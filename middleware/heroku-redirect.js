function herokuRedirect(req, res, next) {
    const host = req.header("host");
    if (host.match(/.+\.herokuapp\..+/)) {
        res.redirect(301, process.env.HOST_URL);
    } else {
        next();
    }
}

module.exports = herokuRedirect