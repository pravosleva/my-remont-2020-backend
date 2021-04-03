const axios = require('axios')
const reportForChecking = require('./report.final.json')

console.log(reportForChecking)

if (!reportForChecking.step2) throw new Error('step1 result not found')

const limit = 1
const getPartial = (arr, chunkSize) =>
  arr.concat.apply(
    [],
    arr.map((_elem, i) => (i % chunkSize ? [] : [arr.slice(i, i + chunkSize)]))
  );
const httpClient = axios.create({
  baseURL: 'http://selection4test.ru:1338', // selection4test.ru
  proxy: false  
})

httpClient.get('/remonts/count')
  .then(async (res) => {
    // console.log(typeof res.data)
    // console.log(typeof res.data === 'number' && Number.isInteger(res.data))
    if (typeof res.data === 'number' && Number.isInteger(res.data)) {
      const counter = res.data
      const _arr = []

      for (let i = 0; i < counter; i++) _arr.push(i)

      const chunks = getPartial(_arr, limit)
  
      // console.log(chunks) // [[1], [2]]

      let allImgs = []

      chunks.forEach((arr) => {
        // console.log(arr) // [1]
        arr.forEach(async (num) => {
          // console.log(num)
          const r = await httpClient.get(`/remonts?_limit=${limit}&_start=${num}`)
            .then((res) => {
              return res.data
            })
            .catch((err) => {
              console.log(err)
            })
          
          if (r && Array.isArray(r)) {
            r.forEach((project) => {
              if (!!project.joblist) {
                const imgs = project.joblist.map(({ imagesUrls }) => imagesUrls ? imagesUrls : null)

                const filtered = imgs.filter((item) => !!item)

                if (!!filtered.length) {
                  allImgs = [...allImgs, ...filtered]
                }
              }
            })
          }
        })
      })

      console.log('---')
      console.log(allImgs)
      console.log('---')
    }
    throw new Error(res)
  })
  .catch((_err) => {
    // console.log(err)
    return 0
  })
