/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'next-mdx-remote/serialize'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // compile the mdx, render the component to a string to be hydrated on the client
    const serialized = await serialize(req.body.mdx)
    try {
      // const renderedString = await renderToString(req.body.mdx, Components)
      res.status(200).send({
        source: serialized,
      })
    } catch (err) {
      res.status(500).send({
        error: err,
      })
    }
  }
}
