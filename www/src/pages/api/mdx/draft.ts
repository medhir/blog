// import fs from 'fs'
// import mdxTranspile from '@mdx-js/mdx'
import renderToString from 'next-mdx-remote/render-to-string'
import { Components } from '../../../components/mdx-viewer'

import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // if (req.method === 'POST' || req.method === 'PATCH') {
  //   // Create or update mdx file
  //   const mdx: string = req.body.mdx
  //   const id: string = req.body.id
  //   const path = `src/pages/mdx/drafts/${id}.mdx`
  //   const url = `/mdx/drafts/${id}`
  //   mdxTranspile(mdx) // validate the mdx
  //     .then(() => {
  //       // if it's valid, write to file
  //       fs.writeFile(path, mdx, (err: NodeJS.ErrnoException) => {
  //         if (err) {
  //           res.status(500).json({
  //             error: err.message,
  //           })
  //         } else {
  //           res.status(200).json({
  //             url,
  //           })
  //         }
  //       })
  //     })
  //     .catch((err) => {
  //       // otherwise return an error
  //       res.status(500).json({
  //         error: err,
  //       })
  //     })
  // } else if (req.method === 'DELETE') {
  //   const id: string = req.body.id
  //   const path = `src/pages/mdx/drafts/${id}.mdx`
  //   fs.unlink(path, (err: NodeJS.ErrnoException) => {
  //     if (err) {
  //       res.status(500).json({
  //         error: err.message,
  //       })
  //     } else {
  //       res.status(200).end()
  //     }
  //   })
  // } else {
  //   res.status(400).send('Unable to process request')
  // }
  if (req.method === 'POST') {
    // compile the mdx, render the component to a string to be hydrated on the client
    try {
      const renderedString = await renderToString(req.body.mdx, Components)
      res.status(200).send({
        source: renderedString,
      })
    } catch (err) {
      res.status(500).send({
        error: err,
      })
    }
  }
}
