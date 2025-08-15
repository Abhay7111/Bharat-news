import React, { StrictMode } from 'react'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Home from './Components/Pages/Home';
import News from './Components/Pages/News';
import Chat from './Components/Pages/Chat/Chat';
import Allnews from './Components/Small-components/Allnews';
import Weather from './Components/Pages/weather';
import Mostviews_citys from './Components/Small-components/Mostviews-citys';

const routers = createBrowserRouter([
{  path: '/',  element: <Home/>, children: [
    {path: '', element: <News/>, children: [
      {path: '', element: <div><Mostviews_citys/></div>},
      {path: 'all', element: <div><Mostviews_citys/><Allnews/></div>},
      {path: 'wether', element: <Weather/>},
      {path: '*', element: 'Error 402'}
    ]},
    {path:'/chat', element: <Chat/>},
    {path:'/notification', element: 'notification'},
    {path:'/add-new', element: 'new news'},
    {path:'/Profile', element: 'Profile'},
    {path: '*', element: 'Error'},
]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={routers} />
  </React.StrictMode>,
)
