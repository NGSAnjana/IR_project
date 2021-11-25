// import json array file to elasticsearch
const fs = require('fs')
const shelljs = require('shelljs')
let endpoint = process.argv[2]
let jsonFile = process.argv[3]

if (!endpoint || !jsonFile || endpoint.search('_bulk') === -1) {
    console.log('sample: node jsonArrayToES.js localhost:9200/bank/customer/_bulk customer.json')
    process.exit()
}

console.log('json', jsonFile)
let data
try {
    data = JSON.parse(fs.readFileSync(jsonFile))
} catch (e) {
    console.log('read json file failed')
    process.exit()
}

console.log('read', data.length, 'line(s)')

let dataBinary = []

data.forEach((d, index) => {
    let idx = { index: { _id: index + 1 } }
    dataBinary.push(JSON.stringify(idx))
    dataBinary.push(JSON.stringify(d))
})

dataBinary = dataBinary.join('\n')

fs.writeFileSync('result.json', dataBinary)

let cmd = ['curl -XPOST ', endpoint, " -H 'Content-Type: application/x-ndjson'", ' --data-binary \'@result.json\''].join('')

console.log(cmd)
let rlt = shelljs.exec(cmd)
console.log(rlt)
// shelljs.exec('rm result.json')
if (rlt.code === 0) {
    console.log('data imported')
} else {
    console.log('error occured')
}