module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error', 'Please log in to access your this page');
        res.redirect('/users/login');
    }
}