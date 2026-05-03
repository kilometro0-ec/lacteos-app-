/**
 * LÓGICA LÁCTEA - CLIENTE API v3.5 (CORREGIDO)
 */
const DAIRY_API_URL = "https://script.google.com/macros/s/AKfycbxwkd6RUJIPkiERkJ3PMzfGu8D7ciJ-i-xr88edOpdnIpd4zM1aILpPQIN8Y3tu_MeD-Q/exec";

const DairyAPI = {
    // Para leer datos de las pestañas
    obtenerDatos: async (pestaña) => {
        try {
            const response = await fetch(`${DAIRY_API_URL}?pestaña=${pestaña}`);
            if (!response.ok) throw new Error("Error en respuesta de red");
            return await response.json();
        } catch (error) {
            console.error("Error al obtener datos de " + pestaña + ":", error);
            return [];
        }
    },

    // Esta es la función que invoca tu HTML de Ranking
    enviarDatos: async (datos) => {
        try {
            // El objeto 'datos' ya incluye la propiedad 'pestaña' desde el HTML
            const response = await fetch(DAIRY_API_URL, {
                method: 'POST',
                mode: 'no-cors', // Necesario para evitar bloqueos de redirección de Google
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify(datos)
            });

            // Como usamos 'no-cors', el navegador no nos deja leer la respuesta de Google
            // por seguridad, así que asumimos que si no hubo error de red, se envió.
            return "OK"; 
        } catch (error) {
            console.error("Error crítico en enviarDatos:", error);
            throw error;
        }
    },

    // Mantenemos guardarDatos por si otros archivos tuyos lo usan
    guardarDatos: async (pestaña, datos) => {
        const payload = { pestaña: pestaña, ...datos };
        return await DairyAPI.enviarDatos(payload);
    }
};
