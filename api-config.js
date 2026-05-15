const API_URL = "https://script.google.com/macros/s/AKfycbxabIAD-6st9we-W1KI6zKPAcFM842eu8RNos23QWAxP0jvzSahbAbEyYgQzAqz0J8c6A/exec";

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
