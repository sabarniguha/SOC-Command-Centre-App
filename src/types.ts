export type Severity = "Critical" | "High" | "Medium" | "Low";

export type IncidentStatus = "Open" | "Investigating" | "Contained" | "Closed";

export type AgentPersonaId = "commander" | "hunter" | "malware" | "forensics" | "responder" | "reporter";

export interface AgentPersona {
  id: AgentPersonaId;
  name: string;
  title: string;
  badge: string;
  avatar: string;
  description: string;
  color: string;
  capabilities: string[];
  systemRole: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  source: string;
  severity: Severity;
  mitreTechnique?: string;
}

export interface AttackGraphNode {
  id: string;
  label: string;
  type: "threat_actor" | "entry_point" | "host" | "process" | "domain_controller" | "c2_server" | "exfil_bucket";
  status: "compromised" | "vulnerable" | "clean" | "contained";
  ip?: string;
  os?: string;
  riskScore: number;
  details: string;
  x: number;
  y: number;
}

export interface AttackGraphLink {
  source: string;
  target: string;
  relationship: string;
  protocol: string;
  step: number;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  targetHost: string;
  ipAddress: string;
  timestamp: string;
  summary: string;
  mitreTactics: string[];
  mitreTechniques: string[];
  assignedAgent: AgentPersonaId;
  impactScore: number;
  attackGraphNodes: AttackGraphNode[];
  attackGraphLinks: AttackGraphLink[];
  timelineEvents: TimelineEvent[];
  rawLogs: string[];
  containmentPlaybook: {
    id: string;
    name: string;
    steps: { text: string; completed: boolean }[];
  };
}

export interface SOCMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  color: "cyan" | "emerald" | "amber" | "rose" | "purple";
  subtext: string;
}

export interface MitreTechnique {
  code: string;
  name: string;
  tactic: string;
  status: "active_detection" | "monitored" | "clean";
  severity: Severity;
  description: string;
  queryExample: string;
}

export interface SIEMLog {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  host: string;
  service: string;
  severity: Severity;
  eventCode: string;
  message: string;
  category: string;
  rawPayload: string;
}

export interface WiFiAccessPoint {
  bssid: string;
  ssid: string;
  channel: number;
  rssi: number;
  security: string;
  status: "rogue" | "trusted" | "deauth_attack";
  connectedDevices: number;
  riskScore: number;
  vendor: string;
}

export interface EndpointHost {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  type: "Workstation" | "Server" | "Domain Controller" | "Gateway";
  status: "healthy" | "vulnerable" | "compromised" | "isolated";
  agentVersion: string;
  vulnerabilitiesCount: number;
  lastSeen: string;
  cpuUsage: number;
  ramUsage: number;
}

export interface FirewallRule {
  id: string;
  priority: number;
  action: "ALLOW" | "DENY";
  source: string;
  destination: string;
  port: string;
  protocol: "TCP" | "UDP" | "ICMP" | "ANY";
  hitCount: number;
  createdBy: string;
  notes: string;
}

export interface ThreatFeedItem {
  id: string;
  indicator: string;
  type: "IP" | "Domain" | "SHA256" | "URL";
  threatActor: string;
  riskScore: number;
  category: string;
  dateAdded: string;
}
