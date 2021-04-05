const axios = require('axios')
const path = require('path')
const fs = require('fs')

const { PAGE, LIMIT } = process.env

const reportFileName = 'report.final.json'
const report = require('./report.final.json')
// console.log(report)

report['step2'].allUploads['.gitkeep'] = true // NOTE: Исключение

const httpClient = axios.create({
  baseURL: 'http://selection4test.ru:1338', // selection4test.ru
  proxy: false
})

const main = async () => {
  // STEP 1: Get remonts page
  const r = await httpClient({
    method: 'GET',
    url: `/remonts?_limit=${LIMIT}&_start=${PAGE - 1}`
  })
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.log(err)
    })

  let allImgs = []

  if (r && Array.isArray(r)) {
    r.forEach((project) => {
      if (!!project.joblist) {
        const jobsWitchHasImgs = project.joblist.filter(({ imagesUrls }) => !!imagesUrls && imagesUrls.length > 0)
        let imgs = []

        jobsWitchHasImgs.forEach(({ imagesUrls }) => {
          imgs = [...imgs, ...imagesUrls]
        })

        if (!!imgs.length) {
          allImgs = [...allImgs, ...imgs]
        }
      }
    })
  }

  // console.log(allImgs)

  /* FOR EXAMPLE:
  [
    {
      thumbnail: {
        size: 6.41,
        ext: '.jpg',
        path: null,
        width: 245,
        height: 138,
        name: 'thumbnail_IMG_20210327_160519.jpg',
        hash: 'thumbnail_IMG_20210327_160519_7a9afdc9cf',
        url: '/uploads/thumbnail_IMG_20210327_160519_7a9afdc9cf.jpg',
        mime: 'image/jpeg'
      },
      large: {
        size: 76.79,
        ext: '.jpg',
        path: null,
        width: 1000,
        height: 563,
        name: 'large_IMG_20210327_160519.jpg',
        hash: 'large_IMG_20210327_160519_7a9afdc9cf',
        url: '/uploads/large_IMG_20210327_160519_7a9afdc9cf.jpg',
        mime: 'image/jpeg'
      },
      medium: {
        size: 44.85,
        ext: '.jpg',
        path: null,
        width: 750,
        height: 422,
        name: 'medium_IMG_20210327_160519.jpg',
        hash: 'medium_IMG_20210327_160519_7a9afdc9cf',
        url: '/uploads/medium_IMG_20210327_160519_7a9afdc9cf.jpg',
        mime: 'image/jpeg'
      },
      small: {
        size: 22.18,
        ext: '.jpg',
        path: null,
        width: 500,
        height: 281,
        name: 'small_IMG_20210327_160519.jpg',
        hash: 'small_IMG_20210327_160519_7a9afdc9cf',
        url: '/uploads/small_IMG_20210327_160519_7a9afdc9cf.jpg',
        mime: 'image/jpeg'
      }
    },
  ]
  */
  // const hashes = allImgs.map(({ thumbnail: { hash } }) => hash.split('_').reverse()[0])
  const getFilename = (url) => url.split('/').reverse()[0]
  allImgs.forEach((obj) => {
    for (const key in obj) {
      const filename = getFilename([obj[key].url])

      if (report['step2'].allUploads[filename] === false) {
        // report['step3.1'].assignedUploads[filename] = true
        report['step2'].allUploads[filename] = true
      }
      // else {
      //   report['step3.1'].assignedUploads[filename] = report['step2'].allUploads[filename] || false
      // }

      report['step3.2'].analysis.assigned.total += 1
      report['step3.2'].analysis.assigned.totalSize += obj[key].size // kB
      report['step3.2'].ts = new Date().getTime()
    }
  })

  const reportFile = path.join(__dirname, reportFileName)
  fs.writeFileSync(
    reportFile,
    JSON.stringify(report),
    'utf8',
    () => {
      console.log(`👌 JSON SAVED: ${reportFile}`)
      // process.exit(0)
    }
  )

  // process.stdout.write(JSON.stringify(hashes))
}

main()
