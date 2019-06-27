const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mkdirp = require('mkdirp');
const moment = require('moment');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();
/*
app.use(cookieParser());

app.use(csrf());
app.use(function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.locals.csrftoken = req.csrfToken();
  next();
});
*/

const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');



const Recaptcha = require('express-recaptcha').RecaptchaV2;

const recaptcha = new Recaptcha('6Le87qgUAAAAAA91eO824EPaYg9H1mQxhuaGmTQp', '6Le87qgUAAAAAGg0RHQRTYKtY3IR8V5ivMlh0QBv',{callback:'cb'});

// Prepare mail
const transporter = nodemailer.createTransport({
    name: 'COINMAC-Properties.com',
    host: 'smtp.gmail.com',
    service: 'gmail',
    secure: false,
    auth: {
      user: 'gcictng@gmail.com',
      pass: 'nuopqzxruosubucp'
    },
    tls: {
        rejectUnauthorized: false
    }
  });

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const { ensureAuthenticated } = require('../config/auth');

const fs = require('fs-extra');

//Require all models
const User = require('../models/User');
const Property = require('../models/Property');
const Profile = require("../models/Profile");
const Photos = require("../models/Photos");
const Amenities = require("../models/Amenities");
const Payment = require("../models/Payment");
const Contact = require("../models/Contact");
const Favourite = require("../models/Favourite");

const uniqueRandom = require('unique-random');
const rand = uniqueRandom(100, 999);
var randomstring = require("randomstring");

app.use(express.static(path.join(__dirname, 'public')));

//Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const router = express.Router();

