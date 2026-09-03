import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

function MainLayout() {
  const location = useLocation();

  const isDashboard = location.pathname === "/";

  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">

        {isDashboard && <Header />}

        <main>
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default MainLayout;