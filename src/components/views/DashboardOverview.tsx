import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Activity,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Server,
  Radio,
  ExternalLink,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { INITIAL_METRICS, MOCK_INCIDENTS, MOCK_SIEM_LOGS } from "../../data/mockSOCData";
import { Incident } from "../../types";
import { NavTab } from "../layout/SidebarNav";

interface DashboardOverviewProps {
  onNavigateToTab: (tab: NavTab) => void;
  onSelectIncident: (inc: Incident) => void;
  onExecuteAction: (actionType: string, target: string) => void;
}

const TRAFFIC_DATA = [
  { time: "00:00", events: 12400, blocked: 420 },
  { time: "04:00", events: 9800, blocked: 310 },
  { time: "08:00", events: 18400, blocked: 890 },
  { time: "12:00", events: 24100, blocked: 1210 },
  { time: "16:00", events: 21000, blocked: 940 },
  { time: "20:00", events: 15600, blocked: 620 },
  { time: "24:00", events: 13200, blocked: 510 },
];

const THREAT_DISTRIBUTION = [
  { name: "Credential Access", value: 35, color: "#f43f5e" },
  { name: "Command & Control", value: 28, color: "#ec4899" },
  { name: "Execution (PowerShell)", value: 22, color: "#a855f7" },
  { name: "Rogue Wi-Fi / Wireless", value: 15, color: "#06b6d4" },
];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateToTab,
  onSelectIncident,
  onExecuteAction,
}) => {
  const [liveLogs, setLiveLogs] = useState(MOCK_SIEM_LOGS);

  // Auto-simulate new incoming SIEM logs every 5 seconds for live telemetry feel
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIp = `10.0.${Math.floor(Math.random() * 5)}.${Math.floor(
        Math.random() * 200
      )}`;
      const newLog = {
        id: `log-live-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        sourceIp: randomIp,
        destIp: "185.220.101.44",
        host: `WS-NODE-${Math.floor(Math.random() * 90 + 10)}`,
        service: "PaloAltoFirewall",
        severity: Math.random() > 0.7 ? ("High" as const) : ("Medium" as const),
        eventCode: "PAN-DENY",
        message: "Automated Egress Rule Enforcement Blocked Connection",
        category: "Threat Protection",
        rawPayload: `{"Action":"DENY","Src":"${randomIp}","Dst":"185.220.101.44"}`,
      };
      setLiveLogs((prev) => [newLog, ...prev.slice(0, 7)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 font-sans text-zinc-100 max-w-7xl mx-auto">
      {/* Top Banner & KPI Cards Grid */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-800/60">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-wider text-zinc-100 flex items-center space-x-2">
            <span>EXECUTIVE SOC COMMAND CENTER</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time telemetry ingestion across Palo Alto Networks, CrowdStrike Falcon, AWS CloudTrail, and Meraki Wireless.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <button
            onClick={() => onNavigateToTab("incidents")}
            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold flex items-center space-x-2 transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)]"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>3 Critical Incidents Requiring Triage</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {INITIAL_METRICS.map((metric) => (
          <div
            key={metric.id}
            className="p-4 rounded-xl bg-white/5 border border-zinc-800 hover:border-cyan-500/40 transition-all backdrop-blur-sm relative overflow-hidden group shadow-lg"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-bl-full group-hover:bg-cyan-500/10 transition-colors" />
            <p className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase font-bold mb-1">
              {metric.label}
            </p>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-zinc-100 tracking-tight">
                {metric.value}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  metric.trend === "up"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-zinc-800 text-zinc-300"
                }`}
              >
                {metric.change}
              </span>
            </div>
            <p className="mt-2 text-[10px] text-zinc-500 truncate">
              {metric.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* Live Telemetry Ticker Stream */}
      <div className="p-3 rounded-xl bg-[#09090b] border border-cyan-500/30 font-mono text-xs shadow-2xl flex items-center space-x-3 overflow-hidden">
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex-shrink-0">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold text-[10px]">LIVE LOG TICKER</span>
        </div>
        <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center space-x-6 text-[11px] text-zinc-300">
          {liveLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-zinc-500">[{log.timestamp}]</span>
              <span className="text-cyan-400 font-semibold">{log.host}:</span>
              <span className="text-zinc-200">{log.message}</span>
              <span className="px-1 py-0.5 rounded text-[9px] bg-red-500/10 text-red-400 border border-red-500/20">
                {log.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Telemetry Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: 24h Telemetry & Ingestion Volume */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white/5 border border-zinc-800 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold font-mono text-zinc-200 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>24-HOUR SIEM INGESTION & THREAT MITIGATION TRAFFIC</span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Total Events Ingested vs. Automated Firewall & SOAR Threat Blocks
              </p>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
              18.4K EPS PEAK
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC_DATA}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" stroke="#71717a" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#71717a" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "#27272a",
                    borderRadius: "8px",
                    color: "#f4f4f5",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="events"
                  name="Events Ingested"
                  stroke="#22d3ee"
                  fillOpacity={1}
                  fill="url(#colorEvents)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="blocked"
                  name="Threats Blocked"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorBlocked)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Threat Vector Breakdown */}
        <div className="p-5 rounded-xl bg-white/5 border border-zinc-800 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-mono text-zinc-200 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>THREAT VECTOR BREAKDOWN</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              MITRE Tactic Distribution across active detections
            </p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={THREAT_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {THREAT_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "#27272a",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            {THREAT_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold text-zinc-100">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Active Incidents List */}
      <div className="p-5 rounded-xl bg-white/5 border border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold font-mono text-zinc-100 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>ACTIVE INCIDENT INVESTIGATION WORKSPACE</span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Select an incident to launch the Force-Directed Attack Graph or command AI Copilot triage.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab("incidents")}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>View All Incidents</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {MOCK_INCIDENTS.map((inc) => (
            <div
              key={inc.id}
              className="p-4 rounded-xl bg-[#09090b] border border-zinc-800 hover:border-cyan-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center space-x-2.5 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                    {inc.severity.toUpperCase()}
                  </span>
                  <span className="text-zinc-500">{inc.id}</span>
                  <span className="text-zinc-700">•</span>
                  <span className="text-cyan-400 font-semibold">{inc.targetHost}</span>
                  <span className="text-zinc-500">({inc.ipAddress})</span>
                </div>
                <h4 className="font-bold text-zinc-200 text-sm group-hover:text-cyan-300 transition-colors">
                  {inc.title}
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-1">{inc.summary}</p>
                <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px]">
                  {inc.mitreTechniques.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 font-mono text-xs flex-shrink-0">
                <button
                  onClick={() => {
                    onSelectIncident(inc);
                    onNavigateToTab("graph");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center space-x-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Attack Graph</span>
                </button>
                <button
                  onClick={() =>
                    onExecuteAction("ISOLATE_HOST", inc.targetHost)
                  }
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 flex items-center space-x-1.5 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Isolate Host</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
