import React, { useState } from "react";
import { ContactLead, CompanyProfile } from "../types";
import { Mail, Phone, User, Briefcase, FileCheck, ArrowLeft, ArrowRight, ShieldCheck, Lock } from "lucide-react";

interface Step5Props {
  contact: ContactLead;
  profile: CompanyProfile;
  onChangeContact: (updated: Partial<ContactLead>) => void;
  onSubmitLead: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const Step5LeadCapture: React.FC<Step5Props> = ({
  contact,
  profile,
  onChangeContact,
  onSubmitLead,
  onBack,
  isSubmitting,
}) => {
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.contactName.trim()) {
      setErrorMsg("Por favor ingrese su Nombre y Apellido.");
      return;
    }
    if (!contact.email.trim() || !contact.email.includes("@")) {
      setErrorMsg("Por favor ingrese un correo electrónico válido para recibir el informe PDF.");
      return;
    }
    if (!contact.phone.trim()) {
      setErrorMsg("Por favor ingrese un número de teléfono o WhatsApp de contacto.");
      return;
    }
    setErrorMsg("");
    onSubmitLead();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Paso 5 de 6 | Envío del Informe Técnico & Diagnóstico</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ¿A qué correo y WhatsApp le enviamos el Reporte PDF?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Generaremos el <strong className="text-slate-900">Informe Técnico de Compliance SST</strong> en PDF con la auditoría de obligaciones, plan de servicios técnicos y calendario de alertas para <span className="font-bold text-teal-700">{profile.companyName || "su empresa"}</span>.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl font-medium">
          {errorMsg}
        </div>
      )}

      {/* Main Card Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Nombre y Apellido del Solicitante <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              placeholder="Ej: Lic. Martín Rodriguez"
              value={contact.contactName}
              onChange={(e) => onChangeContact({ contactName: e.target.value })}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 text-sm font-medium transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Correo Electrónico <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="ejemplo@empresa.com"
                value={contact.email}
                onChange={(e) => onChangeContact({ email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 text-sm font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Teléfono / WhatsApp <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                required
                placeholder="+54 9 299 1234567"
                value={contact.phone}
                onChange={(e) => onChangeContact({ phone: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Cargo o Función en la Organización
          </label>
          <div className="relative">
            <Briefcase className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Ej: Gerente de HSEQ / Titular / Apoderado / RRHH"
              value={contact.role}
              onChange={(e) => onChangeContact({ role: e.target.value })}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* Checkbox terms */}
        <div className="pt-2">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={contact.acceptedTerms}
              onChange={(e) => onChangeContact({ acceptedTerms: e.target.checked })}
              className="mt-1 rounded text-teal-600 focus:ring-teal-500 h-4 w-4 border-slate-300"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              Acepto recibir el Informe Técnico en PDF y el plan de servicios regulatorios. Sus datos están protegidos bajo política de confidencialidad para operadoras petroleras.
            </span>
          </label>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2 text-xs text-slate-500">
          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Garantía de Privacidad | No compartimos su contacto con terceros.</span>
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
          disabled={isSubmitting}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-xl hover:shadow-teal-500/30 transition-all transform hover:-translate-y-0.5 text-base cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Generando Diagnóstico...</span>
          ) : (
            <>
              <FileCheck className="w-5 h-5" />
              <span>Ver Diagnóstico & Descargar PDF</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
