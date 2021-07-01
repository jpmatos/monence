function error(status, message){
    return {
        'status': status,
        'message': message,
        'isErrorObject': true
    }
}

module.exports = error