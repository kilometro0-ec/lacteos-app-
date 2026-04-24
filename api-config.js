/**
 * LÓGICA LÁCTEA - CLIENTE API v3.3
 * Conexión centralizada con Google Apps Script
 */

const DAIRY_API_URL = "https://script.google.com/macros/s/AKfycbx24VHdEYSc9AzZ3o9k4MBsqI3vUoPQvpS82B0FKFN7l9Z2A2J_Xh-MjOYalxHDm2DB1g/exec";

const DairyAPI = {
    /**
     * Obtiene datos de cualquier pestaña (Inventario, Ventas, Clientes)
     * @param {string} pestaña - Nombre exacto de la hoja en Google Sheets
     */
    obtenerDatos: async (pestaña) => {
        try {
            const response = await fetch(`${DAIRY_API_URL}?pestaña=${pestaña}`);
            if (!response.ok) throw new Error("Error en la respuesta del servidor");
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener datos de ${pestaña}:`, error);
            return [];
        }
    },

    /**
     * Envía datos para registrar Ventas, Clientes o actualizar Inventario
     * @param {string} pestaña - Nombre de la hoja destino
     * @param {Object} datos - Objeto con la información a guardar
     */
    enviarDatos: async (pestaña, datos) => {
        try {
            // Añadimos el nombre de la pestaña al objeto de datos
            const payload = { 
                pestaña: pestaña, 
                ...datos 
            };

            const response = await fetch(DAIRY_API_URL, {
                method: 'POST',
                mode: 'no-cors', // Evita problemas de política CORS en navegadores
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            // Nota: Con 'no-cors', la respuesta siempre será opaca (no se puede leer el texto)
            // pero si no hay error de red, el envío fue exitoso.
            return true; 
        } catch (error) {
            console.error(`Error al enviar datos a ${pestaña}:`, error);
            throw error;
        }
    }
};
