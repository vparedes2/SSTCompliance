import React, { useState } from "react";
import { ContactLead, CompanyProfile, ComplianceSelfCheck, DiagnosticResult } from "../types";
import {
  Mail,
  Phone,
  User,
  Briefcase,
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  TriangleAlert,
  AlertOctagon,
  Send,
  MessageSquare,
  TrendingDown,
  Video,
  PhoneCall,
} from "lucide-react";

interface Step5Props {
  contact: ContactLead;
  profile: CompanyProfile;
  selfCheck: ComplianceSelfCheck;
  diagnosticResult: DiagnosticResult;
  onChangeContact: (updated: Partial<ContactLead>) => void;
  onSubmitLead: () => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

interface ItemDef {
  key: keyof ComplianceSelfCheck;
  title: string;
  risk: string;
}

const ALL_ITEMS: ItemDef[] = [
  { key: "hasHSService", title: "Servicio de H&S Matriculado", risk: "Inhabilitación inmediata y clausura de operaciones" },
  { key: "hasOccupationalMed", title: "Medicina del Trabajo", risk: "Rechazo de aptitudes médicas para pase de yacimiento" },
  { key: "hasNoiseStudy", title: "Medición de Ruido Ocupacional", risk: "Demandas por hipoacusia y multas de la SRT" },
  { key: "hasLightingStudy", title: "Medición de Iluminación", risk: "Observaciones y demoras en auditorías de operadora" },
  { key: "hasGroundingProtocol", title: "Puesta a Tierra y Masas", risk: "Riesgo de electrocución y paralización de base" },
  { key: "hasChemicalSampling", title: "Muestreo Químico / Sílice", risk: "Rechazo en auditorías de yacimiento YPF/Vista" },
  { key: "hasPressureVesselsReg", title: "Aparatos a Presión / Calderas", risk: "Inhabilitación de equipos operativos en pozo" },
  { key: "hasMiperIper", title: "Matriz MIPER / IPER", risk: "Suspensión de pases de trabajo seguro" },
  { key: "hasEvacuationPlan", title: "Plan de Evacuación", risk: "Sanciones por falta de plan de emergencia" },
  { key: "hasRgrl", title: "RGRL ante la ART", risk: "Recargo de alícuotas y sanciones administrativas" },
  { key: "hasAnnualTraining", title: "Capacitaciones Anuales", risk: "Falta de firmas en legajos ante inspección" },
  { key: "hasErgonomicsStudy", title: "Estudio de Ergonomía", risk: "Demandas por trastornos musculoesqueléticos" },
];

export const Step5LeadCapture: React.FC<Step5Props> = ({
  contact,
  profile,
  selfCheck,
  onChangeContact,
  onSubmitLead,
  onBack,
  isSubmitting,
}) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Calculate real score %
  const fulfilledCount = Object.values(selfCheck).filter(Boolean).length;
  const scorePercent = Math.round((fulfilledCount / ALL_ITEMS.length) * 100);

  // Status mapping
  let statusBadge = {
    label: "Crítico — Riesgo Alto de Inhabilitación",
    color: "bg-rose-500 text-white border-rose-600",
  };
  if (scorePercent >= 85) {
    statusBadge = {
      label: "Casi Habilitado",
      color: "bg-emerald-500 text-slate-950 border-emerald-600",
    };
  } else if (scorePercent >= 70) {
    statusBadge = {
      label: "Ajustes Menores",
      color: "bg-teal-500 text-slate-950 border-teal-600",
    };
  } else if (scorePercent >= 50) {
    statusBadge = {
      label: "Regularización Urgente",
      color: "bg-amber-500 text-slate-950 border-amber-600",
    };
  }

