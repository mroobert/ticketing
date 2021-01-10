import React from 'react'

import '../styles/index.css'
import type { AppProps } from 'next/app'

const NoLayout: React.FC = ({ children }) => <>{children}</>

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  const Layout = (Component as any).Layout || NoLayout

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
export default MyApp
