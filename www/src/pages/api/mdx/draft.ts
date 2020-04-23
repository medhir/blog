import fs from 'fs'
import mdxTranspile from '@mdx-js/mdx'

import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
    // Create or update mdx file
    const mdx: string = req.body.mdx
    const id: string = req.body.id
    const path = `src/pages/mdx/drafts/${id}.mdx`
    const url = `/mdx/drafts/${id}`
    mdxTranspile(mdx) // validate the mdx
    .then(() => {   // if it's valid, write to file
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
    })
    .catch((err) => { // otherwise return an error
      res.status(500).json({
        error: err,
      })
    })
  } else {
    res.status(400).send('Unable to process request')
  }
}
