var checkAuth = require('../middleware/checkAuth')

module.exports = function(app) {
    app.get('/', require('./frontpage').get)
    app.get('/editor', checkAuth, require('./editor').get)
    app.get('/dashboard', checkAuth, require('./dashboard').get)
    app.get('/auth', require('./auth').get)

    app.post('/auth/login', require('./auth').login)
    app.post('/auth/signup', require('./auth').signup)
    app.get('/auth/logout', checkAuth, require('./auth').logout)

    app.get('/getDocuments', checkAuth, require('./api').getDocuments)
    app.get('/createDocument', checkAuth, require('./api').createDocument)
}