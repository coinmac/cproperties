const express = require('express');
// const fileUpload = require('express-fileupload');
// const bodyParser = require('body-parser');
const app = express();

const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

const busboy = require('connect-busboy'); //middleware for form/file upload

const fs = require('fs-extra');       //File System - for file manipulation

//Require all models
const User = require('../models/User');
const Property = require('../models/Property');
const Photo = require("../models/Photos");

const uniqueRandom = require('unique-random');
const rand = uniqueRandom(100, 999);
var randomstring = require("randomstring");
const path = require('path');

app.use(busboy());
const router = express.Router();
app.use(express.static(path.join(__dirname, 'public')));

// Dashboard
router.get('/submit', (req, res) => 
    res.render('submit', {
        userdata: req.user
        , layout : 'userlayout'
    })
);

router.post('/submit', (req, res) => {
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/public/uploads/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                res.redirect('back');           //where to go next
            });
        });
    });

router.post("/submit2", (req, res) => {
    
    const {
        agentid,
        propertyname,
        propertyprice,
        phonenumber,
        propertydescription,
        physicallocation,
        propertystate,
        propertycity,
        propertystatus,
        propertytype,
        amenities,
        quantity,
        propertyimages,
        property_video,
        agentswarning,
        pterms } = req.body;
    
    
    // Create variables from the Property form
    let publishstatus = "Not Approved";
    let propertyid = rand()+randomstring.generate({length: 5, charset: 'alphanumeric', capitalization: 'uppercase'});
    // console.log(req.body.featuredimg);
    const uploadedFile = req.body.featuredimg;
    const image_name = uploadedFile.name;
    
    const newProperty = new Property({   
        agentid,     
        featuredimg : image_name,
        propertyname,
        propertyprice,
        phonenumber,
        propertydescription,
        physicallocation,
        propertystate,
        propertycity,
        propertystatus,
        propertytype,
        amenities,
        quantity,
        propertyimages,
        property_video,
        agentswarning,
        pterms,
        publishstatus,
        propertyid
    });
    
    /* Upload Picture
    // check the filetype before uploading it
        // upload the file to the /public/assets/img directory
        uploadedFile.mv(`public/users/${agentid}/${image_name}`, (err ) => {
            if (err) {
                return res.status(500).send(err);
            }
            console.log("Image uploaded !.");
        });
    */

    // Save Text to Database
    newProperty.save()

    
    .then( user => {
        req.flash('success_msg', 'Your property has been published successfully');
        res.redirect('/myproperties');
    })
    .catch(err => console.log(err));

});

//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page 
router.get('/register', (req, res) => res.render('register'));


router.post('/register', (req, res) => {
    console.log(req.body);
    // res.send('hello');
    
    const { name, lastname, email, password, password2 } = req.body;
    let errors = [];
    
    // Check required fields
    if(!name || !lastname  || !email || !password || !password2){
        errors.push({msg: 'Please fill in all required fields'})
    }

    if(password !== password2){
        errors.push({msg: 'Passwords do not match'});
    }

    // Check password length
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters'});
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            lastname,
            email,
            password,
            password2
        });
    } else{
        // Validation Passed
        User.findOne({ email: email })
        .then(user => {
            if(user) {
                // User Exists
                errors.push({msg: 'Email is already registered!'});
                res.render('register',{
                    errors,
                    name,
                    lastname,
                    email,
                    password,
                    password2
                });
            }else{
                // const userid = rand();
                const userid = rand()+randomstring.generate({length: 5, charset: 'alphanumeric', capitalization: 'lowercase'});
                const newUser = new User({
                    userid,
                    name,
                    lastname,
                    email,
                    password
                });

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (error, hash) => {
                    if(err) throw err;
                    // Set password to hashed
                    newUser.password = hash;
                    // Save user
                    newUser.save()
                    .then( user => {
                        var dir = './public/users/'+userid;
                        if (!fs.existsSync(dir)){
                            fs.mkdirSync(dir);
                        }

                        req.flash('success_msg', 'You are now registered and can login');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                }));
            }
        });
    } 

    console.log(req.body);

});


// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out. Log in again?');
    res.redirect('/users/login');
});

// Logout handle
router.get('/myproperties', ensureAuthenticated, (req, res) => 

    // mongoose operations are asynchronous, so you need to wait 
    Property.find({}, function(err, data) {
        // note that data is an array of objects, not a single object!
        res.render('myproperties', {
            userdata : req.user
            , propertiesdata: data
            , userlayout : 'userlayout'
        });
    })
);

module.exports = router;