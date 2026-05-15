const API_URL = "https://script.google.com/macros/s/AKfycbwo5wOYZXzMRP_frRGQze0MydQC-pPaQQFLW67ipByMO9jvrVH9xZf_fSLMYFhw-xGb/exec";

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
