import {
  FiHome,
  FiUser,
  FiUsers,
  FiLayers,
  FiBook,
  FiDollarSign,
  FiBarChart2,
  FiHelpCircle,
  FiCreditCard,
} from "react-icons/fi";

const iconMap: Record<string, React.ElementType> = {
  home: FiHome,
  analytics: FiBarChart2,
  users: FiUsers,
  user: FiUser,
  book: FiBook,
  layers: FiLayers,
  money: FiDollarSign,
  ticket: FiHelpCircle,
  payments: FiCreditCard,
};

export const adminMenu = [
  { label: "Dashboard", href: "/dashboard", icon: "home" },
  { label: "Analytics", href: "/admin/analytics/fees", icon: "analytics" },
  { label: "Students", href: "/admin/students", icon: "users" },
  { label: "Classes", href: "/admin/classes", icon: "layers" },
  { label: "Fees", href: "/admin/fees", icon: "money" },
  { label: "Installments", href: "/admin/installments", icon: "layers" },
  { label: "Payments History", href: "/admin/payments", icon: "payments" },
];

export const parentMenu = [
  { label: "Dashboard", href: "/dashboard", icon: "home" },
  { label: "Children", href: "/parent/children", icon: "user" },
  { label: "Classes", href: "/classes", icon: "book" },
  { label: "Payments", href: "/parent/payments", icon: "payments"},
];


export const studentMenu = [
  { label: "Dashboard", href: "/dashboard", icon: "home" },
  { label: "Classes", href: "/student/classes", icon: "layers" },
  { label: "My Fees", href: "/student/fees", icon: "money" },
  { label: "Payments", href: "/student/payments", icon: "payments" },
  { label: "Profile", href: "/student/profile", icon: "users" },
];

