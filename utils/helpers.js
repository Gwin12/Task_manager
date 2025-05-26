const bcrypt = require("bcryptjs"); 

const hashValue = async (value) => {
    try {
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(`${value}`, salt)
        return (hash)
    } catch (error) {
        return (value)
    }
}

const verifyHash = async (value, hash) => {
    try {
        if (bcrypt.compareSync(value, hash)) {
            return(true)
        } else {
            return(false)
        }
    } catch (error) {
        return (false)
    }
}

module.exports = { isExpired, hashValue, verifyHash }