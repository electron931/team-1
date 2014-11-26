var config = require('./config')
  , app = require('./server/app')

app.set('port', config.http_server.port)

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'))
})

require('./server/socket-server').start(config.socket_server)