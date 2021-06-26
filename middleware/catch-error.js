function catchError(err, req, res, next) {
    if (err !== undefined) {
        if (err.stack !== undefined)
            console.error(err.stack)
        res.status(err.status)
            .json({
                'success': false,
                'message': err.message
            })
    }
}

module.exports = catchError