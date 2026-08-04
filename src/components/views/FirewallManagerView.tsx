import React, { useState } from "react";
import {
  Flame,
  Plus,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  Lock,
} from "lucide-react";
import { MOCK_FIREWALL_RULES } from "../../data/mockSOCData";
import { FirewallRule } from "../../types";

interface FirewallManagerViewProps {
  onExecuteAction: (actionType: string, target: string) => void;
}

export const FirewallManagerView: React.FC<FirewallManagerViewProps> = ({
  onExecuteAction,
}) => {
  const [rules, setRules] = useState<FirewallRule[]>(MOCK_FIREWALL_RULES);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newIp, setNewIp] = useState<string>("");

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim()) return;

    const newRule: FirewallRule = {
      id: `FW-${Date.now().toString().slice(-4)}`,
      priority: 1,
      action: "DENY",
      source: newIp,
      destination: "ANY",
      port: "ANY",
      protocol: "ANY",
      hitCount: 0,
      createdBy: "Lead SOC Analyst",
      notes: "Manually added firewall drop rule",
    };

    setRules([newRule, ...rules]);
    setNewIp("");
    setShowAddModal(false);
    onExecuteAction("BLOCK_IP", newIp);
  };

  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
              PERIMETER FIREWALL & ACL RULE MANAGER
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Palo Alto Networks & Cisco ASA ingress/egress firewall policy management.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center space-x-2 transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom ACL Drop Rule</span>
        </button>
      </div>

      {/* Rules Table */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <th className="py-2.5 px-3">Rule ID</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Port</th>
                <th className="py-2.5 px-3">Hit Count</th>
                <th className="py-2.5 px-3">Created By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-950/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-cyan-400">{rule.id}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        rule.action === "DENY"
                          ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                          : "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {rule.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-200">{rule.source}</td>
                  <td className="py-3 px-3 text-slate-300">{rule.destination}</td>
                  <td className="py-3 px-3 text-cyan-300">{rule.port}</td>
                  <td className="py-3 px-3 text-slate-400">{rule.hitCount.toLocaleString()}</td>
                  <td className="py-3 px-3 text-slate-400 text-[10px]">{rule.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Drop Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 font-mono text-xs">
            <h3 className="text-base font-bold text-slate-100">
              ENFORCE FIREWALL DENY RULE
            </h3>
            <form onSubmit={handleAddRule} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">
                  Source IP Address / CIDR to Block:
                </label>
                <input
                  type="text"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="e.g. 185.220.101.44"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 text-slate-950 font-bold"
                >
                  Deploy Firewall Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
