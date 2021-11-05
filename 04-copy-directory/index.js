const fs = require('fs/promises');
const path = require('path');
const SRC_URL = path.join(__dirname,'files');
const DEST_URL = path.join(__dirname,'files-copy');

deleteDir(DEST_URL)
//createDir(DEST_URL)
async function deleteDir(url) {
  try {
    let delSuccess = await fs.rmdir(url,{ recursive: true, force: true });
    if (delSuccess !== undefined) console.log("Can't delete folder")
    else createDir(DEST_URL)
  } catch (error) {
    console.log('Error:', error.message);
  }
}

async function createDir(url) {
  try {
    //let parentDir = 
    await fs.mkdir(url,{recursive:false})
    if (url === DEST_URL) readDir(SRC_URL)
    else {
      let srcUrl = url.replace(DEST_URL, SRC_URL);
      readDir(srcUrl)
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
} 

async function readDir(url) { 
  let destUrl = url.replace(SRC_URL,DEST_URL)
  try {
    let files = await fs.readdir(url, {withFileTypes: true})
    files.forEach( async function(file) {
      if (file.isFile()) {
        let src = path.join(url, file.name);
        let dest = path.join(destUrl, file.name);
        copyFiles(src, dest)
       } else {
        let dest = path.join(destUrl, file.name)
        createDir(dest)
       }
    })
  } catch (error) {
    console.log('Error:', error.message);
  }
}

async function copyFiles(src,dest) {
  try {
    await fs.copyFile(src, dest)
  } catch (error) {
    console.log('Error:', error.message);
  }
}
