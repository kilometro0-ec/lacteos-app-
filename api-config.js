const DairyConfig = {
    SCRIPT_URL: "https://script.google.com/macros/s/AKfycby1n0pOBGYNy0taa85lnQ6YAkYeFzOmlJ8IYORmYjC9EKmbn0oebU4ak_hh1cPZCkmN/exec",
    VERSION: "1.5"
};

const DairyAPI = {
    // LECTURA de datos (GET) con cache: 'no-store'
    async obtenerDatos(pestana) {
        const url = `${DairyConfig.SCRIPT_URL}?pestana=${encodeURIComponent(pestana)}&accion=leer`;
        try {
            const response = await fetch(url, {
                method: "GET",
                cache: "no-store",               // ← EVITA CACHÉ DEL NAVEGADOR
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache"
                }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error(`Error al leer ${pestana}:`, error);
            throw error;
        }
    },

    // ESCRITURA (POST) – Sin no-cors para poder leer respuesta (opcional)
    async guardarDatos(pestana, payload) {
        const cuerpo = {
            pestana: pestana,
            action: payload.action || payload.accion,
            ...payload
        };
        try {
            const response = await fetch(DairyConfig.SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },  // ← Usamos JSON, no text/plain
                body: JSON.stringify(cuerpo)
            });
            // Si quieres ignorar la respuesta (modo no-cors) usa esto:
            // return { status: "success", message: "Enviado" };
            // Pero mejor intentar leer la respuesta:
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(`Error al guardar en ${pestana}:`, error);
            throw error;
        }
    }
};
