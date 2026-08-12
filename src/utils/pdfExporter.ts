import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { DiagnosticResult } from "../types";

/**
 * High-Precision PDF Exporter for Patagonia Consult SRL.
 * Ensures clean page margins, repeating headers/footers, exact A4 pagination, and high DPI rendering.
 */
export async function generatePDFReport(result: DiagnosticResult, elementId: string = "pdf-report-template") {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("PDF template element not found:", elementId);
    return;
  }

  // Ensure element is visible during capture
  const originalDisplay = element.style.display;
  element.style.display = "block";

  try {
    // Look for explicit page containers (.pdf-page)
    const pageElements = Array.from(element.querySelectorAll<HTMLElement>(".pdf-page"));

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    if (pageElements.length > 0) {
      // MULTI-PAGE STRATEGY: Process each explicit .pdf-page
      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];

        const canvas = await html2canvas(pageEl, {
          scale: 2, // High DPI / Retina clarity
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: 800,
          onclone: (clonedDoc) => {
            sanitizeColorsForHtml2Canvas(clonedDoc);
          },
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.98);

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      }
    } else {
      // SINGLE CONTAINER FALLBACK: Capture full container & slice at exact A4 page intervals
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 800,
        onclone: (clonedDoc) => {
          sanitizeColorsForHtml2Canvas(clonedDoc);
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Page 1
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;

      let pageNum = 1;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pdfHeight;
        pageNum++;
      }
    }

    element.style.display = originalDisplay;

    const sanitizedCompany = (result.profile.companyName || "Empresa")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `Informe_Compliance_SST_VacaMuerta_${sanitizedCompany}.pdf`;

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF report:", error);
    element.style.display = originalDisplay;
    alert("Ocurrió un inconveniente al generar el PDF. Por favor reintente o utilice la función de impresión del navegador.");
  }
}

/**
 * Safely resolves modern CSS color functions (oklab, oklch, color-mix)
 * into standard RGB strings using browser's native DOM style parser.
 */
function sanitizeColorsForHtml2Canvas(clonedDoc: Document) {
  // Create a temporary element in clonedDoc body to resolve colors natively
  const tempEl = clonedDoc.createElement("div");
  tempEl.style.display = "none";
  clonedDoc.body.appendChild(tempEl);

  const resolveColorToRgb = (colorVal: string): string => {
    if (
      !colorVal ||
      (!colorVal.includes("oklch") && !colorVal.includes("oklab") && !colorVal.includes("color-mix"))
    ) {
      return colorVal;
    }

    try {
      tempEl.style.color = "";
      tempEl.style.color = colorVal;
      const computed = window.getComputedStyle(tempEl).color;
      if (
        computed &&
        !computed.includes("oklch") &&
        !computed.includes("oklab") &&
        !computed.includes("color-mix")
      ) {
        return computed;
      }
    } catch {
      // Fallback
    }

    return "transparent";
  };

  const allElements = Array.from(clonedDoc.querySelectorAll<HTMLElement>("*"));
  const colorProps = [
    "color",
    "background-color",
    "border-color",
    "border-top-color",
    "border-bottom-color",
    "border-left-color",
    "border-right-color",
    "outline-color",
    "fill",
    "stroke",
  ];

  allElements.forEach((htmlEl) => {
    // 1. Sanitize raw inline style attributes if present
    const rawStyle = htmlEl.getAttribute("style");
    if (
      rawStyle &&
      (rawStyle.includes("oklab") || rawStyle.includes("oklch") || rawStyle.includes("color-mix"))
    ) {
      // Resolve properties individually
      colorProps.forEach((prop) => {
        const styleVal = htmlEl.style.getPropertyValue(prop);
        if (
          styleVal &&
          (styleVal.includes("oklab") || styleVal.includes("oklch") || styleVal.includes("color-mix"))
        ) {
          const resolved = resolveColorToRgb(styleVal);
          htmlEl.style.setProperty(prop, resolved, "important");
        }
      });
    }

    // 2. Inspect computed styles
    try {
      const computed = window.getComputedStyle(htmlEl);
      colorProps.forEach((prop) => {
        const val = computed.getPropertyValue(prop);
        if (
          val &&
          (val.includes("oklab") || val.includes("oklch") || val.includes("color-mix"))
        ) {
          const resolved = resolveColorToRgb(val);
          htmlEl.style.setProperty(prop, resolved, "important");
        }
      });
    } catch {
      // Ignore element style inspection errors
    }
  });

  tempEl.remove();
}
