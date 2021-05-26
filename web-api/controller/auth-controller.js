const userService = require("../../service/user-service");

class AuthController{
    static verifyNewUser(req, res, next){
        const userId = req.user.id
        const name = req.user.displayName
        const emails = req.user.emails[0].value
        const photos = req.user.photos[0].value
        return userService.verifyNewUser(userId, name, emails, photos)
            .then(() => {
                res.redirect('/');
            })
            .catch(next)
    }
}

module.exports = AuthController