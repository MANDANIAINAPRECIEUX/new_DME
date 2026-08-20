import {
    FaHome,
    FaUserFriends,
    FaCalendarAlt,
    FaTooth,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

const menuItems = [
    {
        title: "Dashboard",
        icon: FaHome,
        path: "/"
    },
    {
        title: "Patients",
        icon: FaUserFriends,
        path: "/patients"
    },
    {
        title: "Rendez-vous",
        icon: FaCalendarAlt,
        path: "/appointments"
    },
    {
        title: "Traitements",
        icon: FaTooth,
        path: "/treatments"
    },
    {
        title: "Paramètres",
        icon: FaCog,
        path: "/settings"
    }
];

export const logoutItem = {
    title: "Déconnexion",
    icon: FaSignOutAlt,
    path: "/logout"
};

export default menuItems;