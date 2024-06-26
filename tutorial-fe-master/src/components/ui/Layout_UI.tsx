import { FC, ReactNode } from 'react'
import Footer from './Footer_UI'
import Navbar from './Navbar_UI'

interface Props {
  children: ReactNode | ReactNode[]
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="layout-container container-xxl p-4">{children}</div>
      <Footer />
    </>
  )
}

export default Layout
