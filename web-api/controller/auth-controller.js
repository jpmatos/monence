const userService = require("../../service/user-service");

class AuthController{
    static verifyNewUser(req, res, next){
        const userId = req.user.id
        const name = req.user.name
        const emails = req.user.emails
        const photos = req.user.photos
        return userService.verifyNewUser(userId, name, emails, photos)
            .then(() => {
                res.redirect('/');
            })
            .catch(next)
    }
}

module.exports = AuthController