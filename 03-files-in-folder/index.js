const fs = require('fs/promises');
const path = require('path');
const url = path.join(__dirname,'secret-folder');

readDir(url);

async function readDir(url) {
  try {
    const files = await fs.readdir(url, {withFileTypes: true})
    showFiles(files, url)
  } catch (err) {
    console.error(err);
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
        console.error(err);
      }
    }
  })
}


/*
fs.readdir(url, {withFileTypes: true}, (err,files) => {
  if (err) throw err;
  files.forEach( (file)=> {
    if (file.isFile()) {
      let extname = path.extname(file.name);
      let fileName = path.basename(file.name, extname) 
      let sizeFile = null;
      fs.stat(path.join(url,file.name), (err,stats) => {
        if (err) throw err;
        sizeFile = stats.size
        console.log(`${fileName} - ${extname.slice(1)} - ${Math.round(sizeFile/1.024)/1000} kb`);
      })
    }
  })
  });

*/
