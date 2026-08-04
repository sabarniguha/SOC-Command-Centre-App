import React, { useState } from "react";
import {
  Wifi,
  Radio,
  ShieldAlert,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Signal,
} from "lucide-react";
import { MOCK_WIFI_APS } from "../../data/mockSOCData";
import { WiFiAccessPoint } from "../../types";

interface WiFiSecurityViewProps {
  onExecuteAction: (actionType: string, target: string) => void;
}

export const WiFiSecurityView: React.FC<WiFiSecurityViewProps> = ({
  onExecuteAction,
}) => {
  const [aps, setAps] = useState<WiFiAccessPoint[]>(MOCK_WIFI_APS);

  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Wifi className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
              WIRELESS THREAT & ROGUE AP MONITORING
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time 802.11 spectrum analysis, Evil Twin AP detection, and wireless deauthentication attack countermeasures.
          </p>
        </div>
      </div>

      {/* Access Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aps.map((ap) => (
          <div
            key={ap.bssid}
            className={`p-5 rounded-xl border shadow-2xl transition-all space-y-4 ${
              ap.status === "rogue"
                ? "bg-rose-950/30 border-rose-500/50"
                : ap.status === "deauth_attack"
                ? "bg-amber-950/30 border-amber-500/50"
                : "bg-slate-900/90 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span
                className={`px-2.5 py-0.5 rounded font-bold uppercase ${
                  ap.status === "rogue"
                    ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                    : ap.status === "deauth_attack"
                    ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                    : "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                }`}
              >
                {ap.status.replace("_", " ")}
              </span>
              <span className="text-slate-400">BSSID: {ap.bssid}</span>
            </div>

            <div>
              <h3 className="text-base font-bold font-mono text-slate-100">
                SSID: {ap.ssid}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Vendor: {ap.vendor}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">CHANNEL</span>
                <span className="text-cyan-400 font-bold">{ap.channel}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">SIGNAL (RSSI)</span>
                <span className="text-emerald-400 font-bold">{ap.rssi} dBm</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">RISK SCORE</span>
                <span className="text-rose-400 font-bold">{ap.riskScore} / 100</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded border border-slate-800">
              Security Protocol: <span className="text-cyan-300">{ap.security}</span>
            </p>

            {ap.status === "rogue" && (
              <button
                onClick={() =>
                  onExecuteAction("COUNTER_DEAUTH", ap.bssid)
                }
                className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-rose-500/20"
              >
                <Zap className="w-4 h-4" />
                <span>Execute Counter-Deauth Containment</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
