import { Outlet, NavLink } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseClass = "flex items-center space-x-3 rounded-md p-2 text-gray-600 hover:bg-gray-100";
const activeClass = "flex items-center space-x-3 rounded-md p-2 text-white bg-blue-600 font-semibold shadow-md";
const getNavLinkClass = ({ isActive }) => (isActive ? activeClass : baseClass);

export default function Layout() {
  return (
    <div className="flex h-screen">
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme="light"
      />

      <div className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col shadow-lg">
        
        <div className="flex flex-col items-center text-center space-y-2 mb-8">
    
          <ion-icon 
            name="fish-outline" 
            class="text-5xl text-blue-600"
          ></ion-icon>
          
          <div>
            <span className="block text-sm font-bold text-gray-800">
              Sistem Pendukung Keputusan
            </span>
            <span className="block text-xs text-gray-600">
              Pemilihan Supplier Bibit Lele
            </span>
          </div>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            <li>
              <NavLink to="/" className={getNavLinkClass} end>
                <ion-icon name="grid-outline" class="text-xl"></ion-icon>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/kriteria" className={getNavLinkClass}>
                <ion-icon name="cube-outline" class="text-xl"></ion-icon>
                <span>Data Kriteria</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/alternatif" className={getNavLinkClass}>
                <ion-icon name="people-outline" class="text-xl"></ion-icon>
                <span>Data Alternatif</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/penilaian" className={getNavLinkClass}>
                <ion-icon name="create-outline" class="text-xl"></ion-icon>
                <span>Input Penilaian</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/hasil" className={getNavLinkClass}>
                <ion-icon name="trophy-outline" class="text-xl"></ion-icon>
                <span>Hasil Peringkat</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="mt-auto">
          <p className="text-xs text-gray-400">© 2025 SPK Bibit Lele</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Outlet /> 
      </div>
    </div>
  );
}