const storage = multer.diskStorage({
    //destination: './public/users/',
    destination: function (req, file, callback) {
        const userid = req.body.userid;
        const propertyid = req.body.propertyid;
        console.log(propertyid);
        
        upload_path = "public/users/"+userid+'/'+propertyid+'/';
        mkdirp(upload_path, function (err) {
            if (err) console.error(err)
            else {
                console.log('Directory created');
                //setting destination.
                callback(null, upload_path);
            }
        });

    },
    filename: function(req, file, cb){
        cb(null, req.body.userid+req.body.propertyid+'-'+Date.now()+rand()+path.extname(file.originalname));
    }    
});
// Profile Picture Storage
const pstorage = multer.diskStorage({
    //destination: './public/users/',
    destination: function (req, file, callback) {
        const userid = req.body.userid;
        const propertyid = req.body.propertyid;
        upload_path =  "public/users/"+userid+'/';
        mkdirp(upload_path, function (err) {
            if (err) console.error(err)
            else {
                console.log('Directory created');
                //setting destination.
                callback(null, upload_path);
            }
        });

    },
    filename: function(req, file, cb){
        cb(null, req.body.userid+path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000*90},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
    
});

const ppupload = multer({
    storage: pstorage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
});

// Check File Type
function checkFileType(file, cb){
    //Allowed Ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //Check Mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

var requiresAdmin = function() {
    return [
      ensureLoggedIn('/users/login'),
      function(req, res, next) {
        if (req.user && req.user.isAdmin === true)
          next();
        else
          res.render(401);
      }
    ]
  };

// Dashboard
router.get('/submit', recaptcha.middleware.render, ensureAuthenticated, (req, res) =>
    res.render('submit', { 
        userdata: req.user
        , propertyid: rand()+randomstring.generate({length: 5, charset: 'alphanumeric', capitalization: 'uppercase'})
        , layout : 'userlayout'
        , active: 'active',
        captcha: res.recaptcha
    })
);

router.post("/submit", upload.array('propertyimages', 10), recaptcha.middleware.verify, ensureAuthenticated, (req, res) => {
    if (req.recaptcha.error) { 
        let errors = [];
        errors.push({msg: 'Error in Recaptcha verification'});
        res.redirect('back');
    }else{
        const file = req.files;
    const {
        userid,
        propertyid,
        propertyname,
        propertyoffer,
        propertysize,
        propertycategory,
        offerstatus,
        physicalcondition,
        propertyprice,
        phonenumber,
        propertydescription,
        physicallocation,
        propertystate,
        propertycity,
        viewcategory,
        propertytype,
        bedrooms,
        baths,
        garage,
        property_video,
        agentswarning,
        pterms } = req.body;    
    
    // Create variables from the Property form
    const publishstatus = "Not Approved"; 
    const featuredthumb = req.files[0].filename;
    console.log(featuredthumb)
    const newProperty = new Property({   
        userid,     
        featuredimg: featuredthumb,
        propertyname,
        propertyoffer,
        propertysize,
        propertycategory,
        offerstatus,
        physicalcondition,
        propertyprice,
        phonenumber,
        propertydescription,
        physicallocation,
        propertystate,
        propertycity,
        viewcategory,
        propertytype,
        bedrooms,
        baths,
        garage,
        property_video,
        agentswarning,
        pterms,
        publishstatus,
        propertyid,
        approval: 'Unapproved'
    });
    // Copy Files to User Folder    
    //fs.copySync(path.resolve(__dirname,'./public/users/xxx.json'), 'xxx.json');
    // Save Text to Database
   
    newProperty.save()    
    .then( user => {
        req.flash('success_msg', 'Your property has been published successfully');
        res.redirect('back');
    })
    .catch(err => console.log(err));
    
    // Save files
    if(req.files){
        req.files.forEach(function(property, key) {
            
            console.log(property.filename);
            const newGallery = new Photos({   
            userid,     
            filename : property.filename,
            propertyid
            });

            newGallery.save();
        });
            
    }
    // Save Amenities
    if(req.body.amenities.length==1 && req.body.amenities[0]!="Add Amenities"){

    for (var i = 0; i < req.body.amenities.length; i++) {   
            
        console.log(req.body.amenities[i]);
        const newAmenity = new Amenities({   
        userid,
        propertyid,
        amenityname: req.body.amenities[i],     
        quantity: req.body.quantity[i],
        additional: 'a'
        });

        newAmenity.save();
    }};
    
    // Save Amenities
    if(req.body.aamenities.length==1 && req.body.aamenities[0]!=""){
    for (var i = 0; i < req.body.aamenities.length; i++) {   
            
        console.log(req.body.aamenities[i]);
        const newAmenity = new Amenities({   
        userid,
        propertyid,
        amenityname: req.body.aamenities[i],     
        quantity: req.body.aquantity[i],
        additional: "aa"
        });

        newAmenity.save();
    }};
    }

});

router.post("/update-profile", ensureAuthenticated, (req, res) => {
    const profileimg = req.body.profileimg;
    let errors = [];
    const {        
        accounttype,
        accountplan,
        fullname,
        pemail,
        facebook,
        twitter,    
        linkedin,
        instagram,    
        generalinfo,
        accountstatus,
        phonenumber,
        address,
        website,
        credit        
        } = req.body;
    
        console.log(req.body);

        // Check required fields
        picture = req.body.profileimg;
        // if(picture.search(/placeholder/)!="-1"){
        if(picture==""){
            profilecompletion = "No";
            errors.push({msg: 'You need to complete your profile by uploading profile image and entering your general information. This will encourage other users/agents to trust you.'})
        }else{
            profilecompletion = "Yes";
            req.flash('success_msg', 'Thank you for completing your profile!');
        }
    
    var updatedProfile = { $set: {              
        accounttype,
        accountplan,
        fullname,
        pemail,
        facebook,
        twitter,
        linkedin,
        instagram,
        profileimg,
        generalinfo,
        accountstatus,
        phonenumber,
        address,
        website,
        profilecompletion,
        credit
    } } 
    
    Profile.findOneAndUpdate({'userid' : req.body.userid}, updatedProfile, { upsert: true }, function(err, data) {
       
        if (err){
            console.log(err);
            }
        
        });

    req.flash('success_msg', ' Your Profile has been updated successfully');
    res.redirect('back');
        
});

router.post('/uploadprofilepic', ppupload.single('profileimg'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    const profileimg = '/users/'+req.body.userid+'/'+file.filename;
    console.log(profileimg); 

        Profile.findOneAndUpdate({'userid' : req.body.userid}, { $set: { profileimg } }, { upsert: true }, function(err, data) {
       
            if (err){
                console.log(err);
                }
            
            });

        req.flash('success_msg', ' Your Profile Image has been updated successfully');
        res.redirect('back');
    
    
});

//Upload Profile Picture
router.post('/uploadprofilepic',  ensureAuthenticated, (req, res) => {
    const profileimg = req.body.profileimg;
    console.log(profileimg);

    ppupload(req, res, (err) =>{
        if(err){
            console.log(err);
        }else{
            console.log(req.file);
        }           

        Profile.findOneAndUpdate({'userid' : req.body.userid}, { $set: { profileimg } }, { upsert: true }, function(err, data) {
       
            if (err){
                console.log(err);
                }
            
            });

        req.flash('success_msg', ' Your Profile Image has been updated successfully');
        res.redirect('back');
    });
});

//Register Page 

router.get('/register', recaptcha.middleware.render, (req, res) => res.render('register', { captcha:res.recaptcha }));

router.post('/register', recaptcha.middleware.verify, (req, res) => {
// router.post('/register', (req, res) => {
    
    if (req.recaptcha.error) { 
        let errors = [];
        errors.push({msg: 'Error in Recaptcha verification'});
        res.redirect('back');
    }else{ 
    
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

                const newProfile = new Profile({
                    userid,
                    accounttype: 'User',
                    pemail: email,
                    accountstatus: 'Not Activated',
                    phonenumber: '',
                    address: '',
                    profileimg:'/assets/img/picture_placeholder.png',
                    profilecompletion: 'No',
                    fullname: name+' '+lastname,
                    credit: 0,
                    accountplan: 'Free'

                });

                newProfile.save().catch(err => console.log(err));

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

                        const mailOptions = {
                            from: 'COINMAC Properties <admin@coinmac-properties.com>',
                            to: email,
                            subject: 'Welcome to COINMAC Properties',
                            html: '<!DOCTYPE html>'+
                                '<html lang="en">'+
                                '<head>'+
                                
                                    '<title>COINMAC Properties - Welcome</title>'+
                                '</head>'+
                                '<body>'+
                                    '<h2><img src="http://www.coinmac-properties.com/assets/img/logo.png" height="60" width="auto" alt="COINMAC PROPERTIES"></h2>'+
                                    '<h5>Your no 1 Choice for Real Estate Listing</h5>'+
                                    '<hr>'+
                                    '<p> Welcome '+name+', <br>'+
                                    'We welcome you to the best real estate listing and general properties services platform.</p>'+
                                    '<p>Click <a href="coinmac-properties.com/users/activate/'+userid+'" style="display: inline-block; padding-left: 5px; padding-right: 5px; background-color: darkblue; color: white; text-align: center;">Activate</a> to start using the platform.</p>'+
                                    '<p>Enjoy real estate and property services!</p>'+
                                    '<p>Admin<br>@COINMAC Properties</p>'+
                                '</body>'+
                                '</html>'
                          };

                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                            console.log(error);
                            } else {
                            console.log('Email sent: ' + info.response);
                            }
                        });

                        req.flash('success_msg', 'Thank you for signing up with us. We have sent an activation link to the e-mail that you provided! Click on the link to activate your account and start submitting properties. Welcome!');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                }));
            }
        });
    } 

    }
});
// Activate Account
router.get('/activate/:userid', (req, res) => {
    layout = 'userlayout';
    const accountstatus = 'Activated';
    //From the net
    Profile.findOneAndUpdate({'userid' : req.params.userid}, { $set: { accountstatus } }, { upsert: true }, function(err, data) {
       
        if (err){
            console.log(err);
            }
        
        });

        req.flash('success_msg', 'You account has been activated. Please login to update your profile and start posting properties!');
        res.redirect('/users/login');
});

