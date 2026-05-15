const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyz4hORwNYw0dc0VsUylODIxwHyi0pdLkn3DQjg3L1ih0j5wufUYVSyKiLhH3k-BomczA/exec";

const DairyAPI = {

  obtenerDatos: async (pestaña) => {
    try {
      const res = await fetch(
        `${SCRIPT_URL}?pestaña=${encodeURIComponent(pestaña)}`
      );

      const json = await res.json();

      console.log("API OK:", pestaña, json);

      return json.data || [];

    } catch (err) {
      console.error("ERROR API:", err);
      return [];
    }
  },

  enviarDatos: async (payload) => {
    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      });

      return await res.json();

    } catch (err) {
      console.error("ERROR POST:", err);
      return { status: "ERROR" };
    }
  }

};
