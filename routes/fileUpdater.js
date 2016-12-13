var fs = require('fs'); 
var id3 = require('id3js');
var mime = require('mime-types');
var exec  = require('child_process').execFile;
var ID3Writer = require('browser-id3-writer');
var request = require('request');
var Path = require('path');
//var Promise = require('promise');
const AUDIO_MP3 = 'audio/mpeg';
const AUDIO_FLAC = 'audio/x-flac';
const EXTENSION_MP3 = '.mp3';
const EXTENSION_FLAC = '.flac';
const path = 'music_files';
const GOOGLE_API_LIMIT_EXCEEDED = -2;
const EXIST_IN_DB = -1;
const NEW = 1;
var co = require('co');
var assert = require('assert');
var child
var docsSongs
var resJson = {
  insert:[ ] ,
  update:[ ] ,
  fail: { }
}
    /*
    var numfiles = 0;
    var numAudio = 0;*/

  /*              
          id3({ file: file, type: id3.OPEN_LOCAL }, function(err, tags) {
            console.log(tags);
          }); */

function echoPrint (file) {
  return new Promise((resolve, reject) => {

    child = exec('./binary/fpcalc', [ file ],
          (error, stdout, stderr) => { 
            
            var trackMetadata;
            var data; 
            let metadata = {
                file: file
            }

            if (!error) {
                var duration;
                //console.log(stdout);

                trackMetadata = stdout.split('\n');
                
                data = trackMetadata[2].split('=');
                metadata.fingerPrint = data[1];
                
                data = trackMetadata[1].split('=');
                metadata.duration = data[1];
                //trackMetadata = trackMetadata[0];
                resolve(metadata);
                console.log(file + " got fingerprint");
            } 

            if(error || 
                metadata.fingerPrint.length === 0 ||
                metadata.duration.length === 0) {
              console.log(file + " has not been recognized");
              reject([file + " has not been recognized", file]);
            }
          });
  })
}
/*
function getMimeType (file) {
    return new Promise((resolve, reject) => {

        child = exec('file', [ file, '--mime-type' ],
            (error, stdout, stderr) => { 
            //console.log(stderr);
            //console.log(error);
            var trackMetadata;
            var data; 
            let metadata = {
                file: file
            }

            if (!error) {
                var duration;
                //console.log(stdout);

                trackMetadata = stdout.split('\n');
                
                data = trackMetadata[2].split('=');
                metadata.fingerPrint = data[1];
                
                data = trackMetadata[1].split('=');
                metadata.duration = data[1];
                //trackMetadata = trackMetadata[0];
                resolve(metadata);
                console.log(file + " got fingerprint");
            } 

            if ( error || 
                metadata.fingerPrint.length == 0 || 
                metadata.duration.length == 0) 
            {
                reject([file + " has not been recognized", file]);
            }
        });
    })
}*/
    
function getRecordingMetadata (oldMetadata) {
    var url = 'http://api.acoustid.org/v2/lookup?client=' + 
              process.env.ACOUSTID_API +
              '&meta=recordings&duration=' +
              oldMetadata.duration +
              '&fingerprint=' +
              oldMetadata.fingerPrint

  return new Promise((resolve, reject) => {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var mBody = JSON.parse(body);
        let metadata = {
          metadata: mBody.results[0].recordings[0],
          file: oldMetadata.file,
          fingerPrint: oldMetadata.fingerPrint
        }
        resolve(metadata)
      } else {
        reject(error)
      }
    })
  })
}


function getMoreDetails (oldMetadata) {
  var trackTitle = oldMetadata.trackTitle.replace(/ /g, '%20').replace(/_/g, '%20').replace(/-/g, '%20')
                .replace(/\.[^/.]+$/, '')

  var artist = oldMetadata.artists[0].replace(/ /g, '%20').replace(/_/g, '%20').replace(/-/g, '%20')
                .replace(/\.[^/.]+$/, '')

  var url = 'https://api.musixmatch.com/ws/1.1/track.search?apikey=' +
            process.env.MUSIXMATCH_API +
            '&format=json&q_track=' +
            trackTitle +
            '&q_artist=' +
            artist +
           '&quorum_factor=1'

  return new Promise((resolve, reject) => {

    request(url, function (error, response, body) {
 
      if (!error && response.statusCode === 200) {
        var mBody = JSON.parse(body);
        var metadata = {
          metadata: mBody.message.body.track_list[0].track,
          oldMetadata: oldMetadata
        }
        resolve(metadata)
     } else {
        console.log('error1 ' + error)
        reject(error)
      }
    
    });
  })
}

