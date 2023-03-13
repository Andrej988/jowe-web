import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/MainDashboard'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '*', name: 'Dashboard', element: Page404 },
]

export default routes
