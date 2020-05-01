import renderToString from 'next-mdx-remote/render-to-string'
import { Components } from '../../../components/mdx-viewer'

import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
