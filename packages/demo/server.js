import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import serveStatic from 'serve-static'
import coBody from 'co-body'

const app = express()
// 创建静态服务
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log(__dirname, '<=====__dirname')
const rootPath = path.join(__dirname, 'dist')
console.log(rootPath, '<=====rootPath')
app.use(serveStatic(rootPath))

//
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  next()
})

// 错误信息数组
const errorList = []

// 获取错误信息集合
app.get('/getErrorList', (req, res) => {
  res.send({
    code: 200,
    data: errorList
  })
})

// 添加错误信息
app.post('/addError', async (req, res) => {
  try {
    // console.log(req, '<=====req.body');
    console.log(req.body, 'body')
    let length = Object.keys(req.body).length
    console.log(length, '<=====length')
    if (length) {
      console.log(length, '<=====length')
    } else {
      let data = await coBody.json(req)
      errorList.push(data)
    }
    res.send({
      code: 200,
      message: 'success'
    })
  } catch (e) {
    console.log(e)
    res.send({
      code: 500,
      message: 'error'
    })
  }
})

// 获取到sourcemap源文件
app.get('/getSourceMap', (req, res) => {
  // 报错的map文件
  const fileName = req.query.fileName
  // 获取到源文件
  const mapFile = path.join(__filename, '..', 'dist/assets')
  // 获取源文件的路径
    const mapPath = path.join(mapFile, `${fileName}`)
    console.log(mapPath, '<=====mapPath');
    fs.readFile(mapPath, function (err, data) {
        if (err) {
            console.log(err, '<=====err');
            return;
        }
        res.send(data)
     })
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
