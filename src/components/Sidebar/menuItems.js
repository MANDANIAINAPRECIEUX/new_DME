import {
    FaHome,
    FaUserFriends,
    FaCalendarAlt,
    FaTooth,
    FaSignOutAlt
} from "react-icons/fa";

const menuItems = [
    { title: "Dashboard", icon: FaHome, path: "/" },
    { title: "Patients", icon: FaUserFriends, path: "/patients" },
    { title: "Rendez-vous", icon: FaCalendarAlt, path: "/appointments" },
    { title: "Traitements", icon: FaTooth, path: "/treatments" },
];

export const logoutItem = {
    title: "Déconnexion",
    icon: FaSignOutAlt,
};

export default menuItems;