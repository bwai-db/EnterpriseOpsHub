import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Building, 
  Tag, 
  Cloud, 
  Ticket, 
  Truck, 
  Shield, 
  Users,
  UserCheck,
  ShoppingBag,
  Database
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vendor Management", href: "/vendors", icon: Building },
  { name: "Licensing", href: "/licensing", icon: Tag },
  { name: "Cloud Services", href: "/cloud-services", icon: Cloud },
  { name: "ITIL Management", href: "/itil", icon: Ticket },
  { name: "Service Management", href: "/service-management", icon: Database },
  { name: "Supply Chain", href: "/supply-chain", icon: Truck },
  { name: "Security & Compliance", href: "/security", icon: Shield },
  { name: "People & Organization", href: "/people", icon: UserCheck },
  { name: "Retail Operations", href: "/retail-operations", icon: ShoppingBag },
  { name: "HR Service Desk", href: "/hr-service", icon: Users },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-ms-card border-r border-gray-200 flex flex-col">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href || 
            (item.href === "/dashboard" && location === "/");
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                  isActive
                    ? "text-ms-blue bg-blue-50"
                    : "text-gray-700 hover:text-ms-blue hover:bg-gray-50"
                )}
              >
                <item.icon className="mr-3 w-5 h-5" />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
