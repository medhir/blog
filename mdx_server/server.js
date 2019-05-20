const express = require('express')
const next = require('next')
const fs = require('fs')

const port = parseInt(process.env.PORT, 10) || 6789
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const cors = require('cors')

app.prepare().then(() => {
  const server = express()
  server.use(express.json())
  server.use(cors())

  server.post('/mdx/:title', (req, res) => {
    const title = req.params.title
    const mdxString = req.body.mdx
    fs.writeFile(`pages/mdx/${title}.mdx`, mdxString, (err) => {
      if (err) {
        res.status(500).json({
          error: err.message
        })
      } else {
        res.sendStatus(200)
      }
    })
  })

  server.get('/mdx/:title', (req, res) => {
    const title = req.params.title
    return app.render(req, res, `/mdx/${title}`)
  })

  server.get('/a', (req, res) => {
    return app.render(req, res, '/a', req.query)
  })

  server.get('/b', (req, res) => {
    return app.render(req, res, '/b', req.query)
  })

  server.get('/posts/:id', (req, res) => {
    return app.render(req, res, '/posts', { id: req.params.id })
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
