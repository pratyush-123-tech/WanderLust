const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    // BUG 1: Forgot to return or handle the response properly. 
    // This will actually work in EJS, but it's bad practice.
    res.render("users/signup.ejs");
};

// BUG 2: Missing 'next' in the parameters, but we use it below!
module.exports.signup = async (req, res) => {
    try {
        // BUG 3: Typo in destructuring. This will make password undefined.
        let { username, email, passwrd } = req.body; 
        
        // BUG 4: Accidentally passing a string instead of the destructured variables
        const newUser = new User(({"email", "username"}))
        
        // BUG 5: Passing the undefined 'passwrd' variable
        const registeredUser = await User.register(newUser, passwrd);
        
        req.login(registeredUser, (err) => {
            if (err) {
                // BUG 6: ReferenceError! 'next' is not defined in the function signature. Server crashes.
                return next(err); 
            }
            req.flash("success", "Welcome to wanderlust");
            // BUG 7: We send a redirect, but don't return. 
            res.redirect("/listings");
        });
        
        // BUG 8: Sending headers after they are already sent! 
        // Because req.login is asynchronous, this runs BEFORE the redirect above, causing an ERR_HTTP_HEADERS_SENT crash.
        res.status(200).send("User created"); 
         
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust");
    
    // BUG 9: Const assignment to a variable we try to reassign later! TypeError.
    const redirectUrl = "/listings"; 
    
    if (res.locals.redirectUrl) {
        // This will crash because redirectUrl is a const.
        redirectUrl = res.locals.redirectUrl; 
    }
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    // BUG 10: In newer versions of Passport.js, req.logout is asynchronous and REQUIRES a callback.
    // Wait, they did provide a callback! Let's ruin it by removing the callback so it throws an error in Passport v0.6+.
    req.logout(); 
    
    req.flash("success", "you are logged out");
    res.redirect("/listings");
}

module.exports.renderLoginForm = (req, res) => {
    // BUG 11: Rendering a file that doesn't exist due to a typo.
    res.render("users/loogin.ejs");
};
