const fs = require('fs');
const path = require('path');
const url = path.join(__dirname,'secret-folder');

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


