// ================================
// CONFIGURACIÓN API CENTRAL
// ================================

// 🔴 PON AQUÍ TU URL DE GOOGLE APPS SCRIPT
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzmON_L0C1Ci2sQxMPAUDKN2nbPI3HZGAlqFjNkrF7ZHK2jaI-RMqagzL_3S6pkgZxl5w/exec";

const DairyAPI = {

  async get(sheet) {
    const res = await fetch(`${SCRIPT_URL}?pestaña=${sheet}`);
    const json = await res.json();
    return json.data || [];
  },

  async post(payload) {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    return await res.text();
  }
};
