import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory lead storage for demonstration / review
const leadsStorage: any[] = [];

// Gemini API lazy client initialization
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      genAI = new GoogleGenAI({ apiKey });
    }
  }
  return genAI;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Diagnosticador Compliance SST Vaca Muerta" });
});

// Endpoint to receive lead submissions & diagnostic results
app.post("/api/leads", (req, res) => {
  try {
    const leadData = req.body;
    const newEntry = {
      id: "LEAD-" + Date.now(),
      createdAt: new Date().toISOString(),
      ...leadData,
    };
    leadsStorage.push(newEntry);
    console.log("New Lead captured for Vaca Muerta SST Diagnostic:", leadData.companyName, leadData.email);
    res.json({ success: true, leadId: newEntry.id, message: "Diagnóstico registrado con éxito. Se enviará una copia al correo indicado." });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint for AI HSE Advisory on Vaca Muerta compliance
app.post("/api/advisor", async (req, res) => {
  try {
    const { prompt, companyContext } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        reply: "Para habilitar respuestas personalizadas por Inteligencia Artificial de Gemini, asegúrese de configurar GEMINI_API_KEY en el panel de secretos de AI Studio. Mientras tanto, consulte la guía normativa oficial de la SRT y decretos 351/79 y 911/96."
      });
    }

    const systemInstruction = `Eres un experto senior e Inspector Certificado en Higiene y Seguridad Laboral (SST) especialista en la industria de Hidrocarburos y Servicios de Vaca Muerta (Provincia de Neuquén, Argentina).
Conoces a detalle:
- Ley Nacional 19.587 de Higiene y Seguridad
- Decreto 351/79 (Industria general y servicio de H&S)
- Decreto 911/96 (Construcción y obras en yacimiento)
- Resoluciones SRT: 1338/96 (Horas profesionales), 905/15 (Medicina laboral), 900/15 (Puesta a tierra), 84/12 (Iluminación), 85/12 (Ruido), 861/15 (Químicos/Sílice de fractura), 886/15 (Ergonomía), 463/09 (RGRL).
- Requerimientos específicos de operadoras de Vaca Muerta (YPF, Vista Energy, Pan American Energy, Shell, Tecpetrol) como pases de yacimiento, licencias de conducir defensivo, habilitación de vehículos 4x4, permisos de trabajo de alto riesgo (PTAR) para calor, espacios confinados, izaje y altura.

Responde de forma clara, técnica pero accesible, profesional, en español neutro/argentino técnico.`;

    const contents = `Contexto de la empresa en Vaca Muerta:
- Razón Social/Nombre: ${companyContext?.companyName || "Empresa proveedora"}
- Sector/Categoría: ${companyContext?.industryLabel || "Servicios Industriales"}
- Dotación: ${companyContext?.workers || "No especificada"} trabajadores
- Riesgos detectados: ${companyContext?.risks?.join(", ") || "No especificados"}

Consulta del usuario:
"${prompt}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
      }
    });

    return res.json({ reply: response.text || "No se obtuvo respuesta del modelo de IA." });
  } catch (err: any) {
    console.error("Error in AI advisor endpoint:", err);
    return res.status(500).json({ error: "Error al procesar la consulta con IA de Gemini: " + err.message });
  }
});

async function startServer() {
  // Vite middleware for development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
