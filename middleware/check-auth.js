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
            if (req.get("altTestUser"))
                req.user = {
                    'isAuthenticated': true,
                    'id': 'testuserid12300000001',
                    'name': 'Test User 2',
                    'email': 'test.user2@gmail.com',
                    'photo': 'testphoto2.png'
                }
            else
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