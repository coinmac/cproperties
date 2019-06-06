const express = require('express');
const router = express.Router();


//User Model
const Post = require('../models/Post')

// Register Handle
router.post('/newpost', (req, res) => {
    console.log(req.body);
    // res.send('hello');

    const { name, lastname, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if(!title || !subtitle  || !body || !author || !postid){
        errors.push({msg: 'Please fill in all required fields'})
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            title,
            subtitle,
            body,
            author,
            postid
        });
    } else{       
        const newPost = new Post({
            title,
            subtitle,
            body,
            author,
            postid,
            featuredimg
        });
               
                    newPost.save()
                    .then( post => {
                        req.flash('success_msg', 'You have successfully published a new post');
                        res.redirect('/');
                    })
                    .catch(err => console.log(err));
                
            
    } 

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

module.exports = router;