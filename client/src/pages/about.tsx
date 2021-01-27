import React from 'react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import { Layout } from '../components/common/Layout'
import { getCurrentUserSSR } from '../utils/getCurrentUser'
import type { PageProps } from '../types'

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageProps>> {
  const user = await getCurrentUserSSR(ctx)
  return { props: { currentUser: user } }
}
function AboutPage(): React.ReactElement {
  return <b>Hello from about page</b>
}

AboutPage.Layout = Layout

export default AboutPage
