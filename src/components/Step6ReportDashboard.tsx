import React, { useState } from "react";
import { DiagnosticResult, ContactLead } from "../types";
import { generatePDFReport } from "../utils/pdfExporter";
import { PDFReportTemplate } from "./PDFReportTemplate";
import {
  ShieldCheck,
  Download,
  Share2,
  Calendar,
  ClipboardList,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Flame,
  ArrowLeft,
  Building,
  TrendingUp,
  Clock,
  Zap,
  Check,
  Building2,
  AlertOctagon,
  PhoneCall,
  CheckCircle,
  Info,
} from "lucide-react";

interface Step6Props {
  result: DiagnosticResult;
  contact: ContactLead;
  onReset: () => void;
}

export const Step6ReportDashboard: React.FC<Step6Props> = ({
  result,
  contact,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<"obligations" | "roadmap" | "pricing" | "budget" | "alerts">("obligations");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [currencyMode, setCurrencyMode] = useState<"ARS" | "USD">("ARS");

  // Selected tier state
  const [selectedTierId, setSelectedTierId] = useState<"basic" | "intermediate" | "integral">("integral");

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    await generatePDFReport(result, "pdf-report-template");
    setIsDownloadingPdf(false);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `Hola, solicito Primera Revisión Técnica para el Diagnóstico Compliance SST Vaca Muerta de *${result.profile.companyName}* (CUIT: ${result.profile.cuit}). Índice actual: ${result.compliancePercentage}%. Pases operadora target: ${result.profile.targetOperator}.`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* 0. AUTOMATED URGENCY BANNER (Factor Urgencia) */}
      {result.hasUrgentDeadlines && result.urgentDeadlineNotice && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5 shadow-md text-rose-950 animate-pulse">
          <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-extrabold text-sm uppercase text-rose-900 tracking-wider">
              Factor de Urgencia Detectado — Vencimiento Crítico Próximo
            </h4>
            <p className="text-xs text-rose-800 font-medium mt-0.5 leading-relaxed">
              {result.urgentDeadlineNotice}
            </p>
          </div>
          <button
            onClick={() => {
              setActiveTab("roadmap");
              setTimeout(() => {
                document.getElementById("tabs-section")?.scrollIntoView({ behavior: "smooth" });
              }, 50);
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shrink-0 cursor-pointer"
          >
            Ver Plan Express
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-500/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <ShieldCheck className="w-80 h-80 text-teal-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Diagnóstico Técnico | Vaca Muerta Compliance</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Informe Técnico SST: <span className="text-teal-400">{result.profile.companyName || "Empresa"}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Generado el {result.generatedAt} para atención de {contact.contactName} ({contact.email}).
            </p>
          </div>

          {/* Download PDF & WhatsApp Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-xl hover:shadow-teal-400/30 transition-all cursor-pointer text-sm"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingPdf ? "Generando PDF..." : "Descargar Informe PDF Oficial"}</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3.5 rounded-xl transition-all text-sm cursor-pointer border border-emerald-500/50"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards & Cost of Inaction Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliance Index KPI */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Índice SST</div>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {result.compliancePercentage}%
            </div>
            <div className="text-[11px] text-teal-600 font-semibold mt-0.5">
              {result.fulfilledCount} de {result.totalObligationsCount} cumplidas
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>

        {/* Target Operadora KPI */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operadora Target</div>
            <div className="text-sm font-bold text-slate-900 mt-1 truncate max-w-[140px]">
              {result.profile.targetOperator}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-0.5">
              Exigencia Homologación: 85%
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Dotación & Base KPI */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dotación / Base</div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {result.profile.staffTier.replace("_", " a ")} pers.
            </div>
            <div className="text-[11px] text-slate-500 truncate mt-0.5 max-w-[140px]">
              {result.profile.location}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Building className="w-6 h-6" />
          </div>
        </div>

        {/* Multa / Riesgo Estimado KPI */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/30 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-rose-700 uppercase tracking-wider">Riesgo Multa SRT</div>
            <div className="text-lg font-black text-rose-900 mt-1">
              ${(result.costOfInaction.srtFineMinARS / 1000000).toFixed(1)}M - ${(result.costOfInaction.srtFineMaxARS / 1000000).toFixed(1)}M
            </div>
            <div className="text-[11px] text-rose-600 font-semibold mt-0.5">
              + Inhabilitación Pases
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* VISUAL BENCHMARKING BLOCK */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <span>Benchmarking Visual de Compliance SST en Vaca Muerta</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparativa del índice de la empresa frente a la media del sector y las exigencias de operadoras (YPF / Vista / PAE / Shell).
            </p>
          </div>
          <span className="self-start sm:self-center text-xs font-extrabold px-3 py-1 rounded-full bg-slate-900 text-white">
            {result.benchmark.statusLabel}
          </span>
        </div>

        {/* Progress Gauges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          {/* Company Score */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex justify-between text-xs font-extrabold text-amber-900">
              <span>Su Empresa ({result.profile.companyName})</span>
              <span>{result.compliancePercentage}%</span>
            </div>
            <div className="w-full bg-amber-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${result.compliancePercentage}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-amber-800 font-semibold mt-1">
              Nivel de riesgo: {result.compliancePercentage < 60 ? "Alto (Inhabilitación)" : "Medio"}
            </div>
          </div>

          {/* Sector Average */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-extrabold text-slate-700">
              <span>Promedio Sector Vaca Muerta</span>
              <span>{result.benchmark.industryAverageScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-slate-600 h-full rounded-full"
                style={{ width: `${result.benchmark.industryAverageScore}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-1">
              Media estimada de Pymes en la cuenca
            </div>
          </div>

          {/* Operator Requirement */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <div className="flex justify-between text-xs font-extrabold text-rose-900">
              <span>Mínimo Operadoras (YPF/Vista)</span>
              <span>{result.benchmark.operatorRequiredScore}%</span>
            </div>
            <div className="w-full bg-rose-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-600 h-full rounded-full"
                style={{ width: `${result.benchmark.operatorRequiredScore}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-rose-700 font-semibold mt-1">
              Requisito excluyente de homologación
            </div>
          </div>

          {/* Target 90 Days */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex justify-between text-xs font-extrabold text-emerald-900">
              <span>Meta a 90 Días (Patagonia)</span>
              <span>{result.benchmark.target90DaysScore}%</span>
            </div>
            <div className="w-full bg-emerald-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${result.benchmark.target90DaysScore}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-1">
              Compliance Total & Homologado
            </div>
          </div>
        </div>
      </div>

      {/* COST OF INACTION CARD (Costo de No Hacer Nada) */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-rose-700/40 pb-3">
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <h3 className="font-extrabold text-base text-white tracking-wide">
              Análisis Cuantitativo del Riesgo: "Costo de No Hacer Nada"
            </h3>
          </div>
          <span className="text-xs font-bold text-rose-300 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800">
            Norma SRT 280/21 & Ley 25.212
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {result.costOfInaction.businessImpact}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-rose-950/60 border border-rose-800/60 p-3.5 rounded-xl">
            <div className="text-[11px] text-rose-300 font-bold uppercase">Multas SRT Acumulativas</div>
            <div className="text-xl font-black text-rose-200 mt-1">
              ${result.costOfInaction.srtFineMinARS.toLocaleString("es-AR")} a ${result.costOfInaction.srtFineMaxARS.toLocaleString("es-AR")} ARS
            </div>
            <div className="text-[10px] text-rose-400 mt-0.5">Sanciones por trabajador y por falta declarada</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700 p-3.5 rounded-xl">
            <div className="text-[11px] text-amber-300 font-bold uppercase">Pérdida por Lucro Cesante Estimada</div>
            <div className="text-xl font-black text-amber-200 mt-1">
              ~${result.costOfInaction.estimatedDailyLossARS.toLocaleString("es-AR")} ARS / día
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Costo por equipo, vehículo o servicio inhabilitado en yacimiento</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div id="tabs-section" className="flex border-b border-slate-200 space-x-2 sm:space-x-4 overflow-x-auto pb-1 scroll-mt-6">
        <button
          onClick={() => setActiveTab("obligations")}
          className={`flex items-center space-x-2 px-4 py-3 font-bold text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "obligations"
              ? "border-teal-500 text-teal-700 bg-teal-50/50 rounded-t-xl"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Obligaciones Legales ({result.obligations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("roadmap")}
          className={`flex items-center space-x-2 px-4 py-3 font-bold text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "roadmap"
              ? "border-teal-500 text-teal-700 bg-teal-50/50 rounded-t-xl"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Hoja de Ruta 90 Días</span>
        </button>

        <button
          onClick={() => setActiveTab("pricing")}
          className={`flex items-center space-x-2 px-4 py-3 font-bold text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "pricing"
              ? "border-teal-500 text-teal-700 bg-teal-50/50 rounded-t-xl"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Zap className="w-4 h-4 text-emerald-500" />
          <span>Cotizador Express & Escenarios</span>
        </button>

        <button
          onClick={() => setActiveTab("budget")}
          className={`flex items-center space-x-2 px-4 py-3 font-bold text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "budget"
              ? "border-teal-500 text-teal-700 bg-teal-50/50 rounded-t-xl"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Desglose de Servicios</span>
        </button>

        <button
          onClick={() => setActiveTab("alerts")}
          className={`flex items-center space-x-2 px-4 py-3 font-bold text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "alerts"
              ? "border-teal-500 text-teal-700 bg-teal-50/50 rounded-t-xl"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Alertas ({result.alerts.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: OBLIGATIONS */}
      {activeTab === "obligations" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
            {result.obligations.map((ob) => {
              const isDone = ob.status === "CUMPLIDO";
              const isCritical = ob.status === "REQUERIDO_CRITICO";

              return (
                <div key={ob.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isCritical
                          ? "bg-rose-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">
                            {ob.title}
                          </h3>
                          {ob.isExcluyenteYacimiento && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                              Excluyente Yacimiento
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                          Norma: <span className="font-semibold text-slate-700">{ob.norm}</span> | Frecuencia: {ob.frequency}
                        </div>
                      </div>
                    </div>

                    <span className={`self-start sm:self-center text-xs font-extrabold px-3 py-1 rounded-full border ${
                      isDone
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : isCritical
                        ? "bg-rose-50 text-rose-800 border-rose-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}>
                      [{ob.status}]
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 pl-9 leading-relaxed">
                    {ob.description}
                  </p>

                  {ob.isExcluyenteYacimiento && ob.excluyenteReason && (
                    <div className="ml-9 mt-2 p-2.5 bg-rose-50/80 border border-rose-200 rounded-xl text-xs text-rose-900 font-semibold flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Impacto comercial: {ob.excluyenteReason}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: 90-DAY ROADMAP */}
      {activeTab === "roadmap" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 border border-teal-500/20 text-xs font-semibold mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Plan de Trabajo Escalonado</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Hoja de Ruta de Regularización a 90 Días
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Planificación por etapas para pasar del {result.compliancePercentage}% actual al {result.benchmark.target90DaysScore}% de compliance total y lograr la homologación definitiva ante operadoras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.roadmap.map((phase) => (
              <div
                key={phase.phaseNumber}
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                  phase.isCriticalFirstStep
                    ? "bg-gradient-to-b from-amber-50/60 to-white border-amber-300 ring-2 ring-amber-400/30 shadow-md"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      {phase.monthLabel}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                      Meta: {phase.targetScore}%
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                    {phase.title}
                  </h4>

                  <ul className="space-y-2 text-xs text-slate-700">
                    {phase.milestones.map((m, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="text-[11px] text-slate-500 uppercase font-bold">Inversión Estimada Etapa:</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    A cotizar según alcance
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between text-teal-950 font-semibold text-xs sm:text-sm">
            <span>¿Desea iniciar la FASE 1 inmediata para regularizar pases en 15 días?</span>
            <button
              onClick={() => setActiveTab("pricing")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer text-xs"
            >
              Ver Escenarios de Contratación
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: PRICING TIERS & EXPRESS QUOTE */}
      {activeTab === "pricing" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-semibold mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Cotizador Express Transparente</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Escenarios de Contratación & Retorno de Inversión
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Elija la opción adecuada según el nivel de compliance actual de su empresa.
              </p>
            </div>

            {/* Currency Mode Switcher */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl self-start sm:self-center border border-slate-200">
              <span className="text-xs font-bold text-slate-600 px-2">Moneda:</span>
              <button
                type="button"
                onClick={() => setCurrencyMode("ARS")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currencyMode === "ARS"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                $ ARS
              </button>
              <button
                type="button"
                onClick={() => setCurrencyMode("USD")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currencyMode === "USD"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                USD (1:1.300)
              </button>
            </div>
          </div>

          {/* Pricing Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.pricingTiers.map((tier) => {
              const isSelected = selectedTierId === tier.id;

              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`p-6 rounded-2xl border-2 flex flex-col justify-between space-y-6 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-gradient-to-b from-teal-50/70 to-white border-teal-500 ring-2 ring-teal-500/30 shadow-xl scale-[1.02]"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {tier.recommendedFor}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-lg mt-2">
                          {tier.name}
                        </h4>
                      </div>

                      {tier.isPopular && (
                        <span className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-sm">
                          Recomendado
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                      {tier.subtitle}
                    </p>

                    {/* Pricing */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-xs text-slate-500 font-semibold">Retainer Mensual H&S:</div>
                      <div className="text-xl font-black text-slate-900 mt-0.5">
                        A cotizar <span className="text-xs text-slate-500 font-normal">/ según alcance</span>
                      </div>

                      {/* ART Savings Callout */}
                      <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-0.5">
                        <div className="flex justify-between font-bold">
                          <span>Optimizaciones / Beneficios:</span>
                          <span className="text-emerald-700">A definir según relevamiento</span>
                        </div>
                        <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-emerald-200/80">
                          <span>Propuesta Comercial:</span>
                          <span className="text-teal-700">A cotizar</span>
                        </div>
                      </div>
                    </div>

                    {/* Included Services */}
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Incluye:</div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {tier.includedServices.map((inc, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>Acondicionamiento Inicial:</span>
                      <span className="font-bold text-slate-800">
                        A cotizar
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendWhatsApp}
                      className={`w-full font-extrabold py-3 rounded-xl transition-all shadow-md text-xs cursor-pointer flex items-center justify-center space-x-2 ${
                        isSelected
                          ? "bg-slate-900 hover:bg-slate-800 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Solicitar {tier.name}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* INDEXATION CLAUSE NOTICE */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-3 text-xs text-slate-600">
            <Info className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-slate-800">Cláusula de Indexación & Transparencia:</span>{" "}
              {result.indexationClause}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: TECHNICAL SERVICES BREAKDOWN */}
      {activeTab === "budget" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Desglose Técnico de Servicios e Inversión Anualizada
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Detalle de cada uno de los estudios, mediciones y horas profesionales requeridas según la normativa aplicable.
            </p>
          </div>

          <div className="space-y-6">
            {["Servicio Mensual", "Estudios Técnicos y Mediciones", "Documentación Legal y Emergencia"].map((cat) => {
              const items = result.budgetItems.filter((i) => i.category === cat);
              if (items.length === 0) return null;

              return (
                <div key={cat} className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg">
                    {cat}
                  </h4>
                  <div className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-start justify-between gap-4">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{item.concept}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                        </div>
                        <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg shrink-0">
                          A cotizar
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between text-teal-950 font-extrabold text-sm sm:text-base">
            <span>PLAN DE TRABAJO Y PROPUESTA TÉCNICA:</span>
            <span className="text-teal-700 font-bold text-sm sm:text-base bg-teal-100 px-3.5 py-1.5 rounded-xl">
              A cotizar según alcance
            </span>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: ALERTS */}
      {activeTab === "alerts" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Calendario de Vencimientos y Alertas Regulatorias
          </h3>

          <div className="space-y-3">
            {result.alerts.map((al, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between space-x-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm shrink-0">
                    !
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{al.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Norma: {al.norm} | Frecuencia: {al.frequency}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500">Vence el</div>
                  <div className="text-sm font-extrabold text-slate-900">{al.dueDateStr}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FIRST REVISION SALES FUNNEL CARD */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-teal-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
              <PhoneCall className="w-3.5 h-3.5 text-teal-300" />
              <span>Paso Siguiente | Embudo de Venta & Primera Revisión</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Solicitar Primera Revisión Técnica en Base o Yacimiento
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Nuestros ingenieros en Higiene y Seguridad realizarán el relevamiento inicial de instalaciones y documentación para homologación ante <strong className="text-teal-300">{result.profile.targetOperator}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={handleSendWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all text-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Agendar Revisión vía WhatsApp</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3.5 rounded-xl border border-slate-700 transition-all text-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingPdf ? "Generando..." : "Descargar PDF"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Relevamiento presencial en Añelo / Neuquén</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Auditoría de requisitos excluyentes SRT</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Presupuesto a medida según alcance</span>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 font-bold px-5 py-2.5 rounded-xl transition-colors text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Realizar Nuevo Diagnóstico</span>
        </button>

        <div className="text-xs text-slate-500">
          Diagnóstico generado según legislación nacional de Argentina y provincia de Neuquén 2026.
        </div>
      </div>

      {/* OFFSCREEN PRINTABLE PDF TEMPLATE COMPONENT (Captured by html2canvas) */}
      <div style={{ position: "absolute", left: "-9999px", top: 0, overflow: "hidden" }}>
        <PDFReportTemplate result={result} id="pdf-report-template" />
      </div>
    </div>
  );
};
