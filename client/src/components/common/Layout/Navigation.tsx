import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useAuth } from '../../contexts'
import { useRequest } from '../../../hooks'

function Navigation(): React.ReactElement {
  const router = useRouter()
  const { currenUser, signOut } = useAuth()
  const { makeRequest } = useRequest('/api/users/signout')

  async function handleSignOutKeyPress(
    event: React.KeyboardEvent<HTMLAnchorElement>
  ): Promise<void> {
    if (event.key === '13')
      await makeRequest({
        method: 'POST',
        onSuccess: function handleSuccess() {
          signOut()
          router.push('/')
        },
      })
  }

  async function handleSignOutClick(): Promise<void> {
    await makeRequest({
      method: 'POST',
      onSuccess: function handleSuccess() {
        signOut()
        router.push('/')
      },
    })
  }
  return (
    <nav className="bg-white sticky top-0 flex items-center justify-between py-3 lg:px-40 xs:px-4 border-b">
      <div className="lg:order-2 w-auto">
        <Link href="/">
          <a className="text-2xl text-gray-600 font-extrabold font-heading tracking-widest">
            TICKETING
          </a>
        </Link>
      </div>
      <div className="lg:hidden">
        <button className="py-4 px-5 rounded border">
          <svg
            className="fill-current h-4 w-4"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </button>
      </div>
      <div className="hidden lg:order-1 lg:block w-full">
        <a className="block lg:inline-block mt-4 lg:mt-0 mr-10 hover:text-gray-400">
          Contact
        </a>
        <Link href="/about">
          <a className="block lg:inline-block mt-4 lg:mt-0 mr-10 hover:text-gray-400">
            About
          </a>
        </Link>
      </div>
      <div className="hidden lg:order-3 lg:block w-full lg:text-right">
        {!currenUser ? (
          <>
            <Link href="/auth/signup">
              <a className="block lg:inline-block mt-4 lg:mt-0 mr-10 hover:text-gray-400">
                Sign Up
              </a>
            </Link>
            <Link href="/auth/signin">
              <a className="block lg:inline-block mt-4 lg:mt-0 mr-10 hover:text-gray-400">
                Sign In
              </a>
            </Link>
          </>
        ) : (
          <Link href="/">
            <a
              tabIndex={0}
              role="link"
              className="block lg:inline-block mt-4 lg:mt-0 mr-10 hover:text-gray-400"
              onClick={handleSignOutClick}
              onKeyPress={handleSignOutKeyPress}
            >
              Sign Out
            </a>
          </Link>
        )}
      </div>
    </nav>
  )
}

export { Navigation }
