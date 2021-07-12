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
            req.user = {
                'isAuthenticated': true,
                'id': 'testuserid12300000000',
                'name': 'Test User',
                'email': 'test.user@gmail.com',
                'photo': 'testphoto.png'
            }
        }
        next()
    }
}

module.exports = checkAuth