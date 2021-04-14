const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')

//Local Files
const webpackConfig = require('./webpack.config.js')
const calendarRoutes = require('./web-api/calendar-web-api')

const app = express();

//Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(webpackMiddleware(webpack(webpackConfig)))

//Routes
app.use('/calendar', calendarRoutes());

module.exports = app;
