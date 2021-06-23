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
if (!fs.existsSync('./env.json')) {
    console.log('Set up env.json!')
    return null
}
const env = require('./env.json')
Object.assign(process.env, env)

//Project Files
let dbCalendar
if (process.env.MOCK_CALENDAR_DB === 'true')
    dbCalendar = require('./data/mock/db-calendar-mock').init()
else
    dbCalendar = require('./data/db-calendar-mongo').init(process.env.CONNECTION_STRING)

let dbUser
if (process.env.MOCK_USER_DB === 'true')
    dbUser = require('./data/mock/db-user-mock').init()
else
    dbUser = require('./data/db-user-mongo').init(process.env.CONNECTION_STRING)

let dbInvite
if(process.env.MOCK_INVITE_DB === 'true')
    dbInvite = require('./data/mock/db-invite-mock').init()
else
    dbInvite = require('./data/db-invite-mongo').init(process.env.CONNECTION_STRING)

let dbExchanges
if (process.env.MOCK_EXCHANGE_DB === 'true')
    dbExchanges = require('./data/mock/db-exchanges-mock').init()
else
    dbExchanges = require('./data/db-exchanges-api').init(process.env.OER_ID)

const socketManager = require('./middleware/socket-manager').init()
const calendarService = require('./service/calendar-service').init(dbCalendar, dbUser, dbExchanges, socketManager)
const userService = require('./service/user-service').init(dbCalendar, dbUser)
const inviteService = require('./service/invite-service').init(dbCalendar, dbUser, dbInvite)
const calendarController = require('./web-api/controller/calendar-controller').init(calendarService)
const userController = require('./web-api/controller/user-controller').init(userService)
const inviteController = require('./web-api/controller/invite-controller').init(inviteService)
const authController = require('./web-api/controller/auth-controller').init(userService)
const calendarRoutes = require('./web-api/calendar-web-api')
const authRoutes = require('./web-api/auth-web-api')
const userRoutes = require('./web-api/user-web-api')
const inviteRoutes = require('./web-api/invite-web-api')
const webpackConfig = require('./webpack.config.js')

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        //callbackURL: 'http://localhost:3000/auth/google/callback'
        callbackURL: process.env.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user)
        // })
        process.nextTick(function () {
            return done(null, profile)
        })
    }
))

const app = express()

//Middleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
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
app.use('/calendar', calendarRoutes(express.Router(), calendarController))
app.use('/auth', authRoutes(express.Router(), authController, passport))
app.use('/user', userRoutes(express.Router(), userController))
app.use(inviteRoutes(express.Router(), inviteController))
app.use((err, req, res, next) => {
    if (err !== undefined) {
        if (err.stack !== undefined)
            console.error(err.stack)
        res.status(err.status)
            .json({
                'success': false,
                'message': err.message
            })
    }
})

module.exports = {app, socketManager}
