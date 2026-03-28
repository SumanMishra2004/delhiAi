import { UserRole } from "@prisma/client";
import {
  LayoutDashboardIcon,
  Building2,
  PlusCircle,
  Users,
  TrendingUp,
  Map,
  Bookmark,
  Bell,
  MessageSquare,
  ShieldCheck,
  User,
  Settings,
  Wallet,
  FileText,
  BarChart3,
  Shield,
  CheckCircle,
  Clock,
  MapPin
} from "lucide-react";
import { JSX } from "react";

export type SidebarLink = {
  title: string;
  href: string;
  icon: JSX.Element;
  description?: string;
  badge?: string;
  variant?: "primary";
  roles: UserRole[];
};

export type SidebarSection = {
  label: string;
  links: SidebarLink[];
};

export const dashboardSidebarLinks: SidebarSection[] = [
  // -----------------------------
  // OVERVIEW
  // -----------------------------
  {
    label: "Overview",
    links: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboardIcon />,
        description: "Quick overview of activity and stats",
        roles: ["PUBLIC", "OWNER", "BROKER", "ADMIN"]
      },
      {
        title: "Admin Dashboard",
        href: "/dashboard/admin",
        icon: <Shield />,
        description: "Admin control panel",
        variant: "primary",
        roles: ["ADMIN"]
      },
      {
        title: "Market Snapshot",
        href: "/dashboard/market",
        icon: <TrendingUp />,
        description: "City-level property trends",
        roles: ["PUBLIC", "OWNER", "BROKER"]
      }
    ]
  },

  // -----------------------------
  // PROPERTIES
  // -----------------------------
  {
    label: "Properties",
    links: [
      {
        title: "Browse Properties",
        href: "/dashboard/properties",
        icon: <Building2 />,
        roles: ["PUBLIC", "OWNER", "BROKER"]
      },
      {
        title: "Add Property",
        href: "/dashboard/properties/new",
        icon: <PlusCircle />,
        variant: "primary",
        roles: ["OWNER", "BROKER"]
      },
      {
        title: "My Listings",
        href: "/dashboard/properties/my",
        icon: <FileText />,
        roles: ["OWNER", "BROKER"]
      },
      {
        title: "Map Explorer",
        href: "/dashboard/map",
        icon: <Map />,
        description: "Map-based property exploration",
        roles: ["PUBLIC", "OWNER", "BROKER"]
      },
      {
        title: "Saved Properties",
        href: "/dashboard/saved",
        icon: <Bookmark />,
        description: "Your favorite properties",
        roles: ["PUBLIC", "OWNER", "BROKER"]
      }
    ]
  },

  // -----------------------------
  // BUSINESS TOOLS (BROKER)
  // -----------------------------
  {
    label: "Business Tools",
    links: [
      {
        title: "Lead Management",
        href: "/dashboard/leads",
        icon: <Users />,
        description: "Track and convert leads",
        badge: "New",
        variant: "primary",
        roles: ["BROKER"]
      },
      {
        title: "Client Portal",
        href: "/dashboard/clients",
        icon: <Users />,
        description: "Manage client relationships",
        roles: ["BROKER"]
      },
      {
        title: "Inquiries",
        href: "/dashboard/inquiries",
        icon: <MessageSquare />,
        description: "Property inquiries",
        roles: ["OWNER", "BROKER"]
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: <BarChart3 />,
        description: "Performance insights",
        roles: ["OWNER", "BROKER"]
      },
      {
        title: "Billing & Payments",
        href: "/dashboard/billing",
        icon: <Wallet />,
        description: "Manage payments",
        roles: ["BROKER"]
      }
    ]
  },

  // -----------------------------
  // PROPERTY VERIFICATION
  // -----------------------------
  {
    label: "Community",
    links: [
      {
        title: "Anonymous Opinions",
        href: "/dashboard/opinions",
        icon: <MessageSquare />,
        description: "View neighborhood feedback",
        roles: ["PUBLIC", "OWNER", "BROKER"]
      },
      {
        title: "Property Validation",
        href: "/dashboard/validation",
        icon: <Shield />,
        description: "Help verify nearby properties",
        roles: ["PUBLIC", "OWNER", "BROKER"]
      }
    ]
  },

  // -----------------------------
  // ADMIN VERIFICATION
  // -----------------------------
  {
    label: "Admin Verification",
    links: [
      {
        title: "Verification Queue",
        href: "/dashboard/admin/queue",
        icon: <CheckCircle />,
        description: "Review pending properties",
        variant: "primary",
        roles: ["ADMIN"]
      },
      {
        title: "Abuse Detection",
        href: "/dashboard/admin/abuse",
        icon: <ShieldCheck />,
        description: "Flag suspicious activity",
        roles: ["ADMIN"]
      }
    ]
  },

  // -----------------------------
  // ACCOUNT & SETTINGS
  // -----------------------------
  {
    label: "Account",
    links: [
      {
        title: "Update Location",
        href: "/dashboard/location",
        icon: <MapPin />,
        description: "Set your current location",
        roles: ["PUBLIC", "OWNER", "BROKER", "ADMIN"]
      },
      {
        title: "Profile",
        href: "/dashboard/profile",
        icon: <User />,
        roles: ["PUBLIC", "OWNER", "BROKER", "ADMIN"]
      },
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: <Bell />,
        roles: ["PUBLIC", "OWNER", "BROKER", "ADMIN"]
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: <Settings />,
        roles: ["PUBLIC", "OWNER", "BROKER", "ADMIN"]
      }
    ]
  },

  // -----------------------------
  // ADMIN TOOLS
  // -----------------------------
  {
    label: "Administration",
    links: [
      {
        title: "User Management",
        href: "/dashboard/admin/users",
        icon: <Users />,
        description: "Manage platform users",
        roles: ["ADMIN"]
      },
      {
        title: "Content Moderation",
        href: "/dashboard/admin/moderation",
        icon: <ShieldCheck />,
        description: "Review content",
        roles: ["ADMIN"]
      },
      {
        title: "System Analytics",
        href: "/dashboard/admin/analytics",
        icon: <BarChart3 />,
        description: "Platform metrics",
        roles: ["ADMIN"]
      },
      {
        title: "Platform Settings",
        href: "/dashboard/admin/settings",
        icon: <Settings />,
        description: "System configuration",
        roles: ["ADMIN"]
      }
    ]
  }
];

/**
 * Get sidebar links filtered by user role
 * Only shows links that the user has access to based on their role
 */
export function getSidebarLinksByRole(userRole: UserRole): SidebarSection[] {
  return dashboardSidebarLinks
    .map((section) => ({
      ...section,
      links: section.links.filter((link) => link.roles.includes(userRole)),
    }))
    .filter((section) => section.links.length > 0); // Remove empty sections
}
