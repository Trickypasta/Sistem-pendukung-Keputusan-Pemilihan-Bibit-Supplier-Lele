import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css' 

import Layout from './layout.jsx';

import PageDashboard from './PageDashboard.jsx';
import PageKriteria from './PageKriteria';
import PageAlternatif from './PageAlternatif';
import PagePenilaian from './PagePenilaian';
import PageHasil from './PageHasil';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PageDashboard /> 
      },
      {
        path: "kriteria", 
        element: <PageKriteria />, 
      },
      {
        path: "alternatif", 
        element: <PageAlternatif />,
      },
      {
        path: "penilaian",
        element: <PagePenilaian />,
      },
      {
        path: "hasil",
        element: <PageHasil />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)