const fs = require('fs/promises');
const path = require('path');
const { nextTick } = require('process');
const SRC_URL = path.join(__dirname,'styles');
const DEST_URL = path.join(__dirname,'project-dist', 'bundle.css');

isExistBundle(DEST_URL)
.then((exist)=> {deleteFile(DEST_URL)},
      (notExist) => { })
.then(() => readDir(SRC_URL))
.then((files)=> readAll(SRC_URL,files))
.then((dates) => appendToBundle(DEST_URL, dates))
.catch((error)=> console.log('Error:', error.message));

function isExistBundle(url) {
  console.log('isExistBundle URL', url)
  return fs.access(url)
}

function deleteFile(url) {
  console.log('deleteFile URL', url)
  return fs.rm(url)
}

function readDir(url) { 
  console.log('readDir URL', url)
    return fs.readdir(url, {withFileTypes: true})
}

function readAll(url,files) {
  console.log('readAll files', files)
  let promises = files.map((file) => {
    if (path.extname(file.name) === '.css') {
      let src = path.join(url, file.name);
      return readFile(src);
    }
  }).filter( item => item !== undefined)
  return Promise.all(promises)
}

async function readFile(url) {
  console.log('readFile URL', url)
  let data = fs.readFile(url, {encoding: 'utf8'})
  return data
}
  
async function appendToBundle(url, dates) {
  console.log('appendToBundle dates', url)
  appendNext(await dates.shift())

async  function appendNext(data) {
    if (data) {
      let success = await fs.appendFile(url, data)
      if (success === undefined) appendNext(dates.shift())
    }
  }    
      
}

/*
const stream = fs.createReadStream(url)
stream.setEncoding('utf8');
  stream.on('data', (chunk) => process.stdout.write(chunk));
  stream.on('end', () => console.log('Reading finished successfully'))
  stream.on('error', (error) => console.log('Error: ', error));
*/









