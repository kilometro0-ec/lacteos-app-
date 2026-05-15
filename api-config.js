// ======================================================
// LÓGICA LÁCTEA - API ÚNICA (CORREGIDA)
// ======================================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz7Xk0TC_18Q5jd0MvtwTddVHkhLnsJ7SraLpwl3i2Ki6ru81OVpsc-zDgf5tfqLFoDbA/exec";

const DairyAPI = {

  // =========================
  // GET (Inventario / Ventas / Clientes)
  // =========================
  async obtenerDatos(pestaña) {
    try {
      const res = await fetch(
        `${SCRIPT_URL}?pestaña=${encodeURIComponent(pestaña)}`
      );

      const json = await res.json();

      console.log("GET:", pestaña, json);

      return json.data || [];

    } catch (err) {
      console.error("ERROR GET:", err);
      return [];
    }
  },

  // =========================
  // POST (Clientes / Ventas / Compras)
  // =========================
  async enviarDatos(payload) {
    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      console.log("POST:", json);

      return json;

    } catch (err) {
      console.error("ERROR POST:", err);
      return { success: false, error: err.toString() };
    }
  }

};

// GLOBAL
window.DairyAPI = DairyAPI;
