import React from 'react'

import { AuthForm } from '../../components/common/AuthForm'

function SignInPage(): React.ReactElement {
  return (
    <AuthForm
      title="Sign in"
      apiUri="/api/users/signin"
      emailValidation={{
        required: 'Email required.',
        pattern: {
          value: /^[\w-]{0,50}@([\w-]+\.)+[\w-]{2,4}$/i,
          message: 'Email is not valid.',
        },
      }}
      passwordValidation={{
        required: 'Password required.',
      }}
    />
  )
}

export default SignInPage
