const API_URL = "https://script.google.com/macros/s/AKfycbziATkvhWLT263Pa43Eppw8cRuRXW7IyNsGo0r7Ox0ePlb7sX7j0EoRJvyxzImCsLSgRg/exec";

const DairyAPI = {

  async obtenerDatos(pestaña) {
    const res = await fetch(`${API_URL}?action=obtener&pestaña=${encodeURIComponent(pestaña)}`);
    return await res.json();
  },

  async enviarDatos(data) {
    // Convertir todo a parámetros GET
    const params = new URLSearchParams({
      action: "guardar",
      pestaña: data.pestaña,
      Fecha: data.Fecha || new Date().toISOString(),
      Producto: data.Producto,
      Stock: data.Stock || 0,
      Precio_Distribuidor: data.Precio_Distribuidor || 0,
      Precio_Venta: data.Precio_Venta || 0,
      Ventas: data.Ventas || 0,
      "Proveedor_Habitual": data["Proveedor Habitual"] || "GENERAL"
    });
    
    const res = await fetch(`${API_URL}?${params.toString()}`);
    return await res.json();
  },

  async actualizarDato(pestaña, id, datos) {
    const params = new URLSearchParams({
      action: "actualizar",
      pestaña: pestaña,
      id: id,
      Stock: datos.Stock || 0
    });
    
    const res = await fetch(`${API_URL}?${params.toString()}`);
    return await res.json();
  },

  async eliminarDato(pestaña, id) {
    const params = new URLSearchParams({
      action: "eliminar",
      pestaña: pestaña,
      id: id
    });
    
    const res = await fetch(`${API_URL}?${params.toString()}`);
    return await res.json();
  }

};
