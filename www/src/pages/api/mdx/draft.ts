/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'next-mdx-remote/serialize'
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

/** @type {import('rehype-pretty-code').Options} */
const rehypeOptions = {
  keepBackground: false,
  theme: "one-light"
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // compile the mdx, render the component to a string to be hydrated on the client
    const serialized = await serialize(req.body.mdx, {
      mdxOptions: {
        remarkPlugins: [],
        // @ts-ignore
        rehypePlugins: [[rehypePrettyCode, rehypeOptions], rehypeSlug],
      }
    })
    try {
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
