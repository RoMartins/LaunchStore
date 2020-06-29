function Permission(req, res, next) {
    
    if(!req.session.UserId)
        return res.redirect("/users/login")
    
    next()
}

function isLogged(req, res, next) {
    if(req.session.UserId)
        return res.redirect('/users')

    next()

}

module.exports = {
    Permission,
    isLogged
}