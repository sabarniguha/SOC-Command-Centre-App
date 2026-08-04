import React, { useState, useEffect } from "react";
import {
  Shield,
  Search,
  Bell,
  Volume2,
  VolumeX,
  Clock,
  Terminal,
  Activity,
  UserCheck,
  ChevronDown,
} from "lucide-react";

interface NavbarProps {
  onOpenCommandPalette: () => void;
  activeIncidentsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  activeIncidentsCount,
}) => {
  const [time, setTime] = useState<string>("");
  const [utcTime, setUtcTime] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setUtcTime(
        now.toISOString().replace("T", " ").substring(0, 19) + " UTC"
      );
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio context policy
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    playBeep();
  };

  return (
    <header id="soc-navbar" className="h-14 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/60 px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Brand & Defcon Indicator */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.15)] group-hover:border-cyan-500/40 transition-all">
            <div className="w-5 h-5 bg-cyan-400 rounded-sm rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#050507] rounded-full" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wider text-zinc-100 text-base font-mono">
                SENTINEL<span className="text-cyan-400">SOC</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                v5.0 XDR
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 tracking-widest uppercase font-medium">
              Enterprise Cyber AI Operations
            </p>
          </div>
        </div>

        {/* DEFCON / Threat Level Badge */}
        <div className="hidden lg:flex items-center space-x-3 px-3 py-1 rounded bg-red-500/10 border border-red-500/20 font-mono text-[10px]">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-bold uppercase tracking-wider">
              THREAT LEVEL: CRITICAL
            </span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center space-x-1.5 text-zinc-400">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>18.4K EPS</span>
          </div>
        </div>
      </div>

      {/* Quick Search Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/40 text-zinc-400 hover:text-zinc-200 text-xs font-mono transition-all group shadow-inner"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-cyan-400/80 group-hover:text-cyan-400" />
            <span>Search incidents, IPs, hosts, MITRE techniques...</span>
          </div>
          <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300">
            <Terminal className="w-3 h-3 mr-0.5 text-zinc-400" />
            <span>⌘K</span>
          </div>
        </button>
      </div>

      {/* Right Controls: Clock, Sound, Alerts, User Profile */}
      <div className="flex items-center space-x-3 font-mono text-xs">
        {/* Real-time Clock */}
        <div className="hidden xl:flex flex-col items-end text-right px-2.5 py-1 rounded bg-zinc-900/60 border border-zinc-800 text-[11px]">
          <div className="flex items-center space-x-1 text-cyan-400 font-medium">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{utcTime}</span>
          </div>
          <span className="text-zinc-500 text-[9px]">Local: {time}</span>
        </div>

        {/* Mute/Unmute SOC Audio Alerts */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? "Mute SOC Audio Alerts" : "Enable SOC Audio Alerts"}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          )}
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4 text-zinc-300" />
            {activeIncidentsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center animate-bounce shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                {activeIncidentsCount}
              </span>
            )}
          </button>

          {/* Quick Alerts Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#09090b] border border-zinc-800 rounded-xl shadow-2xl p-3 backdrop-blur-lg z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 font-sans">
                <span className="font-semibold text-zinc-200 text-xs">
                  Active Security Alerts
                </span>
                <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 font-mono">
                  {activeIncidentsCount} Critical
                </span>
              </div>
              <div className="py-2 space-y-2 text-xs font-sans">
                <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-300">
                  <p className="font-bold text-[11px]">Cobalt Strike C2 Beacon</p>
                  <p className="text-[10px] text-red-400/80">
                    Host SRV-FINANCE-02 • IP 185.220.101.44
                  </p>
                </div>
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  <p className="font-bold text-[11px]">Rogue Wi-Fi Access Point</p>
                  <p className="text-[10px] text-amber-400/80">
                    SSID CORP-SECURE • BSSID 00:c0:ca:98:dd:01
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CISO Analyst Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-zinc-800 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[#050507] font-bold text-xs shadow-[0_0_10px_rgba(34,211,238,0.3)]">
            SG
          </div>
          <div className="hidden md:block text-left font-sans">
            <p className="text-xs font-medium text-zinc-200 leading-tight">
              Sabarni Guha
            </p>
            <p className="text-[10px] text-cyan-400 font-mono leading-tight">
              Lead SOC Analyst
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
