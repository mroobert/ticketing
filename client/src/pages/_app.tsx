import '../styles/index.css'
import type { AppProps } from 'next/app'

import { AuthProvider } from '../components/contexts'

const NoLayout: React.FC = ({ children }) => <>{children}</>

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  const Layout = (Component as any).Layout || NoLayout
  return (
    <AuthProvider currentUser={pageProps.currentUser}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}
export default MyApp
