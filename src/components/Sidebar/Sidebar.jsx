import { NavLink } from "react-router-dom";
import menuItems, { logoutItem } from "./menuItems";
import { doctor } from "../../mock/doctor";
import "./Sidebar.css";

function Sidebar() {
  const LogoutIcon = logoutItem.icon;

  return (
    <aside className="sidebar">
      {/* TODO: Replace mock doctor data with API response when backend is available. */}

      <div className="doctor-profile">
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="doctor-image"
        />

        <h3>{doctor.name}</h3>
        <p>{doctor.speciality}</p>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              <Icon />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="logout">
        <NavLink to={logoutItem.path} className="menu-item">
          <LogoutIcon />
          <span>{logoutItem.title}</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;