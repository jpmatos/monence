const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const bodyParser = require('body-parser')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const session = require('express-session')

//Local Files
const webpackConfig = require('./webpack.config.js')
const calendarRoutes = require('./web-api/calendar-web-api')
const authRoutes = require('./web-api/auth-web-api')

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
        clientID: '314639016301-6l53r25gr2hveakjkj3hk8ta5qsvcuc5.apps.googleusercontent.com',
        clientSecret: 'PBUuWH6LUqNujQ3braNGFhCd',
        callbackURL: 'http://localhost:3000/auth/google/callback'
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
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/calendar', calendarRoutes(express.Router()))
app.use('/auth', authRoutes(express.Router(), passport))

module.exports = app
