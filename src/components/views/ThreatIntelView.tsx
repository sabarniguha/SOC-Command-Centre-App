import React, { useState } from "react";
import {
  Binary,
  Search,
  Sparkles,
  RefreshCw,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { MOCK_THREAT_FEEDS } from "../../data/mockSOCData";

export const ThreatIntelView: React.FC = () => {
  const [lookupQuery, setLookupQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [lookupResult, setLookupResult] = useState<any>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/threat-intel/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: lookupQuery }),
      });
      const data = await res.json();
      setLookupResult(data);
    } catch (err) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Binary className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
              THREAT INTELLIGENCE & MALWARE ANALYSIS SANDBOX
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time IOC lookup, threat actor profiling, and automated AI malware sample decompilation.
          </p>
        </div>
      </div>

      {/* AI Threat Lookup Input */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-purple-500/30 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold font-mono text-slate-100 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>AI-POWERED THREAT INDICATOR LOOKUP</span>
        </h3>

        <form onSubmit={handleLookup} className="flex gap-3 font-mono text-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Search IP (185.220.101.44), SHA256, or domain (c2-beacon-update.xyz)..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold flex items-center space-x-2 transition-colors shadow-lg shadow-purple-500/20"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <span>Analyze Indicator</span>
            )}
          </button>
        </form>

        {/* Lookup Results */}
        {lookupResult && (
          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40 font-mono text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100">
                INDICATOR: {lookupResult.query}
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-500/40">
                {lookupResult.reputation} ({lookupResult.threatScore} / 100)
              </span>
            </div>
            <p className="text-slate-300">{lookupResult.verdict}</p>
          </div>
        )}
      </div>

      {/* Threat Feeds Table */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl font-mono text-xs">
        <h3 className="text-sm font-bold text-slate-100 mb-3">
          GLOBAL IOC THREAT FEEDS (APT29, LOCKBIT, LAZARUS)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <th className="py-2.5 px-3">Indicator</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Threat Actor</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_THREAT_FEEDS.map((tf) => (
                <tr key={tf.id} className="hover:bg-slate-950/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-purple-300 truncate max-w-xs">
                    {tf.indicator}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{tf.type}</td>
                  <td className="py-3 px-3 text-cyan-400 font-bold">{tf.threatActor}</td>
                  <td className="py-3 px-3 text-rose-400 font-bold">{tf.riskScore}</td>
                  <td className="py-3 px-3 text-slate-400">{tf.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
