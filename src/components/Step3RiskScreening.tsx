import React from "react";
import { RiskScreening } from "../types";
import {
  FlaskConical,
  Zap,
  Radio,
  Ruler,
  Volume2,
  Gauge,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  TriangleAlert,
  HelpCircle,
} from "lucide-react";

interface Step3Props {
  risks: RiskScreening;
  onChangeRisks: (updated: Partial<RiskScreening>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface RiskQuestion {
  key: keyof RiskScreening;
  title: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  vacaMuertaContext: string;
  legalNorm: string;
}

const RISK_QUESTIONS: RiskQuestion[] = [
  {
    key: "chemicalExposure",
    title: "1. Trabajo con Químicos, Solventes o Agentes Contaminantes",
    badge: "Res. SRT 861/15",
    icon: FlaskConical,
    description: "Manipulación de químicos de fractura, solventes, hidrocarburos aromáticos o exposición a arena de fractura (sílice cristalina respirable).",
    vacaMuertaContext: "Exigido por YPF/Vista en pozo y base para control de enfermedades profesionales respiratorias y cutáneas.",
    legalNorm: "Res. SRT 861/15 & Res. SRT 295/03",
  },
  {
    key: "heightWork",
    title: "2. Trabajo en Altura (> 1,80 metros)",
    badge: "Dec. 911/96",
    icon: Ruler,
    description: "Tareas en andamios, escaleras de tanques, coronamiento de separadores, torres de perforación o montaje de estructuras.",
    vacaMuertaContext: "Requiere permiso de trabajo seguro en altura (PTAR), arnés ignífugo con doble cabo y puntos de anclaje certificados.",
    legalNorm: "Decreto 911/96 Art. 53 a 58 / Protocolo Operadoras",
  },
  {
    key: "electricalRisk",
    title: "3. Riesgo Eléctrico (Tableros, Media/Alta Tensión y Generadores)",
    badge: "Res. SRT 900/15",
    icon: Zap,
    description: "Intervención o presencia cerca de tableros eléctricos de campo, transformadores, generadores diésel de yacimiento o subestaciones.",
    vacaMuertaContext: "Exige protocolo de medición de puesta a tierra anual y sistemas de bloqueo y etiquetado (LOTO - Lockout/Tagout).",
    legalNorm: "Resolución SRT 900/15 & Reglamentación AEA",
  },
  {
    key: "ionizingRadiation",
    title: "4. Exposición a Radiaciones Ionizantes",
    badge: "Norma ARN & SRT",
    icon: Radio,
    description: "Gammagrafía industrial en ensayo no destructivo (END) de soldaduras de ductos, o herramientas de perfilaje nuclear de pozos.",
    vacaMuertaContext: "Obliga a contar con Licencia de Operación emitida por la Autoridad Regulatoria Nuclear (ARN) y dosimetría individual activa.",
    legalNorm: "Ley 24.804 / Res. SRT 295/03 Anexo II",
  },
  {
    key: "confinedSpace",
    title: "5. Entrada a Espacios Confinados",
    badge: "Riesgo Asfixia/Explosión",
    icon: ShieldAlert,
    description: "Ingreso a tanques de almacenamiento de crudo, piletas de lodo, separadores de fases, piletas de decantación o zanjas profundas.",
    vacaMuertaContext: "Medición previa de gases (LEL, H2S, O2, CO), permiso de trabajo de alto riesgo y vigía exclusivo con equipo de rescate.",
    legalNorm: "Decreto 351/79 Cap. 17 / Normativa YPF-Vista",
  },
  {
    key: "intenseNoise",
    title: "6. Exposición a Ruido Intenso (> 85 dBA)",
    badge: "Res. SRT 85/12",
    icon: Volume2,
    description: "Presencia constante o periódica cerca de motobombas de fractura, compresores de gas, grupos electrógenos o trépanos.",
    vacaMuertaContext: "Protocolo obligatorio de dosimetrías y mapa de ruido para asignación de protección auditiva adecuada.",
    legalNorm: "Resolución SRT 85/12",
  },
  {
    key: "pressureVessels",
    title: "7. Uso de Aparatos a Presión y Calderas",
    badge: "Dec. 351/79 Art. 143",
    icon: Gauge,
    description: "Operación con receptores de aire, trampas de PIG, separadores de producción, autoclaves o calderas de vapor.",
    vacaMuertaContext: "Requiere registro oficial, medición de espesores por ultrasonido y calibración de válvulas de seguridad con certificado.",
    legalNorm: "Decreto 351/79 Art. 143 & Disposición Subsecretaría Trabajo NQ",
  },
];

export const Step3RiskScreening: React.FC<Step3Props> = ({
  risks,
  onChangeRisks,
  onNext,
  onBack,
}) => {
  const activeCount = Object.values(risks).filter(Boolean).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Paso 3 de 6 | Screening de Riesgos Críticos</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Personalización del Protocolo de Seguridad
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Marque las condiciones de trabajo operativas que realiza su personal. Cada selección añadirá las mediciones técnicas y permisos obligatorios correspondientes.
        </p>
      </div>

      {/* Active Risks Counter Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between border border-slate-800 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-sm">
            {activeCount}
          </div>
          <div>
            <div className="text-sm font-bold">Riesgos Críticos Seleccionados</div>
            <div className="text-xs text-slate-400">
              {activeCount === 0
                ? "Ningún riesgo adicional marcado (Condiciones de oficina / base liviana)"
                : `${activeCount} protocolos específicos de seguridad activados`}
            </div>
          </div>
        </div>
        <span className="text-xs bg-slate-800 text-teal-400 px-3 py-1.5 rounded-lg border border-slate-700 font-mono">
          Vaca Muerta Standard
        </span>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {RISK_QUESTIONS.map((q) => {
          const isChecked = risks[q.key];
          const IconComp = q.icon;

          return (
            <div
              key={q.key}
              onClick={() => onChangeRisks({ [q.key]: !isChecked })}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                isChecked
                  ? "bg-slate-900 text-white border-teal-500 shadow-md ring-1 ring-teal-500/50"
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isChecked
                      ? "bg-teal-500 text-slate-950 font-bold"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                    <IconComp className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-bold text-base ${isChecked ? "text-white" : "text-slate-900"}`}>
                        {q.title}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isChecked
                          ? "bg-teal-950 text-teal-300 border-teal-800"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {q.badge}
                      </span>
                    </div>

                    <p className={`text-xs mt-1 leading-relaxed ${isChecked ? "text-slate-300" : "text-slate-600"}`}>
                      {q.description}
                    </p>

                    <div className={`mt-2.5 p-2.5 rounded-lg text-xs flex items-start space-x-2 ${
                      isChecked ? "bg-slate-800/80 text-teal-300" : "bg-amber-50/80 text-amber-900 border border-amber-200/60"
                    }`}>
                      <TriangleAlert className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isChecked ? "text-teal-400" : "text-amber-600"}`} />
                      <span>
                        <strong className="font-semibold">Exigencia Vaca Muerta:</strong> {q.vacaMuertaContext}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Toggle switch */}
                <div className="ml-4 shrink-0 pt-1">
                  <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    isChecked ? "bg-teal-500" : "bg-slate-300"
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      isChecked ? "translate-x-6" : "translate-x-0"
                    }`} />
                  </div>
                </div>
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
          <span>Ir a Autoevaluación de Estado</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
