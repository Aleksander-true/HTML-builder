const fs = require('fs/promises');
const fsStream = require('fs');
const path = require('path');
const SRC_URL = path.join(__dirname,'styles');
const DEST_URL = path.join(__dirname,'project-dist', 'bundle.css');

createEmptyFile(DEST_URL)
.then(() => readDir(SRC_URL))
.then((files)=> getUrls(SRC_URL,files))
.then((urls) => appendToBundle(DEST_URL, urls))
.catch((error)=> console.log('Error', error.message));

function createEmptyFile(url) {
  return fs.writeFile(url,'')
}

function readDir(url) { 
    return fs.readdir(url, {withFileTypes: true})
}

function getUrls(url,files) {
  return files.map((file) => path.extname(file.name) === '.css' ? path.join(url, file.name) : undefined)
  .filter( item => item !== undefined)
}

async function appendToBundle(destUrl, urlArray) {
  appendNext(await urlArray.shift())
  
async  function appendNext(url) {
    if (url) {
      try { 
        let readStream = fsStream.createReadStream(url, "utf8");
        readStream.on('data', async (chunk) => {
          await fs.appendFile(destUrl,chunk)
          appendNext(urlArray.shift())
        })
      } catch(error) {
        console.log('Error to append:', error.message);
      }
    }
  }       
}





