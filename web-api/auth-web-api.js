const authController = require("./controller/auth-controller");
const success = require("../object/success");

// /auth/...
function authWebApi(router, passport) {

    router.get('/google',
        passport.authenticate('google', {
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'openid',
                'https://www.googleapis.com/auth/calendar.events']
        }))

    router.get('/google/callback',
        passport.authenticate('google', {failureRedirect: '/failed'}),
        (req, res, next) => {
            return authController.verifyNewUser(req, res, next)
        });

    router.get('/session', (req, res, next) => {
        if (req.isAuthenticated()) {
            const googleUser = {
                'isAuthenticated': true,
                'id': req.user.id,
                'name': req.user.displayName,
                'emails': req.user.emails,
                'photos': req.user.photos,
                'provide': req.user.provide
            }
            res.json(success(googleUser));
        } else {
            res.json(success({'isAuthenticated': false}));
        }
    })

    router.get('/logout', (req, res, next) => {
        req.logout()
        res.end()
    })

    return router
}

module.exports = authWebApi