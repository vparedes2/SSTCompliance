import React from "react";
import { VACA_MUERTA_CATEGORIES } from "../data/vacaMuertaData";
import { IndustryCategoryId } from "../types";
import {
  Flame,
  Wrench,
  HardHat,
  Truck,
  Hammer,
  Utensils,
  Store,
  HeartPulse,
  CheckCircle2,
  ArrowRight,
  Building2,
  Check,
} from "lucide-react";

interface Step1Props {
  selectedId: IndustryCategoryId;
  onSelect: (id: IndustryCategoryId) => void;
  onNext: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Flame,
  Wrench,
  HardHat,
  Truck,
  Hammer,
  Utensils,
  Store,
  HeartPulse,
};

export const Step1IndustrySelector: React.FC<Step1Props> = ({
  selectedId,
  onSelect,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span>Paso 1 de 6 | Selección de Sector Operativo</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ¿En qué rubro opera o desea prestar servicios en Vaca Muerta?
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Seleccione la categoría principal. El algoritmo adaptar el marco regulatorio (SRT, Decretos 351/79 o 911/96 y exigencias de Operadoras en Neuquén).
        </p>
      </div>

      {/* Grid of 8 Principal Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {VACA_MUERTA_CATEGORIES.map((cat) => {
          const IconComp = ICON_MAP[cat.iconName] || Flame;
          const isSelected = selectedId === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`relative group rounded-2xl p-5 cursor-pointer border-2 transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900 text-white border-teal-500 shadow-xl shadow-teal-950/20 ring-2 ring-teal-500/50 scale-[1.02]"
                  : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:shadow-md hover:scale-[1.01]"
              }`}
            >
              {/* Top Row: Icon & Badge */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-teal-500 text-slate-950 font-bold"
                      : "bg-slate-100 text-slate-700 group-hover:bg-teal-50 group-hover:text-teal-600"
                  }`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    isSelected
                      ? "bg-teal-950/80 text-teal-300 border-teal-800"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    {cat.badgeText}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className={`font-bold text-base leading-snug mb-1 ${
                  isSelected ? "text-white" : "text-slate-900"
                }`}>
                  {cat.title}
                </h3>
                <p className={`text-xs font-medium mb-3 ${
                  isSelected ? "text-teal-300" : "text-teal-600"
                }`}>
                  {cat.subtitle}
                </p>

                {/* Description */}
                <p className={`text-xs leading-relaxed mb-4 ${
                  isSelected ? "text-slate-300" : "text-slate-500"
                }`}>
                  {cat.description}
                </p>
              </div>

              {/* Bottom Row: Operator badges & Check indicator */}
              <div className="pt-3 border-t border-slate-100/10">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Normativa clave:
                </div>
                <p className={`text-[11px] truncate ${
                  isSelected ? "text-slate-300" : "text-slate-600"
                }`}>
                  {cat.applicableLaw}
                </p>

                {/* Selection state button / check */}
                <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                  {isSelected ? (
                    <span className="flex items-center text-teal-400">
                      <CheckCircle2 className="w-4 h-4 mr-1 text-teal-400" />
                      Rubro Seleccionado
                    </span>
                  ) : (
                    <span className="text-slate-400 group-hover:text-slate-700">
                      Haga clic para elegir
                    </span>
                  )}
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 flex justify-end">
        <button
          onClick={onNext}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer text-base"
        >
          <span>Continuar a Datos de la Empresa</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
