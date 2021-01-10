import React from 'react'
import Link from 'next/link'

import { Layout } from '@/components/common/Layout'
function AboutPage(): React.ReactElement {
  return (
    <div>
      <Link href="/">
        <a>About</a>
      </Link>
    </div>
  )
}

AboutPage.Layout = Layout

export default AboutPage
