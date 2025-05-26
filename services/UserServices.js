const { User } = require('../models');

class UserServices {
    static async createUser(data) {
        try {
            return await User.create(data);
        } catch (error) {
            throw error;
        }
    }

    static async findUserData(data, showPassword) {
        try {
            let user = await User.findOne({ where: data });
            if (user) { if (!showPassword) { delete user.password } }
            return user;
        } catch (error) {
            throw error;
        }
    }
}


module.exports = UserServices;