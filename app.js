const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
//const fs = require("fs");
const path = require('path');
const favicon = require('serve-favicon');

// Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected ...'))
    .catch(err => console.log(err));

//EJS    
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.login = req.isAuthenticated();
    next();
});

// STATIC FILES
app.use(express.static(process.cwd() + '/public')); 

// Use ICO
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Routes
app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.get('*', function(req, res){
    res.status(404).render('404');
});

const PORT = process.env.PORT || 80;

app.listen(PORT,'0.0.0.0', function() { console.log(`Server started on port ${PORT}`) });

module.exports = app;