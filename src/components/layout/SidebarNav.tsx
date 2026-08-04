import React from "react";
import {
  LayoutDashboard,
  AlertOctagon,
  GitMerge,
  ShieldAlert,
  Bot,
  SearchCode,
  Wifi,
  Laptop,
  Flame,
  Binary,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type NavTab =
  | "overview"
  | "incidents"
  | "graph"
  | "mitre"
  | "agents"
  | "siem"
  | "wifi"
  | "endpoints"
  | "firewall"
  | "intel"
  | "reports"
  | "settings";

interface SidebarNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  openIncidentsCount: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  openIncidentsCount,
}) => {
  const navItems = [
    { id: "overview" as NavTab, label: "Overview", icon: LayoutDashboard },
    {
      id: "incidents" as NavTab,
      label: "Incident Queue",
      icon: AlertOctagon,
      badge: openIncidentsCount > 0 ? openIncidentsCount : undefined,
      badgeColor: "bg-rose-500",
    },
    { id: "graph" as NavTab, label: "Attack Graph", icon: GitMerge },
    { id: "mitre" as NavTab, label: "MITRE ATT&CK", icon: ShieldAlert },
    { id: "agents" as NavTab, label: "Multi-Agent SOC", icon: Bot, highlight: true },
    { id: "siem" as NavTab, label: "SIEM Log Studio", icon: SearchCode },
    { id: "wifi" as NavTab, label: "Wi-Fi & Wireless", icon: Wifi },
    { id: "endpoints" as NavTab, label: "Endpoints & EDR", icon: Laptop },
    { id: "firewall" as NavTab, label: "Firewall Rules", icon: Flame },
    { id: "intel" as NavTab, label: "Threat Intel", icon: Binary },
    { id: "reports" as NavTab, label: "AI Executive Report", icon: FileText },
    { id: "settings" as NavTab, label: "SOC Settings", icon: Settings },
  ];

  return (
    <aside
      id="soc-sidebar"
      className={`${
        collapsed ? "w-16" : "w-60"
      } transition-all duration-300 ease-in-out bg-[#09090b] border-r border-zinc-800/60 flex flex-col justify-between z-30 select-none shadow-2xl relative`}
    >
      {/* Top Nav Items */}
      <div className="py-4 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center ${
                collapsed ? "justify-center px-2" : "justify-between px-3"
              } py-2 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(34,211,238,0.15)] font-semibold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive
                      ? "text-cyan-400"
                      : "text-zinc-500 group-hover:text-cyan-400"
                  }`}
                />
                {!collapsed && (
                  <span className="truncate tracking-wide font-sans text-[12px]">
                    {item.label}
                  </span>
                )}
              </div>

              {!collapsed && item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white font-mono ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}

              {collapsed && item.badge !== undefined && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse / Expand Toggle Button */}
      <div className="p-2 border-t border-zinc-800/80 bg-[#09090b]">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          ) : (
            <div className="flex items-center space-x-2 text-zinc-400 font-mono text-[11px]">
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
