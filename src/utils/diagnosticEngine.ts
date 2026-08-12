import {
  CompanyProfile,
  RiskScreening,
  ComplianceSelfCheck,
  DiagnosticResult,
  ObligationItem,
  BudgetItem,
  AlertDeadline,
  CostOfInaction,
  BenchmarkData,
  RoadmapPhase,
  PricingTier,
} from "../types";
import { STAFF_TIERS, VACA_MUERTA_CATEGORIES } from "../data/vacaMuertaData";

export function calculateSSTDiagnostic(
  profile: CompanyProfile,
  risks: RiskScreening,
  selfCheck: ComplianceSelfCheck
): DiagnosticResult {
  const staffInfo = STAFF_TIERS.find((s) => s.id === profile.staffTier) || STAFF_TIERS[1];
  const industryCategory = VACA_MUERTA_CATEGORIES.find((c) => c.id === profile.industryId) || VACA_MUERTA_CATEGORIES[0];

  // Base Vaca Muerta Zone Multiplier (Patagonia +40% salary & oilfield specialized rates)
  const zoneMultiplier = 3.5;
  const isEandP = profile.industryId === "oil_gas_eandp" || profile.industryId === "oilfield_services";
  const isTransport = profile.industryId === "transport_hazardous";

  const obligations: ObligationItem[] = [];

  // 1. Servicio H&S (Decreto 1338/96)
  obligations.push({
    id: "hs_service",
    title: "1. Servicio de Higiene y Seguridad en el Trabajo (H&S)",
    norm: "Ley 19.587 Art. 5, Decreto 351/79 Cap. 4, Decreto 1338/96 y Res. SRT 905/15",
    frequency: "Mensual continuo",
    description: `Obligatorio para el establecimiento. Carga horaria profesional para Vaca Muerta: Asignación mínima de ${staffInfo.hsHoursPerMonth} a ${staffInfo.hsHoursPerMonth + 10} horas profesionales mensuales de un especialista matriculado.`,
    status: selfCheck.hasHSService ? "CUMPLIDO" : "REQUERIDO_CRITICO",
    isTriggered: true,
    isExcluyenteYacimiento: true,
    excluyenteReason: "Excluyente: Descalificación inmediata de pases en YPF/Vista si no hay profesional asignado.",
  });

  // 2. Servicio Medicina Laboral
  obligations.push({
    id: "occupational_med",
    title: "2. Servicio de Medicina del Trabajo",
    norm: "Decreto 351/79 Cap. 3, Decreto 1338/96 y Res. SRT 905/15",
    frequency: "Continuo / Eventual",
    description: "Asistencia de medicina laboral externa obligatoria para exámenes de aptitud de ingreso/periódicos para yacimiento, audiometrías y control de ausentismo.",
    status: selfCheck.hasOccupationalMed ? "CUMPLIDO" : "PENDIENTE",
    isTriggered: true,
  });

  // 3. Ruido Ocupacional
  obligations.push({
    id: "noise_study",
    title: "3. Evaluación y Medición de Ruido Ocupacional",
    norm: "Res. SRT 85/12",
    frequency: "Anual obligatoria",
    description: isTransport
      ? "Evaluación de dosis de ruido sonoro en cabina de choferes y playa de maniobras según protocolo homologado."
      : "Medición de nivel sonoro continuo equivalente (NSCE) de 8hs y dosimetrías individuales según protocolo oficial SRT.",
    status: selfCheck.hasNoiseStudy ? "CUMPLIDO" : risks.intenseNoise ? "REQUERIDO_CRITICO" : "PENDIENTE",
    isTriggered: true,
  });

  // 4. Iluminación
  obligations.push({
    id: "lighting_study",
    title: "4. Medición de Niveles de Iluminación en Puestos de Trabajo",
    norm: "Res. SRT 84/12",
    frequency: "Anual obligatoria",
    description: "Luxometría en plano de trabajo y áreas generales en base o taller para verificar concordancia con exigencias visuales y protocolo SRT.",
    status: selfCheck.hasLightingStudy ? "CUMPLIDO" : "PENDIENTE",
    isTriggered: true,
  });

  // 5. Puesta a tierra SRT 900/15
  obligations.push({
    id: "grounding_protocol",
    title: "5. Protocolo de Puesta a Tierra y Continuidad Eléctrica (Res. SRT 900/15)",
    norm: "Resolución SRT 900/15",
    frequency: "Anual obligatoria",
    description: "Medición de resistencia de jabalinas con telurímetro calibrado y continuidad de masas en tableros eléctricos de base/taller.",
    status: selfCheck.hasGroundingProtocol ? "CUMPLIDO" : risks.electricalRisk ? "REQUERIDO_CRITICO" : "PENDIENTE",
    isTriggered: true,
    isExcluyenteYacimiento: true,
    excluyenteReason: "Excluyente para auditorías de instalaciones en base operativa y talleres de mantenimiento.",
  });

  // 6. Contaminantes Químicos / Sílice SRT 861/15
  const isChemicalNeeded = risks.chemicalExposure || isEandP || profile.industryId === "maintenance_metal";
  obligations.push({
    id: "chemical_sampling",
    title: "6. Muestreo de Contaminantes Químicos en Aire (Res. SRT 861/15)",
    norm: "Res. SRT 861/15 & Res. 295/03",
    frequency: "Anual / Semestral según agente",
    description: isTransport
      ? "Evaluación de vapores/gases si se transportan cargas químicas o combustibles. (No aplica a transporte de cargas generales)."
      : "Medición de concentración de material particulado (sílice cristalina de arena de fractura), gases u vapores de hidrocarburos en aire según Res. 295/03.",
    status: selfCheck.hasChemicalSampling ? "CUMPLIDO" : isChemicalNeeded ? "REQUERIDO_CRITICO" : "PENDIENTE",
    isTriggered: isChemicalNeeded,
  });

  // 7. Aparatos a Presión / Calderas
  const isPressureNeeded = risks.pressureVessels || isEandP;
  obligations.push({
    id: "pressure_vessels",
    title: "7. Habilitación, Pruebas de Presión y Registro de Recipientes a Presión",
    norm: "Decreto 351/79 Art. 143 (y resoluciones Subsecretaría de Trabajo NQ)",
    frequency: "Anual obligatoria",
    description: isTransport
      ? "Pruebas de presión y calibración de válvulas en cisternas o tanques presurizados (solo si la flota cuenta con equipamiento a presión)."
      : "Prueba hidráulica, medición de espesores por ultrasonido y calibración de válvulas de seguridad en separadores, autoclaves y pulmones de aire.",
    status: selfCheck.hasPressureVesselsReg ? "CUMPLIDO" : isPressureNeeded ? "REQUERIDO_CRITICO" : "PENDIENTE",
    isTriggered: isPressureNeeded,
  });

  // Specific Transport Obligation
  if (isTransport) {
    obligations.push({
      id: "transport_defensive_driving",
      title: "Manejo Defensivo, Flota Petrolera y Habilitaciones LINTI / RUTA",
      norm: "Ley de Tránsito 24.449, Res. SRT 905/15 & Exigencias Operadoras YPF/Vista",
      frequency: "Continuo / Anual",
      description: "Capacitación obligatoria en manejo defensivo para rutas petroleras (Rutas 7, 17, Añelo), licencias LINTI/RUTA al día, monitoreo de velocidad por telemetría/GPS, control de fatiga y descansos.",
      status: selfCheck.hasAnnualTraining ? "CUMPLIDO" : "REQUERIDO_CRITICO",
      isTriggered: true,
      riskCategory: "Seguridad Vial y Transporte",
      isExcluyenteYacimiento: true,
      excluyenteReason: "Excluyente: Inhabilitación inmediata de choferes para ingresar a yacimiento si no acreditan curso de manejo defensivo.",
    });
  }

  // 8. Matriz de Riesgos MIPER/IPER
  obligations.push({
    id: "miper_iper",
    title: "8. Plan Preventivo y Matriz de Riesgos (MIPER / IPER)",
    norm: "Decreto 351/79 Art. 4 / Estándar Operadoras Vaca Muerta",
    frequency: "Anual u cada vez que se modifique un proceso",
    description: "Estudio de Riesgos por Puesto de Trabajo que define peligros identificados, nivel de riesgo y controles adoptados exigidos para pases de yacimiento.",
    status: selfCheck.hasMiperIper ? "CUMPLIDO" : "PENDIENTE",
    isTriggered: true,
    isExcluyenteYacimiento: true,
    excluyenteReason: "Excluyente: Requisito indispensable para carga de legajo y adjudicación de contratos en portales de operadoras.",
  });

  // 9. Plan Evacuación
  obligations.push({
    id: "evacuation_plan",
    title: "9. Plan de Evacuación y Autoprotección con Planos CAD",
    norm: "Decreto 351/79 Cap. 18 / Normativa Provincial Neuquén",
    frequency: "Anual con simulación práctica obligatoria",
    description: "Elaboración del plan de evacuación, simulación con personal de campo, designación de roles de brigada y planos de vías de escape homologados.",
    status: selfCheck.hasEvacuationPlan ? "CUMPLIDO" : "PENDIENTE",
    isTriggered: true,
    isExcluyenteYacimiento: true,
    excluyenteReason: "Excluyente para habilitación de base operativa y acceso a áreas de operadoras.",
  });

  // 10. RGRL SRT 463/09
  obligations.push({
    id: "rgrl",
    title: "10. Relevamiento General de Riesgos Laborales (RGRL)",
    norm: "Resolución SRT Nº 463/09",
    frequency: "Anual obligatoria (presentación formal)",
    description: "Declaración jurada anual ante la ART detallando el nivel de cumplimiento normativo del establecimiento en materia de higiene y seguridad.",
    status: selfCheck.hasRgrl ? "CUMPLIDO" : "REQUERIDO_CRITICO",
    isTriggered: true,
    isExcluyenteYacimiento: true,
    excluyenteReason: "Excluyente: Exigido en primera auditoría de ART y portal de la operadora.",
  });

  // 11. Plan Anual Capacitación
  obligations.push({
    id: "annual_training",
    title: "11. Plan Anual de Capacitación en Seguridad y Salud Ocupacional",
    norm: "Decreto 351/79 Art. 208-210 / Estándar YPF-Vista",
    frequency: "Anual continuo con registro de firmas y planillas oficiales",
    description: "Programa continuo de adiestramiento. Temas mínimos: uso de EPP, manejo defensivo en rutas petroleras, ergonomía, evacuación y riesgo hidrocarburífero.",
    status: selfCheck.hasAnnualTraining ? "CUMPLIDO" : "PENDIENTE",
    isTriggered: true,
  });

  // 12. Ergonomía SRT 886/15
  obligations.push({
    id: "ergonomics_study",
    title: "12. Estudio y Evaluación de Ergonomía Laboral (Res. SRT 886/15)",
    norm: "Resolución SRT 886/15",
    frequency: "Ante cambios de puesto o anual",
    description: "Protocolo obligatorio de ergonomía por puesto para evaluar trastornos musculoesqueléticos (levantamiento manual de cargas, posturas forzadas).",
    status: selfCheck.hasErgonomicsStudy ? "CUMPLIDO" : "PENDIENTE",
    isTriggered: true,
  });

  // 13. [Triggered] Trabajo en Altura
  if (risks.heightWork || profile.industryId === "construction_civil" || profile.industryId === "oil_gas_eandp") {
    obligations.push({
      id: "height_work_protocol",
      title: "13. Protocolo y Permiso de Trabajo Seguro en Altura (>1.80m)",
      norm: "Decreto 911/96 Art. 53-58 / Estándar Operadoras VM",
      frequency: "Continuo / Previo a cada maniobra",
      description: "Inspección de líneas de vida homologadas, arneses anticaídas con doble cabo, certificación de andamios y procedimiento de rescate.",
      status: "REQUERIDO_CRITICO",
      isTriggered: true,
      riskCategory: "Trabajo en Altura",
      isExcluyenteYacimiento: true,
      excluyenteReason: "Excluyente para trabajos en bateas, torres, tanques o estructuras.",
    });
  }

  // 14. [Triggered] Radiaciones Ionizantes
  if (risks.ionizingRadiation) {
    obligations.push({
      id: "radiation_protocol",
      title: "14. Protocolo de Radiaciones Ionizantes y Licencia ARN (Gammagrafía / Perfilaje)",
      norm: "Res. SRT 295/03 Anexo II / Ley 24.804 (Autoridad Regulatoria Nuclear)",
      frequency: "Mensual dosimetría / Licencia vigente",
      description: "Licencia de operación ARN para fuentes radiactivas, dosimetría personal mensual, delimitación de área y transporte seguro.",
      status: "REQUERIDO_CRITICO",
      isTriggered: true,
      riskCategory: "Radiaciones Ionizantes",
      isExcluyenteYacimiento: true,
      excluyenteReason: "Excluyente: Requiere habilitación ARN de la instalación.",
    });
  }

  // 15. [Triggered] Espacios Confinados
  if (risks.confinedSpace) {
    obligations.push({
      id: "confined_space_protocol",
      title: "15. Protocolo de Entrada a Espacios Confinados y Monitoreo de Atmósfera",
      norm: "Decreto 351/79 Cap. 17 / Normativa SRT Espacios Confinados",
      frequency: "Previo a cada ingreso a tanque / pileta",
      description: "Verificación de LEL, H2S, O2 y CO mediante explosímetro calibrado, vigía de superficie con sistema de rescate.",
      status: "REQUERIDO_CRITICO",
      isTriggered: true,
      riskCategory: "Espacios Confinados",
      isExcluyenteYacimiento: true,
      excluyenteReason: "Excluyente para limpieza e inspección de tanques y piletas de yacimiento.",
    });
  }

  // Calculate fulfillment stats
  const totalObligationsCount = obligations.length;
  const fulfilledCount = obligations.filter((o) => o.status === "CUMPLIDO").length;
  const rawPercentage = Math.round((fulfilledCount / totalObligationsCount) * 100);
  const compliancePercentage = Math.min(100, Math.max(0, rawPercentage));

  // Cost of Inaction Calculation
  const srtFineMinARS = 1850000;
  const srtFineMaxARS = 9200000;
  const estimatedDailyLossARS = Math.max(850000, staffInfo.workerCountApprox * 120000);
  const costOfInaction: CostOfInaction = {
    srtFineMinARS,
    srtFineMaxARS,
    fineReferenceNorm: "Resolución SRT 280/21 & Ley 25.212 Anexo II",
    businessImpact: `El incumplimiento del Servicio de H&S (Decreto 1338/96) y RGRL genera multas acumulativas de la SRT de hasta $9.2M+, posible clausura preventiva de instalaciones por la Subsecretaría de Trabajo y la inhabilitación inmediata para cotizar o ingresar con ${profile.targetOperator || "Operadoras de Vaca Muerta"}.`,
    estimatedDailyLossARS,
  };

  // Benchmark Data Calculation
  const benchmark: BenchmarkData = {
    companyScore: compliancePercentage,
    industryAverageScore: isTransport ? 52 : 48,
    operatorRequiredScore: 85,
    target90DaysScore: 95,
    statusLabel:
      compliancePercentage < 60
        ? "CRÍTICO — Riesgo Alto de Inhabilitación"
        : compliancePercentage < 80
        ? "OBSERVADO — Requiere Acondicionamiento"
        : "APTO PARA HOMOLOGACIÓN YACIMIENTO",
  };

  // Build Presupuesto Técnico Estimado
  const budgetItems: BudgetItem[] = [];

  // 1. Servicio Mensual
  const monthlyFeeBase = Math.round(staffInfo.baseMonthlyFee * zoneMultiplier);

  budgetItems.push({
    concept: `Servicio de H&S Integrado (${staffInfo.hsHoursPerMonth}hs profesionales mensuales, auditorías internas y capacitaciones)`,
    description: `Decreto 1338/96 - Tramo ${staffInfo.label} ($${monthlyFeeBase.toLocaleString("es-AR")}/mes) (Zona VM x3.5)`,
    amountARS: monthlyFeeBase * 12,
    category: "Servicio Mensual",
  });

  // 2. Estudios Técnicos y Mediciones de Campo
  budgetItems.push({
    concept: "Protocolo de Iluminación - Luxometría (Res. SRT 84/12)",
    description: "Tarifa básica 5 puntos de muestreo en base/taller ($12.000 por punto adicional) (Zona VM x3.5)",
    amountARS: 367500,
    category: "Estudios Técnicos y Mediciones",
  });

  budgetItems.push({
    concept: "Protocolo de Puesta a Tierra y Continuidad Masas (Res. SRT 900/15)",
    description: "Medición con Telurímetro calibrado - Tarifa base 2 jabalinas ($30.000 c/u adicional) (Zona VM x3.5)",
    amountARS: 542500,
    category: "Estudios Técnicos y Mediciones",
  });

  budgetItems.push({
    concept: isTransport
      ? "Protocolo de Medición de Ruido Ocupacional en Cabina y Flota (Res. SRT 85/12)"
      : "Protocolo de Medición de Ruido Ocupacional (Res. SRT 85/12)",
    description: isTransport
      ? "Evaluación de dosis de ruido en cabinas de camiones y playa de maniobras ($18.000 por unidad/puesto) (Zona VM x3.5)"
      : "Evaluación de dosis de ruido (dosimetrías) y mapa de ruido ($18.000 por punto) (Zona VM x3.5)",
    amountARS: 504000,
    category: "Estudios Técnicos y Mediciones",
  });

  budgetItems.push({
    concept: "Estudio de Carga de Fuego e Instalaciones de Extinción (Decreto 351/79 Cap 18)",
    description: "Cálculo de poder calórico de materiales en base/depósito y extintores vehiculares/base (Zona VM x3.5)",
    amountARS: 525000,
    category: "Estudios Técnicos y Mediciones",
  });

  if (isChemicalNeeded) {
    budgetItems.push({
      concept: "Estudio de Contaminantes en Aire - Protocolo Res. SRT 861/15",
      description: "Muestreo con bomba gravimétrica activa y análisis de laboratorio acreditado (Zona VM x3.5)",
      amountARS: 490000,
      category: "Estudios Técnicos y Mediciones",
    });
  }

  if (isPressureNeeded) {
    budgetItems.push({
      concept: "Habilitación y Pruebas de Recipientes a Presión (Dec. 351/79 Art. 143)",
      description: "Pruebas hidráulicas, espesores por ultrasonido y calibración de válvulas de seguridad (Zona VM x3.5)",
      amountARS: 520000,
      category: "Estudios Técnicos y Mediciones",
    });
  }

  if (isTransport) {
    budgetItems.push({
      concept: "Programa de Manejo Defensivo y Auditoría de Flota Petrolera (LINTI / GPS / Control Fatiga)",
      description: "Capacitación práctica en rutas petroleras (Ruta 7, 17, Añelo), control de tacógrafos y telemetría (Zona VM x3.5)",
      amountARS: 480000,
      category: "Estudios Técnicos y Mediciones",
    });

    budgetItems.push({
      concept: "Evaluación de Vibraciones Ocupacionales en Cuerpo Entero y Ergonomía en Cabina (Res. 295/03 & Res. 886/15)",
      description: "Acelerometría triaxial en asiento de choferes y evaluación ergonómica de larga distancia (Zona VM x3.5)",
      amountARS: 420000,
      category: "Documentación Legal y Emergencia",
    });
  }

  // 3. Documentación Legal, Emergencia y Homologación
  budgetItems.push({
    concept: isTransport
      ? "Plan de Evacuación en Base y Plan de Contingencias en Ruta / Derrames"
      : "Confección de Plan de Evacuación y Autoprotección (con Planos de Vías de Escape)",
    description: isTransport
      ? "Procedimientos de emergencia en travesía, protocolo de llamada ante incidentes viales y diagramación CAD de base (Zona VM x3.5)"
      : "Elaboración teórica, diagramación CAD, y firma de encomienda profesional por Licenciado habilitado (Zona VM x3.5)",
    amountARS: 420000,
    category: "Documentación Legal y Emergencia",
  });

  if (!isTransport) {
    budgetItems.push({
      concept: "Estudio de Ergonomía Integrado por Puesto de Trabajo (Res. SRT 886/15)",
      description: "Evaluaciones ergonómicas por puesto (Planillas oficiales, método REBA/OWAS/NIOSH) (Zona VM x3.5)",
      amountARS: 455000,
      category: "Documentación Legal y Emergencia",
    });
  }

  if (profile.needsHomologation ?? true) {
    budgetItems.push({
      concept: `Paquete Homologación Express y Carga de Legajo en Portales (${profile.targetOperator || "Operadoras VM"})`,
      description: "Armado de carpeta técnica HSE, carga en SICOP / Control Tower, matriz IPER y seguimiento hasta aprobación de pases.",
      amountARS: 380000,
      category: "Documentación Legal y Emergencia",
    });
  }

  const totalAnnualBudgetARS = budgetItems.reduce((acc, item) => acc + item.amountARS, 0);

  // 90-Day Roadmap Calculation
  const roadmap: RoadmapPhase[] = [
    {
      phaseNumber: 1,
      monthLabel: "Mes 1 (Días 1 a 30)",
      title: "Regularización Crítica & Habilitación Inmediata de Pases",
      milestones: [
        "Asignación oficial de Profesional de H&S matriculado (Decreto 1338/96)",
        "Presentación e inscripción de RGRL (Res. SRT 463/09) ante ART",
        "Confección de Matriz de Riesgo IPER / MIPER y legajo inicial",
        profile.needsHomologation ? `Carga inicial de legajo en portal de ${profile.targetOperator || "Operadora"}` : "Alta de libro de actas digital de H&S",
      ],
      estimatedCostARS: monthlyFeeBase + (profile.needsHomologation ? 380000 : 0),
      targetScore: Math.min(80, Math.max(compliancePercentage + 30, 75)),
      isCriticalFirstStep: true,
    },
    {
      phaseNumber: 2,
      monthLabel: "Mes 2 (Días 31 a 60)",
      title: "Mediciones Ambientales de Campo y Protocolos Oficiales",
      milestones: [
        "Medición de Ruido Ocupacional (Res. SRT 85/12) y Puesta a Tierra (Res. SRT 900/15)",
        "Confección e implementación de Plan de Evacuación / Contingencia en Ruta",
        isTransport ? "Evaluación de Vibraciones y Ergonomía en Cabina" : "Estudio de Ergonomía Laboral (Res. SRT 886/15)",
      ],
      estimatedCostARS: 1450000,
      targetScore: 88,
    },
    {
      phaseNumber: 3,
      monthLabel: "Mes 3 (Días 61 a 90)",
      title: "Capacitaciones de Campo, Auditoría Final & Compliance 90%+",
      milestones: [
        "Ejecución de Plan Anual de Capacitación y Manejo Defensivo en Rutas Petroleras",
        "Auditoría interna pre-inspección de la Subsecretaría de Trabajo / Operadora",
        "Emisión de Certificado de Conformidad H&S Patagonia Consult SRL (Puntaje 90%+)",
      ],
      estimatedCostARS: monthlyFeeBase,
      targetScore: 95,
    },
  ];

  // Escenarios de Contratación (Pricing Tiers)
  const exchangeRateUSD = 1300;
  const pricingTiers: PricingTier[] = [
    {
      id: "basic",
      name: "Plan Básico (Mantenimiento H&S)",
      subtitle: "Para empresas estructuradas (Compliance >70%) que buscan cubrir asignación horaria legal",
      monthlyRetainerARS: monthlyFeeBase,
      monthlyRetainerUSD: Math.round(monthlyFeeBase / exchangeRateUSD),
      setupFeeARS: 180000,
      setupFeeUSD: Math.round(180000 / exchangeRateUSD),
      includedServices: [
        `Asignación horaria profesional de H&S (${staffInfo.hsHoursPerMonth}hs/mes - Dec. 1338/96)`,
        "Presentación anual del RGRL (Res. SRT 463/09) ante ART",
        "Asesoramiento legal preventivo ante inspecciones SRT",
        "Apertura de Libro de Actas de H&S digitalizado",
      ],
      recommendedFor: "Compliance > 70%",
      estimatedArtSavingsARS: Math.round(monthlyFeeBase * 0.25),
      netMonthlyCostARS: Math.round(monthlyFeeBase * 0.75),
    },
    {
      id: "intermediate",
      name: "Plan Intermedio (Regularización Acelerada)",
      subtitle: "Ideal para empresas con compliance entre 50% y 70% que requieren mediciones de campo",
      monthlyRetainerARS: Math.round(monthlyFeeBase * 1.35),
      monthlyRetainerUSD: Math.round((monthlyFeeBase * 1.35) / exchangeRateUSD),
      setupFeeARS: 320000,
      setupFeeUSD: Math.round(320000 / exchangeRateUSD),
      includedServices: [
        "Todo lo incluido en el Plan Básico",
        "Protocolo Anual de Ruido Ocupacional (Res. SRT 85/12) bonificado",
        "Protocolo de Puesta a Tierra (Res. SRT 900/15) bonificado",
        "Plan de Evacuación y Autoprotección con Planos CAD",
        "Plan Anual de Capacitación con certificados oficiales",
      ],
      recommendedFor: "Compliance 50% - 70%",
      estimatedArtSavingsARS: Math.round(monthlyFeeBase * 0.35),
      netMonthlyCostARS: Math.round(monthlyFeeBase * 1.0),
    },
    {
      id: "integral",
      name: "Plan Integral Vaca Muerta (Homologación Yacimiento)",
      subtitle: "Recomendado para empresas con compliance <50% o ingreso urgente a YPF, Vista, PAE o Shell",
      monthlyRetainerARS: Math.round(monthlyFeeBase * 1.7),
      monthlyRetainerUSD: Math.round((monthlyFeeBase * 1.7) / exchangeRateUSD),
      setupFeeARS: 480000,
      setupFeeUSD: Math.round(480000 / exchangeRateUSD),
      includedServices: [
        "Todo lo incluido en los Planes Básico e Intermedio",
        `Paquete Homologación Express en Portales (${profile.targetOperator || "YPF/Vista"})`,
        "Carga y seguimiento continuo de legajo en SICOP / Control Tower",
        isTransport ? "Programa de Manejo Defensivo y Auditoría de Flota Petrolera" : "Estudio de Ergonomía Integrado (Res. SRT 886/15)",
        "Atención prioritaria presencial ante auditorías de operadora o Subsecretaría de Trabajo",
        "Certificación de Compliance H&S al alcanzar el 90%",
      ],
      recommendedFor: "Compliance < 50% / Ingreso Yacimiento",
      isPopular: true,
      estimatedArtSavingsARS: Math.round(monthlyFeeBase * 0.45),
      netMonthlyCostARS: Math.round(monthlyFeeBase * 1.25),
    },
  ];

  // Calendar of Deadlines and Alerts
  const currentYear = new Date().getFullYear();
  const hasUrgentDeadlines = compliancePercentage < 60 || !selfCheck.hasRgrl || !selfCheck.hasHSService;
  const urgentDeadlineNotice = hasUrgentDeadlines
    ? "⚠️ ATENCIÓN URGENTE: Su establecimiento registra faltas de presentación críticas (RGRL / Servicio H&S). Active el Plan de Regularización 15 Días para evitar bloqueos de pases o sanciones."
    : undefined;

  const alerts: AlertDeadline[] = [
    {
      title: "Presentación del Relevamiento General de Riesgos Laborales (RGRL)",
      norm: "Resolución SRT 463/09",
      frequency: "Anual obligatoria",
      dueDateStr: `27/8/${currentYear}`,
      urgency: "CRITICO",
    },
    {
      title: "Medición de Puesta a Tierra y Continuidad Masas (Res. SRT 900/15)",
      norm: "Resolución SRT 900/15",
      frequency: "Anual obligatoria",
      dueDateStr: `11/9/${currentYear}`,
      urgency: "ALTO",
    },
  ];

  if (isTransport) {
    alerts.push(
      {
        title: "Renovación Anual de Capacitación en Manejo Defensivo en Rutas Petroleras",
        norm: "Res. SRT 905/15 & Exigencia Operadoras",
        frequency: "Anual obligatoria",
        dueDateStr: `15/9/${currentYear}`,
        urgency: "CRITICO",
      },
      {
        title: "Auditoría de Psicotécnicos, Exámenes Periódicos y Licencias LINTI / RUTA",
        norm: "Ley de Tránsito 24.449",
        frequency: "Semestral / Anual",
        dueDateStr: `30/10/${currentYear}`,
        urgency: "ALTO",
      }
    );
  } else {
    alerts.push(
      {
        title: "Medición Anual de Iluminación en Planta/Oficinas (Res. SRT 84/12)",
        norm: "Resolución SRT 84/12",
        frequency: "Anual obligatoria",
        dueDateStr: `11/10/${currentYear}`,
        urgency: "MEDIO",
      },
      {
        title: "Medición Anual de Exposición a Ruido (Res. SRT 85/12)",
        norm: "Resolución SRT 85/12",
        frequency: "Anual obligatoria",
        dueDateStr: `26/9/${currentYear}`,
        urgency: "ALTO",
      }
    );
  }

  alerts.push({
    title: "Impartir Plan Anual de Capacitación en Prevención de Riesgos",
    norm: "Decreto 351/79 Cap. 21",
    frequency: "Anual obligatoria",
    dueDateStr: `12/8/${currentYear}`,
    urgency: "CRITICO",
  });

  return {
    profile,
    risks,
    compliancePercentage,
    fulfilledCount,
    totalObligationsCount,
    obligations,
    budgetItems,
    totalAnnualBudgetARS,
    alerts,
    costOfInaction,
    benchmark,
    roadmap,
    pricingTiers,
    hasUrgentDeadlines,
    urgentDeadlineNotice,
    exchangeRateUSD,
    indexationClause: "Tarifas sujetas a actualización trimestral por índice de aranceles profesionales COPAIPA/SRT y variación IPC.",
    generatedAt: new Date().toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  };
}
