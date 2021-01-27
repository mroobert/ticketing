import React from 'react'

import { Navigation } from './Navigation'
import { Footer } from './Footer'

type Props = {
  children: React.ReactElement
}

function Layout({ children }: Props): React.ReactElement {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  )
}

export { Layout }
