module.exports = function(req, res, next) {

    res.sendHttpError = function(error) {

        res.status(error.status)
        if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {      //if ajax
            res.json(error)
        } else {
            res.end(JSON.stringify(error))
        }
    }

    next()

}