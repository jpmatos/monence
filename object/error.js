function error(status, message){
    return {
        'status': status,
        'message': message
    }
}

module.exports = error