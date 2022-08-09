require('dotenv').config()
const express = require('express');
const session = require('express-session');
const path = require('path');
const getRoutes = require('./router');
const mainController = require('./controller');
const cache = require('./utils/cachePlugin');
const app = express();
const appSettings = require('../appSettings')();

const msalWrapper = require('./msal/auth-provider');
const authProvider = new msalWrapper.AuthProvider(appSettings, cache);
app.locals = {
    appSettings,
    authProvider
}

app.use(express.json())

// user session
const sessionStore = require('./db/sessionStore')
app.use(session({ secret: process.env.SESSION_SECRET, store: sessionStore, resave: false, saveUninitialized: false }));

// set up routes with authentication
app.use(getRoutes(mainController, authProvider, express.Router()));

// routing views from vue
const history = require('connect-history-api-fallback');
app.use(history({
    verbose: true
}))
app.use('/', express.static(path.join(__dirname, 'dist')));


// static files
// app.use(express.static(path.join(__dirname, './public')));
// app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
// app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.urlencoded({ extended: false }));

// View engine
// app.set('views', path.join(__dirname, './views'));
// app.set('view engine', 'ejs');

app.listen(appSettings.host.port, () => console.log(`listening on port ${appSettings.host.port}!`));
