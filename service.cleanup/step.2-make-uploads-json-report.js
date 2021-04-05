const readline = require('linebyline');
const path = require('path')
const fs = require('fs')

const reportFileName = 'report.final.json'
const rl = readline(path.join(__dirname, 'report.all-photos.txt'));
const json = {
  step2: {
    description: 'Чтение перечня файлов из текстового файла',
    allUploads: {},
    ts: new Date().getTime(),
  },
  'step3.1': {
    description: 'Файлы, найденные в проектах',
    assignedUploads: {},
    ts: null,
  },
  'step3.2': {
    description: 'Analysis',
    analysis: {
      total: 0,
      totalSize: 0,
      assigned: {
        total: 0,
        totalSize: 0,
      },
      notAssigned: {
        total: 0,
        totalSize: 0,
      },
    },
    ts: null,
  },
  'step3.3': {
    description: 'Удаленные файлы',
    removedUploads: {},
    ts: null,
  },
};

rl
  .on('line', function(line, _lineCount, _byteCount) {
    // do something with the line of text
    // lines.push({ filename: line });
    if (line === '.gitkeep') json.step2.allUploads[line] = true
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

    const reportFile = path.join(__dirname, reportFileName)

    fs.writeFile(
      reportFile,
      JSON.stringify(json),
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
