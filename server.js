const fs = require('fs')
const path = require('path')
const express = require('express')


const app = express()
const resolve = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(resolve('./dist/client/index.html'), 'utf-8')
const manifest = require('./dist/client/ssr-manifest.json')
const { render } = require('./dist/server/entry-server.js')

app.use(express.static(resolve('./dist/client'), { index: false }))

app.get('/about', async (req, res) => {
  // res.sendFile(resolve('dist/client/index.html'))
    const html = template
    // .replace(`'<!--vuex-state-->'`, null)
    .replace(`<!--vuex-state-->`, '')
    .replace(`<!--title-->`, '关于')
    res.status(200).set({'Content-Type':'text/html'}).end(html)
})

// console.log('url', manifest)
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl
    const { appHtml, state } = await render(url, manifest)
    const html = template
    .replace(`<!--ssr-outlet-->`, appHtml)
    .replace(`<!--vuex-state-->`, `<script>window.__INITIAL_STATE__ = ${JSON.stringify(state)}</script>`)
    .replace(`<!--title-->`, state.route.meta.title || '首页')
    // console.log('html',html)
    res.status(200).set({'Content-Type':'text/html'}).end(html)
  } catch (error) {
    console.log(error)
  }
})

// app.get('/s', (req, res) => {
//   res.send('html')
// })

app.listen(3000, () => {
  console.log('localhost:3000')
})