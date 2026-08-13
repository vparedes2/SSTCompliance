import React from "react";
import { CompanyProfile, StaffTier } from "../types";
import { STAFF_TIERS, VACA_MUERTA_LOCATIONS, VACA_MUERTA_OPERATORS } from "../data/vacaMuertaData";
import { Users, MapPin, Building, Flame, ArrowLeft, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";

interface Step2Props {
  profile: CompanyProfile;
  onChangeProfile: (updated: Partial<CompanyProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2CompanyDetails: React.FC<Step2Props> = ({
  profile,
  onChangeProfile,
  onNext,
  onBack,
}) => {
  const currentTier = STAFF_TIERS.find((t) => t.id === profile.staffTier) || STAFF_TIERS[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.companyName.trim()) {
      alert("Por favor ingrese la Razón Social o Nombre de Fantasía de la Empresa.");
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold mb-3">
          <Building className="w-3.5 h-3.5" />
          <span>Paso 2 de 5 | Datos del Establecimiento & Dotación</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Datos Operativos de la Empresa
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          La cantidad de trabajadores y superficie cubierta determinan legalmente la carga horaria obligatoria de Higiene y Seguridad (Decreto 1338/96).
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Row 1: Company Name & CUIT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Razón Social / Nombre Fantasía <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Nombre de su empresa S.A. / Servicios Neuquén"
              value={profile.companyName}
              onChange={(e) => onChangeProfile({ companyName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 text-sm font-medium transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              CUIT / Identificación Fiscal
            </label>
            <input
              type="text"
              placeholder="Ej: 30-71234567-9"
              value={profile.cuit}
              onChange={(e) => onChangeProfile({ cuit: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* Row 2: Staff Tiers (Dotación Personal) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Dotación Personal Directa e Indirecta <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {STAFF_TIERS.map((tier) => {
              const isSelected = profile.staffTier === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => onChangeProfile({ staffTier: tier.id as StaffTier })}
                  className={`p-3.5 rounded-xl border cursor-pointer text-center transition-all ${
                    isSelected
                      ? "bg-slate-900 text-white border-teal-500 ring-2 ring-teal-500/40 font-bold shadow-md"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <Users className={`w-5 h-5 mx-auto mb-1.5 ${isSelected ? "text-teal-400" : "text-slate-500"}`} />
                  <div className="text-xs font-semibold leading-tight">{tier.label}</div>
                  <div className={`text-[10px] mt-1 ${isSelected ? "text-teal-300" : "text-slate-500"}`}>
                    Mínimo {tier.hsHoursPerMonth} hs/mes H&S
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legal H&S Notice Callout */}
          <div className="mt-3 p-3.5 bg-teal-50 border border-teal-200 rounded-xl flex items-start space-x-3 text-xs text-teal-900">
            <Sparkles className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold">Requerimiento Legal (Decreto 1338/96):</span> Para una dotación de{" "}
              <span className="underline font-semibold">{currentTier.label}</span>, la norma exige una asignación mínima de{" "}
              <span className="font-bold text-teal-700">{currentTier.hsHoursPerMonth} horas profesionales mensuales</span> de un Licenciado / Especialista en Higiene y Seguridad Laboral habilitado.
            </div>
          </div>
        </div>

        {/* Row 3: Covered Area & Fire Risk */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Área Cubierta Base / Taller (m²)
            </label>
            <input
              type="number"
              min={10}
              max={100000}
              value={profile.coveredAreaM2}
              onChange={(e) => onChangeProfile({ coveredAreaM2: Number(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 text-sm font-medium transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Riesgo de Incendio (Carga Fuego)
            </label>
            <select
              value={profile.fireRisk}
              onChange={(e) => onChangeProfile({ fireRisk: e.target.value as any })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 text-sm font-medium transition-all bg-white"
            >
              <option value="BAJO">BAJO (Oficinas / Depósito liviano)</option>
              <option value="MEDIO">MEDIO (Taller / Base operativa / Campamento)</option>
              <option value="ALTO">ALTO (Combustibles / Tanques / Químicos)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Ubicación Principal en Cuenca
            </label>
            <select
              value={profile.location}
              onChange={(e) => onChangeProfile({ location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 text-sm font-medium transition-all bg-white"
            >
              {VACA_MUERTA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Target Operator Company & Homologation Needs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Operadora Principal a la que prestan o proyectan prestar servicio
            </label>
            <select
              value={profile.targetOperator}
              onChange={(e) => onChangeProfile({ targetOperator: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 text-sm font-medium transition-all bg-white"
            >
              {VACA_MUERTA_OPERATORS.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Cada operadora (YPF, Vista, PAE, Shell) posee estándares propios de auditoría de ingreso (Pases de yacimiento, licencias, habilitaciones VTC).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 flex items-start space-x-3">
            <input
              type="checkbox"
              id="needsHomologation"
              checked={profile.needsHomologation ?? true}
              onChange={(e) => onChangeProfile({ needsHomologation: e.target.checked })}
              className="mt-1 h-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded cursor-pointer"
            />
            <label htmlFor="needsHomologation" className="text-xs text-slate-800 cursor-pointer">
              <span className="font-extrabold text-amber-900 block uppercase tracking-wider">
                ¿Necesita homologarse o ingresar como proveedor en esta operadora? (Recomendado)
              </span>
              <span className="text-slate-600 block mt-0.5">
                Incluye la auditoría acelerada de legajo HSE, carga en portales (SICOP, Control Tower) y armado de matriz de riesgo exigida para adjudicar órdenes de compra.
              </span>
            </label>
          </div>
        </div>
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
          type="submit"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 text-base cursor-pointer"
        >
          <span>Ir a Riesgos Específicos</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
