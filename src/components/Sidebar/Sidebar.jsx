import { NavLink, useNavigate } from "react-router-dom";
import menuItems, { logoutItem } from "./menuItems";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

function Sidebar() {
  const LogoutIcon = logoutItem.icon;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="doctor-profile">
        <img
          src={user?.photo}
          alt={user?.name || user?.firstName}
          className="doctor-image"
        />

        <h3>{user?.name || `Dr. ${user?.firstName ?? ""}`}</h3>
        <p>{user?.speciality}</p>
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
        <button type="button" className="menu-item logout-btn" onClick={handleLogout}>
          <LogoutIcon />
          <span>{logoutItem.title}</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;