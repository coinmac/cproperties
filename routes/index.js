const express = require('express');

//Get the needed models
const Profile = require("../models/Profile");
const Property = require('../models/Property');
const Amenities = require('../models/Amenities');
const Photos = require('../models/Photos');
const Contact = require('../models/Contact');

const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const Recaptcha = require('express-recaptcha').RecaptchaV2;

const recaptcha = new Recaptcha('6Le87qgUAAAAAA91eO824EPaYg9H1mQxhuaGmTQp', '6Le87qgUAAAAAGg0RHQRTYKtY3IR8V5ivMlh0QBv',{callback:'cb'});




//Welcome
// router.get('/', (req, res) => res.render('welcome'));
router.get('/', (req, res) => {
    
    Property.find({'viewcategory':'Slides'}, function(error, slides){
        if(error)
            return console.log(error);

        // GET SLIDE PROPERTIES
        Property.find({'viewcategory':'Featured'}, function(err, data) {
            if (err)
                return console.log(err);        
            res.render('welcome', {
                 topproperties: data,
                 slideproperties: slides
            });
        });
    });
});

router.get('/properties', (req, res) => 

    Promise.all([Property.find({}),Amenities.find({})])
    .then((data) => {        
        
        res.render('properties', {
            properties: data[0],
            amenities: data[1]
       });
    })
);

router.get('/properties/:userid', (req, res) => 

    Promise.all([Property.find({'userid': req.params.userid}),Amenities.find({'userid': req.params.userid})])
    .then((data) => {        
        
        res.render('properties', {
            properties: data[0],
            amenities: data[1]
       });
    })
);

router.post('/properties_search', (req, res) => {
    const propertyname = req.body.propertyname;
    const propertyoffer = req.body.propertyoffer;
    const propertycity = req.body.propertycity;

        Property.find({ $or: [ {propertyname: new RegExp(propertyname,'i')}, {propertyoffer: new RegExp(propertyoffer,'i')},{propertycity: new RegExp(propertycity,'i')} ] }, function(err, data){     
                            if(err){
                                console.log(err);
                                return;
                            }    
                            res.render('properties_search', {
                                properties: data
                            });
                });
        
});



router.get('/property/:userid/:propertyid', recaptcha.middleware.render,  (req, res) => {
    
    if(req.user){
        layout = 'userlayout';
        userinfo = req.user;
    }else{
        layout = 'layout';
        userinfo = 'Guest';
    }

    //From the net
    Property.findOne({'propertyid': req.params.propertyid}, function (err, propertydata){
                    if(err){
                        console.log(err);
                        return;
                    }
                 Amenities.find({'propertyid': req.params.propertyid}, function (err, amenitiesdata){
                    if(err){
                        console.log(err);
                        return;
                    }
                    
                    Photos.find({'propertyid': req.params.propertyid}, function (err, photodata){
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
                                res.render('property', {
                                    property: propertydata,
                                    amenities: amenitiesdata,
                                    photos: photodata,
                                    udata: userdata,
                                    similar: "",
                                    layout: layout,
                                    userdata: userinfo,
                                    captcha: res.recaptcha              
                                });
                            }
                            
                            
                        })
    
                    })
            })  
    })

    
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    
    Profile.findOne({'userid':req.user.userid}, function(err, data) { 
        if (err){
            
            throw err;
            console.log(err);
        } else if (data) {
            if(data.generalinfo !="" || data.profileimg!=""){
                 res.redirect('users/myproperties');
            }else{
                res.render('dashboard', {
                    userdata: req.user,
                    userprofile: data,
                    layout : 'userlayout'
                });
            }
        }
    })
);

// Dashboard
router.get('/profile', ensureAuthenticated, (req, res) => 
    
    Profile.findOne({'userid':req.user.userid}, function(err, data) { 
        if (err){
            
            throw err;
        } else if (data) {
            
            res.render('profile', {
                userdata: req.user,
                userprofile: data,
                layout : 'userlayout',
                active: 'active'
            });
        }
    })
);

// Dashboard
router.get('/aprofile/:userid', ensureAuthenticated, (req, res) => 
    
    
    Profile.findOne({'userid':req.params.userid}, function(err, data) { 
        if (err){
            
            throw err;
        } else if (data) {
            
            res.render('aprofile', {
                auserdata: data,
                userprofile: data,
                layout : 'layout',
                active: 'active'
            });
        }
    })
);

// Dashboard
router.get('/agents', (req, res) => 
    
    Profile.find({'accounttype': 'Agent'}, function(err, data) { 
        if (err){
            
            throw err;
        } else if (data) {
            
            res.render('agents', {
                
                adata: data,
                layout : 'layout'
            });
        }
    })
);

// Contact Us
router.get('/contact', recaptcha.middleware.render, (req, res) => {
    if(req.user){
        layout = 'userlayout';
        userinfo = req.user;
        console.log(req.user);
    }else{
        layout = 'layout';
        userinfo = 'Guest';        
    }
    
    res.render('contact',{layout: layout, captcha: res.recaptcha, userdata: req.user})
});

router.post('/contact_us', recaptcha.middleware.verify,  (req, res) => {

    if (req.recaptcha.error) { 
        req.flash('error', 'Error in Recaptcha verification');
        res.redirect('back');
    }else{
        const {
            senderid,
            receiverid,
            firstname,
            lastname,
            email,
            subject,
            message,
            } = req.body;    
    
            // Create variables from the Property form
            var receiver = "";
            if(receiverid!="Administrator"){
                var receiver = "Agent";
            }else{
                var receiver = "Coinmac Properties";
            }
            const status = "New";

            const newContact = new Contact({   
                senderid,
                receiverid,
                firstname,
                lastname,
                email,
                subject,
                message,
                status
            });
   
        newContact.save()    
        .then( user => {
            req.flash('success_msg', 'Your message has been successfully sent to '+receiver);
            res.redirect('back');
        })
        .catch(err => console.log(err));
    }
});

router.get('/pricing', (req, res) => 
    res.render('pricing',{layout: 'layout'})
);
module.exports = router;