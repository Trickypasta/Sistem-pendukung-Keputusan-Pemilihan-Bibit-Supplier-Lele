import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Import CSS (yang isinya Tailwind)
import './index.css' 

// Import "Bungkus" (Layout) kita
import Layout from './layout.jsx';

// Import Halaman-halaman kita
import PageDashboard from './PageDashboard.jsx';
import PageKriteria from './PageKriteria';
import PageAlternatif from './PageAlternatif';
import PagePenilaian from './PagePenilaian';
import PageHasil from './PageHasil';

// Bikin "Peta" Rute-nya
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // <-- Pake Layout sebagai "bungkus"
    children: [
      {
        index: true,
        element: <PageDashboard /> 
      },
      {
        path: "kriteria", // <-- URL-nya jadi /kriteria
        element: <PageKriteria />, // <-- TAMPILIN INI
      },
      {
        path: "alternatif", // <-- URL-nya jadi /alternatif
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
      // Bisa tambahin halaman Dashboard/Home di sini
      // {
      //   index: true,
      //   element: <h1>Ini Dashboard</h1>
      // }
    ],
  },
]);

// "Nyalain" aplikasinya
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)