const API_URL = "https://script.google.com/macros/s/AKfycbwV-o3eEVzSSTmLwaJu6PXlShWzFLNxVWTvEP3x9XtEZ48K7V-_XQxhosiEdx1_z9hkNA/exec";

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
