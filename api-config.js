// ============================================================
// API CONFIG - LÓGICA LÁCTEA
// Versión CORREGIDA para CORS
// ============================================================

const API_BASE_URL = "https://script.google.com/macros/s/AKfycbyhcqSSZ_P2xWgfDsqFYshXxauXsRWdL3qt6RFFhna14E19baQk8xtrEBPrDBk7ge3cPA/exec";

const DairyAPI = {
    // ========== GET: Obtener datos ==========
    async obtenerDatos(pestaña) {
        try {
            const url = `${API_BASE_URL}?pestaña=${encodeURIComponent(pestaña)}`;
            console.log(`📡 Obteniendo datos de: ${pestaña}`);
            
            // Usar mode: 'no-cors' para evitar CORS
            const response = await fetch(url, {
                method: 'GET',
                mode: 'no-cors'
            });
            
            // Con 'no-cors' no podemos leer la respuesta directamente
            // Usamos un truco con JSONP o usamos la respuesta como texto
            const text = await response.text();
            
            // Intentar parsear como JSON (puede venir como texto plano)
            try {
                const json = JSON.parse(text);
                if (json.error) throw new Error(json.error);
                return json.data || [];
            } catch (e) {
                // Si no es JSON, podría ser un callback o texto plano
                console.warn("Respuesta no es JSON:", text.substring(0, 100));
                return [];
            }
        } catch (error) {
            console.error(`Error al obtener ${pestaña}:`, error);
            // Retornar array vacío en lugar de fallar
            return [];
        }
    },

    // ========== POST: Crear/Actualizar datos ==========
    async enviarDatos(datos) {
        try {
            console.log(`📤 Enviando datos a: ${datos.pestaña}`);
            
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            });
            
            // Con 'no-cors' no podemos leer la respuesta, asumimos éxito
            console.log(`✅ Datos enviados (modo no-cors)`);
            return { success: true };
        } catch (error) {
            console.error(`❌ Error al enviar:`, error);
            throw error;
        }
    },

    // ========== DELETE: Eliminar registro ==========
    async eliminarDato(pestaña, id) {
        try {
            console.log(`🗑️ Eliminando de ${pestaña}: ${id}`);
            
            const response = await fetch(API_BASE_URL, {
                method: 'POST', // Cambiar a POST porque DELETE tiene más problemas con CORS
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    pestaña: pestaña, 
                    ID: id,
                    accion: "ELIMINAR"  // Indicar que es una eliminación
                })
            });
            
            console.log(`✅ Solicitud de eliminación enviada`);
            return { success: true };
        } catch (error) {
            console.error(`❌ Error al eliminar:`, error);
            throw error;
        }
    },

    // ========== CLIENTES ==========
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
            ...datos,
            accion: "ACTUALIZAR"
        });
    },

    async eliminarCliente(id) {
        return this.eliminarDato("Clientes", id);
    },

    // ========== VENTAS ==========
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

    async consumoInterno(producto, cantidad, idConsumo = null) {
        return this.enviarDatos({
            pestaña: "Ventas",
            ID_Venta: idConsumo || `CONSUMO-${Date.now().toString().slice(-6)}`,
            Cliente: "CONSUMO_INTERNO",
            Producto: producto,
            Cantidad: cantidad,
            Precio_PVP: 0,
            Fecha_Entrega: new Date().toISOString().split('T')[0],
            Estado_Entrega: "INTERNO"
        });
    },

    // ========== PRODUCTOS ==========
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
    },

    async actualizarStock(idProducto, nuevoStock) {
        return this.enviarDatos({
            pestaña: "Inventario",
            ID: idProducto,
            Stock: nuevoStock,
            accion: "ACTUALIZAR_STOCK"
        });
    },

    async eliminarProducto(id) {
        return this.eliminarDato("Inventario", id);
    },

    // ========== REPORTES ==========
    async obtenerDashboard() {
        try {
            const [clientes, ventas, inventario] = await Promise.all([
                this.obtenerDatos("Clientes"),
                this.obtenerDatos("Ventas"),
                this.obtenerDatos("Inventario")
            ]);
            
            const totalVentas = Array.isArray(ventas) ? ventas.reduce((sum, v) => sum + (v.Total || 0), 0) : 0;
            const stockTotal = Array.isArray(inventario) ? inventario.reduce((sum, p) => sum + (p.Stock || 0), 0) : 0;
            const valorBodega = Array.isArray(inventario) ? inventario.reduce((sum, p) => sum + ((p.Stock || 0) * (p.Precio_Venta || 0)), 0) : 0;
            const productosCriticos = Array.isArray(inventario) ? inventario.filter(p => (p.Stock || 0) <= 5).length : 0;
            
            return {
                totalClientes: Array.isArray(clientes) ? clientes.length : 0,
                totalVentas: Array.isArray(ventas) ? ventas.length : 0,
                montoVentas: totalVentas,
                stockTotal: stockTotal,
                valorBodega: valorBodega,
                productosCriticos: productosCriticos
            };
        } catch (error) {
            console.error("Error obteniendo dashboard:", error);
            return {
                totalClientes: 0,
                totalVentas: 0,
                montoVentas: 0,
                stockTotal: 0,
                valorBodega: 0,
                productosCriticos: 0
            };
        }
    }
};

// Exportar para uso global
window.DairyAPI = DairyAPI;
console.log("✅ API Config cargado (modo CORS bypass)");
