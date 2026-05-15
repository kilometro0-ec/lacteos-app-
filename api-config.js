const API_URL = "https://script.google.com/macros/s/AKfycbzJeiIp-PQpe7JTuxI7SxHkdglE3jXi9sx9MEA2vM8Y3na6kR4m-8_t4BkVPSRoegMcmQ/exec";

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
