import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Shield,
  Terminal,
  Zap,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";
import { AGENT_PERSONAS } from "../../data/mockSOCData";
import { AgentPersonaId, Incident } from "../../types";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  personaId: AgentPersonaId;
  text: string;
  timestamp: string;
  actions?: { label: string; actionType: string; target: string }[];
}

interface AICopilotPanelProps {
  selectedIncident?: Incident | null;
  onExecuteAction?: (actionType: string, target: string) => void;
}

export const AICopilotPanel: React.FC<AICopilotPanelProps> = ({
  selectedIncident,
  onExecuteAction,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [activePersonaId, setActivePersonaId] =
    useState<AgentPersonaId>("commander");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const activePersona =
    AGENT_PERSONAS.find((p) => p.id === activePersonaId) || AGENT_PERSONAS[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      sender: "ai",
      personaId: "commander",
      text: `### Sentinel SOC Commander Online 🛡️\n\nI am monitoring all active SOC telemetry feeds. 3 critical alerts require your attention.\n\nHow would you like to proceed with incident investigation or SOAR containment?`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      actions: [
        {
          label: "Analyze Incident INC-2026-8801",
          actionType: "ANALYZE",
          target: "INC-2026-8801",
        },
        {
          label: "Execute Host Isolation on SRV-FINANCE-02",
          actionType: "ISOLATE",
          target: "SRV-FINANCE-02",
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // When selected incident changes, inject a contextual prompt suggestion
  useEffect(() => {
    if (selectedIncident) {
      const promptText = `Selected Incident: ${selectedIncident.title} (${selectedIncident.id}). Target: ${selectedIncident.targetHost}, IP: ${selectedIncident.ipAddress}. What is the recommended multi-agent containment strategy?`;
      handleSendMessage(promptText);
    }
  }, [selectedIncident]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      personaId: activePersonaId,
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          agentPersona: activePersonaId,
          incidentContext: selectedIncident || null,
        }),
      });

      const data = await response.json();

      let actions: { label: string; actionType: string; target: string }[] = [];
      if (activePersonaId === "commander" || activePersonaId === "responder") {
        actions = [
          {
            label: "Enforce Firewall Drop Rule",
            actionType: "BLOCK_IP",
            target: "185.220.101.44",
          },
          {
            label: "Isolate Host Network Access",
            actionType: "ISOLATE_HOST",
            target: selectedIncident?.targetHost || "SRV-FINANCE-02",
          },
        ];
      } else if (activePersonaId === "hunter") {
        actions = [
          {
            label: "Run KQL Correlation Query",
            actionType: "RUN_QUERY",
            target: "winlogbeat-*",
          },
        ];
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        personaId: activePersonaId,
        text: data.reply || "Analysis complete.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        actions,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          personaId: activePersonaId,
          text: `⚠️ **Error connecting to SOC AI Copilot.** Please ensure the backend server is running.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleQuickChip = (chipText: string) => {
    handleSendMessage(chipText);
  };

  return (
    <aside
      id="soc-copilot"
      className={`${
        collapsed ? "w-12" : "w-96"
      } transition-all duration-300 ease-in-out bg-[#09090b] border-l border-zinc-800/60 flex flex-col justify-between z-20 shadow-2xl relative select-none`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -left-3 top-16 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-cyan-400 hover:bg-zinc-800 z-50 shadow-md"
        title={collapsed ? "Expand AI Copilot" : "Collapse AI Copilot"}
      >
        {collapsed ? (
          <ChevronLeft className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
      </button>

      {collapsed ? (
        <div className="py-6 flex flex-col items-center space-y-6">
          <Bot className="w-6 h-6 text-cyan-400 animate-pulse" />
          <span className="writing-mode-vertical text-xs font-mono text-cyan-400/80 tracking-widest uppercase">
            AI SOC COPILOT
          </span>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header & Persona Selector */}
          <div className="p-3 border-b border-zinc-800/60 bg-[#0d0d10]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="font-bold text-xs tracking-wider font-mono text-zinc-100">
                  AI SOC COPILOT
                </span>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono font-semibold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                GEMINI 3.6 FLASH
              </span>
            </div>

            {/* Persona Switcher Tabs */}
            <div className="grid grid-cols-6 gap-1 p-1 bg-[#050507] rounded-lg border border-zinc-800">
              {AGENT_PERSONAS.map((persona) => {
                const isSelected = persona.id === activePersonaId;
                return (
                  <button
                    key={persona.id}
                    onClick={() => setActivePersonaId(persona.id)}
                    title={`${persona.name} (${persona.title})`}
                    className={`p-1.5 rounded flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                    }`}
                  >
                    <span className="text-[10px] font-bold font-mono">
                      {persona.badge.substring(0, 3)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Persona Info */}
            <div className="mt-2.5 flex items-center space-x-2 px-2 py-1.5 rounded-md bg-[#050507] border border-zinc-800 text-xs font-sans">
              <img
                src={activePersona.avatar}
                alt={activePersona.name}
                className="w-6 h-6 rounded-full object-cover border border-cyan-500/40"
              />
              <div className="truncate">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-zinc-200 text-[11px] font-mono">
                    {activePersona.name}
                  </span>
                  <span className="text-[9px] text-cyan-400 font-mono px-1 rounded bg-cyan-500/10 border border-cyan-500/30">
                    {activePersona.badge}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 truncate">
                  {activePersona.title}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-zinc-500 font-mono">
                  <span>{msg.sender === "user" ? "You" : activePersona.name}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3 rounded-xl max-w-[90%] border leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-100 rounded-tr-none shadow-md"
                      : "bg-white/5 border-zinc-800 text-zinc-200 rounded-tl-none shadow-lg"
                  }`}
                >
                  <div className="prose prose-invert prose-xs max-w-none space-y-1.5">
                    {msg.text.split("\n").map((line, lIdx) => {
                      if (line.startsWith("### ")) {
                        return (
                          <h4
                            key={lIdx}
                            className="font-bold text-cyan-400 font-mono text-xs mt-1"
                          >
                            {line.replace("### ", "")}
                          </h4>
                        );
                      }
                      if (line.startsWith("- ") || line.startsWith("* ")) {
                        return (
                          <div
                            key={lIdx}
                            className="flex items-start space-x-1.5 text-zinc-300 text-[11px]"
                          >
                            <span className="text-cyan-400">•</span>
                            <span>{line.substring(2)}</span>
                          </div>
                        );
                      }
                      if (line.startsWith("```")) {
                        return (
                          <div
                            key={lIdx}
                            className="bg-[#050507] p-2 rounded border border-zinc-800 font-mono text-[10px] text-emerald-400 my-1 overflow-x-auto"
                          >
                            {line.replace(/```[a-z]*/, "").replace(/```/, "")}
                          </div>
                        );
                      }
                      return (
                        <p key={lIdx} className="text-[11px] text-zinc-200">
                          {line}
                        </p>
                      );
                    })}
                  </div>

                  {/* Copy Action */}
                  <div className="mt-2 flex items-center justify-end">
                    <button
                      onClick={() => handleCopyText(msg.text, idx)}
                      className="text-[10px] text-zinc-400 hover:text-cyan-400 flex items-center space-x-1 font-mono transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Direct Action Triggers */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-zinc-800/80 space-y-1.5">
                      <p className="text-[10px] font-mono font-semibold text-cyan-400">
                        SUGGESTED SOAR ACTIONS:
                      </p>
                      {msg.actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() =>
                            onExecuteAction &&
                            onExecuteAction(act.actionType, act.target)
                          }
                          className="w-full flex items-center justify-between p-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono transition-colors"
                        >
                          <span className="flex items-center space-x-1.5">
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>{act.label}</span>
                          </span>
                          <ChevronRight className="w-3 h-3 text-cyan-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs p-2 rounded bg-zinc-900 border border-cyan-500/20">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{activePersona.name} synthesizing telemetry response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-[#0d0d10] border-t border-zinc-800/80 flex items-center space-x-1.5 overflow-x-auto scrollbar-none font-mono text-[10px]">
            <button
              onClick={() => handleQuickChip("Isolate host SRV-FINANCE-02")}
              className="px-2 py-1 rounded bg-[#050507] border border-zinc-800 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 flex-shrink-0"
            >
              ⚡ Isolate Host
            </button>
            <button
              onClick={() => handleQuickChip("Explain Kerberos Attack")}
              className="px-2 py-1 rounded bg-[#050507] border border-zinc-800 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 flex-shrink-0"
            >
              🛡️ Explain MITRE T1003
            </button>
            <button
              onClick={() => handleQuickChip("Draft Firewall IP block rule")}
              className="px-2 py-1 rounded bg-[#050507] border border-zinc-800 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 flex-shrink-0"
            >
              🔥 Block C2 IP
            </button>
          </div>

          {/* Input Form */}
          <div className="p-3 bg-[#0d0d10] border-t border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask ${activePersona.name}...`}
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-cyan-500 text-zinc-100 text-xs font-mono placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#050507] font-bold transition-colors shadow-[0_0_10px_rgba(34,211,238,0.3)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};
