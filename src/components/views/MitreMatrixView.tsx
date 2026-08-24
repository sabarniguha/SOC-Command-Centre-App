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
  Copy,
  Check,
  FileCode,
  Sparkles,
  Layers,
  Flame,
  ShieldCheck,
  Terminal,
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
    useState<MitreTechnique | null>(MOCK_MITRE_TECHNIQUES[0]);
  const [activeRuleTab, setActiveRuleTab] = useState<"sigma" | "yara" | "suricata" | "kql">("sigma");
  const [copiedRule, setCopiedRule] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "monitored">("all");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRule(true);
    setTimeout(() => setCopiedRule(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
              MITRE ATT&CK ENTERPRISE MATRIX NAVIGATOR & RULE COMPILER
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tactical attack taxonomy with real-time enterprise detection heatmaps, production Sigma/YARA rules, and adversary profiling.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === "all"
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Techniques
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === "active"
                  ? "bg-rose-950 text-rose-300 border border-rose-500/40 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Active Alerts
            </button>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search T-code, adversary, or name..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Tactic Columns Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-3 overflow-x-auto scrollbar-thin pb-2">
        {MITRE_TACTICS.map((tactic) => {
          const techniquesForTactic = MOCK_MITRE_TECHNIQUES.filter((t) => {
            const matchesTactic = t.tactic === tactic;
            const matchesSearch =
              t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (t.adversary && t.adversary.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesStatus =
              statusFilter === "all" ||
              (statusFilter === "active" && t.status === "active_detection") ||
              (statusFilter === "monitored" && t.status === "monitored");

            return matchesTactic && matchesSearch && matchesStatus;
          });

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
                {techniquesForTactic.map((tech) => {
                  const isSelected = selectedTechnique?.code === tech.code;

                  return (
                    <button
                      key={tech.code}
                      onClick={() => setSelectedTechnique(tech)}
                      className={`w-full p-2.5 rounded-lg text-left transition-all border font-mono text-[10px] space-y-1 ${
                        isSelected
                          ? "bg-cyan-950 border-cyan-400 ring-2 ring-cyan-500/40 text-cyan-200"
                          : tech.status === "active_detection"
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
                      <p className="font-semibold line-clamp-2 leading-tight">
                        {tech.name}
                      </p>
                      {tech.adversary && (
                        <span className="text-[9px] text-slate-400 block truncate">
                          {tech.adversary}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Explanatory Technique & Rule Compiler Drawer */}
      {selectedTechnique && (
        <div className="p-6 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-3 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                  {selectedTechnique.code}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                  TACTIC: {selectedTechnique.tactic.toUpperCase()}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded font-bold ${
                    selectedTechnique.status === "active_detection"
                      ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                      : "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  STATUS: {selectedTechnique.status.toUpperCase()}
                </span>
              </div>

              <h2 className="text-xl font-bold font-mono text-slate-100 mt-2">
                {selectedTechnique.name}
              </h2>
            </div>

            {selectedTechnique.detectabilityScore && (
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-slate-400 text-[10px] block">DETECTABILITY CONFIDENCE</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {selectedTechnique.detectabilityScore}% (High Telemetry Coverage)
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
            {/* Left: Attack Anatomy & Remediation */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-1.5 flex items-center space-x-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>ATTACK VECTOR ANATOMY & HOW IT WORKS:</span>
                </h4>
                <p className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-mono">
                  {selectedTechnique.description}
                </p>
              </div>

              {selectedTechnique.adversary && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 mb-1.5 flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span>KNOWN THREAT ACTOR GROUPS ATTRIBUTED:</span>
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-rose-300 font-bold">
                    {selectedTechnique.adversary}
                  </div>
                </div>
              )}

              {selectedTechnique.remediation && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 mb-1.5 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>RECOMMENDED HARDENING & MITIGATION:</span>
                  </h4>
                  <p className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 leading-relaxed font-mono">
                    {selectedTechnique.remediation}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Production Rules Compiler & Syntax Inspector */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <button
                      onClick={() => setActiveRuleTab("sigma")}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        activeRuleTab === "sigma"
                          ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Sigma Rule
                    </button>
                    <button
                      onClick={() => setActiveRuleTab("yara")}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        activeRuleTab === "yara"
                          ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      YARA Rule
                    </button>
                    <button
                      onClick={() => setActiveRuleTab("suricata")}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        activeRuleTab === "suricata"
                          ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Suricata NIDS
                    </button>
                    <button
                      onClick={() => setActiveRuleTab("kql")}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        activeRuleTab === "kql"
                          ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      SIEM KQL
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const textToCopy =
                        activeRuleTab === "sigma"
                          ? selectedTechnique.sigmaRule || ""
                          : activeRuleTab === "yara"
                          ? selectedTechnique.yaraRule || ""
                          : activeRuleTab === "suricata"
                          ? selectedTechnique.suricataRule || ""
                          : selectedTechnique.queryExample || "";
                      handleCopy(textToCopy);
                    }}
                    className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs flex items-center space-x-1.5 transition-colors"
                  >
                    {copiedRule ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Rule</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-3">
                  {activeRuleTab === "sigma" && (
                    <pre className="p-3 rounded-lg bg-black/90 border border-slate-800 text-[11px] text-cyan-300 font-mono overflow-x-auto max-h-56 leading-relaxed">
                      {selectedTechnique.sigmaRule || "# Sigma rule compiled for active detection"}
                    </pre>
                  )}
                  {activeRuleTab === "yara" && (
                    <pre className="p-3 rounded-lg bg-black/90 border border-slate-800 text-[11px] text-purple-300 font-mono overflow-x-auto max-h-56 leading-relaxed">
                      {selectedTechnique.yaraRule || "rule Default_Rule { condition: true }"}
                    </pre>
                  )}
                  {activeRuleTab === "suricata" && (
                    <pre className="p-3 rounded-lg bg-black/90 border border-slate-800 text-[11px] text-amber-300 font-mono overflow-x-auto max-h-56 leading-relaxed">
                      {selectedTechnique.suricataRule || "alert ip any any -> any any (msg:\"Suricata Alert\"; sid:1;)"}
                    </pre>
                  )}
                  {activeRuleTab === "kql" && (
                    <pre className="p-3 rounded-lg bg-black/90 border border-slate-800 text-[11px] text-emerald-300 font-mono overflow-x-auto max-h-56 leading-relaxed">
                      {selectedTechnique.queryExample}
                    </pre>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-500 font-mono text-[10px]">
                <span>Format: Production Ready • Standardized SOC Rule Schema</span>
                <span className="text-cyan-400 font-bold">Sentinel Rule Engine v5.0</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
