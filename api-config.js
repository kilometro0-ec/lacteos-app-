const API_URL = "https://script.google.com/macros/s/AKfycbxU-8DbQdSh--ZgiZaAGi0rJ8anZiNh2myIxdGet4oSaULG8F9XCbMRJlQlQGBWhdV92Q/exec";

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
