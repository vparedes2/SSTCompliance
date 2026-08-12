/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { Step1IndustrySelector } from "./components/Step1IndustrySelector";
import { Step2CompanyDetails } from "./components/Step2CompanyDetails";
import { Step3RiskScreening } from "./components/Step3RiskScreening";
import { Step4CurrentStatus } from "./components/Step4CurrentStatus";
import { Step5LeadCapture } from "./components/Step5LeadCapture";
import { Step6ReportDashboard } from "./components/Step6ReportDashboard";
import { PDFReportTemplate } from "./components/PDFReportTemplate";

import { CompanyProfile, RiskScreening, ComplianceSelfCheck, ContactLead } from "./types";
import { calculateSSTDiagnostic } from "./utils/diagnosticEngine";
import { getDefaultRisksForIndustry } from "./data/vacaMuertaData";

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmittingLead, setIsSubmittingLead] = useState<boolean>(false);

  // 1. Company Profile
  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: "Transportes Neuquén Vaca Muerta SRL",
    tradeName: "Transportes Neuquén",
    cuit: "30-71829304-8",
    industryId: "transport_hazardous",
    staffTier: "51_150",
    location: "Añelo (Corazón de Vaca Muerta)",
    coveredAreaM2: 1200,
    fireRisk: "MEDIO",
    targetOperator: "YPF S.A.",
    needsHomologation: true,
  });

  // 2. Risk Screening (Defaults for transport_hazardous)
  const [risks, setRisks] = useState<RiskScreening>(
    getDefaultRisksForIndustry("transport_hazardous")
  );

  // 3. Current Self Assessment
  const [selfCheck, setSelfCheck] = useState<ComplianceSelfCheck>({
    hasHSService: true,
    hasOccupationalMed: true,
    hasNoiseStudy: true,
    hasLightingStudy: true,
    hasGroundingProtocol: true,
    hasChemicalSampling: true,
    hasPressureVesselsReg: true,
    hasMiperIper: true,
    hasEvacuationPlan: true,
    hasRgrl: true,
    hasAnnualTraining: true,
    hasErgonomicsStudy: true,
  });

  // 4. Contact Lead
  const [contact, setContact] = useState<ContactLead>({
    contactName: "Lic. Martín Rodriguez",
    role: "Responsable de HSEQ",
    email: "mrodriguez@riolimay.com",
    phone: "+54 9 299 4558291",
    acceptedTerms: true,
  });

  // Calculate Diagnostic Result dynamically
  const diagnosticResult = useMemo(() => {
    return calculateSSTDiagnostic(profile, risks, selfCheck);
  }, [profile, risks, selfCheck]);

  // Handlers for updating state
  const handleUpdateProfile = (updated: Partial<CompanyProfile>) => {
    setProfile((prev) => {
      const newProfile = { ...prev, ...updated };
      if (updated.industryId && updated.industryId !== prev.industryId) {
        setRisks(getDefaultRisksForIndustry(updated.industryId));
      }
      return newProfile;
    });
  };

  const handleUpdateRisks = (updated: Partial<RiskScreening>) => {
    setRisks((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateSelfCheck = (updated: Partial<ComplianceSelfCheck>) => {
    setSelfCheck((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateContact = (updated: Partial<ContactLead>) => {
    setContact((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setCurrentStep(1);
  };

  const handleSubmitLead = async () => {
    setIsSubmittingLead(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          profile,
          risks,
          result: {
            percentage: diagnosticResult.compliancePercentage,
            budgetARS: diagnosticResult.totalAnnualBudgetARS,
          },
        }),
      });
    } catch (err) {
      console.warn("API lead submission fallback:", err);
    } finally {
      setIsSubmittingLead(false);
      setCurrentStep(6);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col antialiased">
      {/* Top Navigation Header */}
      <Header currentStep={currentStep} totalSteps={6} onReset={handleReset} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {currentStep === 1 && (
          <Step1IndustrySelector
            selectedId={profile.industryId}
            onSelect={(id) => handleUpdateProfile({ industryId: id })}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2CompanyDetails
            profile={profile}
            onChangeProfile={handleUpdateProfile}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3RiskScreening
            risks={risks}
            onChangeRisks={handleUpdateRisks}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4CurrentStatus
            selfCheck={selfCheck}
            onChangeSelfCheck={handleUpdateSelfCheck}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <Step5LeadCapture
            contact={contact}
            profile={profile}
            onChangeContact={handleUpdateContact}
            onSubmitLead={handleSubmitLead}
            onBack={() => setCurrentStep(4)}
            isSubmitting={isSubmittingLead}
          />
        )}

        {currentStep === 6 && (
          <Step6ReportDashboard
            result={diagnosticResult}
            contact={contact}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-semibold text-slate-300">
            Diagnosticador de Compliance SST Vaca Muerta | Ley 19.587, Decretos 351/79 y 911/96 & Res. SRT Neuquén
          </p>
          <p className="text-slate-500">
            Desarrollado para empresas proveedoras y contratistas de la industria del petróleo, gas y servicios en Neuquén.
          </p>
        </div>
      </footer>

      {/* OFF-SCREEN HIDDEN TEMPLATE FOR PERFECT PDF GENERATION */}
      <div className="fixed top-0 left-[-9999px] pointer-events-none opacity-0">
        <PDFReportTemplate result={diagnosticResult} id="pdf-report-template" />
      </div>
    </div>
  );
}
