const express = require('express')
const path = require('path')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const bodyParser = require('body-parser')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const session = require('express-session')

//Load env variables
if(!fs.existsSync('./env.json')){
    console.log('Set up env.json!')
    return null
}
const env = require('./env.json')
Object.assign(process.env, env)

//Local Files
const webpackConfig = require('./webpack.config.js')
const calendarRoutes = require('./web-api/calendar-web-api')
const authRoutes = require('./web-api/auth-web-api')
const userRoutes = require('./web-api/user-web-api')

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback'
        // callbackURL: process.env.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user)
        // })
        process.nextTick(function() {
            return done(null, profile)
        })
    }
))

const app = express()

//Middleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(webpackMiddleware(webpack(webpackConfig)))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/calendar', calendarRoutes(express.Router()))
app.use('/auth', authRoutes(express.Router(), passport))
app.use('/user', userRoutes(express.Router()))
app.use((err, req, res, next) => {
    res.status(err.status)
        .json({
            'success': false,
            'message': err.message
        })
})

module.exports = app
