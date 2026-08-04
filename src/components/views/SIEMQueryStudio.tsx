import React, { useState } from "react";
import {
  SearchCode,
  Play,
  Terminal,
  Filter,
  Code2,
  Copy,
  Sparkles,
  Check,
  FileText,
} from "lucide-react";
import { MOCK_SIEM_LOGS } from "../../data/mockSOCData";
import { SIEMLog } from "../../types";

interface SIEMQueryStudioProps {
  onSendToCopilot?: (log: SIEMLog) => void;
}

export const SIEMQueryStudio: React.FC<SIEMQueryStudioProps> = ({
  onSendToCopilot,
}) => {
  const [query, setQuery] = useState<string>(
    'event.code: 10 AND process.target: "lsass.exe"'
  );
  const [logs, setLogs] = useState<SIEMLog[]>(MOCK_SIEM_LOGS);
  const [selectedLog, setSelectedLog] = useState<SIEMLog | null>(null);

  const PRESET_QUERIES = [
    { label: "LSASS Credential Dumping", q: 'eventCode: "10" AND message: "*LSASS*"' },
    { label: "PowerShell Encrypted Payload", q: 'service: "Sysmon" AND rawPayload: "*-Enc*"' },
    { label: "Rogue Wi-Fi Access Points", q: 'service: "MerakiWIDS" AND category: "Wireless"' },
    { label: "Kerberos TGS Requests", q: 'eventCode: "4769" AND category: "Kerberoasting"' },
  ];

  const handleRunQuery = () => {
    // Filter logs based on query input keywords
    if (!query.trim()) {
      setLogs(MOCK_SIEM_LOGS);
      return;
    }
    const qLower = query.toLowerCase();
    const filtered = MOCK_SIEM_LOGS.filter((l) =>
      l.message.toLowerCase().includes(qLower) ||
      l.host.toLowerCase().includes(qLower) ||
      l.service.toLowerCase().includes(qLower) ||
      l.category.toLowerCase().includes(qLower) ||
      l.rawPayload.toLowerCase().includes(qLower)
    );
    setLogs(filtered.length > 0 ? filtered : MOCK_SIEM_LOGS);
  };

  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <SearchCode className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
              SIEM LOG QUERY STUDIO & SYNTAX EDITOR
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise Splunk & KQL query engine searching over 14.8M ingested security logs.
          </p>
        </div>
      </div>

      {/* Query Editor Bar */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
        {/* Preset Query Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none font-mono text-[11px]">
          <span className="text-slate-500 font-bold flex-shrink-0">PRESETS:</span>
          {PRESET_QUERIES.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setQuery(preset.q);
                handleRunQuery();
              }}
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 flex-shrink-0 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input Text Area */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="flex-1 bg-slate-950 p-3 rounded-xl border border-slate-800 focus-within:border-cyan-500 transition-colors">
            <textarea
              rows={2}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type Splunk/KQL query... (e.g. event.code: 4624 AND user.is_admin: true)"
              className="w-full bg-transparent text-emerald-400 placeholder:text-slate-600 focus:outline-none resize-none font-mono text-xs"
            />
          </div>

          <button
            onClick={handleRunQuery}
            className="px-6 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs flex items-center space-x-2 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Execute Query</span>
          </button>
        </div>
      </div>

      {/* Query Results Table */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-slate-400">
          <span>
            MATCHING LOGS: <strong className="text-cyan-400">{logs.length}</strong>
          </span>
          <span className="text-[10px]">INDEX: winlogbeat-*, firewall-*, wids-*</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Host</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Message Summary</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-950/60 transition-colors group cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="py-2.5 px-3 text-slate-400 text-[10px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-cyan-300">{log.host}</td>
                  <td className="py-2.5 px-3 text-slate-300">{log.service}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === "Critical"
                          ? "bg-rose-950 text-rose-300 border border-rose-500/30"
                          : log.severity === "High"
                          ? "bg-amber-950 text-amber-300 border border-amber-500/30"
                          : "bg-cyan-950 text-cyan-300 border border-cyan-500/30"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 text-xs max-w-md truncate">
                    {log.message}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSendToCopilot) onSendToCopilot(log);
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] flex items-center space-x-1 ml-auto"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Ask Copilot</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw JSON Payload Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 font-mono text-xs relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-cyan-300">
                RAW SIEM LOG PAYLOAD • {selectedLog.id}
              </span>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-100"
              >
                ✕
              </button>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
              {JSON.stringify(JSON.parse(selectedLog.rawPayload), null, 2)}
            </pre>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-lg bg-cyan-600 text-slate-950 font-bold"
              >
                Close Payload Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
