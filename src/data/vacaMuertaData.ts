import { IndustryCategory, IndustryCategoryId, RiskScreening, StaffTierInfo } from "../types";

export function getDefaultRisksForIndustry(industryId: IndustryCategoryId): RiskScreening {
  switch (industryId) {
    case "transport_hazardous":
      return {
        chemicalExposure: false, // Solo si transportan sustancias peligrosas/químicos
        heightWork: false,       // Solo si suben a cisternas o bateas
        electricalRisk: false,   // Salvo mantenimiento eléctrico en base
        ionizingRadiation: false,
        confinedSpace: false,    // Salvo inspección interior de cisternas
        intenseNoise: true,      // Motores de camiones y ruido en ruta/playa
        pressureVessels: false,  // Salvo compresores de base o cisternas presurizadas
      };
    case "oil_gas_eandp":
      return {
        chemicalExposure: true,
        heightWork: true,
        electricalRisk: true,
        ionizingRadiation: false,
        confinedSpace: true,
        intenseNoise: true,
        pressureVessels: true,
      };
    case "oilfield_services":
      return {
        chemicalExposure: true,
        heightWork: true,
        electricalRisk: true,
        ionizingRadiation: true,
        confinedSpace: true,
        intenseNoise: true,
        pressureVessels: true,
      };
    case "construction_civil":
      return {
        chemicalExposure: false,
        heightWork: true,
        electricalRisk: true,
        ionizingRadiation: false,
        confinedSpace: false,
        intenseNoise: true,
        pressureVessels: false,
      };
    case "maintenance_metal":
      return {
        chemicalExposure: true,
        heightWork: false,
        electricalRisk: true,
        ionizingRadiation: false,
        confinedSpace: false,
        intenseNoise: true,
        pressureVessels: true,
      };
    case "catering_camps":
      return {
        chemicalExposure: false,
        heightWork: false,
        electricalRisk: true,
        ionizingRadiation: false,
        confinedSpace: false,
        intenseNoise: false,
        pressureVessels: false,
      };
    case "commercial_supplies":
      return {
        chemicalExposure: false,
        heightWork: false,
        electricalRisk: true,
        ionizingRadiation: false,
        confinedSpace: false,
        intenseNoise: false,
        pressureVessels: false,
      };
    case "health_medical_4x4":
      return {
        chemicalExposure: false,
        heightWork: false,
        electricalRisk: false,
        ionizingRadiation: false,
        confinedSpace: false,
        intenseNoise: false,
        pressureVessels: false,
      };
    default:
      return {
        chemicalExposure: false,
        heightWork: false,
        electricalRisk: true,
        ionizingRadiation: false,
        confinedSpace: false,
        intenseNoise: true,
        pressureVessels: false,
      };
  }
}

