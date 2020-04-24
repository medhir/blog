import NextHead from 'next/head'

interface HeadProps {
  title: string
}

const Head = ({ title }: HeadProps) => (
  <NextHead>
    <title>{title}</title>
    <link rel="icon" href="/m.ico" />
  </NextHead>
)

export default Head