function getTrackCover (trackName, artists) {
  var url = 'https://www.googleapis.com/customsearch/v1?key=' +
            process.env.GOOGLE_API +
            '&cx=' +
            process.env.GOOGLE_SEARCH_ENGINE +
            '&q=' +
            trackName +
            ' ' +
            artists +
            '&searchType=image'

  url = encodeURI(url);
  url = url.replace(/\(/g, '%28').replace(/\)/g, '%29')
        .replace(/,/g, '%2C');
  console.log(url)

  return new Promise((resolve, reject) => {
    request(url, function (error, response, body) {
      console.log(response.statusCode)

      if (!error && response.statusCode === 200) {
        var mBody = JSON.parse(body)
        var coverUrl = mBody.items[0].link

        getCoverBuffer(coverUrl).then(
              function (data) {
                resolve(data)
              }, function (err) {
                console.log(err)
        })
      } else if (response.statusCode === 403) {
      
        resolve(GOOGLE_API_LIMIT_EXCEEDED)
      } else {
      
        console.log('error2 ' + error)
        reject(error);
      }
    
    });
  })
}

function getCoverBuffer (coverUrl) {
  return new Promise((resolve, reject) => {
    var request = require('request').defaults({ encoding: null });

    request.get(coverUrl, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        resolve(body);
      }
    });
  });
}

function writeTag (mData) { 
  var cover
  var songBuffer = fs.readFileSync(mData.oldMetadata.file)

  var writer = new ID3Writer(songBuffer)
  writer.setFrame('TIT2', mData.oldMetadata.trackTitle)
          .setFrame('TPE1', [mData.oldMetadata.artists])
          .setFrame('TPE2', mData.oldMetadata.artists)
          .setFrame('TALB', mData.metadata.album_name)
          .setFrame('TYER', mData.metadata.first_release_date.substring(0,4)) // get year
          .setFrame('TLEN', mData.metadata.track_length * 1000) //milliseconds
          .setFrame('TCON', mData.metadata.primary_genres.music_genre_list)
          .setFrame('USLT', 'This is unsychronised lyrics')        

  if (mData.cover != GOOGLE_API_LIMIT_EXCEEDED){
    writer.setFrame('APIC', mData.cover)
    cover = mData.cover.toString('base64')
  } else {
    cover = GOOGLE_API_LIMIT_EXCEEDED
  }

  writer.addTag();

  var taggedSongBuffer = new Buffer(writer.arrayBuffer)
  fs.writeFileSync(mData.oldMetadata.file, taggedSongBuffer)

  var type = mime.lookup(mData.oldMetadata.file)
  console.log(type)
  if (type === AUDIO_MP3) {
    type = EXTENSION_MP3
  } else if (type === AUDIO_FLAC) {
    type = EXTENSION_FLAC
  }
  console.log(type, AUDIO_FLAC)

  var newName = mData.oldMetadata.trackTitle +
               ' - ' +
               mData.oldMetadata.artists +
               type

  fs.rename(mData.oldMetadata.file, path + '/' + newName)

  console.log('write')

  return { _id: mData.oldMetadata.trackId,
    file:newName,
    track_name:mData.oldMetadata.trackTitle,
    album_name:mData.metadata.album_name,
    artists:mData.oldMetadata.artists,
    year: mData.metadata.first_release_date.substring(0, 4),
    track_length:mData.metadata.track_length,
    music_genre_list:mData.metadata.primary_genres.music_genre_list,
    cover:cover }
}

