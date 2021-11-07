const fsPromise = require('fs/promises');
const fs = require('fs');
const readline = require ('readline')
const path = require('path');

const CSS_FOLDER_URL = path.join(__dirname,'styles') 
const ASSETS_URL = path.join(__dirname,'assets');
const PROJECT_DIST_URL = path.join(__dirname,'project-dist');
const TEMPLATE_URL = path.join(__dirname, 'template.html');
const COMPONENTS_URL = path.join(__dirname, 'components');
const TEMPLATE_DIST_URL = path.join(PROJECT_DIST_URL, 'template.html');
const BUNDLE_DIST_URL = path.join(PROJECT_DIST_URL, 'style.css');
const ASSETS_DIST_URL = path.join(PROJECT_DIST_URL,'assets');

deleteDir(PROJECT_DIST_URL)
.then(()=> createDir(PROJECT_DIST_URL))
.then(()=> createBundle(CSS_FOLDER_URL,BUNDLE_DIST_URL))
.then(()=> createDir(ASSETS_DIST_URL))
.then(()=> copyDir(ASSETS_URL, ASSETS_DIST_URL))
.then(()=> processTemplate(TEMPLATE_URL, COMPONENTS_URL, TEMPLATE_DIST_URL))
.catch((error)=> console.log('Error main', error.message))

function deleteDir(url) {
  return fsPromise.rmdir(url,{ recursive: true, force: true });
}

function createDir(url) {
  return fsPromise.mkdir(url)
}

function createBundle(srcFolderURL,destinationFileURL) {
  const SRC_URL = srcFolderURL || path.join(__dirname,'styles') 
  const DEST_URL = destinationFileURL || path.join(__dirname,'project-dist', 'bundle.css');
 
  createEmptyFile(DEST_URL)
  .then(() => readDir(SRC_URL))
  .then((fileNames)=> getUrlsByPattern(SRC_URL,fileNames, '.css'))
  .then((urls) => appendToBundle(urls, DEST_URL))
  .catch((error)=> console.log('Error createBundle', error.message));
}

function copyDir(srcDir, destDir) {
    readDir(srcDir)
    .then((fileNames)=> getUrlsByPattern(srcDir,fileNames, '.*'))
    .then((urls)=> copyFiles(urls, destDir))
    .catch((error)=> console.log('Error copyDir', error.message));
}  

async function processTemplate(srcURL, componentsURL, destURL) {
  readLines(srcURL) 
  .then(lines => appendLines(lines, componentsURL, destURL))
  .catch((error)=> console.log('Error processTemplate', error.message));
}

async function readLines(src) {
  let readStream = fs.createReadStream(src);
  const rl = readline.createInterface({input: readStream});
  let lines = []
  for await (const line of rl) {
    lines.push(line)
  }
  return lines
}
  
async function appendLines(lines, componentsURL, destURL) {
 if (lines.length == 0) return 
 let regexp = /{{(.*)}}/
 let line = lines.shift();
  if (regexp.test(line)) {
    let fileName = line.match(regexp)[1] + '.html'
    let srcURL = path.join(componentsURL,fileName)

    await appendToBundle(srcURL, destURL)
    await fsPromise.appendFile(destURL ,'\n')
    appendLines(lines, componentsURL, destURL)
  } else {
    await fsPromise.appendFile(destURL , line + '\n')
    appendLines(lines, componentsURL, destURL)
  }
} 

  function createEmptyFile(url) {
    return fsPromise.writeFile(url,'')
  }
  
  function readDir(url) { 
    return fsPromise.readdir(url, {withFileTypes: true})
  }
  /**
   * 
   * @param {string} url 
   * @param {Array} files 
   * @param {string} extname, extname of file ".css" or regext pattern like '.*'
   * @returns {Array}
   */
  function getUrlsByPattern(url,fileNames, extname) {
    let regexp = new RegExp(extname)
    
    let urls = fileNames.map((file) => regexp.test(path.extname(file.name)) ? path.join(url, file.name) : undefined)
    .filter( item => item !== undefined)
    return urls
  }

  async function copyFiles(urlsArray, destURL){
    try {
      let urlsArrayStat = await urlsArray.map(url => {
        return {srcURL: url, stats:fsPromise.stat(url)}
      })
      await urlsArrayStat.forEach( async (obj) => {
        let fileName = path.basename(obj.srcURL)
        let destUrl = path.join(destURL,fileName )
        let stat = await obj.stats;
        if (stat.isFile()) {
          copyOneFile(obj.srcURL, destUrl)  
        } else {
          createDir(destUrl)
          copyDir(obj.srcURL, destUrl)
        }
      })
    } catch (error) {
      console.log('Error to copyFiles:', error.message);
    }
  }

  /**
   * Get array urls and append data from this files to one file(destination URL)
   * @param {Array} urlArray 
   * @param {string} destUrl 
   */
  async function appendToBundle(urlArray, destUrl) {  
    if(Array.isArray(urlArray) === false) urlArray = [urlArray];
    if (urlArray.length === 0) return 
    let srcUrl = await urlArray.shift()
      try { 
        let data = await readFile(srcUrl);
        let success = await fsPromise.appendFile(destUrl , data)
        if (success === undefined) appendToBundle(urlArray, destUrl);
      } catch(error) {
        console.log('Error to append:', error.message);
      }
  }     
  
  function readFile(url, encoding = "utf8") {
    let option = {encoding: encoding}
    return fsPromise.readFile(url,option)
  }


  function copyOneFile(src,dest) {
    let readStream = fs.createReadStream(src);
    let writeStream = fs.createWriteStream(dest);
    readStream.pipe(writeStream);
}
  