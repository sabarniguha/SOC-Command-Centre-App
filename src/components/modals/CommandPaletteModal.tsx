import React, { useState, useEffect } from "react";
import {
  Search,
  Terminal,
  ShieldAlert,
  GitMerge,
  Bot,
  SearchCode,
  Laptop,
  X,
} from "lucide-react";
import { NavTab } from "../layout/SidebarNav";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onExecuteAction: (actionType: string, target: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onExecuteAction,
}) => {
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const COMMANDS = [
    { label: "Go to Executive Overview Dashboard", action: () => onNavigateTab("overview"), icon: Terminal },
    { label: "Open Incident Queue (3 Critical)", action: () => onNavigateTab("incidents"), icon: ShieldAlert },
    { label: "Launch Force-Directed Attack Graph", action: () => onNavigateTab("graph"), icon: GitMerge },
    { label: "Open MITRE ATT&CK Matrix Navigator", action: () => onNavigateTab("mitre"), icon: ShieldAlert },
    { label: "Consult Multi-Agent SOC Swarm", action: () => onNavigateTab("agents"), icon: Bot },
    { label: "Launch SIEM Query Studio", action: () => onNavigateTab("siem"), icon: SearchCode },
    { label: "Isolate Host SRV-FINANCE-02", action: () => onExecuteAction("ISOLATE_HOST", "SRV-FINANCE-02"), icon: Laptop },
    { label: "Enforce Firewall Drop Rule for 185.220.101.44", action: () => onExecuteAction("BLOCK_IP", "185.220.101.44"), icon: Terminal },
  ];

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4 font-mono text-xs">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <Search className="w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, views, or SOAR actions..."
            className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filteredCommands.map((cmd, idx) => {
            const Icon = cmd.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-950 text-slate-200 hover:text-cyan-300 transition-colors text-left font-mono text-xs"
              >
                <Icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{cmd.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
