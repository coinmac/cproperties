const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');
const fs = require("fs");

router.post("/submit", ensureAuthenticated, (req, res) => {
    
  // Create variables of Property info
  let publishstatus = "Not Approved";
  let propertyid = function() { return randToken.generate(9); }
  let uploadedfile = req.files.featuredimg;
  let featuredimg = uploadedfile.name;    
  let fileExtension = uploadedfile.mimetype.split('/')[1];
  featuredimg = propertyid + '.' + fileExtension;

  const newProperty = new Property({
      
      featuredimg,
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

  // Upload Picture
 // check the filetype before uploading it
 if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
      // upload the file to the /public/assets/img directory
      uploadedFile.mv(`public/users/${image_name}`, (err ) => {
          if (err) {
              return res.status(500).send(err);
          }
      });
  } else {
      error = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
  }


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

// Register Handle
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
                const newUser = new User({
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
                        var dir = './users/'.userid;
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