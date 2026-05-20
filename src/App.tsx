import { Route, Routes } from 'react-router'

import GuestRoute from './components/GuestRoute/GuestRoute'
import Create from './pages/Create/Create'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import MealPreps from './pages/MealPreps/MealPreps'
import Register from './pages/Register/Register'

export default function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<Create />} path="/create" />
      <Route
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
        path="/login"
      />
      <Route element={<GuestRoute><Register /></GuestRoute>} path="/register" />
      <Route element={<MealPreps />} path="/meal-preps" />
    </Routes>
  )
}