function songGetAndUpdateData (file) {

  return new Promise((resolve, reject) => {

    if (file == EXIST_IN_DB) {
      resolve(EXIST_IN_DB)
    }

    echoPrint(file)
      .then(function (data) {
        getRecordingMetadata(data)
          .then(function (data) {
            var metadata = {
              trackId: data.metadata.id,
              trackTitle: data.metadata.title,
              artists: [],
              file: data.file,
              fingerPrint: data.fingerPrint
          }

            console.log('recording', data.metadata)
          
            for (let artist of data.metadata.artists) {
              console.log(artist)
              metadata.artists.push(artist.name)
            }
        
            Promise.all([ getMoreDetails(metadata),
              getTrackCover(metadata.trackTitle,
                            metadata.artists) ])

              .then(values => {
                values[0].cover = values[1]
                var result = writeTag(values[0])

                var pos = docsSongs.findIndex(x => x._id == result._id)
                
                if (pos === -1) {
                  resJson.insert.push(result)
                } else {
                  resJson.update.push(result)
                }

                resolve('insert')
                console.log('resolve')
              }).catch(reason => {
                console.log('fail', reason)
              })
          }, function (err) {
            console.log(err)
              })
      }, function (err) {
        console.log(err)
      })
  })
}

function updateSongCover (fileData){
  return new Promise((resolve, reject) => {

    getTrackCover(fileData.track_name, fileData.artists)
      .then(values => {
        console.log(values);
        if (values == GOOGLE_API_LIMIT_EXCEEDED){
          reject(GOOGLE_API_LIMIT_EXCEEDED)
          return
        }
        var songBuffer = fs.readFileSync(path + '/' + fileData.file)

        var writer = new ID3Writer(songBuffer)
        writer.setFrame('APIC', values)
        writer.addTag();

        fileData.cover = values.toString('base64')

        var taggedSongBuffer = new Buffer(writer.arrayBuffer)
        fs.writeFileSync(path + '/' + fileData.file, taggedSongBuffer)
        resJson.update.push(fileData)

        resolve('update')
      }).catch(reason => {
        console.log('fail', reason)
      })
  })
}
function checkFile (item){
  var file = path + '/' + item
  var type = mime.lookup(file)
  console.log(type);
  if (type !== AUDIO_MP3 && type !== AUDIO_FLAC) {
    return
  }
  var pos = docsSongs.findIndex(x => x.file === item)
  console.log(item, pos)

  if (pos !== -1){
    if (docsSongs[pos].cover === GOOGLE_API_LIMIT_EXCEEDED) {
      console.log(docsSongs[pos].cover)
      console.log('GOOGLE_API_LIMIT_EXCEEDED')
      return [GOOGLE_API_LIMIT_EXCEEDED, docsSongs[pos]]
    }

    console.log('EXIST_IN_DB', file.file)
    return [EXIST_IN_DB, file]
  }  

  return [NEW, file]
}

function main (docsSongs) {
  return new Promise((resolve, reject) => {

    var items
    items = fs.readdirSync(path);

    var promises = items.map(function (item) {
      var result = checkFile(item)
      if (result !== undefined) {
        switch (result[0]) {
          case NEW:
            return songGetAndUpdateData(result[1])
          case EXIST_IN_DB:
            return Promise.resolve(EXIST_IN_DB) // Iave
          case GOOGLE_API_LIMIT_EXCEEDED:
            return updateSongCover(result[1])
        }
      }
    })

    Promise.all(promises).then(values => {
      console.log( 'Promise.all',values);
      var bulkWrite = [];
    
      co(function*() {  
          
        for (insert of resJson.insert) {
          bulkWrite.push({ insertOne: { document: insert } });
        }
        for (update of resJson.update) {
          bulkWrite.push({ updateOne: { filter: {_id: update._id}, update: update } });
        }
        if (Object.keys(bulkWrite).length > 0) {
          var r = yield global.colSongs.bulkWrite(bulkWrite)
        }

        resolve(true)
        return resJson
      }).then(function (value){
        resolve(true)
        return resJson
      }).catch(function (err) {
        console.log(err.stack)
      })
    }).catch(reason => { 
      resolve("no changes")
      console.log(' Promise.all', reason)
    })
  })
}

module.exports = new Promise((resolve, reject) => {
  console.log('FILEUPDATER');
  var songs;

  co(function*() { 
    docsSongs = yield global.colSongs.find().sort({ file: 1 }).toArray();
    //assert.equal(docsSongs.length, docsSongs.length);
  }).then(function (value) {
    co(function*() {
      yield main(docsSongs)
    }).then(function (value) {
      console.log('finish')
      resolve('finish')
    }, function (err) {
      console.error(err.stack)
    })
  }, function (err) {
    console.error(err.stack)
  })
})
