var express = require('express')
var router = express.Router()
var co = require('co')

router.get('/songs', function (req, res, next) {
  delete require.cache[require.resolve('../routes/fileUpdater')]
  console.log(require.cache[require.resolve('../routes/fileUpdater')])
  var fileUpdater = require('../routes/fileUpdater')
  var songs

  fileUpdater.then(promisedResult => {
    co(function*() {
      console.log('select')
      songs = yield global.db.collection('songs').find().toArray()
      res.json(songs)
    }).catch(function (err) {
      console.log('ERROR SELECT' + err.stack)
    })
  }
  )
})

module.exports = router
