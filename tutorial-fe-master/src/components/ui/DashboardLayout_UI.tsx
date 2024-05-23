import { FC, ReactNode } from 'react'
import Sidebar from './Sidebar_UI'
import Topbar from './Topbar_UI'

interface Props {
  children: ReactNode | ReactNode[]
}

const DashboardLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <Topbar />
      </div>
      <div className="p-4">{children}</div>
    </>
  )
}

export default DashboardLayout
