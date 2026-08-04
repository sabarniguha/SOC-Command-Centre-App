import React, { useState } from "react";
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
} from "lucide-react";
import { AGENT_PERSONAS } from "../../data/mockSOCData";
import { AgentPersona, AgentPersonaId } from "../../types";

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
      progress: 75,
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
      progress: 40,
      output: "Extracted Named Pipe: \\\\.\\pipe\\msse-4102-a and C2 Server IP 185.220.101.44.",
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [selectedAgentId, setSelectedAgentId] =
    useState<AgentPersonaId>("commander");

  const handleDispatchTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: AgentTask = {
      id: `task-${Date.now()}`,
      agentId: selectedAgentId,
      title: newTaskTitle,
      status: "Running",
      progress: 15,
      output: "Autonomous agent execution initialized. Processing telemetry buffers...",
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
  };

  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
              MULTI-AGENT AUTONOMOUS SOC COMMAND CENTER
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Coordinated AI agent swarm for real-time threat hunting, malware decompilation, forensics, and automated SOAR response.
          </p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENT_PERSONAS.map((agent) => {
          const agentTasks = tasks.filter((t) => t.agentId === agent.id);

          return (
            <div
              key={agent.id}
              className="p-5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-10 h-10 rounded-full object-cover border border-cyan-500/40 shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm font-mono">
                      {agent.name}
                    </h3>
                    <p className="text-[11px] text-cyan-400 font-mono">
                      {agent.title}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {agent.description}
                </p>

                <div className="flex flex-wrap gap-1 font-mono text-[9px]">
                  {agent.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Tasks Summary for this Agent */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>ACTIVE AGENT TASKS:</span>
                  <span className="text-cyan-400 font-bold">
                    {agentTasks.length} running
                  </span>
                </div>

                {agentTasks.length > 0 ? (
                  agentTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-2 rounded bg-slate-950 border border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-200 truncate">
                          {t.title}
                        </span>
                        <span className="text-emerald-400">{t.progress}%</span>
                      </div>
                      <p className="text-[9px] text-slate-400 truncate">{t.output}</p>
                    </div>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-600 block">
                    Agent standing by for dispatch.
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Autonomous Task Dispatch Form */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl">
        <h3 className="text-sm font-bold font-mono text-slate-100 mb-3 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>DISPATCH AUTONOMOUS AGENT TASK</span>
        </h3>

        <form
          onSubmit={handleDispatchTask}
          className="flex flex-col md:flex-row gap-3 font-mono text-xs"
        >
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value as AgentPersonaId)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-bold focus:outline-none"
          >
            {AGENT_PERSONAS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.badge})
              </option>
            ))}
          </select>

          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="e.g. Execute memory dump analysis on host SRV-DC-01..."
            className="flex-1 px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center justify-center space-x-2 transition-colors shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Agent</span>
          </button>
        </form>
      </div>
    </div>
  );
};
