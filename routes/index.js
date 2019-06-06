const express = require('express');

//Get the needed models
const Profile = require("../models/Profile");
const Property = require('../models/Property');
const Amenities = require('../models/Amenities');
const Photos = require('../models/Photos');

const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');



//Welcome
// router.get('/', (req, res) => res.render('welcome'));
router.get('/', (req, res) => 

    // mongoose operations are asynchronous, so you need to wait 
    Property.find({}, function(err, data) {
        
        if (err)
            return console.log(err);
        // note that data is an array of objects, not a single object!
        res.render('welcome', {
             properties: data
        });
    })
);

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
    
        Property.find({
            $and: [
                {$or : [{'propertyname':/req.body.propertyname/}]},
                {$or : [{'propertyoffer':/req.body.propertyoffer/}]},
                {$or : [{'propertycity':/req.body.propertycity/}]}
            ]},
                function(err, data){    
                    if(err){
                        console.log(err);
                        return;
                    }    
                console.log(data);
                
                    res.render('properties', {
                        properties: data[0],
                        amenities: data[1]
                    });
                }
        );
});



router.get('/property/:userid/:propertyid', (req, res) => {
    
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
                                    userdata: userinfo              
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
router.get('/contact', (req, res) => 
    res.render('contact',{layout: 'layout'})
);

router.get('/pricing', (req, res) => 
    res.render('pricing',{layout: 'layout'})
);
module.exports = router;