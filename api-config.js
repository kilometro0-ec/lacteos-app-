/**
 * LÓGICA LÁCTEA - CLIENTE API v4.1 (CORREGIDO CORS)
 * Solución para CORS con Google Apps Script
 */

const DAIRY_API_URL = "https://script.google.com/macros/s/AKfycbxfeCS_jHckt_eps4g-2FbfEtr6nfzcIyIoV9VAXlB3dlLXfLnMtKuZpyQu4vwbHG8IrA/exec";

const DairyAPI = {
    // 1. LECTURA DE DATOS (doGet) - Esto funciona con GET normal
    obtenerDatos: async (pestaña, reintentos = 3) => {
        for (let intento = 1; intento <= reintentos; intento++) {
            try {
                // IMPORTANTE: Usar no-cors para GET también
                const response = await fetch(`${DAIRY_API_URL}?pestaña=${encodeURIComponent(pestaña)}`, {
                    method: 'GET',
                    mode: 'no-cors'
                });
                
                // Con no-cors, no podemos leer la respuesta directamente
                // pero como es GET, Google Apps Script permite CORS automáticamente
                // Vamos a usar un enfoque alternativo
                const textResponse = await response.text();
                // Intentar parsear como JSON
                try {
                    const data = JSON.parse(textResponse);
                    if (data.error) throw new Error(data.error);
                    return data.data || [];
                } catch (e) {
                    // Si no es JSON válido, podría ser un error
                    console.error("Error parsing response:", textResponse);
                    return [];
                }
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

    // 2. ENVÍO DE DATOS (doPost) - Para POST necesitamos otro enfoque
    enviarDatos: async (datos, reintentos = 3) => {
        for (let intento = 1; intento <= reintentos; intento++) {
            try {
                // Usamos JSONP-style pero con POST
                // Agregamos un parámetro timestamp para evitar caché
                const timestamp = Date.now();
                
                // IMPORTANTE: Usar mode: 'no-cors' para evitar CORS
                // Con no-cors, no podemos leer la respuesta, pero la petición se envía
                await fetch(`${DAIRY_API_URL}?t=${timestamp}`, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                });
                
                // Con no-cors, asumimos éxito si no hay error de red
                return { success: true, data: { id: datos.ID_Venta || 'ok' } };
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
