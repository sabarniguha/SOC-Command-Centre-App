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
  const [viewMode, setViewMode] = useState<"graph" | "topology">("graph");

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
      }, 1500);
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
      default:
        return Server;
    }
  };

  const handleResetReplay = () => {
    setIsPlaying(false);
    setReplayStep(1);
  };

  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-7xl mx-auto">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <GitMerge className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
              FORCE-DIRECTED ATTACK GRAPH & TOPOLOGY
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing threat vector progression, lateral movement vectors, and C2 beaconing infrastructure.
          </p>
        </div>

        {/* View Mode & Incident Switcher */}
        <div className="flex items-center space-x-3 font-mono text-xs">
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
              className={`px-3 py-1 rounded text-xs transition-colors ${
                viewMode === "graph"
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Attack Path
            </button>
            <button
              onClick={() => setViewMode("topology")}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                viewMode === "topology"
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Network Topology
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
                <span>Play Attack Step</span>
              </>
            )}
          </button>

          <button
            onClick={handleResetReplay}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
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

      {/* Main Canvas + Node Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl relative min-h-[480px] flex flex-col justify-between overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 font-mono text-[10px]">
            <span className="px-2 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
              SEVERITY: {incident.severity.toUpperCase()}
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
              IMPACT SCORE: {incident.impactScore} / 10
            </span>
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

                return (
                  <g key={`${link.source}-${link.target}`}>
                    <line
                      x1={`${srcNode.x}%`}
                      y1={`${srcNode.y}px`}
                      x2={`${tgtNode.x}%`}
                      y2={`${tgtNode.y}px`}
                      stroke={isStepActive ? "#06b6d4" : "#334155"}
                      strokeWidth={isStepActive ? 2.5 : 1}
                      strokeDasharray={isStepActive ? "6 3" : undefined}
                      className={isStepActive ? "animate-pulse" : ""}
                    />
                    {isStepActive && (
                      <text
                        x={`${(srcNode.x + tgtNode.x) / 2}%`}
                        y={`${(srcNode.y + tgtNode.y) / 2 - 8}px`}
                        fill="#22d3ee"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {link.relationship}
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
                        : node.status === "compromised"
                        ? "bg-slate-900 border-rose-500/60 hover:border-rose-400"
                        : "bg-slate-900 border-slate-800 hover:border-cyan-500/40"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        node.status === "compromised"
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
                        node.status === "compromised"
                          ? "bg-rose-950 text-rose-300"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      Risk: {node.riskScore}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-2 rounded bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between">
            <span>Click any node to inspect telemetry payload & risk details.</span>
            <span className="text-cyan-400 font-bold">
              Nodes: {incident.attackGraphNodes.length} • Links: {incident.attackGraphLinks.length}
            </span>
          </div>
        </div>

        {/* Node Detail Inspector Panel */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-2xl flex flex-col justify-between font-sans">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
                    {selectedNode.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-400">
                    RISK SCORE: {selectedNode.riskScore} / 100
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 font-mono mt-2">
                  {selectedNode.label}
                </h3>
              </div>

              <div className="space-y-2 font-mono text-xs">
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
                  <span className="text-slate-400">Security Status:</span>
                  <span
                    className={`font-bold uppercase ${
                      selectedNode.status === "compromised"
                        ? "text-rose-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {selectedNode.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold text-slate-300 mb-1">
                  TECHNICAL THREAT DETAILS:
                </h4>
                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed font-mono">
                  {selectedNode.details}
                </p>
              </div>

              {/* Instant SOAR Actions for selected node */}
              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-mono font-bold text-cyan-400">
                  SOAR CONTAINMENT CONTROLS:
                </h4>
                <button
                  onClick={() =>
                    onExecuteAction(
                      "ISOLATE_HOST",
                      selectedNode.label
                    )
                  }
                  className="w-full py-2 px-3 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-mono text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Isolate {selectedNode.label} Network</span>
                </button>
              </div>
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
