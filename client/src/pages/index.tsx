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

function HomePage({ currentUser }: PageProps): React.ReactElement {
  return currentUser ? (
    <b>You are signed in {currentUser.email}</b>
  ) : (
    <b>You are not signed in</b>
  )
}

HomePage.Layout = Layout

export default HomePage
