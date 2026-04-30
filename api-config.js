/**
 * LÓGICA LÁCTEA - CLIENTE API v3.4
 */
const DAIRY_API_URL = "https://script.google.com/macros/s/AKfycbyIxGuAhEC-QV-iubrKj2N2RdxhZ8ay4TE0BnZYRbL8Sbn6kzImhvkm8TinPub_zNDavg/exec";

const DairyAPI = {
    obtenerDatos: async (pestaña) => {
        try {
            const response = await fetch(`${DAIRY_API_URL}?pestaña=${pestaña}`);
            return await response.json();
        } catch (error) {
            console.error("Error al obtener:", error);
            return [];
        }
    },

    // Cambiamos el nombre a guardarDatos para que coincida con tu HTML
    guardarDatos: async (pestaña, datos) => {
        try {
            const payload = { pestaña: pestaña, ...datos };
            // Quitamos 'no-cors' para poder leer si el servidor respondió "OK"
            // Nota: Google Apps Script requiere que el envío sea como texto plano o formulario
            await fetch(DAIRY_API_URL, {
                method: 'POST',
                mode: 'no-cors', // Mantenemos por seguridad de redirección de Google
                body: JSON.stringify(payload)
            });
            return "OK"; // Retornamos OK manualmente ya que no-cors no permite leer el body
        } catch (error) {
            console.error("Error al enviar:", error);
            throw error;
        }
    }
};
