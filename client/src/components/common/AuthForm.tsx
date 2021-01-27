import React from 'react'

import { useRouter } from 'next/router'
import { useForm, RegisterOptions } from 'react-hook-form'

import { useAuth } from '../../components/contexts'
import { useRequest } from '../../hooks'
import { User } from '../../types'

export interface AuthFormData {
  email: string
  password: string
}

interface AuthFormProps {
  title: string
  apiUri: string
  emailValidation?: RegisterOptions
  passwordValidation: RegisterOptions
}

function AuthForm({
  title,
  apiUri,
  emailValidation,
  passwordValidation,
}: AuthFormProps): React.ReactElement {
  const router = useRouter()
  const { signIn } = useAuth()
  const { register, handleSubmit, errors } = useForm<AuthFormData>()
  const { makeRequest, apiError } = useRequest<AuthFormData, User>(apiUri)

  const handleFormSubmit = handleSubmit(async (formData) => {
    await makeRequest({
      method: 'POST',
      body: formData,
      onSuccess: function handleSuccess(data: User) {
        signIn(data)
        router.push('/')
      },
    })
  })
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <svg
          className="w-20 h-20 text-gray-400 m-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-600">
          {title}
        </h2>
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div className="space-y-1">
            <input
              ref={register(emailValidation)}
              name="email"
              className="appearance-none rounded-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
            {errors.email?.message && (
              <span className="font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                {errors.email.message}{' '}
              </span>
            )}
            <input
              ref={register(passwordValidation)}
              name="password"
              type="password"
              className="appearance-none rounded-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
            {errors.password?.message && (
              <span className="font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                {errors.password.message}
              </span>
            )}
          </div>
          {/* <div className="flex items-center justify-between">
            <div>
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 bg-gray-400 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember_me"
                className="ml-2 text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-gray-500"
            >
              Forgot your password?
            </a>
          </div> */}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-500 group-hover:text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            {title}
          </button>
        </form>
        {apiError?.errors && (
          <div className="space-y-1">
            {apiError.errors.map((error) => (
              <div
                key={error.message}
                className="flex justify-items-start items-center m-1 font-medium py-1 px-2 
           rounded-md text-red-700 bg-red-100 border border-red-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 mx-2"
                >
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div className="font-normal max-w-full">{error.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { AuthForm }
