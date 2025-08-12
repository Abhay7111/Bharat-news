import React, { StrictMode } from 'react'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Home from './Components/Pages/Home';
import News from './Components/Pages/News';

const routers = createBrowserRouter([
{  path: '/',  element: <Home/>, children: [
  {path: '', element: <News/>}
]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={routers} />
  </React.StrictMode>,
)
