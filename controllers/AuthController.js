const UserServices = require("../services/UserServices");
const { errorResponse, successResponse } = require("../utils/responses");
const { loginUserSchema, registerSchema } = require("../validators/auth")
const { verifyHash, hashValue } = require("../utils/helpers");
const { signJWTToken, verifyJWTToken } = require("../middlewares/TokenProvider");
const { JWT_SECRET } = process.env


class AuthController {
    static async mustBeLoggedIn(req, res, next) {
        try {
            const bearerHeader = req.headers["authorization"]
            const bearerToken = bearerHeader?.split(" ")[1]
            const verifiedUser = await verifyJWTToken(bearerToken, process.env.JWT_SECRET) //verifying the token generated when logging in
            if (verifiedUser.status !== 200) return errorResponse(res, verifiedUser.status, verifiedUser.error, null, verifiedUser.jwtError);

            const apiUser = verifiedUser?.result
            const userId = apiUser?.id
            const user = await UserServices.findUserData({ id: userId })
            if (!user) return errorResponse(res, 404, "User with that token not found!", null);

            req.apiUser = apiUser
            req.userId = apiUser.id
            req.userDetails = user
            next()
        } catch (error) {
            console.log(error)
            return errorResponse(res, 401, "You must be logged in to perform that action!", "", error)
        }
    }

    static async mustBeAdmin(req, res, next) {
        try {
            const apiUser = req.apiUser
            if (apiUser.role !== 'admin') {
                return errorResponse(res, 401, "You are not authorized to perform that action!", null, "The token provided is not an admin.")
            }
            req.adminId = apiUser._id
            next()
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async loginUser(req, res, next) {
        try {
            const { value, error } = loginUserSchema.validate(req.body);
            if (error) return errorResponse(res, 400, error?.details[0]?.message);
            const user = await UserServices.findUserData({ email: value?.email.toLowerCase().trim() }, true);
            if (!user) return errorResponse(res, 404, "Invalid credentials", null);
            const isValid = await verifyHash(value.password, user.password)
            if (!user || !isValid) {
                return errorResponse(res, 401, "Invalid Email or Password", null,
                    {
                        "email": user ? [] : ["Incorrect Email Address"],
                        "password": ["Incorrect Password"]
                    }
                );
            }

            const userData = {
                id: user.id,
                email: user.email,
                status: "activated",
                role: user.role
            }
            const token = await signJWTToken(userData, JWT_SECRET, "7d");
            delete user?.dataValues?.password
            return successResponse(res, 200, "Login successful", { user, token });
        } catch (error) {
            next(error)
        }
    }

    static async register(req, res, next) {
        try {
            let { value, error } = registerSchema.validate(req.body);
            if (error) return errorResponse(res, 400, error?.details[0]?.message);
            const userByEmail = await UserServices.findUserData({ email: value?.email.toLowerCase().trim() })
            if (userByEmail) return errorResponse(res, 400, 'Email is already taken.');
            const userByUsername = await UserServices.findUserData({ username: value?.username })
            if (userByUsername) return errorResponse(res, 400, 'Username is already been used.');
            const hashedPassword = await hashValue(value.password)

            value.username = value.username.toLowerCase()
            value.password = hashedPassword

            const user = await UserServices.createUser(value);
            delete user?.dataValues?.password
            
            const userData = {
                id: user.id,
                email: user.email,
                status: "activated",
                role: user.role
            }

            const token = await signJWTToken(userData, JWT_SECRET, "7d");
            return successResponse(res, 201, 'Registration Successful.', { user, token });
        } catch (error) {
            next(error)
        }
    }

}


module.exports = AuthController;