// api-config.js - VERSIÓN DEFINITIVA (solo GET, sin errores)
const API_URL = 'https://script.google.com/macros/s/AKfycbww38Ya-F4EIPDv-xN1cnj8bujTGlM6dVWOF_sTn9SGbp5krZ6pDmwAjIlcWGTl3000Vw/exec';

const DairyAPI = {
    // Leer datos
    async obtenerDatos(pestaña) {
        try {
            const url = `${API_URL}?action=obtener&pestaña=${encodeURIComponent(pestaña)}`;
            const response = await fetch(url);
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error("Error en obtenerDatos:", error);
            return [];
        }
    },

    // Guardar registro (usando GET)
    async guardarRegistro(pestaña, datos) {
        try {
            let params = new URLSearchParams();
            params.append('action', 'guardar');
            params.append('pestaña', pestaña);
            
            // Agregar todos los campos
            Object.keys(datos).forEach(key => {
                if(datos[key] !== undefined && datos[key] !== null) {
                    params.append(key, datos[key]);
                }
            });
            
            const url = `${API_URL}?${params.toString()}`;
            const response = await fetch(url);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error en guardarRegistro:", error);
            return { success: false, error: error.message };
        }
    },

    // Actualizar registro (usando GET)
    async actualizarRegistro(pestaña, ID, datos) {
        try {
            let params = new URLSearchParams();
            params.append('action', 'actualizar');
            params.append('pestaña', pestaña);
            params.append('ID', ID);
            
            // Agregar todos los campos a actualizar
            Object.keys(datos).forEach(key => {
                if(datos[key] !== undefined && datos[key] !== null) {
                    params.append(key, datos[key]);
                }
            });
            
            const url = `${API_URL}?${params.toString()}`;
            const response = await fetch(url);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error en actualizarRegistro:", error);
            return { success: false, error: error.message };
        }
    },

    // Eliminar registro (usando GET)
    async eliminarRegistro(pestaña, ID) {
        try {
            const url = `${API_URL}?action=eliminar&pestaña=${encodeURIComponent(pestaña)}&ID=${encodeURIComponent(ID)}`;
            const response = await fetch(url);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error en eliminarRegistro:", error);
            return { success: false, error: error.message };
        }
    },

    // Obtener último ID
    async obtenerUltimoID(pestaña) {
        try {
            const url = `${API_URL}?action=lastID&pestaña=${encodeURIComponent(pestaña)}`;
            const response = await fetch(url);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error en obtenerUltimoID:", error);
            return { last: 0, nextId: "P-001" };
        }
    }
};
