import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
import Home from './pages/Home'
import Book from './pages/Book'
import { ToastContainer } from 'react-toastify'
import React from 'react'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/book/:id" element={<Book />} />
    </>
  )
)

function App(): React.ReactElement {
  return (
    <main className="w-full h-dvh flex bg-zinc-950 text-zinc-200 print:text-zinc-950">
      <RouterProvider router={router} />
      <ToastContainer theme="dark" position="bottom-center" />
    </main>
  )
}

export default App
