const readline = require('linebyline');
const path = require('path')
const fs = require('fs')

const reportFileName = 'report.uploads.json'

const rl = readline(path.join(__dirname, 'report.all-photos.txt'));
const lines = [];
rl
  .on('line', function(line, lineCount, byteCount) {
    // do something with the line of text
    lines.push({ filename: line });
  })
  .on('close', function() {
    // function getValues(arr) {
    //   let obj = {};

    //   for (let i = 0; i < arr.length; i++) {
    //     let modifiedWord = arr[i].toLowerCase().split("").sort().join("");

    //     obj[modifiedWord] = arr[i];
    //   }

    //   return Object.values(obj);
    // }

    // const isOk = getValues(lines).length === 1;

    // process.stdout.write((isOk ? 1 : 0).toString());
    const json = JSON.stringify(lines);
    const reportFile = path.join(__dirname, reportFileName)

    fs.writeFile(
      reportFile,
      json,
      'utf8',
      () => {
        console.log(`👌 JSON SAVED: ${reportFile}`)
      }
    )
  })
  .on('error', err => {
    // something went wrong
    console.log('ERR:', err);
  });
