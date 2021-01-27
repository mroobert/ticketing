import React from 'react'
import Link from 'next/link'

function Navigation(): React.ReactElement {
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
        <a className="block lg:inline-block mt-4 lg:mt-0 mr-10 hover:text-gray-400" href="#">
          Contact
        </a>
        <Link href="/about">
          <a className="block lg:inline-block mt-4 lg:mt-0 mr-10 hover:text-gray-400">About</a>
        </Link>
      </div>
      <div className="hidden lg:order-3 lg:block w-full lg:text-right">
        <a className="block lg:inline-block mt-4 lg:mt-0 mr-10 hover:text-gray-400" href="#">
          Sign Up
        </a>
        <a className="block lg:inline-block mt-4 lg:mt-0 mr-10 hover:text-gray-400" href="#">
          Sign In
        </a>
      </div>
    </nav>
  )
}

export { Navigation }
