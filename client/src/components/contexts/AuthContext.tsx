import {
  useContext,
  useState,
  createContext,
  ReactElement,
  ReactNode,
} from 'react'

import type { User } from '../../types'

interface AuthProviderProps {
  children: ReactNode
  currentUser: User
}

interface AuthContext {
  currenUser: User | null
  signIn: (user: User) => void | null
  signOut: () => void
}

const AuthContext = createContext<AuthContext>({
  currenUser: null,
  signIn: () => null,
  signOut: () => null,
})
function useAuth(): AuthContext {
  return useContext(AuthContext)
}

function AuthProvider({
  children,
  currentUser,
}: AuthProviderProps): ReactElement {
  const [user, setUser] = useState<User | null>(null)

  function signIn(user: User): void {
    setUser(user)
  }

  function signOut(): void {
    setUser(null)
  }
  return (
    <AuthContext.Provider
      value={{ currenUser: user ? user : currentUser, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, useAuth }
