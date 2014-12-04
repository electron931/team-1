var checkAuth = require('../middleware/checkAuth')

module.exports = function(app) {
    app.get('/', require('./frontpage').get)
    app.get('/editor', checkAuth, require('./editor').get)
    app.get('/dashboard', checkAuth, require('./dashboard').get)
    app.get('/theme', require('./theme').get)

    app.get('/auth/login', require('./auth').login)
    app.get('/auth/github', require('./auth').githubAuth)
    app.get('/auth/github/callback', require('./auth').githubCallback)
    app.get('/auth/logout', checkAuth, require('./auth').logout)

    app.post('/api/saveDocument', checkAuth, require('./api').saveDocument)
    app.post('/api/getUserDocuments', checkAuth, require('./api').getUserDocuments)
    app.post('/api/getCurrentUser', checkAuth, require('./api').getCurrentUser)
    app.post('/api/deleteDocument', checkAuth, require('./api').deleteDocument)
    app.get('/api/createDocument', checkAuth, require('./api').createDocument)
}