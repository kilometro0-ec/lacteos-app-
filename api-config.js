const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzj-hpDcD6QNhykeTvLo5hIcAy3Kzk0_YUPeeKhgb08Vsib-xwPN0oskoOI_f637ZaZ6A/exec";

const DairyAPI = {

  // =========================
  // OBTENER DATOS (GET)
  // =========================
  async obtenerDatos(pestaña) {
    try {
      const res = await fetch(
        `${SCRIPT_URL}?sheet=${encodeURIComponent(pestaña)}`
      );

      const json = await res.json();

      console.log("GET OK:", pestaña, json);

      return Array.isArray(json) ? json : [];

    } catch (err) {
      console.error("ERROR GET:", err);
      return [];
    }
  },

  // =========================
  // ENVIAR DATOS (POST SIN CORS)
  // =========================
  async enviarDatos(payload) {

    try {

      const formData = new FormData();

      for (const key in payload) {
        formData.append(key, payload[key]);
      }

      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
      });

      const text = await res.text();

      console.log("POST OK:", text);

      try {
        return JSON.parse(text);
      } catch {
        return { success: true, raw: text };
      }

    } catch (err) {
      console.error("ERROR POST:", err);
      return { success: false };
    }
  }

};
