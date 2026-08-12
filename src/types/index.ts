export type IndustryCategoryId =
  | "oil_gas_eandp"
  | "oilfield_services"
  | "construction_civil"
  | "transport_hazardous"
  | "maintenance_metal"
  | "catering_camps"
  | "commercial_supplies"
  | "health_medical_4x4";

export interface IndustryCategory {
  id: IndustryCategoryId;
  title: string;
  subtitle: string;
  description: string;
  applicableLaw: string;
  typicalOperators: string[];
  iconName: string;
  badgeText: string;
}

export type StaffTier = "1_10" | "11_50" | "51_150" | "151_500" | "gt_500";

export interface StaffTierInfo {
  id: StaffTier;
  label: string;
  workerCountApprox: number;
  hsHoursPerMonth: number;
  baseMonthlyFee: number;
}

export interface RiskScreening {
  chemicalExposure: boolean; // Químicos / Contaminantes (ámbito fractura, solventes, hidrocarburos, arena/sílice)
  heightWork: boolean; // Trabajo en altura (>1.8m, andamios, torres, tanques)
  electricalRisk: boolean; // Riesgo eléctrico (media/alta tensión, tableros en campo)
  ionizingRadiation: boolean; // Radiaciones ionizantes (gammagrafía de soldadura en ductos, perfilaje)
  confinedSpace: boolean; // Espacios confinados (tanques, piletas, separadores)
  intenseNoise: boolean; // Ruido intenso (>85 dBA)
  pressureVessels: boolean; // Aparatos a presión / Calderas / Launchers PIG
}

export interface CompanyProfile {
  companyName: string;
  tradeName: string;
  cuit: string;
  industryId: IndustryCategoryId;
  staffTier: StaffTier;
  location: string;
  coveredAreaM2: number;
  fireRisk: "BAJO" | "MEDIO" | "ALTO";
  targetOperator: string;
  needsHomologation?: boolean;
}

export interface ComplianceSelfCheck {
  hasHSService: boolean;
  hasOccupationalMed: boolean;
  hasNoiseStudy: boolean;
  hasLightingStudy: boolean;
  hasGroundingProtocol: boolean;
  hasChemicalSampling: boolean;
  hasPressureVesselsReg: boolean;
  hasMiperIper: boolean;
  hasEvacuationPlan: boolean;
  hasRgrl: boolean;
  hasAnnualTraining: boolean;
  hasErgonomicsStudy: boolean;
}

export interface ContactLead {
  contactName: string;
  role: string;
  email: string;
  phone: string;
  acceptedTerms: boolean;
}

export type ObligationStatus = "CUMPLIDO" | "PENDIENTE" | "REQUERIDO_CRITICO";

export interface ObligationItem {
  id: string;
  title: string;
  norm: string;
  frequency: string;
  description: string;
  status: ObligationStatus;
  isTriggered: boolean;
  riskCategory?: string;
  isExcluyenteYacimiento?: boolean;
  excluyenteReason?: string;
}

export interface BudgetItem {
  concept: string;
  description: string;
  amountARS: number;
  category: "Servicio Mensual" | "Estudios Técnicos y Mediciones" | "Documentación Legal y Emergencia";
}

export interface AlertDeadline {
  title: string;
  norm: string;
  frequency: string;
  dueDateStr: string;
  urgency: "CRITICO" | "ALTO" | "MEDIO";
}

export interface CostOfInaction {
  srtFineMinARS: number;
  srtFineMaxARS: number;
  fineReferenceNorm: string;
  businessImpact: string;
  estimatedDailyLossARS: number;
}

export interface BenchmarkData {
  companyScore: number;
  industryAverageScore: number;
  operatorRequiredScore: number;
  target90DaysScore: number;
  statusLabel: string;
}

export interface RoadmapPhase {
  phaseNumber: number;
  monthLabel: string;
  title: string;
  milestones: string[];
  estimatedCostARS: number;
  targetScore: number;
  isCriticalFirstStep?: boolean;
}

export interface PricingTier {
  id: "basic" | "intermediate" | "integral";
  name: string;
  subtitle: string;
  monthlyRetainerARS: number;
  monthlyRetainerUSD: number;
  setupFeeARS: number;
  setupFeeUSD: number;
  includedServices: string[];
  recommendedFor: string;
  isPopular?: boolean;
  netMonthlyCostARS: number;
  estimatedArtSavingsARS: number;
}

export interface DiagnosticResult {
  profile: CompanyProfile;
  risks: RiskScreening;
  compliancePercentage: number;
  fulfilledCount: number;
  totalObligationsCount: number;
  obligations: ObligationItem[];
  budgetItems: BudgetItem[];
  totalAnnualBudgetARS: number;
  alerts: AlertDeadline[];
  costOfInaction: CostOfInaction;
  benchmark: BenchmarkData;
  roadmap: RoadmapPhase[];
  pricingTiers: PricingTier[];
  hasUrgentDeadlines: boolean;
  urgentDeadlineNotice?: string;
  exchangeRateUSD: number;
  indexationClause: string;
  generatedAt: string;
}
