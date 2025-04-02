import {
  Calendar,
  Delete,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { deleteCurrentUser, signOutUser } from "@/lib/firebase/auth";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Travel Assistant",
    url: "/travel-assistant",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push("/");
    } catch (error) {
      console.log("Failed to logout: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCurrentUser("email"); // Added required argument
      router.push("/");
    } catch (error) {
      console.log("Failed to delete the user", error);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
                <SidebarMenuButton
                  onClick={handleDelete}
                  className="cursor-pointer"
                >
                  <Delete />
                  <span>Delete Account</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
