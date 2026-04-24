const DAIRY_API_URL = "https://script.google.com/macros/s/AKfycbxKA9S1YAhpz_p-DYgc8Jqf7sk4dDn4l8INmB1QlwrfZFGp44zS1dX1He7Jj3h4sBc1Tw/exec";

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
