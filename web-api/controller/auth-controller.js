const userService = require("../../service/user-service");

class AuthController{
    static verifyNewUser(req, res, next){
        const userId = req.userId
        return userService.verifyNewUser(userId)
            .then(() => {
                res.redirect('/');
            })
    }
}

module.exports = AuthController