// Change Property View Category
router.post('/changepvcat/:propertyid', (req, res) => {
    layout = 'userlayout';
    const viewcategory = req.body.viewcategory;
    //From the net
    Property.findOneAndUpdate({'propertyid' : req.params.propertyid}, { $set: { viewcategory } }, { upsert: true }, function(err, data) {
       
        if (err){
            console.log(err);
            }
        
        });

        req.flash('success_msg', 'You have successfully changed the View Cateory of the selected property!');
        res.redirect('back');
});

router.get('/forgot_password', recaptcha.middleware.render, (req, res) => res.render('forgot_password', { captcha:res.recaptcha}));
    // Change Property View Category
router.post('/forgotpassword', recaptcha.middleware.verify,  (req, res) => {
    layout = 'userlayout';
    if (req.recaptcha.error) { 
        req.flash('error', 'Error in Recaptcha verification');
        res.redirect('back');
    }else{
        User.findOne({ email: req.body.email })
        .then(userexists => {
            if(userexists) {            
                
                const new_password = rand()+randomstring.generate({length: 5, charset: 'alphanumeric', capitalization: 'lowercase'});

                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(new_password, salt, (error, hash) => {
                    if(err) throw err;
                    // Set password to hashed         
                    const password = hash;
                    User.findOneAndUpdate({'email' : req.body.email}, { $set: { password } }, { upsert: true }, function(err, data) {
                    
                        if (err){
                            
                            }
                        
                        });

                    const mailOptions = {
                        from: 'COINMAC Properties <admin@coinmac-properties.com>',
                        to: req.body.email,
                        subject: 'Password Recovery Mail',
                        html: '<!DOCTYPE html>'+
                            '<html lang="en">'+
                            '<head>'+
                            
                                '<title>COINMAC Properties - Welcome</title>'+
                            '</head>'+
                            '<body>'+
                                '<h2><img src="http://www.coinmac-properties.com/assets/img/logo.png" height="60" width="auto" alt="COINMAC PROPERTIES"></h2>'+
                                '<h5>Your no 1 Choice for Real Estate Listing</h5>'+
                                '<hr>'+
                                '<p> Someone requested for the change of password with your email in our website and we have generated a new password for you. <br>'+                
                                '<p>Your new Password is : '+new_password+'<br>'+
                                'Click <a href="http://www.coinmac-properties.com/users/login" style="display: inline-block; padding-left: 5px; padding-right: 5px; background-color: darkblue; color: white; text-align: center;">Here</a> to login with this new password and change this password to your choice by going to Your Profile Page.</p>'+
                                '<p>Enjoy real estate and property services!</p>'+
                                '<p>Admin<br>@COINMAC Properties</p>'+
                            '</body>'+
                            '</html>'
                    };
                
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                        console.log(error);
                        } else {
                        console.log('Email sent: ' + info.response);
                        }
                    });
                    req.flash('success_msg', 'We have sent you a password recovery mail to '+req.body.email);
                    res.redirect('/users/login');
                }));  

                
            }else{
                // Email does not Exists                
                req.flash('error', 'That Email is not registered!');
                res.redirect('back');
            }
        });
    }
});

