import fs from 'fs'

import { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuid } from 'uuid'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Create a new mdx file
    const mdx: string = req.body.mdx
    const id = uuid()
    const path = `src/pages/mdx/drafts/${id}.mdx`
    const url = `/mdx/drafts/${id}`
    fs.writeFile(path, mdx, (err: NodeJS.ErrnoException) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        })
      } else {
        res.status(200).json({
          url,
        })
      }
    })
  } else {
    res.status(400).send('Unable to process request')
  }
}
