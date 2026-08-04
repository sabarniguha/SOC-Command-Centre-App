import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  Copy,
  Check,
  RefreshCw,
  Shield,
  Clock,
} from "lucide-react";

export const ExecutiveReportView: React.FC = () => {
  const [reportType, setReportType] = useState<string>("Executive CISO Briefing");
  const [timeRange, setTimeRange] = useState<string>("Last 24 Hours");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [report, setReport] = useState<any>({
    title: "Sentinel SOC - Executive CISO Security Briefing",
    generatedAt: new Date().toISOString(),
    summary:
      "Over the past 24 hours, Sentinel SOC ingested 14.8 million security events. Multi-agent detection successfully contained 3 critical incidents including a Cobalt Strike beaconing attempt and a Rogue Wi-Fi Evil Twin AP, preventing lateral spread to enterprise financial assets.",
    sections: [
      {
        title: "Key Performance Indicators (KPIs)",
        content:
          "• Mean Time To Detect (MTTD): 1.8 minutes\n• Mean Time To Respond (MTTR): 4.2 minutes\n• Security Posture Index: 92/100 (+3.5% vs prior week)\n• Zero Egress Data Exfiltrations Reported",
      },
      {
        title: "MITRE ATT&CK Tactics & Detections",
        content:
          "• Initial Access: T1566 Spearphishing Link (Mitigated)\n• Execution: T1059 PowerShell Encrypted Payload (Contained via EDR)\n• Credential Access: T1003 LSASS Memory Dumping Attempt (Blocked)\n• Command & Control: T1071 Encrypted HTTPS Beaconing to 185.220.101.44 (Firewall Dropped)",
      },
      {
        title: "CISO Strategic Recommendations",
        content:
          "1. Enforce FIDO2 Hardware Key MFA across all Tier-1 Domain Administrators.\n2. Apply security patch for CVE-2026-1049 on perimeter VPN gateways.\n3. Expand automated EDR isolation playbooks to 3rd floor wireless access points.",
      },
    ],
  });

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType, timeRange }),
      });
      const data = await res.json();
      if (data && data.title) {
        setReport(data);
      }
    } catch (err) {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    if (!report) return;
    const text = `# ${report.title}\n*Generated: ${report.generatedAt}*\n\n## Summary\n${report.summary}\n\n` +
      report.sections.map((s: any) => `## ${s.title}\n${s.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
              AI EXECUTIVE SECURITY REPORT GENERATOR
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate CISO-ready threat assessments, regulatory compliance summaries, and export to PDF.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center space-x-1.5 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-cyan-400" />
            )}
            <span>{copied ? "Copied" : "Copy Markdown"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center space-x-1.5 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Generator Form */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl print:hidden">
        <form onSubmit={handleGenerateReport} className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Report Type:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-bold focus:outline-none"
            >
              <option value="Executive CISO Briefing">Executive CISO Briefing</option>
              <option value="Incident Post-Mortem Analysis">Incident Post-Mortem Analysis</option>
              <option value="SOC Operations Audit">SOC Operations Audit</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Time Horizon:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-bold focus:outline-none"
            >
              <option value="Last 24 Hours">Last 24 Hours</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center justify-center space-x-2 transition-colors shadow-lg"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Briefing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Printable Report Output Document */}
      <div className="p-8 rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-2xl space-y-6 font-sans text-slate-100 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="pb-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
              CONFIDENTIAL • CISO SECURITY ASSESSMENT
            </span>
            <h2 className="text-2xl font-bold font-mono text-slate-100 mt-1">
              {report.title}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Generated at: {report.generatedAt}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        {/* Executive Summary Box */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs leading-relaxed font-mono text-slate-200">
          <h3 className="font-bold text-cyan-300 text-xs uppercase mb-1">
            EXECUTIVE SUMMARY
          </h3>
          <p>{report.summary}</p>
        </div>

        {/* Report Sections */}
        <div className="space-y-6">
          {report.sections.map((sec: any, idx: number) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-sm font-bold font-mono text-cyan-400 border-b border-slate-800/80 pb-1">
                {sec.title}
              </h3>
              <div className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-line pl-2">
                {sec.content}
              </div>
            </div>
          ))}
        </div>

        {/* Sign-off Footer */}
        <div className="pt-6 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex justify-between">
          <span>Sentinel SOC v5.0 AI Operations Engine</span>
          <span>Verified by Commander Nexus</span>
        </div>
      </div>
    </div>
  );
};
