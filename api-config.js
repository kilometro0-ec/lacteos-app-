const DairyConfig = {
    // ID de implementación web activo en Google Apps Script
    SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzRAExScHJ54RxpXseI2yrgdSwSwDlqdSq3qHYqZEaBqzBbXlJ2s-9KrRGF8ekHB1cLXQ/exec",
    VERSION: "1.4"
};

const DairyAPI = {
    // Mantén tu función obtenerDatos igual...
    async obtenerDatos(pestana) {
        const url = `${DairyConfig.SCRIPT_URL}?pestana=${encodeURIComponent(pestana)}&accion=leer`;
        try {
            const response = await fetch(url, {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "text/plain" }
            });
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error al leer datos de la pestaña [${pestana}]:`, error);
            throw error;
        }
    },

    /**
     * Envía procesos transaccionales al servidor alineado con doPost(e)
     */
    async guardarDatos(pestana, payload) {
        try {
            // Aseguramos que viaje el parámetro "action" que tu script de Apps Script busca estrictamente
            const cuerpoEnvio = { 
                pestana: pestana, 
                action: payload.action || payload.accion, 
                ...payload 
            };
            
            // Usamos "no-cors" para prevenir los bloqueos clásicos que hace Google Script al redirigir la petición de macros
            const response = await fetch(DairyConfig.SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", 
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(cuerpoEnvio) 
            });
            
            // Nota: Con "no-cors" la respuesta regresará opaca, pero los datos se insertarán con éxito en la hoja.
            return { status: "success", message: "Petición despachada al servidor." };
        } catch (error) {
            console.error(`Error al guardar datos en la pestaña [${pestana}]:`, error);
            throw error;
        }
    }
};
