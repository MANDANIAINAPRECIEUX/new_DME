import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

function MainLayout() {
    return (
        <div className="layout">
            <Sidebar />

            <div className="main-content">
            <Header />
            <main>

                <Outlet />

            </main>
            </div>

        </div>
    );
}

export default MainLayout;