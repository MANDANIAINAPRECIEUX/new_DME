import { NavLink } from "react-router-dom";
import menuItems, { logoutItem } from "./menuItems";
import docteurImage from "../../assets/Docteur.png";
import "./Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">

            {/* Profil du docteur */} 

            <div className="doctor-profile">

                <img
                    src={docteurImage}
                    alt="Docteur"
                    className="doctor-image"
                />

                <h3>Dr. Mandaniaina Précieux</h3>

                <p>Chirurgien-dentiste</p>

            </div>

            {/* Menu */}

            <nav className="sidebar-menu">

                {menuItems.map((item) => {

                    const Icon = item.icon;

                    return (

                        <NavLink
                            key={item.title}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive
                                    ? "menu-item active"
                                    : "menu-item"
                            }
                        >
                            <Icon />

                            <span>{item.title}</span>

                        </NavLink>

                    );

                })}

            </nav>

            {/* Déconnexion */}

            <div className="logout">

                <NavLink
                    to={logoutItem.path}
                    className="menu-item"
                >

                    <logoutItem.icon />

                    <span>{logoutItem.title}</span>

                </NavLink>

            </div>

        </aside>
    );
}

export default Sidebar;