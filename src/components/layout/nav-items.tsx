import { LayoutDashboard, KanbanSquare, Building2, Users, FileText, CalendarClock, Settings } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidatures", label: "Candidatures", icon: KanbanSquare },
  { href: "/entreprises", label: "Entreprises", icon: Building2 },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/calendrier", label: "Calendrier", icon: CalendarClock },
  { href: "/parametres", label: "Paramètres", icon: Settings },
];