  // Top 3 critical gaps (items marked false)
  const pendingGaps = ALL_ITEMS.filter((item) => !selfCheck[item.key]);
  const top3Gaps = pendingGaps.slice(0, 3);

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hola, realicé el autodiagnóstico de Compliance SST para *${profile.companyName || "mi empresa"}* (CUIT: ${profile.cuit || "no especificado"}). Obtuvimos un resultado preliminar del *${scorePercent}%*. Quisiera hablar con un especialista y coordinar la presentación del informe técnico completo.`
    );
    window.open(`https://wa.me/5492994109533?text=${text}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.contactName.trim()) {
      setErrorMsg("Por favor ingrese su Nombre y Apellido.");
      return;
    }
    if (!contact.email.trim() || !contact.email.includes("@")) {
      setErrorMsg("Por favor ingrese un correo electrónico corporativo válido.");
      return;
    }
    if (!contact.phone.trim()) {
      setErrorMsg("Por favor ingrese su número de teléfono o WhatsApp.");
      return;
    }
    setErrorMsg("");
    await onSubmitLead();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-16 h-16 bg-emerald-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          ¡Solicitud Recibida con Éxito!
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto">
          Un especialista senior de <strong className="text-slate-900">Patagonia Consult SRL</strong> revisará los datos de <span className="font-bold text-teal-700">{profile.companyName}</span> y se pondrá en contacto a la brevedad mediante <span className="font-bold">{contact.preferredContactMethod || "el medio indicado"}</span> para presentarte el Informe Técnico Reservado.
        </p>

        <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 text-left space-y-2">
          <div className="text-xs text-slate-400 font-mono">RESUMEN DE SOLICITUD</div>
          <div className="text-sm font-bold text-teal-400">{profile.companyName} ({scorePercent}% Compliance)</div>
          <div className="text-xs text-slate-300">Solicitante: {contact.contactName} ({contact.email} | {contact.phone})</div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleWhatsAppDirect}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all text-sm cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Hablar ahora por WhatsApp (+54 9 299 4109533)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Paso 5 de 5 | Resultado Preliminar + Contacto</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Resultado Preliminar de Compliance SST
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Basado en tus respuestas. El informe técnico completo con normativa, frecuencias y plan de regularización se presenta en una videollamada personalizada.
        </p>
      </div>

      {/* Main Score & Status Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          {/* Circular Score Display */}
          <div className="flex items-center space-x-6">
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="10"
                  className={
                    scorePercent >= 80
                      ? "text-emerald-400"
                      : scorePercent >= 50
                      ? "text-amber-400"
                      : "text-rose-500"
                  }
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - scorePercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black tracking-tight">{scorePercent}%</span>
                <span className="text-[10px] uppercase text-slate-400 font-bold">Índice</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-1">
                Estado Estimado de Regularidad
              </div>
              <div className={`inline-block text-xs font-bold px-3 py-1.5 rounded-xl border ${statusBadge.color}`}>
                {statusBadge.label}
              </div>
              <div className="text-xs text-slate-300 mt-2">
                Empresa: <strong className="text-white">{profile.companyName || "Sin especificar"}</strong>
              </div>
              <div className="text-xs text-slate-400">
                Operadora Target: <span className="text-teal-400 font-semibold">{profile.targetOperator}</span>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp CTA Button */}
          <div className="w-full md:w-auto text-center md:text-right">
            <button
              type="button"
              onClick={handleWhatsAppDirect}
              className="w-full md:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all text-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950" />
              <span>Hablar con un especialista</span>
            </button>
            <p className="text-[11px] text-slate-400 mt-1.5">Atención directa Vaca Muerta</p>
          </div>
        </div>

        {/* Financial Impact Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 flex items-start space-x-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-slate-400 font-medium">Sanciones Económicas Potenciales SRT</div>
              <div className="text-base font-extrabold text-rose-300">USD 1.200 a USD 6.000</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Aprox. $1.850.000 a $9.200.000 ARS (TC: $1.530/USD)</div>
            </div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 flex items-start space-x-3">
            <TrendingDown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-slate-400 font-medium">Lucro Cesante Estimado por Inhabilitación</div>
              <div className="text-base font-extrabold text-amber-300">~USD 7.800 / día</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Aprox. $12.000.000 ARS/día por cuadrilla paralizada en yacimiento (TC: $1.530/USD)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Critical Gaps */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <TriangleAlert className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-slate-900">
            Top 3 Brechas Críticas Detectadas
          </h3>
        </div>

        {top3Gaps.length === 0 ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-sm flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Excelente nivel inicial. Ha indicado cumplimiento en la totalidad de los ítems base autoevaluados. Recomendamos validación presencial en base.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {top3Gaps.map((gap, idx) => (
              <div
                key={gap.key}
                className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-start space-x-3 text-sm"
              >
                <div className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <span className="font-bold text-slate-900">{gap.title}</span>
                  <span className="text-slate-400 font-semibold mx-1.5">—</span>
                  <span className="text-rose-700 font-medium">Riesgo: {gap.risk}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 12-Item Visual Checklist Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            Resumen Visual de Requisitos Evaluados
          </h3>
          <span className="text-xs text-slate-500">
            {fulfilledCount} de {ALL_ITEMS.length} cumplidos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {ALL_ITEMS.map((item) => {
            const isFulfilled = selfCheck[item.key];
            return (
              <div
                key={item.key}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                  isFulfilled
                    ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <span className="truncate pr-2">{item.title}</span>
                {isFulfilled ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Form for Full Reserved Report */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Solicitar Informe Técnico Completo y Agendar Presentación
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Reciba la documentación detallada con citas normativas, cuadro de frecuencias de renovación y propuesta técnica para su empresa.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Nombre y Apellido <span className="text-teal-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Ej: Juan Pérez"
                  value={contact.contactName}
                  onChange={(e) => onChangeContact({ contactName: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Email Corporativo <span className="text-teal-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="ejemplo@empresa.com"
                  value={contact.email}
                  onChange={(e) => onChangeContact({ email: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Teléfono / WhatsApp <span className="text-teal-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  required
                  placeholder="+54 9 299 1234567"
                  value={contact.phone}
                  onChange={(e) => onChangeContact({ phone: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Cargo o Función
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Ej: Gerente de HSEQ / Apoderado"
                  value={contact.role}
                  onChange={(e) => onChangeContact({ role: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Preferencia de Contacto
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
                { id: "phone", label: "Llamada", icon: PhoneCall },
                { id: "videocall", label: "Videollamada", icon: Video },
              ].map((m) => {
                const IconC = m.icon;
                const isSel = contact.preferredContactMethod === m.id || (!contact.preferredContactMethod && m.id === "videocall");
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onChangeContact({ preferredContactMethod: m.id as any })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      isSel
                        ? "bg-teal-500 text-slate-950 border-teal-400 shadow-md"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    <IconC className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold py-4 px-8 rounded-2xl shadow-xl hover:shadow-teal-500/20 transition-all text-sm sm:text-base cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Procesando Solicitud...</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Solicitar informe técnico completo y agendar presentación</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed italic border-t border-slate-800/80 pt-4">
          El informe técnico completo con normativa aplicable, calendario de vencimientos y propuesta comercial se entrega exclusivamente tras contacto con un especialista de Patagonia Consult SRL.
        </p>
      </div>

      {/* Back Button */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition-colors text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Autoevaluación</span>
        </button>
      </div>
    </div>
  );
};
