export const ensureAuth = function (req, res, next) {
    // passport will create a user object in the request
    // after successful authentication, and will put it 
    // there in all requests until logout.
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
};
