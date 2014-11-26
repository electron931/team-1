module.exports = function(app) {
    app.get('/', require('./frontpage').get);
    app.get('/editor', require('./editor').get);
};