/**
 * LÓGICA LÁCTEA - CLIENTE API v3.7 (ESTRUCTURA LIMPIA)
 */
const DAIRY_API_URL = "https://script.google.com/macros/s/AKfycbxkzj0xXlX9GUqucXs1tovdZFUYhEz8HAZV4W19vA8DSShqdwQdspOhj9Zo1Q5uhuQK2w/exec";

const DairyAPI = {
    // 1. LECTURA DE DATOS (doGet)
    obtenerDatos: async (pestaña) => {
        try {
            const response = await fetch(`${DAIRY_API_URL}?pestaña=${pestaña}`);
            if (!response.ok) throw new Error("Error en red");
            return await response.json();
        } catch (error) {
            console.error("Error al obtener:", error);
            return [];
        }
    },

    // 2. ENVÍO DE DATOS (doPost)
    enviarDatos: async (datos) => {
        try {
            // Se usa 'text/plain' y 'no-cors' para evitar bloqueos de seguridad de Google
            await fetch(DAIRY_API_URL, {
                method: 'POST',
                mode: 'no-cors', 
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(datos)
            });
            // Con no-cors asumimos éxito si no hay error de red
            return "OK"; 
        } catch (error) {
            console.error("Error al enviar:", error);
            throw error;
        }
    },

    // 3. ALIAS PARA COMPATIBILIDAD CON OTROS SCRIPTS
    guardarDatos: async (pestaña, datos) => {
        const payload = { pestaña: pestaña, ...datos };
        return await DairyAPI.enviarDatos(payload);
    }
};
