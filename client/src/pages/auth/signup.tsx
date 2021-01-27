import React from 'react'

import { AuthForm } from '../../components/common/AuthForm'

function SignUpPage(): React.ReactElement {
  return (
    <AuthForm
      title="Sign up"
      apiUri="/api/users/signup"
      emailValidation={{
        required: 'Email required.',
        pattern: {
          value: /^[\w-]{0,50}@([\w-]+\.)+[\w-]{2,4}$/i,
          message: 'Email is not valid.',
        },
      }}
      passwordValidation={{
        required: 'Password required.',
        minLength: {
          value: 4,
          message: 'The password must be at least 4 characters long.',
        },
        maxLength: {
          value: 20,
          message: 'The password must be maximum 20 characters long.',
        },
      }}
    />
  )
}

export default SignUpPage
