/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { SidebarNav, NavTab } from "./components/layout/SidebarNav";
import { AICopilotPanel } from "./components/copilot/AICopilotPanel";
import { DashboardOverview } from "./components/views/DashboardOverview";
import { IncidentQueueView } from "./components/views/IncidentQueueView";
import { AttackGraphView } from "./components/views/AttackGraphView";
import { MitreMatrixView } from "./components/views/MitreMatrixView";
import { MultiAgentSOCView } from "./components/views/MultiAgentSOCView";
import { SIEMQueryStudio } from "./components/views/SIEMQueryStudio";
import { WiFiSecurityView } from "./components/views/WiFiSecurityView";
import { EndpointManagerView } from "./components/views/EndpointManagerView";
import { FirewallManagerView } from "./components/views/FirewallManagerView";
import { ThreatIntelView } from "./components/views/ThreatIntelView";
import { ExecutiveReportView } from "./components/views/ExecutiveReportView";
import { SettingsView } from "./components/views/SettingsView";
import { CommandPaletteModal } from "./components/modals/CommandPaletteModal";
import { Incident, SIEMLog } from "./types";
import { MOCK_INCIDENTS } from "./data/mockSOCData";
import { CheckCircle2, Zap } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    MOCK_INCIDENTS[0]
  );
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [actionToast, setActionToast] = useState<string | null>(null);

  const handleExecuteAction = (actionType: string, target: string) => {
    // Execute backend or simulated action
    fetch("/api/actions/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionType, targetId: target }),
    }).catch(() => {});

    setActionToast(`Executed ${actionType} on target ${target}`);
    setTimeout(() => setActionToast(null), 4000);
  };

  const handleSendLogToCopilot = (log: SIEMLog) => {
    // Switch to copilot view or attach
    setActionToast(`Sent SIEM Log ${log.id} (${log.service}) to AI Copilot`);
    setTimeout(() => setActionToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-[#050507]">
      {/* Top Navigation Header */}
      <Navbar
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        activeIncidentsCount={3}
      />

      {/* Main Three-Column Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column: Navigation Sidebar */}
        <SidebarNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          openIncidentsCount={3}
        />

        {/* Center Column: Active Investigation Workspace */}
        <main className="flex-1 overflow-y-auto bg-[#050507] bg-grid-pattern relative">
          {/* Action Notification Toast */}
          {actionToast && (
            <div className="fixed top-20 right-[390px] z-50 p-3 rounded-xl bg-zinc-900 border border-cyan-500/40 text-cyan-200 font-mono text-xs shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center space-x-2 animate-in fade-in zoom-in-95">
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{actionToast}</span>
            </div>
          )}

          {activeTab === "overview" && (
            <DashboardOverview
              onNavigateToTab={setActiveTab}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onExecuteAction={handleExecuteAction}
            />
          )}

          {activeTab === "incidents" && (
            <IncidentQueueView
              onSelectIncidentForGraph={(inc) => {
                setSelectedIncident(inc);
                setActiveTab("graph");
              }}
              onExecuteAction={handleExecuteAction}
            />
          )}

          {activeTab === "graph" && (
            <AttackGraphView
              selectedIncident={selectedIncident}
              onExecuteAction={handleExecuteAction}
            />
          )}

          {activeTab === "mitre" && <MitreMatrixView />}

          {activeTab === "agents" && <MultiAgentSOCView />}

          {activeTab === "siem" && (
            <SIEMQueryStudio onSendToCopilot={handleSendLogToCopilot} />
          )}

          {activeTab === "wifi" && (
            <WiFiSecurityView onExecuteAction={handleExecuteAction} />
          )}

          {activeTab === "endpoints" && (
            <EndpointManagerView onExecuteAction={handleExecuteAction} />
          )}

          {activeTab === "firewall" && (
            <FirewallManagerView onExecuteAction={handleExecuteAction} />
          )}

          {activeTab === "intel" && <ThreatIntelView />}

          {activeTab === "reports" && <ExecutiveReportView />}

          {activeTab === "settings" && <SettingsView />}
        </main>

        {/* Right Column: Persistent AI Copilot */}
        <AICopilotPanel
          selectedIncident={selectedIncident}
          onExecuteAction={handleExecuteAction}
        />
      </div>

      {/* Command Palette Modal */}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigateTab={setActiveTab}
        onExecuteAction={handleExecuteAction}
      />
    </div>
  );
}
