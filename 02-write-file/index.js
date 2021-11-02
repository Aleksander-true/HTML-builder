const fs = require('fs');
const path = require('path');
const readline = require ('readline')

const fileName = 'text.txt';
const url = path.join(__dirname,fileName);
const outputStream = fs.createWriteStream(url);
const rl = readline.createInterface({
  input: process.stdin,
  output: outputStream
});

/** Some instruction for user */
outputStream.on('open', ()=>{
  console.log('-> Please entry your data and press "Enter". To finish data entry: type "exit" (without quotes) or press CTRL + C ');
})

/** Write input data to file by line, until meet 'exit' command */
rl.on('line', (input) => {
  if (input.trim().toLowerCase() == 'exit') {
    exitHandler();
  } 
  else {
    outputStream.write(`${input}\n`);
  } 
});

/** Finishing when press CTRL + C */
process.on('SIGINT', exitHandler)

function exitHandler() {
  rl.close()
  console.log(`-> Your data was saved in file: text.txt `);
}

/** Error handler */
outputStream.on('error', (error) => console.log('Error: ', error));