export const VACA_MUERTA_CATEGORIES: IndustryCategory[] = [
  {
    id: "oil_gas_eandp",
    title: "Petróleo & Gas (E&P)",
    subtitle: "Perforación, Completación, Fractura y DTM",
    description: "Operaciones en locación de pozo, rigs de perforación, sets de fractura hidráulica y montaje de instalaciones en yacimiento.",
    applicableLaw: "Ley 19.587, Dec. 351/79, Dec. 911/96, Res. SRT 1338/96, Normas YPF/Vista",
    typicalOperators: ["YPF", "Vista Energy", "Pan American Energy", "Shell", "Tecpetrol"],
    iconName: "Flame",
    badgeText: "Riesgo Muy Alto",
  },
  {
    id: "oilfield_services",
    title: "Servicios a la Industria Petrolera (OFS)",
    subtitle: "Mantenimiento de Pozos, Wireline, Coiled Tubing",
    description: "Servicios técnicos especializados de estimulación, cementación, ensayos de pozos, compresión de gas y logística operativa en campo.",
    applicableLaw: "Ley 19.587, Dec. 351/79, Res. SRT 905/15, Disposiciones Subsecretaría de Trabajo NQ",
    typicalOperators: ["Halliburton", "SLB (Schlumberger)", "Baker Hughes", "Weatherford", "Calfrac"],
    iconName: "Wrench",
    badgeText: "Riesgo Alto",
  },
  {
    id: "construction_civil",
    title: "Construcción & Obras Civiles",
    subtitle: "Ductos, Plateas, Caminos y Plantas (EPF/PTC)",
    description: "Obras de infraestructura, zanjado de oleoductos/gasoductos, movimiento de suelos, plateas para rigs y campamentos modulares.",
    applicableLaw: "Decreto 911/96 (Construcción), Res. SRT 231/96, Res. SRT 51/97, Ley 19.587",
    typicalOperators: ["Techint", "SACDE", "Contreras Hermanos", "AESA", "Pecom"],
    iconName: "HardHat",
    badgeText: "Dec. 911/96",
  },
  {
    id: "transport_hazardous",
    title: "Transporte & Logística Pesada",
    subtitle: "Cargas Peligrosas, Agua, Arena de Fractura y Crudo",
    description: "Flotas de camiones batea, cisternas de fluidos/agua, contenedores de arena sílica y transporte de equipos pesados por Rutas 7, 17 y Añelo.",
    applicableLaw: "Ley de Tránsito 24.449, Res. SRT 905/15, Exigencias Manejo Defensivo Operadoras",
    typicalOperators: ["Transportes Crexell", "Cruz del Sur", "Andreani", "Vientos del Sur"],
    iconName: "Truck",
    badgeText: "Ruta & Campo",
  },
  {
    id: "maintenance_metal",
    title: "Mantenimiento & Metalmecánica",
    subtitle: "Talleres de Soldadura, Válvulas y Tornería",
    description: "Talleres mecánicos, reparación de herramientas de perforación, soldadura de piping, ensayos no destructivos (END) y torneado pesado.",
    applicableLaw: "Ley 19.587, Dec. 351/79 Cap. 17, Res. SRT 900/15, Res. SRT 85/12",
    typicalOperators: ["AESA", "DLS Archer", "Tassaroli", "Metalúrgica Neuquén"],
    iconName: "Hammer",
    badgeText: "Taller & Yacimiento",
  },
  {
    id: "catering_camps",
    title: "Catering, Campamentos & Servicios",
    subtitle: "Comedores de Yacimiento, Housing Modular y Aseo",
    description: "Servicios gastronómicos en Base y Yacimiento, gestión de traileres habitales, potabilización de agua y tratamiento de efluentes sanitarios.",
    applicableLaw: "Decreto 351/79, Código Alimentario Argentino, Res. SRT 861/15, Bromatología NQ",
    typicalOperators: ["Sodexo", "Compass Group", "Catering Gourmet", "Cookins"],
    iconName: "Utensils",
    badgeText: "Campamentos",
  },
  {
    id: "commercial_supplies",
    title: "Comercial, Insumos & Suministros",
    subtitle: "Venta de Repuestos, EPP, Herramientas y Químicos",
    description: "Bases logísticas, showrooms y depósitos en Añelo, Parque Industrial Neuquén o Plaza Huincul para provisión a yacimientos.",
    applicableLaw: "Ley 19.587, Dec. 351/79 Cap. 18 (Incendio), Res. SRT 463/09 (RGRL)",
    typicalOperators: ["Proveedores Vaca Muerta", "Suministros Añelo", "EPP Patagonia"],
    iconName: "Store",
    badgeText: "Base Logística",
  },
  {
    id: "health_medical_4x4",
    title: "Salud, Servicios Médicos & Ambulancias 4x4",
    subtitle: "Enfermerías de Yacimiento y Cobertura UTIM 4x4",
    description: "Servicios de atención médica de emergencia en locación, ambulancias 4x4 equipadas para alta montaña/desierto y gestión de ausentismo.",
    applicableLaw: "Decreto 351/79 Cap. 3, Res. SRT 905/15, Ministerio de Salud de Neuquén",
    typicalOperators: ["Vital", "SIEM", "Medical Jet", "Clínica de la UOCRA / MHS"],
    iconName: "HeartPulse",
    badgeText: "Salud Ocupacional",
  },
];

export const STAFF_TIERS: StaffTierInfo[] = [
  {
    id: "1_10",
    label: "1 a 10 trabajadores",
    workerCountApprox: 8,
    hsHoursPerMonth: 8,
    baseMonthlyFee: 220000,
  },
  {
    id: "11_50",
    label: "11 a 50 trabajadores",
    workerCountApprox: 30,
    hsHoursPerMonth: 16,
    baseMonthlyFee: 350000,
  },
  {
    id: "51_150",
    label: "51 a 150 trabajadores",
    workerCountApprox: 100,
    hsHoursPerMonth: 25,
    baseMonthlyFee: 450000,
  },
  {
    id: "151_500",
    label: "151 a 500 trabajadores",
    workerCountApprox: 300,
    hsHoursPerMonth: 40,
    baseMonthlyFee: 680000,
  },
  {
    id: "gt_500",
    label: "Más de 500 trabajadores",
    workerCountApprox: 650,
    hsHoursPerMonth: 60,
    baseMonthlyFee: 980000,
  },
];

export const VACA_MUERTA_LOCATIONS = [
  "Añelo (Corazón de Vaca Muerta)",
  "Neuquén Capital / Parque Industrial PIN",
  "Plaza Huincul / Cutral Có",
  "Rincón de los Sauces",
  "San Patricio del Chañar",
  "Centenario / Plottier",
  "Allen / Río Negro (Alto Valle)",
  "Catriel / Medanito",
];

export const VACA_MUERTA_OPERATORS = [
  "YPF S.A.",
  "Vista Energy",
  "Pan American Energy (PAE)",
  "Shell Argentina",
  "Tecpetrol",
  "Chevron Argentina",
  "Pluspetrol",
  "Pampa Energía",
  "CGC / Phoenix Global Resources",
  "Otra Operadora / Contratista Principal",
];
