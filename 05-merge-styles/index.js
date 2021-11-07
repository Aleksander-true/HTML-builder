const fsPromise = require('fs/promises');
const fs = require('fs');
const path = require('path');


createBundle()

function createBundle(srcFolderURL,destinationFileURL) {
const SRC_URL = srcFolderURL || path.join(__dirname,'styles') 
const DEST_URL = destinationFileURL || path.join(__dirname,'project-dist', 'bundle.css');

createEmptyFile(DEST_URL)
.then(() => readDir(SRC_URL))
.then((files)=> getUrls(SRC_URL,files))
.then((urls) => appendToBundle(urls, DEST_URL))
.catch((error)=> console.log('Error', error.message));
}

function createEmptyFile(url) {
  return fsPromise.writeFile(url,'')
}

function readDir(url) { 
  return fsPromise.readdir(url, {withFileTypes: true})
}

function getUrls(url,files) {
  return files.map((file) => path.extname(file.name) === '.css' ? path.join(url, file.name) : undefined)
  .filter( item => item !== undefined)
}

async function appendToBundle(urlArray, destUrl) {
    let srcUrl = await urlArray.shift()
    if (srcUrl) {
      try { 
        let data = await fsPromise.readFile(srcUrl,{encoding:'utf8'})
        await fsPromise.appendFile(destUrl , data)
        appendToBundle(urlArray, destUrl);
      } catch(error) {
        console.log('Error to append:', error.message);
      }
    }
}       



