const API_URL = "https://script.google.com/macros/s/AKfycbwwSQLJxsL3yUgOJzakgr_47X1q5X-BpH6e3xTIAC2ECAKIwlfJVEjT0qsqVWg-PnEW-w/exec";

const DairyAPI = {

  async obtenerDatos(pestaña) {
    const res = await fetch(`${API_URL}?pestaña=${pestaña}`);
    return (await res.json()).data || [];
  },

  async enviarDatos(data) {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });

    return await res.json();
  }

};
