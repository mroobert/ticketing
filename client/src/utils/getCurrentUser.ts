import { GetServerSidePropsContext } from 'next'
import axios from 'axios'

import { createAxiosInstanceForSSR } from '../API/axios'
import type { User } from '../types'

export interface CurrentUserApi {
  currentUser: User
}

async function getCurrentUserSSR(
  ctx: GetServerSidePropsContext
): Promise<User> {
  const { data } = await createAxiosInstanceForSSR(ctx).get<CurrentUserApi>(
    '/api/users/currentuser'
  )
  return data.currentUser
}

async function getCurrentUser(): Promise<User> {
  const { data } = await axios.get<CurrentUserApi>('/api/users/currentuser')
  return data.currentUser
}

export { getCurrentUserSSR, getCurrentUser }
