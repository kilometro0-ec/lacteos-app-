const API_URL = "https://script.google.com/macros/s/AKfycby7NpAxUYXx4LQ2E7RRXKX8-puxQYVJXpzBFSBFvNf0q7vAXw3ojUE1trpipo5QAaLCRQ/exec";

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
