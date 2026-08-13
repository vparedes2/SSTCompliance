import React from "react";
import { ShieldCheck, Flame, ChevronRight, FileText } from "lucide-react";

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, totalSteps, onReset }) => {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const stepLabels = [
    "Rubro",
    "Empresa",
    "Riesgos",
    "Estado",
    "Resultado",
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
            <div className="bg-white px-2 py-1.5 rounded-lg shadow-md flex items-center shrink-0">
              <img
                src="/patagonia_consult_logo.svg"
                alt="Patagonia Consult SRL"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  Compliance SST
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Flame className="w-3 h-3 mr-1 text-amber-400 fill-amber-400" />
                  Vaca Muerta
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Diagnóstico de Seguridad & Higiene | Patagonia Consult SRL.
              </p>
            </div>
          </div>

          {/* Stepper overview (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2">
            {stepLabels.map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              const isDone = currentStep > stepNum;

              return (
                <React.Fragment key={label}>
                  <div className={`flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-all ${
                    isActive
                      ? "bg-teal-500 text-slate-950 font-bold shadow-sm"
                      : isDone
                      ? "text-teal-400 bg-teal-950/40"
                      : "text-slate-500"
                  }`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isActive ? "bg-slate-950 text-white" : isDone ? "bg-teal-500/20 text-teal-300" : "bg-slate-800 text-slate-400"
                    }`}>
                      {stepNum}
                    </span>
                    <span>{label}</span>
                  </div>
                  {idx < stepLabels.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-700" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step badge (Mobile) */}
          <div className="flex items-center space-x-3">
            <div className="text-right text-xs">
              <span className="text-slate-400">Paso</span>{" "}
              <span className="font-bold text-teal-400">{currentStep}</span>
              <span className="text-slate-500">/{totalSteps}</span>
            </div>
            <button
              onClick={onReset}
              className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
            >
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1">
        <div
          className="bg-gradient-to-r from-teal-500 to-emerald-400 h-1 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
};
