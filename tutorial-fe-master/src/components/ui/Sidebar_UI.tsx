import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { routes } from 'constants/routesConstants'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { NavLink } from 'react-router-dom'

interface ItemProps extends ISidebarItem {
  setOpen: Dispatch<SetStateAction<boolean>>
}

interface ISidebarItem {
  title: string
  href: string
}

const sidebarItems: ISidebarItem[] = [
  {
    title: 'All Auctions',
    href: routes.DASHBOARD_PREFIX,
  },
  {
    title: 'My Profile',
    href: `${routes.DASHBOARD_PREFIX}/users/edit`,
  },
  {
    title: 'My Bids',
    href: `${routes.DASHBOARD_PREFIX}/bids`,
  },
  {
    title: 'My Auctions',
    href: `${routes.DASHBOARD_PREFIX}/auctions`,
  },
]

const Item: FC<ItemProps> = ({ href, setOpen, title }) => {
  return (
    <li className="mb-4">
      <NavLink
        className="text-decoration-none"
        to={href}
        onClick={() => setOpen(false)}
      >
        {title}
      </NavLink>
    </li>
  )
}

const Sidebar: FC = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <div>
      <Button
        className="sidebar__btn-menu btn-dark text-light rounded-0 d-flex justify-content-center align-items-center p-4"
        type="button"
        onClick={handleOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-list"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </Button>
      <Offcanvas
        show={open}
        onHide={handleClose}
        className="offcanvas offcanvas-start"
        tabIndex={-1}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src="/images/logo1.png" width={123} alt="SkillUp Mentor" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="ps-0 list-unstyled">
            {sidebarItems.map((item, index) => (
              <Item
                key={index}
                title={item.title}
                href={item.href}
                setOpen={setOpen}
              />
            ))}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

export default Sidebar
