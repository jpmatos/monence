
class CalendarController{
    static hello(req, res, next) {
        return Promise.resolve()
            .then(() => {
                res.status(200).json({message: 'Hello'})
            })
            .catch(next)
    }
}

module.exports = CalendarController