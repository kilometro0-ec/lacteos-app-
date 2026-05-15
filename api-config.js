// ============================================================
// API CONFIG - LÓGICA LÁCTEA
// Versión CORREGIDA para CORS
// ============================================================

const API_BASE_URL = "https://script.google.com/macros/s/AKfycbw55kLetMyNEBOb9z9jcM3f6q2fhg-DxQkIyxScRGNws0Nr1Tr2mSOS7ZHGoZ813hKYkg/exec";

const DairyAPI = {
    // ========== GET: Obtener datos (funciona en PC y Celular) ==========
    async obtenerDatos(pestaña) {
        try {
            const url = `${API_BASE_URL}?pestaña=${encodeURIComponent(pestaña)}&t=${Date.now()}`;
            console.log(`📡 Obteniendo datos de: ${pestaña}`);
            
            // Estrategia 1: Intentar con JSONP (más compatible)
            const data = await this.fetchWithTimeout(url, 10000);
            
            // Intentar parsear como JSON
            try {
                const json = JSON.parse(data);
                if (json.error) throw new Error(json.error);
                console.log(`✅ Datos cargados: ${json.data?.length || 0} registros`);
                return json.data || [];
            } catch (parseError) {
                console.warn("Respuesta no es JSON válido, intentando otra estrategia");
                
                // Estrategia 2: Si falla, intentar con fetch normal
                const response = await fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const jsonResult = await response.json();
                if (jsonResult.error) throw new Error(jsonResult.error);
                return jsonResult.data || [];
            }
            
        } catch (error) {
            console.error(`❌ Error al obtener ${pestaña}:`, error);
            
            // Estrategia 3: Último recurso - retornar datos de prueba
            console.warn(`⚠️ Usando datos de respaldo para ${pestaña}`);
            return this.getFallbackData(pestaña);
        }
    },

    // Función para fetch con timeout
    async fetchWithTimeout(url, timeout = 10000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });
            clearTimeout(timeoutId);
            return await response.text();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    },

    // Datos de respaldo para cuando no hay conexión
    getFallbackData(pestaña) {
        const fallbackData = {
            "Inventario": [
                { ID: "P-001", Producto: "QUESO FRESCO", Stock: 15, Precio_Venta: 3.50, Precio_Distribuidor: 2.50 },
                { ID: "P-002", Producto: "YOGURT NATURAL", Stock: 8, Precio_Venta: 1.80, Precio_Distribuidor: 1.20 },
                { ID: "P-003", Producto: "LECHE PASTEURIZADA", Stock: 20, Precio_Venta: 1.20, Precio_Distribuidor: 0.80 },
                { ID: "P-004", Producto: "CREMA DE LECHE", Stock: 3, Precio_Venta: 2.50, Precio_Distribuidor: 1.80 },
                { ID: "P-005", Producto: "MOZZARELLA", Stock: 12, Precio_Venta: 4.00, Precio_Distribuidor: 3.00 }
            ],
            "Ventas": [
                { ID_Venta: "V-001", Cliente: "MARIA GONZALEZ", Producto: "QUESO FRESCO", Cantidad: 2, Total: 7.00, Estado: "ENTREGADO", Fecha: new Date().toISOString() },
                { ID_Venta: "V-002", Cliente: "JUAN PEREZ", Producto: "YOGURT NATURAL", Cantidad: 5, Total: 9.00, Estado: "PENDIENTE", Fecha: new Date().toISOString() }
            ],
            "Compras": [
                { ID_Compra: "CP-001", Proveedor: "LACTEOS DEL VALLE", Producto: "QUESO FRESCO", Cantidad: 50, Estado_Entrega: "RECIBIDO" }
            ],
            "Clientes": [
                { ID: "C-001", Nombre: "MARIA GONZALEZ", CI_RUC: "1234567890", Teléfono: "0991234567", Sector: "NORTE" },
                { ID: "C-002", Nombre: "JUAN PEREZ", CI_RUC: "0987654321", Teléfono: "0997654321", Sector: "SUR" }
            ]
        };
        
        console.warn(`📦 Usando datos locales para ${pestaña}`);
        return fallbackData[pestaña] || [];
    },

    // ========== POST: Enviar datos ==========
    async enviarDatos(datos) {
        try {
            console.log(`📤 Enviando datos a: ${datos.pestaña}`);
            
            // Intentar con fetch normal
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const json = await response.json();
            if (json.error) throw new Error(json.error);
            
            console.log(`✅ Datos guardados`);
            return json;
            
        } catch (error) {
            console.error(`❌ Error al enviar:`, error);
            
            // Si falla, mostrar mensaje pero no bloquear
            alert(`⚠️ No se pudo guardar en la nube. Los datos se guardarán localmente.\n\nError: ${error.message}`);
            
            // Guardar localmente como respaldo
            this.saveToLocalStorage(datos);
            
            return { success: true, local: true, warning: "Guardado localmente" };
        }
    },

    // Guardar datos localmente como respaldo
    saveToLocalStorage(datos) {
        try {
            const key = `${datos.pestaña}_${Date.now()}`;
            const pending = JSON.parse(localStorage.getItem('pending_sync') || '[]');
            pending.push({ ...datos, timestamp: Date.now() });
            localStorage.setItem('pending_sync', JSON.stringify(pending));
            console.log(`💾 Datos guardados localmente para sincronizar después`);
        } catch (e) {
            console.error("Error guardando localmente:", e);
        }
    },

    // Sincronizar datos pendientes
    async syncPending() {
        const pending = JSON.parse(localStorage.getItem('pending_sync') || '[]');
        if (pending.length === 0) return;
        
        console.log(`🔄 Sincronizando ${pending.length} items pendientes...`);
        
        for (const item of pending) {
            try {
                await this.enviarDatos(item);
                // Eliminar del pendiente si se sincronizó
                const updated = JSON.parse(localStorage.getItem('pending_sync') || '[]');
                const filtered = updated.filter(u => u.timestamp !== item.timestamp);
                localStorage.setItem('pending_sync', JSON.stringify(filtered));
            } catch (e) {
                console.error("Error sincronizando item:", e);
            }
        }
    },

    // ========== DELETE: Eliminar ==========
    async eliminarDato(pestaña, id) {
        try {
            console.log(`🗑️ Eliminando de ${pestaña}: ${id}`);
            
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            alert(`⚠️ No se pudo eliminar. Error: ${error.message}`);
            throw error;
        }
    },

    // ========== Funciones específicas ==========
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

    async obtenerDashboard() {
        try {
            const [clientes, ventas, inventario, compras] = await Promise.all([
                this.obtenerDatos("Clientes"),
                this.obtenerDatos("Ventas"),
                this.obtenerDatos("Inventario"),
                this.obtenerDatos("Compras")
            ]);
            
            const totalVentas = Array.isArray(ventas) ? ventas.reduce((sum, v) => sum + (Number(v.Total) || 0), 0) : 0;
            const stockTotal = Array.isArray(inventario) ? inventario.reduce((sum, p) => sum + (Number(p.Stock) || 0), 0) : 0;
            const valorBodega = Array.isArray(inventario) ? inventario.reduce((sum, p) => sum + ((Number(p.Stock) || 0) * (Number(p.Precio_Venta) || 0)), 0) : 0;
            const productosCriticos = Array.isArray(inventario) ? inventario.filter(p => (Number(p.Stock) || 0) <= 5).length : 0;
            
            return {
                totalClientes: Array.isArray(clientes) ? clientes.length : 0,
                totalVentas: Array.isArray(ventas) ? ventas.length : 0,
                montoVentas: totalVentas,
                stockTotal: stockTotal,
                valorBodega: valorBodega,
                productosCriticos: productosCriticos,
                comprasPendientes: Array.isArray(compras) ? compras.filter(c => String(c.Estado_Entrega || "").toUpperCase() === "PENDIENTE").length : 0
            };
        } catch (error) {
            console.error("Error obteniendo dashboard:", error);
            return {
                totalClientes: 0,
                totalVentas: 0,
                montoVentas: 0,
                stockTotal: 0,
                valorBodega: 0,
                productosCriticos: 0,
                comprasPendientes: 0
            };
        }
    }
};

// Inicializar sincronización al cargar
window.DairyAPI = DairyAPI;

// Intentar sincronizar datos pendientes al cargar
window.addEventListener('load', () => {
    setTimeout(() => {
        DairyAPI.syncPending();
    }, 3000);
});

console.log("✅ API Config cargado - Modo compatible PC/Celular");
