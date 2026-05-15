const API_URL = "https://script.google.com/macros/s/AKfycbxabIAD-6st9we-W1KI6zKPAcFM842eu8RNos23QWAxP0jvzSahbAbEyYgQzAqz0J8c6A/exec";

const DairyAPI = {

  // Obtener datos de una pestaña
  async obtenerDatos(pestaña) {
    try {
      const res = await fetch(`${API_URL}?pestaña=${pestaña}`);
      const json = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Error en obtenerDatos:", error);
      throw error;
    }
  },

  // Enviar cualquier operación al backend
  async enviarDatos(data) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (error) {
      console.error("Error en enviarDatos:", error);
      throw error;
    }
  },

  // Crear un nuevo registro
  async crearDato(pestaña, datos) {
    const payload = {
      pestaña: pestaña,
      ...datos
    };
    return await this.enviarDatos(payload);
  },

  // Actualizar un registro existente
  async actualizarDato(pestaña, id, datos) {
    const payload = {
      pestaña: pestaña,
      ID: id,
      ...datos
    };
    return await this.enviarDatos(payload);
  },

  // Eliminar un registro
  async eliminarDato(pestaña, id) {
    const payload = {
      pestaña: pestaña,
      accion: "ELIMINAR",
      ID: id
    };
    return await this.enviarDatos(payload);
  }

};
