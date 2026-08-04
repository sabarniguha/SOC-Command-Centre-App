import React from "react";
import { Settings, Key, Bell, Shield, Server, RefreshCw } from "lucide-react";

export const SettingsView: React.FC = () => {
  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
            SENTINEL SOC PLATFORM CONFIGURATION
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          System preferences, Gemini API key telemetry, SOAR webhook integrations, and audio alert triggers.
        </p>
      </div>

      <div className="space-y-4 font-mono text-xs">
        {/* Gemini API Status */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200">
              GEMINI 3.6 FLASH INTEGRATION STATUS
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
              SERVER-SIDE ACTIVE
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            API key is managed securely via AI Studio Secrets Panel.
          </p>
        </div>

        {/* Audio Alerts */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
          <span className="font-bold text-slate-200 block">
            AUDIO ALERT TRIGGERS
          </span>
          <div className="space-y-2 text-slate-300">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-cyan-400" />
              <span>Play high-frequency audio tone on Critical Severity Incidents</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-cyan-400" />
              <span>Enable AI Copilot voice audio response synthesizers</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
