import React, { useState, useEffect } from "react";
import {
  GitMerge,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  Server,
  Laptop,
  Globe,
  Lock,
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  Binary,
  Radio,
  FileCode,
  Flame,
  Activity,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { MOCK_INCIDENTS } from "../../data/mockSOCData";
import { Incident, AttackGraphNode, AttackGraphLink } from "../../types";

interface AttackGraphViewProps {
  selectedIncident?: Incident | null;
  onExecuteAction: (actionType: string, target: string) => void;
}

export const AttackGraphView: React.FC<AttackGraphViewProps> = ({
  selectedIncident: initialIncident,
  onExecuteAction,
}) => {
  const [incident, setIncident] = useState<Incident>(
    initialIncident || MOCK_INCIDENTS[0]
  );
  const [selectedNode, setSelectedNode] = useState<AttackGraphNode | null>(
    incident.attackGraphNodes[2] || incident.attackGraphNodes[0]
  );
  const [replayStep, setReplayStep] = useState<number>(5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"graph" | "dissector" | "blastRadius">("graph");
  const [isolatedNodes, setIsolatedNodes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"forensics" | "packets" | "containment">("forensics");

  // Replay animation effect
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setReplayStep((prev) => {
          if (prev >= incident.attackGraphLinks.length) {
            setIsPlaying(false);
            return incident.attackGraphLinks.length;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, incident]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "threat_actor":
        return Globe;
      case "entry_point":
        return ShieldAlert;
      case "host":
        return Laptop;
      case "process":
        return Cpu;
      case "domain_controller":
        return Server;
      case "c2_server":
        return Lock;
      case "exfil_bucket":
        return Layers;
      default:
        return Server;
    }
  };

  const handleResetReplay = () => {
    setIsPlaying(false);
    setReplayStep(1);
  };

  const toggleIsolation = (nodeLabel: string) => {
    if (isolatedNodes.includes(nodeLabel)) {
      setIsolatedNodes(isolatedNodes.filter((n) => n !== nodeLabel));
    } else {
      setIsolatedNodes([...isolatedNodes, nodeLabel]);
      onExecuteAction("ISOLATE_HOST", nodeLabel);
    }
  };

  // Simulated packet payload data for deep packet dissection
  const getPacketDissection = (node: AttackGraphNode | null) => {
    if (!node) return null;

    if (node.type === "c2_server") {
      return {
        protocol: "HTTPS / TLS 1.3 (Cobalt Strike Malleable C2)",
        src: "10.0.4.112:49821",
        dst: `${node.ip || "185.220.101.44"}:443`,
        jitter: "60s (±15% random delay)",
        entropy: "7.94 (High Cryptographic Randomness)",
        beaconWatermark: "419201 (APT29 Profile)",
        hexDump: `0000   17 03 03 01 20 00 00 00  00 00 00 01 a4 19 82 fe   .... .......
0010   c9 e4 b1 88 20 4a 12 00  48 89 e5 48 83 ec 28 e8   .... J..H..H.(.
0020   2e 00 00 00 50 6f 77 65  72 53 68 65 6c 6c 20 45   ....PowerShell E
0030   78 65 63 75 74 65 20 4c  53 41 53 53 20 44 75 6d   xecute LSASS Dum
0040   70 20 53 74 61 67 65 20  32 30 32 36 2d 53 4f 43   p Stage 2026-SOC`,
        asciiSummary: "Encrypted C2 Beacon check-in exchanging tasking orders for credential harvest stage.",
      };
    }

    if (node.type === "process") {
      return {
        protocol: "Win32 Process / Named Pipe (IPC$)",
        src: "PID: 4102 (powershell.exe)",
        dst: "PID: 892 (lsass.exe)",
        jitter: "N/A (Local Memory Intercept)",
        entropy: "6.12 (Obfuscated Base64 Shellcode)",
        beaconWatermark: "MiniDumpWriteDump API",
        hexDump: `0000   4d 5a 90 00 03 00 00 00  04 00 00 00 ff ff 00 00   MZ..............
0010   b8 00 00 00 00 00 00 00  40 00 00 00 00 00 00 00   ........@.......
0020   5c 5c 2e 5c 70 69 70 65  5c 6d 73 73 65 2d 34 31   \\\\.\\pipe\\msse-41
0030   30 32 2d 61 00 00 00 00  73 65 6b 75 72 6c 73 61   02-a....sekurlsa`,
        asciiSummary: "In-memory reflective DLL injection via \\\\.\\pipe\\msse-4102-a to extract plaintext credentials.",
      };
    }

    return {
      protocol: "Kerberos TGS-REQ / SMB (Port 445)",
      src: `${node.ip || "10.0.4.112"}:53218`,
      dst: "10.0.1.10:88",
      jitter: "0.2s Burst",
      entropy: "5.45 (Standard ASN.1 Kerberos Ticket)",
      beaconWatermark: "SPN: MSSQLSvc/sql.corp.local",
      hexDump: `0000   6e 82 02 4b 30 82 02 47  a0 03 02 01 05 a1 03 02   n..K0..G........
0010   01 0c a2 07 03 05 00 40  80 00 00 a3 82 01 e8 30   .......@.......0
0020   82 01 e4 a0 1b 1b 19 4d  53 53 51 4c 53 76 63 2f   .......MSSQLSvc/
0030   73 71 6c 2e 63 6f 72 70  2e 6c 6f 63 61 6c 3a 31   sql.corp.local:1`,
      asciiSummary: "Kerberos Ticket-Granting Service (TGS) request targeting MSSQL service account with RC4-HMAC cipher.",
    };
  };

  const packetData = getPacketDissection(selectedNode);

  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-7xl mx-auto">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <GitMerge className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
              FORCE-DIRECTED ATTACK GRAPH & PROTOCOL DISSECTOR
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing threat actor progression, lateral movement hops, forensic byte streams, and automated containment blast radiuses.
          </p>
        </div>

        {/* View Mode & Incident Switcher */}
        <div className="flex items-center space-x-3 font-mono text-xs flex-wrap gap-2">
          <select
            value={incident.id}
            onChange={(e) => {
              const found = MOCK_INCIDENTS.find((i) => i.id === e.target.value);
              if (found) {
                setIncident(found);
                setSelectedNode(found.attackGraphNodes[0]);
                setReplayStep(found.attackGraphLinks.length);
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 font-semibold focus:outline-none"
          >
            {MOCK_INCIDENTS.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id}: {inc.title.substring(0, 35)}...
              </option>
            ))}
          </select>

          <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode("graph")}
              className={`px-3 py-1 rounded text-xs transition-colors flex items-center space-x-1 ${
                viewMode === "graph"
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Attack Path</span>
            </button>
            <button
              onClick={() => setViewMode("dissector")}
              className={`px-3 py-1 rounded text-xs transition-colors flex items-center space-x-1 ${
                viewMode === "dissector"
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Binary className="w-3.5 h-3.5" />
              <span>Byte Dissector</span>
            </button>
            <button
              onClick={() => setViewMode("blastRadius")}
              className={`px-3 py-1 rounded text-xs transition-colors flex items-center space-x-1 ${
                viewMode === "blastRadius"
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Blast Radius</span>
            </button>
          </div>
        </div>
      </div>

      {/* Attack Replay Control Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center space-x-2 transition-colors shadow-lg shadow-cyan-500/20"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Replay</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Play Attack Timeline</span>
              </>
            )}
          </button>

          <button
            onClick={handleResetReplay}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="text-slate-300 font-semibold">
            <span>Attack Timeline Step: </span>
            <span className="text-cyan-400 text-sm font-bold">
              {replayStep} / {incident.attackGraphLinks.length}
            </span>
          </div>
        </div>

        {/* Step Slider */}
        <div className="flex-1 max-w-md flex items-center space-x-3">
          <span className="text-slate-500 text-[10px]">Step 1</span>
          <input
            type="range"
            min={1}
            max={incident.attackGraphLinks.length}
            value={replayStep}
            onChange={(e) => setReplayStep(Number(e.target.value))}
            className="w-full accent-cyan-400 bg-slate-950 cursor-pointer"
          />
          <span className="text-slate-500 text-[10px]">
            Step {incident.attackGraphLinks.length}
          </span>
        </div>
      </div>

      {/* Explanatory Step Card Banner */}
      <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start space-x-3 text-xs font-mono">
        <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-cyan-300 font-bold">
            STAGE {replayStep} EXPLANATION & THREAT REASONING:
          </span>
          <p className="text-slate-300 leading-relaxed">
            {replayStep === 1 && "Adversary gained initial foothold by distributing an encrypted spearphishing payload. Endpoint perimeter defenses flagged high-entropy download."}
            {replayStep === 2 && "Living-off-the-Land (LOLBAS) execution via obfuscated PowerShell script bypassing execution policies and initiating memory staging."}
            {replayStep === 3 && "Local Security Authority Subsystem (LSASS) process access was granted (EventID 10) to dump NTLM hashes and Kerberos tickets."}
            {replayStep === 4 && "Compromised financial server established outbound HTTPS C2 channel to remote node 185.220.101.44 with randomized jitter."}
            {replayStep >= 5 && "Adversary initiated internal lateral movement towards Domain Controllers via Kerberos Ticket-Granting Service (TGS) requests."}
          </p>
        </div>
      </div>

      {/* Main Canvas + Node Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl relative min-h-[480px] flex flex-col justify-between overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 font-mono text-[10px]">
            <span className="px-2 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500/30 font-bold">
              DEFCON {incident.severity === "Critical" ? "1" : "2"}: {incident.severity.toUpperCase()}
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
              IMPACT SCORE: {incident.impactScore} / 10
            </span>
            {viewMode === "blastRadius" && (
              <span className="px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>Blast Radius Simulation Active</span>
              </span>
            )}
          </div>

          {/* SVG Graph Visualization */}
          <div className="relative w-full h-[400px] flex items-center justify-center">
            <svg className="w-full h-full absolute inset-0 pointer-events-none">
              {/* Draw Connections */}
              {incident.attackGraphLinks.map((link) => {
                const srcNode = incident.attackGraphNodes.find(
                  (n) => n.id === link.source
                );
                const tgtNode = incident.attackGraphNodes.find(
                  (n) => n.id === link.target
                );
                if (!srcNode || !tgtNode) return null;

                const isStepActive = link.step <= replayStep;
                const isIsolated = isolatedNodes.includes(srcNode.label) || isolatedNodes.includes(tgtNode.label);

                return (
                  <g key={`${link.source}-${link.target}`}>
                    <line
                      x1={`${srcNode.x}%`}
                      y1={`${srcNode.y}px`}
                      x2={`${tgtNode.x}%`}
                      y2={`${tgtNode.y}px`}
                      stroke={isIsolated ? "#ef4444" : isStepActive ? "#06b6d4" : "#334155"}
                      strokeWidth={isStepActive ? 2.5 : 1}
                      strokeDasharray={isIsolated ? "4 4" : isStepActive ? "6 3" : undefined}
                      className={isStepActive && !isIsolated ? "animate-pulse" : ""}
                    />
                    {isStepActive && (
                      <text
                        x={`${(srcNode.x + tgtNode.x) / 2}%`}
                        y={`${(srcNode.y + tgtNode.y) / 2 - 8}px`}
                        fill={isIsolated ? "#f87171" : "#22d3ee"}
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {isIsolated ? "[SEVERED]" : link.relationship}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Draw Graph Nodes */}
            <div className="w-full h-full relative z-20">
              {incident.attackGraphNodes.map((node) => {
                const Icon = getNodeIcon(node.type);
                const isSelected = selectedNode?.id === node.id;
                const isIsolated = isolatedNodes.includes(node.label);

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                    className={`absolute p-3 rounded-xl border flex flex-col items-center space-y-1 transition-all shadow-xl group ${
                      isSelected
                        ? "bg-cyan-950 border-cyan-400 ring-2 ring-cyan-500/50 scale-110"
                        : isIsolated
                        ? "bg-rose-950/80 border-rose-500 text-rose-300 ring-1 ring-rose-500/40"
                        : node.status === "compromised"
                        ? "bg-slate-900 border-rose-500/60 hover:border-rose-400"
                        : "bg-slate-900 border-slate-800 hover:border-cyan-500/40"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isIsolated
                          ? "bg-rose-900 text-rose-200"
                          : node.status === "compromised"
                          ? "bg-rose-950 text-rose-400"
                          : "bg-cyan-950 text-cyan-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-200 max-w-[100px] truncate">
                      {node.label}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 rounded ${
                        isIsolated
                          ? "bg-rose-900 text-rose-200 font-bold"
                          : node.status === "compromised"
                          ? "bg-rose-950 text-rose-300"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isIsolated ? "ISOLATED" : `Risk: ${node.riskScore}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Interactive Telemetry: Click any node to open live protocol dissection & forensic evidence.</span>
            </span>
            <span className="text-cyan-400 font-bold">
              Nodes: {incident.attackGraphNodes.length} • Links: {incident.attackGraphLinks.length}
            </span>
          </div>
        </div>

        {/* Node Detail & Forensic Dissector Inspector Panel */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-2xl flex flex-col justify-between font-sans">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase font-bold">
                    {selectedNode.type.replace("_", " ")}
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-400">
                    RISK SCORE: {selectedNode.riskScore} / 100
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 font-mono mt-2">
                  {selectedNode.label}
                </h3>
              </div>

              {/* Inspector Sub-Tabs */}
              <div className="flex border-b border-slate-800 font-mono text-xs">
                <button
                  onClick={() => setActiveTab("forensics")}
                  className={`pb-2 px-2.5 transition-colors border-b-2 font-semibold ${
                    activeTab === "forensics"
                      ? "border-cyan-400 text-cyan-300"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Forensic Overview
                </button>
                <button
                  onClick={() => setActiveTab("packets")}
                  className={`pb-2 px-2.5 transition-colors border-b-2 font-semibold ${
                    activeTab === "packets"
                      ? "border-cyan-400 text-cyan-300"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Byte Dissector
                </button>
                <button
                  onClick={() => setActiveTab("containment")}
                  className={`pb-2 px-2.5 transition-colors border-b-2 font-semibold ${
                    activeTab === "containment"
                      ? "border-cyan-400 text-cyan-300"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Containment
                </button>
              </div>

              {activeTab === "forensics" && (
                <div className="space-y-3 font-mono text-xs">
                  {selectedNode.ip && (
                    <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">IP Address:</span>
                      <span className="text-cyan-400 font-bold">{selectedNode.ip}</span>
                    </div>
                  )}
                  {selectedNode.os && (
                    <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">Operating System:</span>
                      <span className="text-slate-200">{selectedNode.os}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Containment State:</span>
                    <span
                      className={`font-bold uppercase ${
                        isolatedNodes.includes(selectedNode.label)
                          ? "text-rose-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {isolatedNodes.includes(selectedNode.label) ? "NETWORK ISOLATED" : "CONNECTED"}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-300 mb-1">
                      TECHNICAL THREAT DETAILS:
                    </h4>
                    <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed font-mono">
                      {selectedNode.details}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "packets" && packetData && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>PROTOCOL:</span>
                      <span className="text-cyan-300 font-bold">{packetData.protocol}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>SHANNON ENTROPY:</span>
                      <span className="text-amber-400 font-bold">{packetData.entropy}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>SIGNATURE/WATERMARK:</span>
                      <span className="text-rose-300 font-bold">{packetData.beaconWatermark}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 mb-1 flex items-center justify-between">
                      <span>RAW HEX DISSECTION:</span>
                      <span className="text-[9px] text-cyan-400">LAYER 7 CAPTURE</span>
                    </h4>
                    <pre className="p-2.5 rounded bg-black/90 border border-slate-800 text-[10px] text-emerald-400 overflow-x-auto font-mono leading-tight">
                      {packetData.hexDump}
                    </pre>
                  </div>

                  <p className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-cyan-400 font-bold">ANALYSIS: </span>
                    {packetData.asciiSummary}
                  </p>
                </div>
              )}

              {activeTab === "containment" && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-cyan-300">
                      BLAST RADIUS CONTAINMENT SIMULATION
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Isolating this host will immediately sever inbound/outbound SMB, WinRM, and C2 beaconing while maintaining telemetry with the EDR agent.
                    </p>
                  </div>

                  <button
                    onClick={() => toggleIsolation(selectedNode.label)}
                    className={`w-full py-2.5 px-3 rounded-lg font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-lg ${
                      isolatedNodes.includes(selectedNode.label)
                        ? "bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>
                      {isolatedNodes.includes(selectedNode.label)
                        ? `Restore ${selectedNode.label} Network`
                        : `Quarantine ${selectedNode.label} Instantly`}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 font-mono text-xs">
              Select a graph node on the canvas to inspect forensics details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
