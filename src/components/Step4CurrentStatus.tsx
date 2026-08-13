import React from "react";
import { ComplianceSelfCheck } from "../types";
import {
  Check,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  ShieldCheck,
  HelpCircle,
  CheckSquare,
  Square,
  Info,
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
    title: "1. ¿Cuenta con un profesional de Higiene y Seguridad matriculado asignado a la empresa?",
    norm: "",
    detail: "Servicio externo o interno con asignación mensual de horas profesionales y registro de actividades.",
  },
  {
    key: "hasOccupationalMed",
    title: "2. ¿Posee Servicio de Medicina del Trabajo contratado?",
    norm: "",
    detail: "Médico laboral a cargo de exámenes de aptitud de yacimiento y seguimiento de salud ocupacional.",
  },
  {
    key: "hasNoiseStudy",
    title: "3. ¿Tiene realizada la Medición de Ruido Ocupacional vigente?",
    norm: "",
    detail: "Medición en puestos de trabajo e informe del último año.",
  },
  {
    key: "hasLightingStudy",
    title: "4. ¿Cuenta con Medición de Niveles de Iluminación en Puestos de Trabajo?",
    norm: "",
    detail: "Evaluación de niveles de iluminación en puestos operativos y administrativos.",
  },
  {
    key: "hasGroundingProtocol",
    title: "5. ¿Posee la Medición de Puesta a Tierra y Continuidad de Masas?",
    norm: "",
    detail: "Medición anual con instrumental certificado e informe de protecciones eléctricas.",
  },
  {
    key: "hasChemicalSampling",
    title: "6. ¿Realizó Muestreo de Contaminantes Químicos o Sílice en Aire?",
    norm: "",
    detail: "Análisis de calidad de aire en zona de trabajo en los últimos 12 meses.",
  },
  {
    key: "hasPressureVesselsReg",
    title: "7. ¿Tiene habilitados los Recipientes a Presión o Calderas?",
    norm: "",
    detail: "Registro oficial, ensayos de integridad y calibración de válvulas de seguridad.",
  },
  {
    key: "hasMiperIper",
    title: "8. ¿Posee la Matriz de Riesgos por Puesto (MIPER/IPER) actualizada?",
    norm: "",
    detail: "Identificación de peligros, evaluación de riesgos y controles operativos.",
  },
  {
    key: "hasEvacuationPlan",
    title: "9. ¿Tiene Plan de Evacuación / Autoprotección y Planos de Escape?",
    norm: "",
    detail: "Plan de emergencias con simulacros y planos de evacuación aprobados.",
  },
  {
    key: "hasRgrl",
    title: "10. ¿Presentó el Relevamiento General de Riesgos Laborales (RGRL)?",
    norm: "",
    detail: "Declaración jurada anual de estado de cumplimiento ante la ART.",
  },
  {
    key: "hasAnnualTraining",
    title: "11. ¿Ejecuta un Plan Anual de Capacitación con registro de asistencia?",
    norm: "",
    detail: "Capacitaciones continuas en prevención, manejo defensivo y emergencias.",
  },
  {
    key: "hasErgonomicsStudy",
    title: "12. ¿Dispone del Estudio de Ergonomía por Puesto de Trabajo?",
    norm: "",
    detail: "Evaluación de riesgos ergonómicos en puestos operativos y administrativos.",
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
          <span>Paso 4 de 5 | Autoevaluación de Cumplimiento Actual</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ¿Con qué estudios y documentación cuenta actualmente?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Marque únicamente las obligaciones que su empresa tiene vigentes y aprobadas. Esto calculará su Índice Inicial de Compliance SST.
        </p>
      </div>

      {/* Explicit User Instruction Callout Banner */}
      <div className="p-4 bg-teal-50 border-2 border-teal-200 rounded-2xl flex items-start space-x-3 text-slate-800 text-xs sm:text-sm">
        <Info className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-extrabold text-teal-950 block uppercase tracking-wider mb-0.5">
            Instrucciones de Marcación:
          </span>
          <span className="text-slate-700 leading-relaxed">
            Haga clic o coloque una <strong>tilde (✓)</strong> en el cuadradito blanco únicamente de los estudios o servicios con los que su empresa <strong>YA CUENTA</strong> actualmente. Deje el cuadradito en blanco si no posee el estudio o desconoce su estado.
          </span>
        </div>
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
              {fulfilledCount} de {CHECKLIST_ITEMS.length} estudios/requisitos marcados con tilde (✓)
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

      {/* Questions list with explicit square checkboxes */}
      <div className="space-y-3">
        {CHECKLIST_ITEMS.map((item) => {
          const isFulfilled = selfCheck[item.key];

          return (
            <div
              key={item.key}
              onClick={() => onChangeSelfCheck({ [item.key]: !isFulfilled })}
              className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-150 flex items-start justify-between space-x-4 ${
                isFulfilled
                  ? "bg-emerald-50/70 border-emerald-300 shadow-sm"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Visual Square Checkbox */}
                <div
                  className={`mt-0.5 w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-all ${
                    isFulfilled
                      ? "bg-emerald-500 text-white border-2 border-emerald-600 shadow-sm"
                      : "bg-white border-2 border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {isFulfilled && <Check className="w-5 h-5 stroke-[3]" />}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-bold text-sm sm:text-base ${isFulfilled ? "text-slate-900" : "text-slate-800"}`}>
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="shrink-0 pt-0.5">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all inline-flex items-center space-x-1.5 ${
                  isFulfilled
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                  <span>{isFulfilled ? "✓ POSEE ESTUDIO" : "□ SIN MARCAR"}</span>
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
          <span>Ver Resultado Preliminar</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
