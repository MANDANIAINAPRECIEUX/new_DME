import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
function MainLayout() {
    return (
        <div className="layout">
            <Sidebar />

            <div className="main-content">
            <Header />
            <main>

                {/* Les pages */}

            </main>
            </div>

        </div>
    );
}

export default MainLayout;