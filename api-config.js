/**
 * LÓGICA LÁCTEA - CLIENTE API v5.0 (CORREGIDO COMPLETAMENTE)
 */

const DAIRY_API_URL = "https://script.google.com/macros/s/AKfycbxfeCS_jHckt_eps4g-2FbfEtr6nfzcIyIoV9VAXlB3dlLXfLnMtKuZpyQu4vwbHG8IrA/exec";

const DairyAPI = {
    // 1. LECTURA DE DATOS (doGet)
    obtenerDatos: async (pestaña) => {
        try {
            const url = `${DAIRY_API_URL}?pestaña=${encodeURIComponent(pestaña)}&t=${Date.now()}`;
            console.log("Fetching:", url);
            
            const response = await fetch(url);
            const text = await response.text();
            console.log("Response text:", text);
            
            // Intentar parsear como JSON
            const data = JSON.parse(text);
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            return data.data || [];
        } catch (error) {
            console.error("Error al obtener", pestaña, error);
            return [];
        }
    },

    // 2. ENVÍO DE DATOS (doPost)
    enviarDatos: async (datos) => {
        try {
            console.log("Enviando datos:", datos);
            
            const response = await fetch(DAIRY_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            });
            
            const text = await response.text();
            console.log("Response:", text);
            
            try {
                const resultado = JSON.parse(text);
                if (!resultado.success) {
                    throw new Error(resultado.error || "Error desconocido");
                }
                return resultado;
            } catch (e) {
                // Si no es JSON pero la respuesta está vacía, asumimos éxito
                if (text === "") {
                    return { success: true };
                }
                throw new Error("Respuesta inválida del servidor");
            }
        } catch (error) {
            console.error("Error al enviar:", error);
            throw error;
        }
    },

    // 3. ALIAS PARA COMPATIBILIDAD
    guardarDatos: async (pestaña, datos) => {
        const payload = { pestaña: pestaña, ...datos };
        return await DairyAPI.enviarDatos(payload);
    }
};