//Login Page
router.get('/login', recaptcha.middleware.render, (req, res) => res.render('login', { captcha:res.recaptcha}));
// Login Handle
router.post('/login', recaptcha.middleware.verify, (req, res, next) => {
//router.post('/login', (req, res, next) => {

    if (!req.recaptcha.error) {        
      
        Profile.find( { $and:[ {'pemail':req.body.email}, {'accountstatus':'Activated'} ]}, 
        function(err,activated){
            if(err) 
            {
                let errors = [];
                errors.push({msg: 'Please check your email to activate your account and login again'});
                res.redirect('/users/login');
            }
        });

        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);

    
    } else {        
        req.flash('error', 'You failed the recaptcha verification test!');
        res.redirect('back');
    }
    
});
// Dashboard
router.get('/uploadimage', (req, res) => 
    res.render('uploadimage', {
        userdata: req.user
        , layout : 'userlayout'
    })
);
// Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out. Thank you!');
    res.redirect('/users/login');
});
// Logout handle
router.get('/myproperties', ensureAuthenticated, (req, res) => 
    // mongoose operations are asynchronous, so you need to wait 
    Property.find({'userid':req.user.userid}, function(err, data) {
        // console.log(data);
        // note that data is an array of objects, not a single object!
        if(err)
            return console.log(err);
        res.render('myproperties', {
            userdata : req.user
            , myproperties: data
            , layout : 'userlayout'
            , active: 'active'
        });
    })
);
// Dashboard
router.get('/payments', ensureAuthenticated, (req, res) => {
    Payment.find({'userid':req.user.userid}, function(err, paydata) {
        // console.log(paydata);
        // note that data is an array of objects, not a single object!
        if(err)
            return console.log(err);
        res.render('payments', { 
            userdata: req.user
            , layout : 'userlayout'
            , active: 'active'
            , payments: paydata
        })
    });
});
router.post("/paymentconfirmation", ensureAuthenticated, (req, res) => {
    
    let errors = [];
    const {        
        userid,
        amountpaid,
        payref,
        depositorname,
        methodofpayment,
        bankpaidto
        } = req.body;
        // console.log(req.body);
        
        if(errors.length > 0){
            errors.push({msg: 'Please cross-check your submission'});
        }else{
            req.flash('success_msg', 'Your payment has been sent - Pending Confirmation');
        }
    
    const newPayment = new Payment({              
        userid,
        amountpaid,
        payref,
        depositorname,
        methodofpayment,
        bankpaidto,    
        paymentdate: moment().format('YYYY-MM-DD'),
        payid:  'P-'+userid+rand()+randomstring.generate({length: 5, charset: 'alphanumeric', capitalization: 'uppercase'}),
        status: 'Unconfirmed'
    });

    newPayment.save().catch(err => console.log(err));     
    res.redirect('back');
        
});

