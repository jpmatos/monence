const error = require('../object/error')

function checkAuth(req, res, next) {
    if (process.env.REQUIRES_AUTH === 'true') {
        if (req.isAuthenticated())
            next()
        else {
            next(error(401, 'Request Not Authenticated'))
        }
    } else {
        if (req.user === undefined) {
            req.user = {}
            req.user.id = req.header('id')
        }
        next()
    }
}

module.exports = checkAuth