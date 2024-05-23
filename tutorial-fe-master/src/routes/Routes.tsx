import { FC, lazy, Suspense } from 'react'
import { Route, RouteProps, Routes as Switch } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import RestrictedRoute from './RestrictedRoute'

export enum RouteType {
  PUBLIC,
  PRIVATE,
  RESTRICTED,
}

type AppRoute = RouteProps & {
  type?: RouteType
}

/* Public routes */
const Home = lazy(() => import('pages/Home'))

/* Private routes */
const Dashboard = lazy(() => import('pages/Dashboard/index_Dashboard'))
const DashboardUsers = lazy(() => import('pages/Dashboard/Users/index_users'))
const DashboardUsersAdd = lazy(
  () => import('pages/Dashboard/Users/Add/index_users_add'),
)
const DashboardUsersEdit = lazy(
  () => import('pages/Dashboard/Users/Edit/index_users_edit'),
)

const DashboardAuctions = lazy(
  () => import('pages/Dashboard/Auctions/index_auctions'),
)
const DashboardAuctionsAdd = lazy(
  () => import('pages/Dashboard/Auctions/Add/index_auctions_add'),
)
const DashboardAuctionsEdit = lazy(
  () => import('pages/Dashboard/Auctions/Edit/index_auctions_edit'),
)
const DashboardAuctionsView = lazy(
  () => import('pages/Dashboard/Auctions/specific_auction'),
)
const DashboardBids = lazy(() => import('pages/Dashboard/Bids/index_bids'))

/* Restricted routes */
const Login = lazy(() => import('pages/Login'))
const Register = lazy(() => import('pages/Register'))

/* Error routes */
const Page404 = lazy(() => import('pages/Page404'))

export const AppRoutes: AppRoute[] = [
  // Restricted Routes
  {
    type: RouteType.RESTRICTED,
    path: '/login',
    children: <Login />,
  },
  {
    type: RouteType.RESTRICTED,
    path: '/signup',
    children: <Register />,
  },
  // Private Routes
  {
    type: RouteType.PRIVATE,
    path: '/dashboard',
    children: <Dashboard />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/users',
    children: <DashboardUsers />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/users/add',
    children: <DashboardUsersAdd />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/users/edit',
    children: <DashboardUsersEdit />,
  },

  ///AUCTIONSS
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/auctions',
    children: <DashboardAuctions />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/auctions/add',
    children: <DashboardAuctionsAdd />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/auctions/edit',
    children: <DashboardAuctionsEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/auctions/view',
    children: <DashboardAuctionsView />,
  },

  {
    type: RouteType.PRIVATE,
    path: '/dashboard/bids',
    children: <DashboardBids />,
  },

  // Public Routes
  {
    type: RouteType.PUBLIC,
    path: '/',
    children: <Home />,
  },
  // 404 Error
  {
    type: RouteType.PUBLIC,
    path: '*',
    children: <Page404 />,
  },
]

const Routes: FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        {AppRoutes.map((r) => {
          const { type } = r
          if (type === RouteType.PRIVATE) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<PrivateRoute>{r.children}</PrivateRoute>}
              />
            )
          }
          if (type === RouteType.RESTRICTED) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<RestrictedRoute>{r.children}</RestrictedRoute>}
              />
            )
          }

          return (
            <Route key={`${r.path}`} path={`${r.path}`} element={r.children} />
          )
        })}
        <Route path="*" element={<Page404 />} />
      </Switch>
    </Suspense>
  )
}

export default Routes
