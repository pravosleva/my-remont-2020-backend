const axios = require('axios')
const path = require('path')
const { exec } = require('child_process')
const si = require('systeminformation')
const fs = require('fs')

const { LIMIT } = process.env

const reportFileName = 'report.final.json'
const reportFile = path.join(__dirname, reportFileName)

const httpClient = axios.create({
  baseURL: 'http://selection4test.ru:1338', // selection4test.ru
  proxy: false
})
/*
const getPartial = (arr, chunkSize) =>
  arr.concat.apply(
    [],
    arr.map((_elem, i) => (i % chunkSize ? [] : [arr.slice(i, i + chunkSize)]))
  );
*/

// --- UTILS:
const promiseReduce = pList =>
  pList.reduce(
    (promise, func) =>
      promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([]),
  )
const delay = (ms = 5000) => new Promise(res => setTimeout(res, ms))
const getPagesFromTo = arr => {
  const [from, to] = arr;

  if (!Array.isArray(arr)) {
    console.log('Arg isnt an array');
    return [];
  }
  if (!to || !from) {
    console.log(`Required fields was not received; to= ${String(to)}, from= ${String(from)}`);
    return [];
  }
  if (to < from) {
    console.log(`End point should be more than start point !(${from} < ${to})`);
    return [];
  }

  const result = [];

  for (let i = from; i < to + 1; i ++) result.push(i);

  return result;
}
const getCMD = ({ page, limit }) => `PAGE=${page} LIMIT=${limit} node ${path.join(__dirname, 'step.3.1.1-get-page.js')}`
// ---

const main = () => httpClient.get('/remonts/count')
  .then((res) => {
    if (typeof res.data === 'number' && Number.isInteger(res.data)) {
      // console.log(res.data)
      return Number(res.data)
    }
    throw new Error(res)
  })
  .then((totalPages) => {
    const pages = [...getPagesFromTo([1, totalPages])]
    const promiseList = pages.map((p, i) => (async () => {
      console.log(`${p}...`)
      si.mem()
        .then(data => console.log(`   free ${(data.free*0.00000095367432).toFixed(2)} Mb`))
        .catch(error => console.error(error))
      const cmd = getCMD({ page: p, limit: LIMIT })
      // console.log(cmd)
      exec(cmd)
      if (i !== pages.length - 1) await delay(3000)
    }));

    return {
      promiseList,
      totalPages,
    }
  })
  .then(async ({ promiseList, totalPages }) => {
    await promiseReduce(promiseList);

    return totalPages
  })
  .then(() => {
    const report = require('./report.final.json')

    Object.keys(report['step2'].allUploads).forEach((key) => {
      // if (report['step3.1'].assignedUploads[key] === false) report['step3.1'].assignedUploads[key] = true
      if (report['step2'].allUploads[key] === false) {
        report['step3.1'].assignedUploads[key] = true
      } else {
        report['step3.1'].assignedUploads[key] = report['step2'].allUploads[key] || false
      }
    })
    report['step3.1'].ts = new Date().getTime()

    fs.writeFileSync(
      reportFile,
      JSON.stringify(report),
      'utf8',
      () => {
        console.log(`👌 JSON SAVED: ${reportFile}`)
        // process.exit(0)
      }
    )
  })
  .catch((err) => {
    console.log(err)
    throw new Error(err)
  })

const report = require('./report.final.json')
const getSize = require('get-folder-size')

getSize(path.join(__dirname, '../', 'public/uploads'), async (err, size) => {
  if (err) { throw err; }

  // console.log((size / 1024 / 1024).toFixed(2) + ' MB'); // bytes -> MB
  report['step3.2'].analysis.totalSize = size / 1024 // / 1024 // [kB]

  // TODO: Does not work! WTF?
  fs.readFile(path.join(__dirname, 'report.total.txt'), 'utf8', function readFileCallback (err, data) {
    if (err) {
      console.log('🚫 TXT COULD NOT READ!')
      console.log(err)
    } else {
      const num = Number(data)
      report['step3.2'].analysis.total = num
    }
  })
  await delay(5000)

  fs.writeFileSync(
    reportFile,
    JSON.stringify(report),
    'utf8',
    () => {
      console.log(`👌 JSON SAVED: ${reportFile}`)
      // process.exit(0)
    }
  )

  main()
})
