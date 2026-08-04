import React, { useState } from "react";
import {
  Laptop,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  HardDrive,
  ShieldAlert,
} from "lucide-react";
import { MOCK_ENDPOINTS } from "../../data/mockSOCData";
import { EndpointHost } from "../../types";

interface EndpointManagerViewProps {
  onExecuteAction: (actionType: string, target: string) => void;
}

export const EndpointManagerView: React.FC<EndpointManagerViewProps> = ({
  onExecuteAction,
}) => {
  const [endpoints, setEndpoints] = useState<EndpointHost[]>(MOCK_ENDPOINTS);

  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Laptop className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
              ENDPOINT MANAGEMENT & EDR COMMAND WORKSPACE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time host inventory, EDR agent status, vulnerability metrics, and network containment execution.
          </p>
        </div>
      </div>

      {/* Endpoints Table / Grid */}
      <div className="space-y-4">
        {endpoints.map((ep) => (
          <div
            key={ep.id}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 transition-all shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-100 text-sm">
                  {ep.hostname}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ep.status === "compromised"
                      ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                      : ep.status === "isolated"
                      ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                      : "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  {ep.status}
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                {ep.ip} • {ep.os} ({ep.type})
              </p>
              <p className="text-slate-500 text-[11px]">
                Agent: {ep.agentVersion}
              </p>
            </div>

            {/* Performance Gauges */}
            <div className="flex items-center space-x-6 text-slate-300 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">CPU USAGE</span>
                <span className="font-bold text-cyan-400">{ep.cpuUsage}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">RAM USAGE</span>
                <span className="font-bold text-cyan-400">{ep.ramUsage}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">VULNERABILITIES</span>
                <span className="font-bold text-rose-400">{ep.vulnerabilitiesCount} CVEs</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {ep.status !== "isolated" ? (
                <button
                  onClick={() => onExecuteAction("ISOLATE_HOST", ep.hostname)}
                  className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-slate-950 font-bold flex items-center space-x-1.5 transition-colors shadow-md"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Isolate Host</span>
                </button>
              ) : (
                <button
                  onClick={() => onExecuteAction("UNISOLATE_HOST", ep.hostname)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold flex items-center space-x-1.5 transition-colors shadow-md"
                >
                  <span>Re-enable Host</span>
                </button>
              )}

              <button
                onClick={() => onExecuteAction("TRIAGE_DUMP", ep.hostname)}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold"
              >
                Memory Dump
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
