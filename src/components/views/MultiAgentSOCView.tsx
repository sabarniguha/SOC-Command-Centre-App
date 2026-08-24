import React, { useState, useEffect } from "react";
import {
  Bot,
  Zap,
  CheckCircle2,
  Terminal,
  Send,
  Sparkles,
  ShieldAlert,
  Cpu,
  Clock,
  Play,
  RotateCcw,
  MessageSquare,
  Flame,
  Activity,
  Layers,
  ShieldCheck,
  Award,
} from "lucide-react";
import { AGENT_PERSONAS, MOCK_SWARM_DEBATE } from "../../data/mockSOCData";
import { AgentPersona, AgentPersonaId, SwarmDebateMessage } from "../../types";

interface AgentTask {
  id: string;
  agentId: AgentPersonaId;
  title: string;
  status: "Running" | "Completed" | "Queued";
  progress: number;
  output: string;
}

export const MultiAgentSOCView: React.FC = () => {
  const [tasks, setTasks] = useState<AgentTask[]>([
    {
      id: "task-1",
      agentId: "commander",
      title: "Orchestrate SOAR Ransomware Containment Playbook #PB-409",
      status: "Running",
      progress: 85,
      output: "Initiated network isolation on WS-FINANCE-09. Egress firewall rules enforced.",
    },
    {
      id: "task-2",
      agentId: "hunter",
      title: "Query SIEM for High-Entropy DNS Exfiltration Beacons",
      status: "Completed",
      progress: 100,
      output: "Correlated 14 anomalous DNS requests matching domain update-sec-server-4102.xyz.",
    },
    {
      id: "task-3",
      agentId: "malware",
      title: "Unpack Cobalt Strike Beacon Memory Injection Payload",
      status: "Running",
      progress: 55,
      output: "Extracted Named Pipe: \\\\.\\pipe\\msse-4102-a and C2 Server IP 185.220.101.44.",
    },
    {
      id: "task-4",
      agentId: "forensics",
      title: "Snapshot Volatile RAM on SRV-FINANCE-02 & Extract MFT Logs",
      status: "Running",
      progress: 70,
      output: "Acquired 16GB memory dump. Scheduled task 'WinSecMaintain' identified at 10:11:30 UTC.",
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [selectedAgentId, setSelectedAgentId] =
    useState<AgentPersonaId>("commander");
  const [debateMessages, setDebateMessages] = useState<SwarmDebateMessage[]>(
    MOCK_SWARM_DEBATE.slice(0, 3)
  );
  const [isDebating, setIsDebating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"swarm" | "tasks">("swarm");

  // Swarm debate streaming simulation
  useEffect(() => {
    let timer: any;
    if (isDebating && debateMessages.length < MOCK_SWARM_DEBATE.length) {
      timer = setTimeout(() => {
        setDebateMessages((prev) => [
          ...prev,
          MOCK_SWARM_DEBATE[prev.length],
        ]);
      }, 1500);
    } else if (debateMessages.length >= MOCK_SWARM_DEBATE.length) {
      setIsDebating(false);
    }
    return () => clearTimeout(timer);
  }, [isDebating, debateMessages]);

  const handleStartDebate = () => {
    setDebateMessages(MOCK_SWARM_DEBATE.slice(0, 2));
    setIsDebating(true);
  };

  const handleResetDebate = () => {
    setIsDebating(false);
    setDebateMessages(MOCK_SWARM_DEBATE.slice(0, 3));
  };

  const handleDispatchTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: AgentTask = {
      id: `task-${Date.now()}`,
      agentId: selectedAgentId,
      title: newTaskTitle,
      status: "Running",
      progress: 25,
      output: "Autonomous agent execution initialized. Ingesting telemetry buffers...",
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
  };

  const calculateConsensusScore = () => {
    if (debateMessages.length === 0) return 0;
    const total = debateMessages.reduce((sum, msg) => sum + msg.confidenceScore, 0);
    return (total / debateMessages.length).toFixed(1);
  };

  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
              MULTI-AGENT AUTONOMOUS SOC WAR ROOM & SWARM CONSENSUS
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Coordinated AI agent swarm debating threat vectors, voting on containment actions, and executing synchronized SOAR playbooks.
          </p>
        </div>

        <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab("swarm")}
            className={`px-3 py-1.5 rounded transition-colors flex items-center space-x-1.5 ${
              activeTab === "swarm"
                ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Swarm War Room</span>
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-3 py-1.5 rounded transition-colors flex items-center space-x-1.5 ${
              activeTab === "tasks"
                ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Task Dispatcher</span>
          </button>
        </div>
      </div>

      {/* Agents Roster Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {AGENT_PERSONAS.map((agent) => {
          const isSelected = selectedAgentId === agent.id;

          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                isSelected
                  ? "bg-cyan-950 border-cyan-400 ring-2 ring-cyan-500/30"
                  : "bg-slate-900/90 border-slate-800 hover:border-cyan-500/40"
              }`}
            >
              <div className="flex items-center space-x-2">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-8 h-8 rounded-full object-cover border border-cyan-500/40"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs font-mono text-slate-100 truncate">
                    {agent.name.split(" ")[0]}
                  </h4>
                  <span className="text-[9px] font-mono text-cyan-400 block truncate">
                    {agent.badge}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>STATUS:</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {activeTab === "swarm" ? (
        /* Autonomous Swarm Debate War Room */
        <div className="p-6 rounded-2xl bg-slate-900/95 border border-cyan-500/30 shadow-2xl space-y-6">
          {/* Consensus Metrics Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 font-mono text-xs">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block">SWARM BAYESIAN CONSENSUS</span>
                  <span className="text-emerald-400 font-bold text-base">
                    {calculateConsensusScore()}% Confidence
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ACTIVE DEBATE THREAD</span>
                <span className="text-cyan-300 font-bold">
                  INC-2026-8801: Containment vs Threat Hunting
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleStartDebate}
                disabled={isDebating}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isDebating ? "Agents Debating..." : "Simulate Swarm Consensus"}</span>
              </button>

              <button
                onClick={handleResetDebate}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Reset debate"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Streaming Messages Chain */}
          <div className="space-y-4 font-mono text-xs">
            {debateMessages.map((msg, index) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={msg.agentAvatar}
                      alt={msg.agentName}
                      className="w-7 h-7 rounded-full object-cover border border-cyan-500/40"
                    />
                    <div>
                      <span className="font-bold text-slate-100">{msg.agentName}</span>
                      <span className="text-[10px] text-slate-500 ml-2">{msg.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        msg.stance === "CONTAIN_NOW"
                          ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                          : msg.stance === "REVOKE_IDENTITY"
                          ? "bg-purple-950 text-purple-300 border border-purple-500/40"
                          : msg.stance === "GATHER_EVIDENCE"
                          ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                          : "bg-cyan-950 text-cyan-300 border border-cyan-500/40"
                      }`}
                    >
                      VOTE: {msg.stance.replace("_", " ")}
                    </span>
                    <span className="text-cyan-400 font-bold text-[11px]">
                      {msg.confidenceScore}% conf
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed">{msg.content}</p>

                <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-bold">TECHNICAL FINDING:</span>
                    <span className="text-slate-300">{msg.technicalFinding}</span>
                  </div>
                  <div>
                    <span className="text-cyan-400 block font-bold">PROPOSED SOAR ACTION:</span>
                    <span className="text-cyan-300">{msg.proposedAction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Execution Consensus Summary */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 font-mono text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300 font-bold">
                SWARM CONSENSUS VERDICT: PROCEED WITH FULL NETWORK ISOLATION & EDR RECOVERY
              </span>
            </div>
            <span className="text-emerald-400 font-bold">MTTR: 4.2 mins</span>
          </div>
        </div>
      ) : (
        /* Task Dispatcher View */
        <div className="space-y-6 font-mono text-xs">
          {/* Dispatch Bar */}
          <form
            onSubmit={handleDispatchTask}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex gap-3"
          >
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder={`Dispatch autonomous mission to ${selectedAgentId.toUpperCase()} (e.g. Run memory injection scan on SRV-FINANCE-02)...`}
              className="flex-1 bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center space-x-2 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Agent</span>
            </button>
          </form>

          {/* Active Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase font-bold text-[10px]">
                    AGENT: {task.agentId}
                  </span>
                  <span
                    className={`font-bold ${
                      task.status === "Completed" ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-100 text-sm">{task.title}</h4>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>EXECUTION PROGRESS</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-cyan-500 h-full transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>

                <p className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                  {task.output}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
