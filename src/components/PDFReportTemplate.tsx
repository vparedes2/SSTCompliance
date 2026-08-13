import React from "react";
import { DiagnosticResult } from "../types";
import { VACA_MUERTA_CATEGORIES } from "../data/vacaMuertaData";

interface PDFReportTemplateProps {
  result: DiagnosticResult;
  id?: string;
}

export const PDFReportTemplate: React.FC<PDFReportTemplateProps> = ({ result, id = "pdf-report-template" }) => {
  const category = VACA_MUERTA_CATEGORIES.find((c) => c.id === result.profile.industryId);

  return (
    <div
      id={id}
      className="mx-auto font-sans text-xs leading-normal space-y-6"
      style={{
        width: "800px",
        color: "#0f172a",
        backgroundColor: "#f1f5f9",
      }}
    >
      {/* ==================== PAGE 1 ==================== */}
      <div
        className="pdf-page p-8 flex flex-col justify-between relative overflow-hidden"
        style={{
          width: "800px",
          height: "1130px", // Exact A4 aspect ratio @ 800px width (210mm x 297mm)
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
          border: "1px solid #cbd5e1",
        }}
      >
        <div>
          {/* BRAND HEADER LOGO BANNER (PATAGONIA CONSULT SRL) */}
          <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: "2px solid #ee7218" }}>
            <div className="flex items-center space-x-3">
              <img
                src="/patagonia_consult_logo.svg"
                alt="Patagonia Consult SRL. Oil & Gas"
                className="h-11 w-auto object-contain"
              />
              <div className="text-[8.5px] text-slate-600 space-y-0.5 border-l pl-2 border-slate-200">
                <div className="font-bold text-slate-800">+54 9 299 4109533</div>
                <div>info@patagoniaconsult.com.ar</div>
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider block" style={{ color: "#ee7218" }}>
                  Socio Gerente
                </span>
                <span className="text-[10.5px] font-bold block leading-tight" style={{ color: "#0f172a" }}>
                  Ing. Sergio Vasicek
                </span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider block" style={{ color: "#ee7218" }}>
                  Responsable Técnico Legal
                </span>
                <span className="text-[10.5px] font-bold block leading-tight" style={{ color: "#0f172a" }}>
                  Víctor Javier Paredes
                </span>
                <span className="text-[8.5px] font-medium block" style={{ color: "#475569" }}>
                  Lic. en Higiene y Seguridad Laboral — Matrícula PA 446
                </span>
                <span className="text-[8.5px] font-medium block" style={{ color: "#64748b" }}>
                  Máster en PRL
                </span>
              </div>
            </div>
          </div>

          {/* HEADER BANNER */}
          <div
            className="p-3.5 rounded-sm mb-3"
            style={{ backgroundColor: "#0b1329", color: "#ffffff" }}
          >
            <h1 className="text-base font-extrabold tracking-wide uppercase mb-0.5" style={{ color: "#ffffff" }}>
              INFORME TÉCNICO DE COMPLIANCE SST
            </h1>
            <p className="text-[10px]" style={{ color: "#cbd5e1" }}>
              Auditoría Regulatoria, Diagnóstico de Riesgo y Plan de Habilitación ante Operadoras (YPF / Vista / PAE / Shell)
            </p>
            <p className="text-[9px] font-semibold mt-0.5" style={{ color: "#ee7218" }}>
              Especialización Cuenca Vaca Muerta (Neuquén, Río Negro y Mendoza)
            </p>
          </div>

          {/* SECTION 1: DATOS DEL ESTABLECIMIENTO AUDITADO */}
          <div className="mb-3">
            <h2
              className="font-extrabold text-[11px] pb-1 mb-1.5 uppercase tracking-wide"
              style={{ color: "#0f172a", borderBottom: "1px solid #cbd5e1" }}
            >
              1. Datos del Establecimiento Auditado
            </h2>

            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[10px]">
              <div className="flex">
                <span className="font-bold w-28 shrink-0" style={{ color: "#1e293b" }}>Razón Social:</span>
                <span className="font-semibold" style={{ color: "#0f172a" }}>{result.profile.companyName || "Empresa Auditada"}</span>
              </div>
              <div className="flex">
                <span className="font-bold w-28 shrink-0" style={{ color: "#1e293b" }}>Actividad/Sector:</span>
                <span className="font-semibold" style={{ color: "#0f172a" }}>{category?.title || "Industria Vaca Muerta"}</span>
              </div>

              <div className="flex">
                <span className="font-bold w-28 shrink-0" style={{ color: "#1e293b" }}>CUIT / ID Fiscal:</span>
                <span style={{ color: "#334155" }}>{result.profile.cuit || "No informado"}</span>
              </div>
              <div className="flex">
                <span className="font-bold w-28 shrink-0" style={{ color: "#1e293b" }}>Operadora Target:</span>
                <span className="font-bold" style={{ color: "#92400e" }}>{result.profile.targetOperator}</span>
              </div>

              <div className="flex">
                <span className="font-bold w-28 shrink-0" style={{ color: "#1e293b" }}>Dotación Personal:</span>
                <span className="font-semibold" style={{ color: "#0f172a" }}>{result.profile.staffTier.replace("_", " a ")} pers. (Decreto 1338/96)</span>
              </div>
              <div className="flex">
                <span className="font-bold w-28 shrink-0" style={{ color: "#1e293b" }}>Ubicación / Base:</span>
                <span style={{ color: "#334155" }}>{result.profile.location}</span>
              </div>
            </div>
          </div>

          {/* BENCHMARKING VISUAL & COMPLIANCE SCORE BLOCK */}
          <div
            className="p-3 rounded-sm mb-3 space-y-2"
            style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[10.5px] uppercase tracking-wider" style={{ color: "#0f172a" }}>
                BENCHMARKING VISUAL DE COMPLIANCE VACA MUERTA
              </span>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded" style={{ backgroundColor: "#ea580c", color: "#ffffff" }}>
                {result.benchmark.statusLabel}
              </span>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-4 gap-2 text-center text-[9px]">
              <div className="p-1.5 rounded" style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}>
                <span className="font-bold block" style={{ color: "#64748b" }}>Su Empresa</span>
                <span className="text-sm font-black" style={{ color: "#b45309" }}>{result.compliancePercentage}%</span>
              </div>
              <div className="p-1.5 rounded" style={{ backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1" }}>
                <span className="font-bold block" style={{ color: "#64748b" }}>Promedio Sector</span>
                <span className="text-sm font-black" style={{ color: "#334155" }}>{result.benchmark.industryAverageScore}%</span>
              </div>
              <div className="p-1.5 rounded" style={{ backgroundColor: "#fff1f2", border: "1px solid #fecdd3" }}>
                <span className="font-bold block" style={{ color: "#64748b" }}>Mínimo Operadora</span>
                <span className="text-sm font-black" style={{ color: "#be123c" }}>{result.benchmark.operatorRequiredScore}%</span>
              </div>
              <div className="p-1.5 rounded" style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0" }}>
                <span className="font-bold block" style={{ color: "#64748b" }}>Meta 90 Días</span>
                <span className="text-sm font-black" style={{ color: "#047857" }}>{result.benchmark.target90DaysScore}%</span>
              </div>
            </div>
          </div>

          {/* COST OF INACTION / COSTO DEL RIESGO CALLOUT BOX */}
          <div
            className="p-3 rounded-sm mb-3 space-y-1"
            style={{ backgroundColor: "#fff1f2", border: "1px solid #fecdd3" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[10px] uppercase tracking-wider" style={{ color: "#881337" }}>
                ⚠️ COSTO DE INACCIÓN Y RIESGO SANCIONATORIO (COSTO DE NO HACER NADA)
              </span>
              <span className="text-[9px] font-bold" style={{ color: "#9f1239" }}>
                Norma: {result.costOfInaction.fineReferenceNorm}
              </span>
            </div>
            <p className="text-[9.5px] leading-tight font-medium" style={{ color: "#4c0519" }}>
              {result.costOfInaction.businessImpact}
            </p>
            <div className="flex items-center justify-between text-[9px] font-bold pt-1" style={{ borderTop: "1px solid #fca5a5", color: "#881337" }}>
              <span>Multa Multitudinaria SRT: ${result.costOfInaction.srtFineMinARS.toLocaleString("es-AR")} a ${result.costOfInaction.srtFineMaxARS.toLocaleString("es-AR")} ARS</span>
              <span>Pérdida por Lucro Cesante Flota/Base: ~${result.costOfInaction.estimatedDailyLossARS.toLocaleString("es-AR")} ARS/día</span>
            </div>
          </div>

          {/* SECTION 2: DIAGNÓSTICO DE OBLIGACIONES DE CUMPLIMIENTO EXIGIBLE */}
          <div>
            <h2
              className="font-extrabold text-[11px] pb-1 mb-2 uppercase tracking-wide"
              style={{ color: "#0f172a", borderBottom: "1px solid #cbd5e1" }}
            >
              2. Matriz de Obligaciones Reguladas (Párrafo Inicial)
            </h2>

            <div className="space-y-1.5">
              {result.obligations.slice(0, 5).map((ob) => {
                const isDone = ob.status === "CUMPLIDO";
                const isCritical = ob.status === "REQUERIDO_CRITICO";

                return (
                  <div
                    key={ob.id}
                    className="pl-2 py-0.5"
                    style={{
                      borderLeft: `4px solid ${isDone ? "#10b981" : isCritical ? "#ef4444" : "#f59e0b"}`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[10px] flex items-center" style={{ color: "#0f172a" }}>
                        <span>{ob.title}</span>
                        {ob.isExcluyenteYacimiento && (
                          <span
                            className="ml-2 text-[7.5px] font-black uppercase rounded"
                            style={{
                              backgroundColor: "#ffe4e6",
                              color: "#9f1239",
                              border: "1px solid #fecdd3",
                              padding: "1px 4px",
                              display: "inline-block",
                              lineHeight: "1",
                            }}
                          >
                            EXCLUYENTE YACIMIENTO
                          </span>
                        )}
                      </div>
                      <span
                        className="font-extrabold text-[8.5px] rounded"
                        style={{
                          color: isDone ? "#047857" : isCritical ? "#be123c" : "#b45309",
                          backgroundColor: isDone ? "#ecfdf5" : isCritical ? "#fff1f2" : "#fffbeb",
                          padding: "2px 6px",
                          lineHeight: "1",
                        }}
                      >
                        [{ob.status}]
                      </span>
                    </div>

                    <div className="text-[9px] font-medium" style={{ color: "#64748b" }}>
                      Norma: {ob.norm} | Frecuencia: {ob.frequency}
                    </div>

                    <p className="text-[9px] leading-tight mt-0.5" style={{ color: "#334155" }}>
                      {ob.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PAGE 1 FOOTER */}
        <div
          className="pt-2 flex items-center justify-between text-[9px] font-medium mt-auto"
          style={{ borderTop: "1px solid #e2e8f0", color: "#64748b" }}
        >
          <div>
            <strong style={{ color: "#ee7218" }}>PATAGONIA CONSULT SRL.</strong> | Tel: +54 9 299 4109533 | Email: info@patagoniaconsult.com.ar
          </div>
          <div>Confidencial — Diagnóstico Técnico Preventivo SST</div>
          <div className="font-bold" style={{ color: "#334155" }}>Página 1 de 2</div>
        </div>
      </div>


      {/* ==================== PAGE 2 ==================== */}
      <div
        className="pdf-page p-8 flex flex-col justify-between relative overflow-hidden"
        style={{
          width: "800px",
          height: "1130px", // Exact A4 aspect ratio @ 800px width
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
          border: "1px solid #cbd5e1",
        }}
      >
        <div>
          {/* RUNNING HEADER FOR PAGE 2 */}
          <div className="flex items-center justify-between pb-2 mb-3" style={{ borderBottom: "2px solid #ee7218" }}>
            <div className="flex items-center space-x-3">
              <img
                src="/patagonia_consult_logo.svg"
                alt="Patagonia Consult SRL."
                className="h-8 w-auto object-contain"
              />
              <span className="text-[10.5px] font-bold tracking-tight" style={{ color: "#1e293b" }}>
                INFORME TÉCNICO DE COMPLIANCE SST — PLAN DE HOMOLOGACIÓN Y PLANES
              </span>
            </div>
            <div className="text-right text-[9px] font-bold" style={{ color: "#475569" }}>
              {result.profile.companyName || "Empresa Auditada"}
            </div>
          </div>

          {/* OBLIGATIONS CONTINUATION IF ANY */}
          {result.obligations.length > 5 && (
            <div className="mb-3">
              <h2
                className="font-extrabold text-[10.5px] pb-1 mb-1.5 uppercase tracking-wide"
                style={{ color: "#0f172a", borderBottom: "1px solid #cbd5e1" }}
              >
                2. Matriz de Obligaciones Reguladas (Continuación)
              </h2>
              <div className="space-y-1.5">
                {result.obligations.slice(5).map((ob) => {
                  const isDone = ob.status === "CUMPLIDO";
                  const isCritical = ob.status === "REQUERIDO_CRITICO";

                  return (
                    <div
                      key={ob.id}
                      className="pl-2 py-0.5"
                      style={{
                        borderLeft: `4px solid ${isDone ? "#10b981" : isCritical ? "#ef4444" : "#f59e0b"}`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-[9.5px] flex items-center" style={{ color: "#0f172a" }}>
                          <span>{ob.title}</span>
                          {ob.isExcluyenteYacimiento && (
                            <span
                              className="ml-2 text-[7.5px] font-black uppercase rounded"
                              style={{
                                backgroundColor: "#ffe4e6",
                                color: "#9f1239",
                                border: "1px solid #fecdd3",
                                padding: "1px 4px",
                                display: "inline-block",
                                lineHeight: "1",
                              }}
                            >
                              EXCLUYENTE YACIMIENTO
                            </span>
                          )}
                        </div>
                        <span
                          className="font-extrabold text-[8.5px] rounded"
                          style={{
                            color: isDone ? "#047857" : isCritical ? "#be123c" : "#b45309",
                            backgroundColor: isDone ? "#ecfdf5" : isCritical ? "#fff1f2" : "#fffbeb",
                            padding: "2px 6px",
                            lineHeight: "1",
                          }}
                        >
                          [{ob.status}]
                        </span>
                      </div>
                      <div className="text-[8.5px] font-medium" style={{ color: "#64748b" }}>
                        Norma: {ob.norm} | Frecuencia: {ob.frequency}
                      </div>
                      <p className="text-[8.5px] leading-tight mt-0.5" style={{ color: "#334155" }}>
                        {ob.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: HOJA DE RUTA DE 90 DÍAS */}
          <div className="mb-3">
            <h2
              className="font-extrabold text-[10.5px] pb-1 mb-1.5 uppercase tracking-wide"
              style={{ color: "#0f172a", borderBottom: "1px solid #cbd5e1" }}
            >
              3. Hoja de Ruta Escalonada de Regularización a 90 Días
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {result.roadmap.map((phase) => (
                <div
                  key={phase.phaseNumber}
                  className="p-2 rounded space-y-1"
                  style={{
                    border: `1px solid ${phase.isCriticalFirstStep ? "#ea580c" : "#cbd5e1"}`,
                    backgroundColor: phase.isCriticalFirstStep ? "#fff7ed" : "#f8fafc",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] font-extrabold uppercase" style={{ color: "#334155" }}>{phase.monthLabel}</span>
                    <span
                      className="text-[8px] font-bold rounded"
                      style={{ backgroundColor: "#ccfbf1", color: "#115e59", padding: "1px 4px" }}
                    >
                      Meta: {phase.targetScore}%
                    </span>
                  </div>
                  <h3 className="font-bold text-[9px] leading-tight" style={{ color: "#0f172a" }}>{phase.title}</h3>
                  <ul className="text-[8px] space-y-0.5 list-disc pl-3" style={{ color: "#475569" }}>
                    {phase.milestones.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                  <div className="pt-1 text-[8.5px] font-bold flex justify-between" style={{ borderTop: "1px solid #e2e8f0", color: "#1e293b" }}>
                    <span>Inversión Estimada:</span>
                    <span style={{ color: "#ee7218" }}>A cotizar</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: ESCENARIOS DE CONTRATACIÓN Y COTIZADOR EXPRESS */}
          <div className="mb-3">
            <h2
              className="font-extrabold text-[10.5px] pb-1 mb-1.5 uppercase tracking-wide"
              style={{ color: "#0f172a", borderBottom: "1px solid #cbd5e1" }}
            >
              4. Opciones de Contratación &amp; Retorno de Inversión (ROI ART)
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {result.pricingTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="p-2 rounded flex flex-col justify-between space-y-1"
                  style={{
                    border: `1px solid ${tier.isPopular ? "#ee7218" : "#e2e8f0"}`,
                    backgroundColor: tier.isPopular ? "#fff7ed" : "#ffffff",
                  }}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[9.5px]" style={{ color: "#0f172a" }}>{tier.name}</span>
                      {tier.isPopular && (
                        <span
                          className="text-[7.5px] font-extrabold uppercase rounded"
                          style={{ backgroundColor: "#ee7218", color: "#ffffff", padding: "1px 4px" }}
                        >
                          Recomendado
                        </span>
                      )}
                    </div>
                    <div className="text-[8px] mt-0.5" style={{ color: "#64748b" }}>{tier.recommendedFor}</div>

                    <div className="mt-1 font-black text-[10.5px]" style={{ color: "#0f172a" }}>
                      A cotizar según alcance
                    </div>

                    <div
                      className="text-[8px] font-semibold mt-0.5 rounded"
                      style={{ backgroundColor: "#ecfdf5", color: "#047857", padding: "1px 4px" }}
                    >
                      Optimizaciones ARL/ART: A definir
                    </div>
                    <div className="text-[8.5px] font-bold mt-0.5" style={{ color: "#1e293b" }}>
                      Propuesta Comercial: A cotizar
                    </div>
                  </div>

                  <div className="text-[7.5px] pt-1" style={{ borderTop: "1px solid #e2e8f0", color: "#64748b" }}>
                    Acondicionamiento Inicial: A cotizar
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[8px] italic mt-1 text-right" style={{ color: "#64748b" }}>
              * {result.indexationClause}
            </div>
          </div>

          {/* DISCLAIMER BOX */}
          <div
            className="p-2 rounded-sm text-[8px] leading-tight mb-3"
            style={{ backgroundColor: "#fff1f2", border: "1px solid #fecdd3", color: "#881337" }}
          >
            <strong>AVISO LEGAL:</strong> Este reporte es un diagnóstico informático de compliance preventivo según normativa SRT y estándares de operadoras en 2026. Para la validez formal ante organismos oficiales e inspecciones in-situ, la firma habilitante se ratifica mediante encomienda profesional.
          </div>

          {/* SIGNATURES ROW */}
          <div
            className="pt-3 flex justify-between text-center text-[9px]"
            style={{ borderTop: "1px solid #cbd5e1", color: "#475569" }}
          >
            <div className="w-56">
              <div className="mb-1 pb-4" style={{ borderBottom: "1px solid #94a3b8" }}></div>
              <p className="font-extrabold text-[10.5px]" style={{ color: "#0f172a" }}>
                Ing. Sergio Vasicek
              </p>
              <p className="font-bold text-[9px]" style={{ color: "#ee7218" }}>
                Socio Gerente
              </p>
              <p className="text-[8px] font-extrabold uppercase mt-0.5 tracking-wider" style={{ color: "#0f172a" }}>
                PATAGONIA CONSULT SRL.
              </p>
            </div>

            <div className="w-56">
              <div className="mb-1 pb-4" style={{ borderBottom: "1px solid #94a3b8" }}></div>
              <p className="font-extrabold text-[10.5px]" style={{ color: "#0f172a" }}>
                Víctor Javier Paredes
              </p>
              <p className="font-bold text-[9px]" style={{ color: "#ee7218" }}>
                Lic. en Higiene y Seguridad Laboral — Matrícula PA 446
              </p>
              <p className="text-[8px] font-medium" style={{ color: "#475569" }}>
                Máster en PRL • Responsable Técnico Legal
              </p>
              <p className="text-[8px] font-extrabold uppercase mt-0.5 tracking-wider" style={{ color: "#0f172a" }}>
                PATAGONIA CONSULT SRL.
              </p>
            </div>
          </div>
        </div>

        {/* PAGE 2 FOOTER */}
        <div
          className="pt-2 flex items-center justify-between text-[8.5px] font-medium mt-auto"
          style={{ borderTop: "1px solid #e2e8f0", color: "#64748b" }}
        >
          <div>
            <strong style={{ color: "#ee7218" }}>PATAGONIA CONSULT SRL.</strong> | Tel: +54 9 299 4109533 | Email: info@patagoniaconsult.com.ar
          </div>
          <div>Confidencial — Diagnóstico Técnico Preventivo SST</div>
          <div className="font-bold" style={{ color: "#334155" }}>Página 2 de 2</div>
        </div>
      </div>
    </div>
  );
};
