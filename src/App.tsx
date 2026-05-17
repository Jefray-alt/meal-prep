import { Route, Routes } from 'react-router'

import Create from './pages/Create/Create'
import Home from './pages/Home/Home'
import MealPreps from './pages/MealPreps/MealPreps'
import Register from './pages/Register/Register'

export default function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<Create />} path="/create" />
      <Route element={<MealPreps />} path="/meal-preps" />
      <Route element={<Register />} path="/register" />
    </Routes>
  )
}
