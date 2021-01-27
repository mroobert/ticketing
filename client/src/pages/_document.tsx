import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'
class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head />
        <body className="bg-white text-gray-600 font-normal font-sans leading-normal text-base tracking-normal">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
