var express = require('express')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
// var monogoLab = 'mongodb://admin:admin@ds013330.mlab.com:13330/react_nodejs'
var MongoClient = require('mongodb').MongoClient
var co = require('co')
console.log(process.env.MONGOLAB_URI)
co(function*() {
  global.db = yield MongoClient.connect(process.env.MONGOLAB_URI /* || monogoLab */)
  global.colSongs = global.db.collection('songs')
  console.log('Connected correctly to server')
})

// routes
// var users   = require('./routes/users');
var songs = require('./routes/songs')
// var fileUpdater = require('./routes/fileUpdater');

var app = express()

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Request-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

var staticPath = 'music_files'

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// middleware that checks if JWT token exists and verifies it if it does exist.
// In all the future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token']

  // decode token
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
      if (err) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' })
      } else {
        req.user = user
        next()
      }
    })
  } else {
    next()
  }
})

app.use('/api/', songs)
// app.use('/api/', fileUpdater);

// app.use('/api/', users);
app.use(express.static(staticPath))
app.use('/', express.static(staticPath))
app.use('/songs/*', express.static(staticPath))

// app.use('/new/*', express.static(staticPath));
// app.use('/validateEmail/*', express.static(staticPath));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found!!')
  err.status = 404
  next(err)
})

// app.use(function(err, req, res, next) {
//   console.error(err.stack);
//   console.log(1)
//   res.status(500).send('Uh oh! Something broke!');
// });

// error handlers
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  console.dir(err)
  res.status(err.status || 500)
  if (err.status === 500) {
    console.error(err.stack)
    res.json({ error: 'Internal Server Error' })
  }  else if (err.status === 404) {
    res.render('error')    // render error page
  } else {
    res.json({ error: err.message })
  }
})

module.exports = app