// ADMIN ONLY
router.get('/all_payments', requiresAdmin(), (req, res) => {
    Payment.find({}, function(err, paydata) {
        // console.log(paydata);
        // note that data is an array of objects, not a single object!
        if(err)
            return console.log(err);
        res.render('all_payments', { 
            userdata: req.user
            , layout : 'userlayout'
            , active: 'active'
            , payments: paydata
        })
    });
});

router.get('/all_properties', requiresAdmin(), (req, res) => {
    Property.find({}, function(err, properties) {
        if(err)
            return console.log(err);
        res.render('all_properties', { 
            userdata: req.user
            , layout : 'userlayout'
            , active: 'active'
            , allproperties: properties
        })
    });
});

router.get('/my_favourites', requiresAdmin(), (req, res) => {
    Favourite.find({'userid':req.user.userid }, function(err, favourites) {
        if(err)
            return console.log(err);
    });
});

router.get('/all_users', requiresAdmin(), (req, res) => {
    Profile.find({}, function(err, usersdata) {
        if(err)
            return console.log(err);
        res.render('all_users', { 
            userdata: req.user
            , layout : 'userlayout'
            , active: 'active'
            , allusers: usersdata
        })
    });
});

// END OF ADMIN ONLY
router.get('/payment/:userid/:payid', ensureAuthenticated, (req, res) => {

        layout = 'userlayout';
        userinfo = req.user;
        
        //From the net
        Payment.findOne({'payid': req.params.payid}, function (err, paymentdata){
                if(err){
                    console.log(err);
                    return;
                }
            
                Profile.findOne({'userid': req.params.userid}, function (err, userdata){
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        // console.log(userinfo);
                        res.render('payment', {
                            paymentdata: paymentdata,
                            layout: layout,
                            userdata: userinfo              
                        });
                    }
                    
                    
                });

        });
    
});

// END OF ADMIN ONLY
router.get('/favourite/:userid/:propertyid', ensureAuthenticated, (req, res) => {

    layout = 'userlayout';
    userinfo = req.user;

    const newFavourite = new Favourite({   
        userid: req.user.userid,     
        propertyuid: req.params.userid,
        propertyid: req.params.propertyid
    });

    newFavourite.save()    
    .then( user => {
        req.flash('success_msg', 'The property has been added to your favourites list');
        res.redirect('back');
    })
    .catch(err => console.log(err));
    
    
});

router.post('/contact_agent/:receiverid/:senderid', ensureAuthenticated, recaptcha.middleware.verify,  (req, res) => {

    if (req.recaptcha.error) { 
        let errors = [];
        errors.push({msg: 'Error in Recaptcha verification'});
        res.redirect('back');
    }else{
        const {
            firstname,
            lastname,
            email,
            subject,
            message,
            } = req.body;    
    
            // Create variables from the Property form
            const senderid = req.params.senderid; 
            const receiverid = req.params.receiverid;
            const status = "New";

            const newContact = new Contact({   
                senderid,
                receiverid,
                firstname,
                lastname,
                email,
                subject,
                message,
                datesent,
                status
            });
   
        newContact.save()    
        .then( user => {
            req.flash('success_msg', 'Your message has been successfully sent to the agent');
            res.redirect('back');
        })
        .catch(err => console.log(err));
    }
});

router.get('/approve/:payid', ensureAuthenticated, (req, res) => {

    layout = 'userlayout';
    userinfo = req.user;
    const status = 'Confirmed';
    //From the net
    Payment.findOneAndUpdate({'payid' : req.params.payid}, { $set: { status } }, { upsert: true }, function(err, data) {
       
        if (err){
            console.log(err);
            }
        
        });

        req.flash('success_msg', 'The payment has been confirmed!');
        res.redirect('back');
       
});

router.get('/delete/:payid', ensureAuthenticated, (req, res) => {

    layout = 'userlayout';
    userinfo = req.user;
    const status = 'Confirmed';
    //From the net
    Payment.findOneAndRemove({'payid' : req.params.payid}, function(err, data) {
       
        if (err){
            console.log(err);
            }
        
        });

        req.flash('success_msg', 'The payment has been deleted!');
        res.redirect('back');
       
});

