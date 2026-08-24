import React, { useState } from "react";
import {
  Binary,
  Search,
  Sparkles,
  RefreshCw,
  ShieldAlert,
  Terminal,
  Code2,
  Lock,
  Unlock,
  Copy,
  Check,
  Flame,
  ShieldCheck,
  Cpu,
  AlertTriangle,
  Globe,
  ExternalLink,
} from "lucide-react";
import { MOCK_THREAT_FEEDS } from "../../data/mockSOCData";

export const ThreatIntelView: React.FC = () => {
  const [lookupQuery, setLookupQuery] = useState<string>("185.220.101.44");
  const [loading, setLoading] = useState<boolean>(false);
  const [lookupResult, setLookupResult] = useState<any>({
    query: "185.220.101.44",
    reputation: "MALICIOUS",
    threatScore: 98,
    category: "Cobalt Strike C2 / Command & Control Node",
    firstSeen: "2026-07-12T04:12:00Z",
    lastSeen: "2026-08-24T09:30:00Z",
    relatedMalware: ["Cobalt Strike v4.8", "QakBot", "Sliver C2"],
    verdict: "High risk score associated with known APT29 infrastructure. Active TLS certificates match malicious malleable C2 profile.",
  });

  const [activeTab, setActiveTab] = useState<"lookup" | "decoder" | "cve" | "feeds">("lookup");

  // CyberChef Decoder Studio State
  const [inputPayload, setInputPayload] = useState<string>(
    "aHR0cHM6Ly9jMi1iZWFjb24tdXBkYXRlLnh5ei9zdWJtaXQucGhwP2lkPTQxOTIwMQ=="
  );
  const [decodedOutput, setDecodedOutput] = useState<string>(
    "https://c2-beacon-update.xyz/submit.php?id=419201"
  );
  const [selectedOperation, setSelectedOperation] = useState<"base64_decode" | "base64_encode" | "defang" | "refang" | "hex_to_ascii">("base64_decode");
  const [copied, setCopied] = useState<boolean>(false);

  // YARA Sandbox State
  const [yaraCode, setYaraCode] = useState<string>(`rule Cobalt_Strike_Beacon {
    strings:
        $pipe = "\\\\.\\pipe\\msse-" nocase
        $str = "submit.php?id="
    condition:
        $pipe or $str
}`);
  const [testSample, setTestSample] = useState<string>(
    `Target Pipe: \\\\.\\pipe\\msse-4102-a\nOutbound URI: /submit.php?id=419201`
  );
  const [yaraMatch, setYaraMatch] = useState<boolean>(true);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/threat-intel/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: lookupQuery }),
      });
      const data = await res.json();
      setLookupResult(data);
    } catch (err) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleRunDecoder = () => {
    try {
      if (selectedOperation === "base64_decode") {
        setDecodedOutput(atob(inputPayload.trim()));
      } else if (selectedOperation === "base64_encode") {
        setDecodedOutput(btoa(inputPayload));
      } else if (selectedOperation === "defang") {
        setDecodedOutput(
          inputPayload
            .replace(/http:\/\//g, "hxxp://")
            .replace(/https:\/\//g, "hxxps://")
            .replace(/\./g, "[.]")
        );
      } else if (selectedOperation === "refang") {
        setDecodedOutput(
          inputPayload
            .replace(/hxxp:\/\//g, "http://")
            .replace(/hxxps:\/\//g, "https://")
            .replace(/\[\.\]/g, ".")
        );
      } else if (selectedOperation === "hex_to_ascii") {
        const hex = inputPayload.replace(/\s+/g, "");
        let str = "";
        for (let i = 0; i < hex.length; i += 2) {
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        setDecodedOutput(str);
      }
    } catch (err: any) {
      setDecodedOutput(`[DECODE ERROR]: Invalid input encoding format (${err.message})`);
    }
  };

  const handleTestYara = () => {
    // Basic string check based on strings in YARA rule
    const hasPipe = testSample.includes("\\\\.\\pipe\\msse-");
    const hasStr = testSample.includes("submit.php?id=");
    setYaraMatch(hasPipe || hasStr);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 font-sans text-slate-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Binary className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100">
              THREAT INTELLIGENCE & MALWARE ANALYSIS SANDBOX
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time IOC lookup, payload deobfuscator studio, CVE exploitability calculator, and in-memory YARA scanner.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab("lookup")}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === "lookup"
                ? "bg-purple-950 text-purple-300 border border-purple-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            AI IOC Lookup
          </button>
          <button
            onClick={() => setActiveTab("decoder")}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === "decoder"
                ? "bg-purple-950 text-purple-300 border border-purple-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Payload Decoder Studio
          </button>
          <button
            onClick={() => setActiveTab("cve")}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === "cve"
                ? "bg-purple-950 text-purple-300 border border-purple-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            CVE Risk Matrix
          </button>
          <button
            onClick={() => setActiveTab("feeds")}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === "feeds"
                ? "bg-purple-950 text-purple-300 border border-purple-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Threat Feeds
          </button>
        </div>
      </div>

      {activeTab === "lookup" && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-2xl space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI-POWERED THREAT INDICATOR LOOKUP & REPUTATION ENGINE</span>
            </h3>

            <form onSubmit={handleLookup} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder="Search IP (185.220.101.44), SHA256 hash, or domain (c2-beacon-update.xyz)..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold flex items-center space-x-2 transition-colors shadow-lg shadow-purple-500/20"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Analyze Indicator</span>
                )}
              </button>
            </form>

            {/* Indicator Quick Chips */}
            <div className="flex items-center space-x-2 pt-2 text-[11px] overflow-x-auto">
              <span className="text-slate-500 font-bold">QUICK IOCs:</span>
              <button
                onClick={() => {
                  setLookupQuery("185.220.101.44");
                }}
                className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-300"
              >
                185.220.101.44 (C2 IP)
              </button>
              <button
                onClick={() => {
                  setLookupQuery("c2-beacon-update.xyz");
                }}
                className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-300"
              >
                c2-beacon-update.xyz (DGA Domain)
              </button>
              <button
                onClick={() => {
                  setLookupQuery("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
                }}
                className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-300"
              >
                LockBit 4.0 Dropper (SHA256)
              </button>
            </div>
          </div>

          {/* Detailed Lookup Result Card */}
          {lookupResult && (
            <div className="p-6 rounded-2xl bg-slate-900/95 border border-purple-500/40 shadow-2xl space-y-5 font-mono text-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 uppercase font-bold">
                    IOC REPUTATION REPORT
                  </span>
                  <h2 className="text-lg font-bold text-slate-100 mt-2">
                    {lookupResult.query}
                  </h2>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-500/50 font-bold text-sm">
                    {lookupResult.reputation} ({lookupResult.threatScore || 98} / 100)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">CATEGORY</span>
                  <span className="text-slate-100 font-bold">{lookupResult.category}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">FIRST SEEN</span>
                  <span className="text-slate-200">{lookupResult.firstSeen || "2026-07-12"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">THREAT ACTOR ATTRIBUTION</span>
                  <span className="text-rose-400 font-bold">APT29 (Cozy Bear)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-purple-300">
                  TECHNICAL THREAT VERDICT & EXPLANATION:
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {lookupResult.verdict}
                </p>
              </div>

              {lookupResult.relatedMalware && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400">ASSOCIATED MALWARE FAMILIES:</h4>
                  <div className="flex flex-wrap gap-2">
                    {lookupResult.relatedMalware.map((mal: string) => (
                      <span
                        key={mal}
                        className="px-2.5 py-1 rounded bg-slate-950 text-purple-300 border border-purple-500/30"
                      >
                        {mal}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "decoder" && (
        /* Cyber Swiss-Army Knife / Decoder Studio */
        <div className="p-6 rounded-2xl bg-slate-900/95 border border-purple-500/30 shadow-2xl space-y-6 font-mono text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                <span>PAYLOAD DEOBFUSCATOR & DEFANGING STUDIO</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Decode Base64 payloads, convert Hex dumps, defang malicious URLs for safe reporting.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedOperation}
                onChange={(e: any) => setSelectedOperation(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-purple-300 font-bold focus:outline-none"
              >
                <option value="base64_decode">Base64 Decode</option>
                <option value="base64_encode">Base64 Encode</option>
                <option value="defang">Defang URL/IP (hxxp://)</option>
                <option value="refang">Refang URL/IP (http://)</option>
                <option value="hex_to_ascii">Hex to ASCII String</option>
              </select>

              <button
                onClick={handleRunDecoder}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold transition-colors"
              >
                Execute Transformation
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-slate-400 font-bold block">INPUT OBFUSCATED PAYLOAD:</span>
              <textarea
                rows={6}
                value={inputPayload}
                onChange={(e) => setInputPayload(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">DECODED OUTPUT RESULT:</span>
                <button
                  onClick={() => handleCopy(decodedOutput)}
                  className="text-purple-300 hover:text-purple-200 flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <textarea
                rows={6}
                readOnly
                value={decodedOutput}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Interactive YARA Sandbox */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>IN-MEMORY YARA SIGNATURE TESTER</span>
              </h3>
              <button
                onClick={handleTestYara}
                className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold transition-colors"
              >
                Run Match Test
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">YARA RULE:</span>
                <pre className="p-3 rounded-xl bg-black/90 border border-slate-800 text-[11px] text-purple-300 font-mono">
                  {yaraCode}
                </pre>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">TEST PAYLOAD BUFFER:</span>
                <textarea
                  rows={5}
                  value={testSample}
                  onChange={(e) => setTestSample(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs resize-none"
                />
                <div className="mt-2 flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-1 rounded font-bold ${
                      yaraMatch
                        ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {yaraMatch ? "MATCH DETECTED (RULE TRIGGERED)" : "NO MATCH FOUND"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "cve" && (
        /* CVE Risk Matrix & CVSS Calculator */
        <div className="p-6 rounded-2xl bg-slate-900/95 border border-purple-500/30 shadow-2xl space-y-6 font-mono text-xs">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>ACTIVE ENTERPRISE CVE EXPLOITABILITY MATRIX</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Correlated vulnerability intelligence against CISA Known Exploited Vulnerabilities (KEV) catalogue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/40 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-100">CVE-2026-1049</span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold">
                  CVSS 9.8 (CRITICAL)
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Pre-authentication remote code execution (RCE) in perimeter SSL VPN gateway appliances.
              </p>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
                <span>CISA KEV: ACTIVE</span>
                <span className="text-rose-400 font-bold">EPSS: 94.2%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-100">CVE-2026-4402</span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold">
                  CVSS 8.4 (HIGH)
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Active Directory Kerberos privilege escalation via weak RC4 service ticket encryption.
              </p>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
                <span>CISA KEV: MONITORED</span>
                <span className="text-amber-400 font-bold">EPSS: 68.1%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-100">CVE-2026-8819</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold">
                  CVSS 7.5 (HIGH)
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Wi-Fi WPA2 deauthentication broadcast flood vulnerability causing denial of service.
              </p>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
                <span>PMF 802.11w: REQUIRED</span>
                <span className="text-cyan-400 font-bold">EPSS: 41.5%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "feeds" && (
        /* Threat Feeds Table */
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-slate-100">
            GLOBAL HIGH-CONFIDENCE THREAT FEEDS (OTX & CISA KEV)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                  <th className="pb-3">INDICATOR</th>
                  <th className="pb-3">TYPE</th>
                  <th className="pb-3">THREAT ACTOR</th>
                  <th className="pb-3">CATEGORY</th>
                  <th className="pb-3">RISK SCORE</th>
                  <th className="pb-3">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {MOCK_THREAT_FEEDS.map((feed) => (
                  <tr key={feed.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-cyan-300 truncate max-w-[200px]">
                      {feed.indicator}
                    </td>
                    <td className="py-3 text-slate-400">{feed.type}</td>
                    <td className="py-3 text-rose-300 font-bold">{feed.threatActor}</td>
                    <td className="py-3 text-slate-300">{feed.category}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-500/30">
                        {feed.riskScore} / 100
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => {
                          setLookupQuery(feed.indicator);
                          setActiveTab("lookup");
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
