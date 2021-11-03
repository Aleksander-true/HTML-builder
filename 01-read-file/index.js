const fs = require('fs');
const path = require('path');

const url = path.join(__dirname,'text.txt');

const stream = fs.createReadStream(url)
stream.setEncoding('utf8');
  stream.on('data', (chunk) => process.stdout.write(chunk));
  //stream.on('end', () => console.log('Reading finished successfully'))
  stream.on('error', (error) => console.log('Error: ', error));
