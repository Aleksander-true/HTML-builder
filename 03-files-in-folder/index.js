const fs = require('fs/promises');
const path = require('path');
const url = path.join(__dirname,'secret-folder');

readDir(url);

async function readDir(url) {
  try {
    const files = await fs.readdir(url, {withFileTypes: true})
    showFiles(files, url)
  } catch (error) {
    console.log('Error:', error.message);
  }
}

function showFiles(files, url) {
  files.forEach( async function(file) {
    if (file.isFile()) {
      let extname = path.extname(file.name);
      let fileName = path.basename(file.name, extname)    
      try {
        let stats = await fs.stat(path.join(url,file.name))
        console.log(`${fileName} - ${extname.slice(1)} - ${Math.round(stats.size/1.024)/1000} kb`);
      } catch (error) {
        console.log('Error:', error.message);
      }
    }
  })
}
