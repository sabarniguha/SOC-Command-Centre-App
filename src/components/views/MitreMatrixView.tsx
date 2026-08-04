import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  ExternalLink,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { MOCK_MITRE_TECHNIQUES } from "../../data/mockSOCData";
import { MitreTechnique } from "../../types";

const MITRE_TACTICS = [
  "Initial Access",
  "Execution",
  "Persistence",
  "Defense Evasion",
  "Credential Access",
  "Lateral Movement",
  "Command and Control",
  "Exfiltration",
  "Impact",
];

export const MitreMatrixView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTechnique, setSelectedTechnique] =
    useState<MitreTechnique | null>(null);

  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
              MITRE ATT&CK ENTERPRISE MATRIX NAVIGATOR
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time heat map mapping active enterprise SOC detections to MITRE framework tactics and techniques.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search T-code or technique..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Tactic Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-3 overflow-x-auto scrollbar-thin">
        {MITRE_TACTICS.map((tactic) => {
          const techniquesForTactic = MOCK_MITRE_TECHNIQUES.filter(
            (t) =>
              t.tactic === tactic &&
              (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.code.toLowerCase().includes(searchQuery.toLowerCase()))
          );

          return (
            <div
              key={tactic}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl flex flex-col min-w-[130px]"
            >
              <div className="pb-2 mb-3 border-b border-slate-800 text-center">
                <h3 className="font-bold font-mono text-[11px] text-cyan-300 leading-tight">
                  {tactic}
                </h3>
                <span className="text-[9px] font-mono text-slate-500">
                  {techniquesForTactic.length} techniques
                </span>
              </div>

              <div className="space-y-2 flex-1">
                {techniquesForTactic.map((tech) => (
                  <button
                    key={tech.code}
                    onClick={() => setSelectedTechnique(tech)}
                    className={`w-full p-2 rounded-lg text-left transition-all border font-mono text-[10px] space-y-1 ${
                      tech.status === "active_detection"
                        ? "bg-rose-950/80 border-rose-500/50 hover:border-rose-400 text-rose-200 shadow-md shadow-rose-500/10"
                        : "bg-slate-950/80 border-slate-800 hover:border-cyan-500/40 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400">{tech.code}</span>
                      {tech.status === "active_detection" && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      )}
                    </div>
                    <p className="line-clamp-2 text-[10px] leading-tight font-sans">
                      {tech.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Technique Modal Inspector */}
      {selectedTechnique && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 font-sans relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedTechnique(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold">
                {selectedTechnique.code}
              </span>
              <div>
                <h2 className="text-base font-bold font-mono text-slate-100">
                  {selectedTechnique.name}
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  Tactic: {selectedTechnique.tactic}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed font-mono">
              {selectedTechnique.description}
            </p>

            <div>
              <h4 className="text-xs font-mono font-bold text-cyan-400 mb-1 flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>SIEM DETECTION KQL QUERY:</span>
              </h4>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                {selectedTechnique.queryExample}
              </div>
            </div>

            <div className="pt-2 flex justify-end font-mono text-xs">
              <button
                onClick={() => setSelectedTechnique(null)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
