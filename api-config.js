// ================================
// CONFIGURACIÓN API CENTRAL
// ================================

// 🔴 PON AQUÍ TU URL DE GOOGLE APPS SCRIPT
const SCRIPT_URL = "https://script.google.com/macros/s/TU_DEPLOY_ID/exec";

const DairyAPI = {

  // ================================
  // OBTENER DATOS
  // ================================
  obtenerDatos: async (sheetName) => {
    try {
      const res = await fetch(`${SCRIPT_URL}?action=get&sheet=${sheetName}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error obtenerDatos:", error);
      return [];
    }
  },

  // ================================
  // GUARDAR / ACTUALIZAR DATOS
  // ================================
  guardarDatos: async (sheetName, payload) => {
    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          sheet: sheetName,
          ...payload
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const text = await res.text();
      return text;

    } catch (error) {
      console.error("Error guardarDatos:", error);
      return "ERROR";
    }
  }
};
