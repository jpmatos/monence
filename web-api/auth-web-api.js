const authController = require("./controller/auth-controller");

function authWebApi(router, passport) {

    router.get('/google',
        passport.authenticate('google', {
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'openid']
        }))

    router.get('/google/callback',
        passport.authenticate('google', {failureRedirect: '/failed'}),
        (req, res, next) => {
            authController.verifyNewUser(req, res, next)
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
            res.json(googleUser);
        } else {
            res.json({'isAuthenticated': false});
        }
    })

    router.get('/logout', (req, res, next) => {
        req.logout()
        // res.redirect('/')
    })

    return router
}

module.exports = authWebApi