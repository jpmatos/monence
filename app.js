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
const dotenv = require('dotenv');

//Load env variables
dotenv.config();

//Project Files
const mongoConnection = require('./data/mongo-connection').init(process.env.CONNECTION_STRING, process.env.MONGO_INDEX)

let dbCalendar
if (process.env.MOCK_CALENDAR_DB === 'true')
    dbCalendar = require('./data/mock/db-calendar-mock').init()
else
    dbCalendar = require('./data/db-calendar-mongo').init(mongoConnection)

let dbUser
if (process.env.MOCK_USER_DB === 'true')
    dbUser = require('./data/mock/db-user-mock').init()
else
    dbUser = require('./data/db-user-mongo').init(mongoConnection)

let dbInvite
if(process.env.MOCK_INVITE_DB === 'true')
    dbInvite = require('./data/mock/db-invite-mock').init()
else
    dbInvite = require('./data/db-invite-mongo').init(mongoConnection)

let dbExchanges
if (process.env.MOCK_EXCHANGE_DB === 'true')
    dbExchanges = require('./data/mock/db-exchanges-mock').init()
else
    dbExchanges = require('./data/db-exchanges-api').init(process.env.OER_ID)

const socketManager = require('./service/sockets/socket-manager').init()
const catchError = require('./middleware/catch-error')
const webpackConfig = require('./webpack.config.js')

const calendarService = require('./service/calendar-service').init(dbCalendar, dbUser, dbExchanges, socketManager)
const userService = require('./service/user-service').init(dbCalendar, dbUser)
const inviteService = require('./service/invite-service').init(dbCalendar, dbUser, dbInvite, socketManager)
const calendarController = require('./web-api/controller/calendar-controller').init(calendarService)
const userController = require('./web-api/controller/user-controller').init(userService)
const inviteController = require('./web-api/controller/invite-controller').init(inviteService)
const authController = require('./web-api/controller/auth-controller').init(userService)
const calendarRoutes = require('./web-api/calendar-web-api')
const authRoutes = require('./web-api/auth-web-api')
const userRoutes = require('./web-api/user-web-api')
const inviteRoutes = require('./web-api/invite-web-api')

//Passport setup
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile)
        })
    }
))

//Express Setup
const app = express()
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
app.use(catchError)

module.exports = {app, socketManager}
