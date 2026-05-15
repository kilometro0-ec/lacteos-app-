const API_URL = "https://script.google.com/macros/s/AKfycbwlMnyLLaxTX_N9DQ7SldOs2dlJIfwmeNz940tGahfD49Ba134_UBKRFnL7Pyqc3NGn6Q/exec";

const DairyAPI = {

  async obtenerDatos(pestaña) {
    try {
      const res = await fetch(`${API_URL}?pestaña=${encodeURIComponent(pestaña)}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.error("GET ERROR:", err);
      return [];
    }
  },

  async enviarDatos(payload) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      return await res.json();

    } catch (err) {
      console.error("POST ERROR:", err);
      return { error: true };
    }
  }

};
