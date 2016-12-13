# REACT REDUX NODEJS MONGODB MUSICPLAYER APP


Musicplayer with songs list.
The app identifies songs in src/static folder:
It gets a fingerprint using chrompraint (fpcalc), the fingerprint is sent to accoustid webservice 
and receives basic metadata. Then, it consumes musixmatch webservice for additional metadata.
The last webservice retrieves cover photo from google api (limit up to 100 HTTP requests per day).

Metadata is sent to monogdb and presented at client.

[Musicplayer Live](http://reuvenliran.hopto.org/)
 
The app was tested on Linux 64bit.
For another version of fpcalc - chromaprint:
https://acoustid.org/chromaprint

git clone 

npm install

open 2 terminal sessions (client and server)

npm start - for client

npm run server - for server

on ARM, you should run npm rebuild node-sass

open http://localhost:8080/ on your browser

* The app is not fully sync - deleteing files is currently not supported.

