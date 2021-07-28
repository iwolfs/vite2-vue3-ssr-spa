const fs = require('fs')
const path = require('path')
const express = require('express')
const { createServer: createViteServer } = require('vite')

async function createServer() {
  const app = express()

  const vite = await createViteServer({
    server: { middlewareMode: true },
  })

  app.use(vite.middlewares)

  app.get('/about', async (req, res) => {
    // res.sendFile(path.resolve(__dirname, 'index.html'))
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
      const html = template
      .replace(`<!--vuex-state-->`, '')
      .replace(`<!--title-->`, '关于')
      res.status(200).set({'Content-Type':'text/html'}).end(html)
  })

  app.use('*', async (req, res) => {
    // serve index.html - we will tackle this next
    const url = req.originalUrl;
    
    try {
      // 1. Read index.html
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')

      // 2. Apply vite HTML transforms
      template = await vite.transformIndexHtml(url, template)
      // 3. Load the server entry, vite.ssrLoadModule
      const { render } = await vite.ssrLoadModule('/src/entry-server.js')


      // 4. render the app HTML
      const { appHtml, state } = await render(url)

      // 5. Inject the app-rendered html into template.
      const html = template
      .replace(`<!--ssr-outlet-->`, appHtml)
      // .replace(`'<!--vuex-state-->'`, JSON.stringify(state))
      .replace(`<!--vuex-state-->`, `<script>window.__INITIAL_STATE__ = ${JSON.stringify(state)}</script>`)
      .replace(`<!--title-->`, state.route.meta.title || '首页')

      // 5. Send the rendered HTML back.
      res.status(200).set({'Content-Type':'text/html'}).end(html)
    } catch (error) {
      await vite.ssrFixStacktrace(error)
      console.log(error)
      res.status(500).end(error.message)
    }
  })

  app.listen(3000, () => {
    console.log('localhost:3000')
  })
}

createServer()