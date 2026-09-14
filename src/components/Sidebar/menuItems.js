import {
    FaHome,
    FaUserFriends,
    FaCalendarAlt,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

const menuItems = [
    { title: "Dashboard", icon: FaHome, path: "/" },
    { title: "Patients", icon: FaUserFriends, path: "/patients" },
    { title: "Rendez-vous", icon: FaCalendarAlt, path: "/appointments" },
    { title: "Paramètres", icon: FaCog, path: "/settings" }
];

export const logoutItem = {
    title: "Déconnexion",
    icon: FaSignOutAlt,
};

export default menuItems;