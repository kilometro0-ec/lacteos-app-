// ============================================================
// API CONFIG - LÓGICA LÁCTEA
// Versión para GitHub Pages (funciona en PC y Celular)
// ============================================================

// ⚠️ ACTUALIZA ESTA URL CON LA QUE OBTENGAS DESPUÉS DE PUBLICAR
const API_BASE_URL = "https://script.google.com/macros/s/AKfycbyAevYvQnbdiYt8RaifEMExFt9VMybh6YHVsLrSEo2-_v-96HW-sgPAWLXIQ8V_iFbTfA/exec";

const DairyAPI = {
    // ========== GET: Obtener datos ==========
    async obtenerDatos(pestaña) {
        try {
            // Usar JSONP-like approach para evitar CORS
            const url = `${API_BASE_URL}?pestaña=${encodeURIComponent(pestaña)}&t=${Date.now()}`;
            console.log(`📡 Obteniendo datos de: ${pestaña}`, url);
            
            // Intentar con fetch normal
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const text = await response.text();
            console.log(`📥 Respuesta recibida (${text.length} chars)`);
            
            try {
                const json = JSON.parse(text);
                if (json.error) throw new Error(json.error);
                console.log(`✅ Datos cargados: ${json.data?.length || 0}`);
                return json.data || [];
            } catch (parseError) {
                console.error("Error parseando JSON:", parseError);
                return [];
            }
            
        } catch (error) {
            console.error(`❌ Error en obtenerDatos (${pestaña}):`, error.message);
            
            // Intentar con Google Apps Script URL directa
            try {
                const scriptUrl = API_BASE_URL.replace('/exec', '/dev');
                const response = await fetch(`${scriptUrl}?pestaña=${pestaña}`, {
                    method: 'GET',
                    mode: 'no-cors'
                });
                console.warn(`⚠️ Usando modo no-cors para ${pestaña}`);
                return [];
            } catch (e) {
                return [];
            }
        }
    },

    // ========== POST: Enviar datos (usando no-cors para celular) ==========
    async enviarDatos(datos) {
        try {
            console.log(`📤 Enviando a: ${datos.pestaña}`, datos);
            
            // Estrategia 1: Intentar con fetch normal
            try {
                const response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                
                if (response.ok) {
                    const json = await response.json();
                    if (!json.error) {
                        console.log(`✅ Datos guardados`);
                        return json;
                    }
                }
            } catch (corsError) {
                console.warn("CORS error, intentando método alternativo:", corsError.message);
            }
            
            // Estrategia 2: Usar JSONP (crear un script dinámico)
            return await this.enviarDatosJSONP(datos);
            
        } catch (error) {
            console.error(`❌ Error al enviar:`, error);
            
            // Guardar localmente para reintentar después
            this.guardarPendiente(datos);
            alert(`⚠️ Datos guardados localmente. Se sincronizarán cuando haya conexión.`);
            return { success: true, local: true };
        }
    },

    // Método alternativo usando imagen/script (evita CORS)
    async enviarDatosJSONP(datos) {
        return new Promise((resolve, reject) => {
            const callbackName = `callback_${Date.now()}`;
            const url = `${API_BASE_URL}?callback=${callbackName}&data=${encodeURIComponent(JSON.stringify(datos))}`;
            
            window[callbackName] = (response) => {
                delete window[callbackName];
                document.body.removeChild(script);
                if (response.error) {
                    reject(new Error(response.error));
                } else {
                    resolve(response);
                }
            };
            
            const script = document.createElement('script');
            script.src = url;
            script.onerror = () => {
                delete window[callbackName];
                document.body.removeChild(script);
                reject(new Error("Error de conexión"));
            };
            document.body.appendChild(script);
        });
    },

    // Guardar datos pendientes localmente
    guardarPendiente(datos) {
        try {
            const pendientes = JSON.parse(localStorage.getItem('api_pendientes') || '[]');
            pendientes.push({ ...datos, timestamp: Date.now() });
            localStorage.setItem('api_pendientes', JSON.stringify(pendientes));
            console.log(`💾 Datos guardados localmente. Total pendientes: ${pendientes.length}`);
        } catch (e) {
            console.error("Error guardando localmente:", e);
        }
    },

    // Sincronizar datos pendientes
    async sincronizarPendientes() {
        const pendientes = JSON.parse(localStorage.getItem('api_pendientes') || '[]');
        if (pendientes.length === 0) return;
        
        console.log(`🔄 Sincronizando ${pendientes.length} items pendientes...`);
        
        for (const item of pendientes) {
            try {
                await this.enviarDatos(item);
                // Eliminar del localStorage si tuvo éxito
                const nuevos = pendientes.filter(p => p.timestamp !== item.timestamp);
                localStorage.setItem('api_pendientes', JSON.stringify(nuevos));
            } catch (e) {
                console.error("Error sincronizando:", e);
            }
        }
    },

    // ========== ELIMINAR ==========
    async eliminarDato(pestaña, id) {
        try {
            console.log(`🗑️ Eliminando: ${pestaña} / ${id}`);
            
            // Usar POST con acción especial
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pestaña: pestaña,
                    ID: id,
                    accion: "ELIMINAR"
                })
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const json = await response.json();
            if (json.error) throw new Error(json.error);
            
            console.log(`✅ Eliminado correctamente`);
            return json;
            
        } catch (error) {
            console.error(`❌ Error al eliminar:`, error);
            alert(`❌ No se pudo eliminar. Error: ${error.message}\n\nVerifica tu conexión o intenta más tarde.`);
            throw error;
        }
    },

    // ========== FUNCIONES ESPECÍFICAS ==========
    async crearCliente(cliente) {
        const ahora = new Date();
        const fechaReg = ahora.toLocaleDateString() + " " + ahora.toLocaleTimeString();
        
        return this.enviarDatos({
            pestaña: "Clientes",
            ID: `C-${Date.now().toString().slice(-6)}`,
            Nombre: cliente.Nombre.toUpperCase(),
            CI_RUC: cliente.CI_RUC,
            Teléfono: cliente.Teléfono,
            Dirección: cliente.Dirección,
            Referencia: cliente.Referencia,
            Sector: cliente.Sector,
            "Fecha Registro": fechaReg
        });
    },

    async actualizarCliente(id, datos) {
        return this.enviarDatos({
            pestaña: "Clientes",
            ID: id,
            ...datos
        });
    },

    async eliminarCliente(id) {
        return this.eliminarDato("Clientes", id);
    },

    async crearVenta(venta) {
        return this.enviarDatos({
            pestaña: "Ventas",
            ID_Venta: venta.ID_Venta,
            Cliente: venta.Cliente,
            Producto: venta.Producto,
            Cantidad: venta.Cantidad,
            Precio_PVP: venta.Precio_PVP,
            Fecha_Entrega: venta.Fecha_Entrega,
            Estado_Entrega: venta.Estado_Entrega || "PENDIENTE"
        });
    },

    async crearProducto(producto) {
        return this.enviarDatos({
            pestaña: "Inventario",
            Fecha: new Date().toISOString().split('T')[0],
            ID: `P-${Date.now().toString().slice(-6)}`,
            Producto: producto.Producto.toUpperCase(),
            Stock: producto.Stock || 0,
            Precio_Distribuidor: producto.Precio_Distribuidor || 0,
            Precio_Venta: producto.Precio_Venta,
            Ventas: 0,
            Proveedor: producto.Proveedor || "GENERAL"
        });
    }
};

// Inicializar sincronización al cargar
window.DairyAPI = DairyAPI;

// Intentar sincronizar datos pendientes
window.addEventListener('load', () => {
    setTimeout(() => {
        DairyAPI.sincronizarPendientes();
    }, 3000);
});

console.log("✅ API Config cargado");
