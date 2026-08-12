import React from "react";
import { ComplianceSelfCheck } from "../types";
import {
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

interface Step4Props {
  selfCheck: ComplianceSelfCheck;
  onChangeSelfCheck: (updated: Partial<ComplianceSelfCheck>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface SelfCheckQuestion {
  key: keyof ComplianceSelfCheck;
  title: string;
  norm: string;
  detail: string;
}

const CHECKLIST_ITEMS: SelfCheckQuestion[] = [
  {
    key: "hasHSService",
    title: "1. ¿Cuenta con Servicio de Higiene y Seguridad activo (Profesional matriculado)?",
    norm: "Ley 19.587 / Res. SRT 1338/96",
    detail: "Servicio externo o interno con asignación mensual de horas profesionales y libro de actas rubricado.",
  },
  {
    key: "hasOccupationalMed",
    title: "2. ¿Posee Servicio de Medicina del Trabajo contratado?",
    norm: "Dec. 351/79 Cap. 3 / Res. SRT 905/15",
    detail: "Médico laboral a cargo de exámenes de aptitud de yacimiento y seguimiento de salud ocupacional.",
  },
  {
    key: "hasNoiseStudy",
    title: "3. ¿Tiene realizada la Medición de Ruido Ocupacional (Res. SRT 85/12) vigente?",
    norm: "Res. SRT 85/12",
    detail: "Protocolo oficial con dosimetrías individuales e informe de laboratorio del último año.",
  },
  {
    key: "hasLightingStudy",
    title: "4. ¿Cuenta con Medición de Niveles de Iluminación en Puestos (Res. SRT 84/12)?",
    norm: "Res. SRT 84/12",
    detail: "Luxometría en plano de trabajo con protocolo oficial SRT.",
  },
  {
    key: "hasGroundingProtocol",
    title: "5. ¿Posee la Medición de Puesta a Tierra y Continuidad Masas (Res. SRT 900/15)?",
    norm: "Res. SRT 900/15",
    detail: "Medición anual con Telurímetro certificado e informe de disparo de disyuntores.",
  },
  {
    key: "hasChemicalSampling",
    title: "6. ¿Realizó Muestreo de Contaminantes Químicos o Sílice en Aire (Res. SRT 861/15)?",
    norm: "Res. SRT 861/15",
    detail: "Análisis gravimétrico y cromatografía en zona de trabajo en los últimos 12 meses.",
  },
  {
    key: "hasPressureVesselsReg",
    title: "7. ¿Tiene habilitados los Recipientes a Presión / Calderas con Prueba Hidráulica?",
    norm: "Dec. 351/79 Art. 143",
    detail: "Registro provincial, ensayo por ultrasonido y calibración de válvulas de seguridad.",
  },
  {
    key: "hasMiperIper",
    title: "8. ¿Posee la Matriz de Riesgos por Puesto (MIPER/IPER) actualizada?",
    norm: "Dec. 351/79 / Estándar Operadoras",
    detail: "Identificación de peligros, evaluación de riesgos y controles para pases de yacimiento.",
  },
  {
    key: "hasEvacuationPlan",
    title: "9. ¿Tiene Plan de Evacuación / Autoprotección y Planos de Escape CAD?",
    norm: "Dec. 351/79 Cap. 18",
    detail: "Plan con simulacro anual registrado y planos aprobados por profesional.",
  },
  {
    key: "hasRgrl",
    title: "10. ¿Presentó el Relevamiento General de Riesgos Laborales (RGRL SRT 463/09)?",
    norm: "Res. SRT 463/09",
    detail: "Declaración jurada ante la ART presentada en el período correspondiente.",
  },
  {
    key: "hasAnnualTraining",
    title: "11. ¿Ejecuta un Plan Anual de Capacitación con planillas de asistencia registradas?",
    norm: "Dec. 351/79 Cap. 21",
    detail: "Registro continuo de firmas de capacitaciones en EPP, manejo defensivo, ergonomía y emergencias.",
  },
  {
    key: "hasErgonomicsStudy",
    title: "12. ¿Dispone del Estudio Ergonomía por Puesto de Trabajo (Res. SRT 886/15)?",
    norm: "Res. SRT 886/15",
    detail: "Planillas oficiales de evaluación de riesgos musculoesqueléticos en puestos operativos.",
  },
];

export const Step4CurrentStatus: React.FC<Step4Props> = ({
  selfCheck,
  onChangeSelfCheck,
  onNext,
  onBack,
}) => {
  const fulfilledCount = Object.values(selfCheck).filter(Boolean).length;
  const currentPercentage = Math.round((fulfilledCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold mb-3">
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>Paso 4 de 6 | Autoevaluación de Cumplimiento Actual</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ¿Con qué documentación y estudios cuenta actualmente?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Marque únicamente las obligaciones que su empresa tiene vigentes y aprobadas. Esto calculará su Índice Inicial de Compliance SST.
        </p>
      </div>

      {/* Compliance Live Badge */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl ${
            currentPercentage >= 80
              ? "bg-emerald-500 text-slate-950"
              : currentPercentage >= 50
              ? "bg-amber-500 text-slate-950"
              : "bg-rose-500 text-white"
          }`}>
            {currentPercentage}%
          </div>
          <div>
            <div className="text-base font-bold">Índice Estimado de Cumplimiento</div>
            <div className="text-xs text-slate-400">
              {fulfilledCount} de {CHECKLIST_ITEMS.length} requisitos legales base marcados como cumplidos
            </div>
          </div>
        </div>

        <div className="w-full sm:w-48 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full transition-all duration-300 ${
              currentPercentage >= 80
                ? "bg-emerald-500"
                : currentPercentage >= 50
                ? "bg-amber-500"
                : "bg-rose-500"
            }`}
            style={{ width: `${currentPercentage}%` }}
          />
        </div>
      </div>

      {/* Questions list */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
        {CHECKLIST_ITEMS.map((item) => {
          const isFulfilled = selfCheck[item.key];

          return (
            <div
              key={item.key}
              onClick={() => onChangeSelfCheck({ [item.key]: !isFulfilled })}
              className={`p-4 sm:p-5 cursor-pointer transition-colors flex items-start justify-between space-x-4 hover:bg-slate-50 ${
                isFulfilled ? "bg-emerald-50/40" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                  isFulfilled
                    ? "bg-emerald-500 text-white border-emerald-600"
                    : "bg-slate-100 text-slate-400 border-slate-300"
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {item.norm}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="shrink-0">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                  isFulfilled
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}>
                  {isFulfilled ? "CUMPLIDO" : "PENDIENTE"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 text-base cursor-pointer"
        >
          <span>Ir a Datos de Contacto</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
