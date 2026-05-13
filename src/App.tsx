import { Route, Routes } from 'react-router'

import Home from './pages/Home/Home'
import MealPreps from './pages/MealPreps/MealPreps'

export default function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<MealPreps />} path="/meal-preps" />
    </Routes>
  )
}
