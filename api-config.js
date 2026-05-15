/**
 * LÓGICA LÁCTEA - CLIENTE API v4.0 (COMPLETO)
 * Mejoras: manejo de errores, reintentos, normalización de textos
 */

const DAIRY_API_URL = "https://script.google.com/macros/s/AKfycbyhuid6wQS8RM74_ZAKbzgC-2ZOpI3BgE2ZsDFZS22ffs9a7Usy1VZQDc5SwpgR5eoPBw/exec";

const DairyAPI = {
    // 1. LECTURA DE DATOS (doGet)
    obtenerDatos: async (pestaña, reintentos = 3) => {
        for (let intento = 1; intento <= reintentos; intento++) {
            try {
                const response = await fetch(`${DAIRY_API_URL}?pestaña=${encodeURIComponent(pestaña)}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                if (data.error) throw new Error(data.error);
                return data.data || [];
            } catch (error) {
                console.error(`Intento ${intento}/${reintentos} falló:`, error);
                if (intento === reintentos) {
                    console.error("Error al obtener:", pestaña, error);
                    return [];
                }
                await new Promise(r => setTimeout(r, 1000 * intento));
            }
        }
        return [];
    },

    // 2. ENVÍO DE DATOS (doPost)
    enviarDatos: async (datos, reintentos = 3) => {
        for (let intento = 1; intento <= reintentos; intento++) {
            try {
                const response = await fetch(DAIRY_API_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const resultado = await response.json();
                if (!resultado.success) throw new Error(resultado.error || "Error desconocido");
                return resultado;
            } catch (error) {
                console.error(`Intento ${intento}/${reintentos} falló:`, error);
                if (intento === reintentos) throw error;
                await new Promise(r => setTimeout(r, 1000 * intento));
            }
        }
    },

    // 3. ALIAS PARA COMPATIBILIDAD
    guardarDatos: async (pestaña, datos) => {
        const payload = { pestaña: pestaña, ...datos };
        return await DairyAPI.enviarDatos(payload);
    }
};

// Función de normalización global
function normalizarTexto(texto) {
    if (!texto) return "";
    return texto.toString()
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