router.get('/approvep/:propertyid', requiresAdmin(), (req, res) => {

    layout = 'userlayout';
    userinfo = req.user;
    const propertystatus = 'Approved';
    //From the net
    Property.findOneAndUpdate({'propertyid' : req.params.propertyid}, { $set: { propertystatus } }, { upsert: true }, function(err, data) {
       
        if (err){
            console.log(err);
            }
        
        });

        req.flash('success_msg', 'The property has been approved!');
        res.redirect('back');
       
});

router.get('/deletep/:propertyid', requiresAdmin(), (req, res) => {

    layout = 'userlayout';
    userinfo = req.user;
    //From the net
    Property.findOneAndRemove({'propertyid' : req.params.propertyid}, function(err, data) {
       
        if (err){
            console.log(err);
            }
        
        });

        req.flash('success_msg', 'The property has been deleted!');
        res.redirect('back');
       
});

router.get('/approveuser/:userid', requiresAdmin(), (req, res) => {

    layout = 'userlayout';
    userinfo = req.user;
    const accountstatus = 'Activated';
    //From the net
    Profile.findOneAndUpdate({'userid' : req.params.userid}, { $set: { accountstatus } }, { upsert: true }, function(err, data) {
       
        if (err){
            console.log(err);
            }
        
        });

        req.flash('success_msg', 'The user has been activated!');
        res.redirect('back');
       
});

router.get('/delete/:userid', requiresAdmin(), (req, res) => {

    layout = 'userlayout';
    userinfo = req.user;
    //From the net
    Profile.findOneAndRemove({'userid' : req.params.userid}, function(err, data) {
       
        if (err){
            console.log(err);
            }
        
        });

        req.flash('success_msg', 'The user has been deleted!');
        res.redirect('back');
       
});
// Fetch Messages
router.get('/my_messages', ensureAuthenticated, (req, res) => {
    var query = {};
    if(req.user && req.user.isAdmin===false){
        var query = {'receiverid': req.user.userid};

        console.log(query);
    }

    Contact.find(query, function(err, data) { 
        if (err){
            
            throw err;
        } else if (data) {
            
            res.render('my_messages', {
                msg: "",
                mymessages: data,
                layout : 'userlayout',
                userdata: req.user
            });
        }
    })
});
router.get('/sent_messages', ensureAuthenticated, (req, res) => {
    var query = {};
    if(req.user.isAdmin===false){
        var query = {'senderid': req.user.userid};
        console.log(query);
    }

    Contact.find(query, function(err, data) { 
        if (err){
            
            throw err;
        } else if (data) {
            
            res.render('my_messages', {
                msg: "",
                mymessages: data,
                layout : 'userlayout',
                userdata: req.user
            });
        }
    })
});


router.get('/my_messages/:msgid', ensureAuthenticated, (req, res) => {
    const query = {};
    if(req.user && req.user.isAdmin===false){
        const query = {'receiverid': req.user.userid};
    }

    Contact.find(query, function(err, data) { 
        if (err){
            
            throw err;
        } else if (data) {
            Contact.find({'_id':req.params.msgid}, function(err, msgdata) { 
                if (err){
                    
                    throw err;
                } else if (msgdata) {
                    res.render('my_messages', {
                        msg: msgdata,
                        mymessages: data,
                        layout : 'userlayout',
                        userdata: req.user
                    });
                }
            });            
        }
    });
    
});

// Fetch Messages
router.get('/reply/:msgid/:subject/:receiverid', ensureAuthenticated, (req, res) => {
    const senderid = req.params.msgid;    
    const subject = req.params.subject; 
    const receiverid = req.params.receiverid;    
    res.render('reply',{layout: 'userlayout', captcha: res.recaptcha, userdata: req.user, senderid: senderid,subject:subject,receiverid:receiverid})
});

router.get('/deletemessage/:msgid', ensureAuthenticated, (req, res) => {

    layout = 'userlayout';
    userinfo = req.user;
    //From the net
    Contact.findOneAndRemove({'_id' : req.params.msgid}, function(err, data) {
       
        if (err){
            console.log(err);
            }
        
        });
        
        req.flash('success_msg', 'The message has been deleted!');
        res.redirect('back');       
});


// Fetch Messages
router.get('/my_favourites', ensureAuthenticated, (req, res) => 
    
    Favourite.find({'userid': req.user.userid}, function(err, data) { 
        if (err){
            
            throw err;
        } else if (data) {
            
            res.render('my_messages', {
                
                myfavourites: data,
                layout : 'userlayout'
            });
        }
    })
);

module.exports = router;