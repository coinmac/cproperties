module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error', 'Please login to access this page');
        res.redirect('/users/login');
    }
}