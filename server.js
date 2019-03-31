const http = require('http')
const app = require('./index')
const port = process.env.PORT || 1972
const server = http.createServer(app)

server.listen(port, function() {
    console.log('Listening on ' + port)
});