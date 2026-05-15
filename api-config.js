// ============================================================
// CONFIGURACIÓN DE LA API - LÓGICA LÁCTEA
// ============================================================

const API_BASE_URL = "https://script.google.com/macros/s/AKfycbwV-o3eEVzSSTmLwaJu6PXlShWzFLNxVWTvEP3x9XtEZ48K7V-_XQxhosiEdx1_z9hkNA/exec";

const DairyAPI = {
    // ========== GET: Obtener datos ==========
    async obtenerDatos(pestaña) {
        try {
            const url = `${API_BASE_URL}?pestaña=${encodeURIComponent(pestaña)}`;
            const response = await fetch(url);
            const json = await response.json();
            
            if (json.error) throw new Error(json.error);
            return json.data || [];
        } catch (error) {
            console.error(`Error al obtener ${pestaña}:`, error);
            throw error;
        }
    },

    // ========== POST: Crear nuevo registro ==========
    async crearDato(pestaña, datos) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                mode: 'no-cors', // Importante para Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pestaña, ...datos })
            });
            return { success: true };
        } catch (error) {
            console.error(`Error al crear en ${pestaña}:`, error);
            throw error;
        }
    },

    // ========== PUT: Actualizar registro ==========
    async actualizarDato(pestaña, id, campos) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'PUT',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pestaña, ID: id, campos })
            });
            return { success: true };
        } catch (error) {
            console.error(`Error al actualizar en ${pestaña}:`, error);
            throw error;
        }
    },

    // ========== DELETE: Eliminar registro ==========
    async eliminarDato(pestaña, id) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'DELETE',
                mode: 'no-cors',
                headers: {
                    'Content-Type': application/json',
                },
                body: JSON.stringify({ pestaña, ID: id })
            });
            return { success: true };
        } catch (error) {
            console.error(`Error al eliminar en ${pestaña}:`, error);
            throw error;
        }
    },

    // ========== Enviar datos (POST genérico) ==========
    async enviarDatos(datos) {
        return this.crearDato(datos.pestaña, datos);
    }
};

// Exportar para uso global
window.DairyAPI = DairyAPI;
