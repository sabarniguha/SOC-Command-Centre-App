import React, { useState } from "react";
import {
  AlertOctagon,
  Search,
  Filter,
  Shield,
  Zap,
  CheckCircle2,
  Clock,
  ChevronRight,
  Terminal,
  UserCheck,
  FileText,
  Eye,
  ExternalLink,
} from "lucide-react";
import { MOCK_INCIDENTS } from "../../data/mockSOCData";
import { Incident, Severity, IncidentStatus } from "../../types";

interface IncidentQueueViewProps {
  onSelectIncidentForGraph: (inc: Incident) => void;
  onExecuteAction: (actionType: string, target: string) => void;
}

export const IncidentQueueView: React.FC<IncidentQueueViewProps> = ({
  onSelectIncidentForGraph,
  onExecuteAction,
}) => {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [activeIncident, setActiveIncident] = useState<Incident | null>(
    MOCK_INCIDENTS[0]
  );

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.targetHost.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.ipAddress.includes(searchQuery);

    const matchesSeverity =
      selectedSeverity === "ALL" || inc.severity === selectedSeverity;

    const matchesStatus =
      selectedStatus === "ALL" || inc.status === selectedStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const togglePlaybookStep = (incidentId: string, stepIdx: number) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const updatedSteps = [...inc.containmentPlaybook.steps];
          updatedSteps[stepIdx].completed = !updatedSteps[stepIdx].completed;
          return {
            ...inc,
            containmentPlaybook: {
              ...inc.containmentPlaybook,
              steps: updatedSteps,
            },
          };
        }
        return inc;
      })
    );
    if (activeIncident && activeIncident.id === incidentId) {
      setActiveIncident((prev) => {
        if (!prev) return null;
        const updatedSteps = [...prev.containmentPlaybook.steps];
        updatedSteps[stepIdx].completed = !updatedSteps[stepIdx].completed;
        return {
          ...prev,
          containmentPlaybook: {
            ...prev.containmentPlaybook,
            steps: updatedSteps,
          },
        };
      });
    }
  };

  return (
    <div className="p-6 space-y-6 font-sans text-zinc-100 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
        <div>
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-zinc-100">
              INCIDENT QUEUE & TRIAGE WORKSPACE
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Prioritized SOC queue with interactive forensic timelines, SOAR playbooks, and containment execution.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white/5 border border-zinc-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incident ID, host, IP address, MITRE technique..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#050507] border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-zinc-400">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#050507] border border-zinc-800 text-cyan-400 focus:outline-none"
            >
              <option value="ALL">ALL SEVERITIES</option>
              <option value="Critical">CRITICAL</option>
              <option value="High">HIGH</option>
              <option value="Medium">MEDIUM</option>
              <option value="Low">LOW</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-zinc-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#050507] border border-zinc-800 text-cyan-400 focus:outline-none"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="Open">OPEN</option>
              <option value="Investigating">INVESTIGATING</option>
              <option value="Contained">CONTAINED</option>
              <option value="Closed">CLOSED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Incident List on Left, Detail Workspace on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incident List Column (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredIncidents.map((inc) => {
            const isSelected = activeIncident?.id === inc.id;

            return (
              <div
                key={inc.id}
                onClick={() => setActiveIncident(inc)}
                className={`p-4 rounded-xl border cursor-pointer transition-all shadow-lg ${
                  isSelected
                    ? "bg-zinc-900/90 border-cyan-400 ring-1 ring-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                    : "bg-[#09090b] border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px] mb-1.5">
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      inc.severity === "Critical"
                        ? "bg-red-500/10 text-red-400 border border-red-500/30"
                        : inc.severity === "High"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                    }`}
                  >
                    {inc.severity.toUpperCase()}
                  </span>
                  <span className="text-zinc-500">{inc.id}</span>
                </div>

                <h3 className="font-bold text-zinc-100 text-sm mb-1 line-clamp-1">
                  {inc.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>Target: {inc.targetHost}</span>
                  <span className="text-cyan-400">{inc.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Workspace Column (7 cols) */}
        <div className="lg:col-span-7">
          {activeIncident ? (
            <div className="p-6 rounded-xl bg-white/5 border border-zinc-800 shadow-2xl space-y-6">
              {/* Header */}
              <div className="pb-4 border-b border-zinc-800">
                <div className="flex items-center justify-between font-mono text-xs mb-2">
                  <span className="text-red-400 font-bold">
                    INCIDENT DETAILS • {activeIncident.id}
                  </span>
                  <button
                    onClick={() => onSelectIncidentForGraph(activeIncident)}
                    className="px-3 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Launch Attack Graph</span>
                  </button>
                </div>
                <h2 className="text-lg font-bold font-mono text-zinc-100">
                  {activeIncident.title}
                </h2>
                <p className="text-xs text-zinc-300 mt-2 bg-[#050507] p-3 rounded-lg border border-zinc-800 leading-relaxed font-mono">
                  {activeIncident.summary}
                </p>
              </div>

              {/* Containment Playbook Checklist */}
              <div>
                <h3 className="text-xs font-mono font-bold text-cyan-400 mb-2 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>
                    SOAR CONTAINMENT PLAYBOOK ({activeIncident.containmentPlaybook.name})
                  </span>
                </h3>
                <div className="space-y-2 bg-[#050507] p-3 rounded-xl border border-zinc-800 font-mono text-xs">
                  {activeIncident.containmentPlaybook.steps.map((step, idx) => (
                    <div
                      key={idx}
                      onClick={() => togglePlaybookStep(activeIncident.id, idx)}
                      className="flex items-center space-x-3 p-2 rounded hover:bg-zinc-900 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={step.completed}
                        onChange={() => {}}
                        className="accent-cyan-400 w-4 h-4 cursor-pointer"
                      />
                      <span
                        className={
                          step.completed
                            ? "line-through text-zinc-600"
                            : "text-zinc-200"
                        }
                      >
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chronological Timeline */}
              <div>
                <h3 className="text-xs font-mono font-bold text-zinc-300 mb-2 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>CHRONOLOGICAL EVENT FORENSIC TIMELINE</span>
                </h3>
                <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto scrollbar-thin">
                  {activeIncident.timelineEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-2.5 rounded bg-[#050507] border border-zinc-800 flex items-start justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-2 text-zinc-500 text-[10px]">
                          <span>{evt.timestamp}</span>
                          <span>•</span>
                          <span className="text-cyan-400">{evt.source}</span>
                        </div>
                        <p className="font-bold text-zinc-200 text-xs mt-0.5">
                          {evt.title}
                        </p>
                        <p className="text-[11px] text-zinc-400">{evt.description}</p>
                      </div>
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                        {evt.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw Sysmon / SIEM Logs */}
              <div>
                <h3 className="text-xs font-mono font-bold text-zinc-300 mb-2 flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>RAW TELEMETRY SYSMON LOGS</span>
                </h3>
                <div className="bg-[#050507] p-3 rounded-xl border border-zinc-800 font-mono text-[10px] text-emerald-400 space-y-1 overflow-x-auto max-h-36">
                  {activeIncident.rawLogs.map((log, lIdx) => (
                    <div key={lIdx} className="whitespace-nowrap">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instant Containment Buttons */}
              <div className="pt-2 flex flex-wrap gap-3 font-mono text-xs">
                <button
                  onClick={() =>
                    onExecuteAction("ISOLATE_HOST", activeIncident.targetHost)
                  }
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-[#050507] font-bold flex items-center space-x-2 transition-colors shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                >
                  <Zap className="w-4 h-4" />
                  <span>Isolate {activeIncident.targetHost}</span>
                </button>
                <button
                  onClick={() =>
                    onExecuteAction("BLOCK_IP", activeIncident.ipAddress)
                  }
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold flex items-center space-x-2 transition-colors border border-zinc-700"
                >
                  <span>Block IP {activeIncident.ipAddress}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-white/5 border border-zinc-800 text-center text-zinc-500 font-mono text-xs">
              Select an incident from the queue to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
