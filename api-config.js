const DAIRY_API_URL = "https://script.google.com/macros/s/AKfycbyposUklQ0BPWlFjHVmYscHqYmQjGSVH2WDljyT1PgBBoicvrVS_MLv9vvncyFcvfgszQ/exec";

const DairyAPI = {
  // Función para leer datos (Inventario o Pedidos)
  obtenerDatos: async (pestaña) => {
    const response = await fetch(`${DAIRY_API_URL}?pestaña=${pestaña}`);
    return await response.json();
  },
  
  // Función para enviar datos (Ventas o Pedidos)
  enviarDatos: async (pestaña, datos) => {
    datos.pestaña = pestaña;
    return await fetch(DAIRY_API_URL, {
      method: 'POST',
      body: JSON.stringify(datos)
    });
  }
};
