// ============================================================
// API CONFIG - LÓGICA LÁCTEA
// Integración con Google Sheets
// ============================================================

const SPREADSHEET_ID = "1PtM2KA1Ix0qJfUtEpxsYmiviwUKFEBYpT6hbUn1aXck";
const API_BASE_URL = "https://script.google.com/macros/s/AKfycbwV-o3eEVzSSTmLwaJu6PXlShWzFLNxVWTvEP3x9XtEZ48K7V-_XQxhosiEdx1_z9hkNA/exec";

// Mapeo de nombres de hojas (por si hay diferencias)
const HOJAS = {
    CLIENTES: "Clientes",
    VENTAS: "Ventas",
    PROVEEDORES: "Proveedores",
    COMPRAS: "Compras",
    INVENTARIO: "Inventario"
};

const DairyAPI = {
    // ========== GET: Obtener datos ==========
    async obtenerDatos(pestaña) {
        try {
            const url = `${API_BASE_URL}?pestaña=${encodeURIComponent(pestaña)}`;
            console.log(`📡 Obteniendo datos de: ${pestaña}`);
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const json = await response.json();
            if (json.error) throw new Error(json.error);
            
            console.log(`✅ Datos cargados: ${json.data?.length || 0} registros`);
            return json.data || [];
        } catch (error) {
            console.error(`❌ Error al obtener ${pestaña}:`, error);
            // Mostrar error en la interfaz si existe la función
            if (window.mostrarError) window.mostrarError(error.message);
            throw error;
        }
    },

    // ========== POST: Crear/Enviar datos ==========
    async enviarDatos(datos) {
        try {
            console.log(`📤 Enviando datos a: ${datos.pestaña}`, datos);
            
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            });
            
            const json = await response.json();
            if (json.error) throw new Error(json.error);
            
            console.log(`✅ Datos guardados correctamente`);
            return json;
        } catch (error) {
            console.error(`❌ Error al enviar datos:`, error);
            if (window.mostrarError) window.mostrarError(error.message);
            throw error;
        }
    },

    // ========== Crear Cliente ==========
    async crearCliente(cliente) {
        const ahora = new Date();
        const fechaReg = `${ahora.toLocaleDateString()} ${ahora.toLocaleTimeString()}`;
        
        const data = {
            pestaña: HOJAS.CLIENTES,
            ID: `C-${Date.now().toString().slice(-6)}`,
            Nombre: cliente.Nombre.toUpperCase(),
            CI_RUC: cliente.CI_RUC,
            Teléfono: cliente.Teléfono || "",
            Dirección: cliente.Dirección || "",
            Referencia: cliente.Referencia || "",
            Sector: cliente.Sector || "CENTRO",
            "Fecha Registro": fechaReg
        };
        
        return this.enviarDatos(data);
    },

    // ========== Crear Venta ==========
    async crearVenta(venta) {
        const data = {
            pestaña: HOJAS.VENTAS,
            ID_Venta: venta.ID_Venta,
            Cliente: venta.Cliente,
            Producto: venta.Producto,
            Cantidad: venta.Cantidad,
            Precio_PVP: venta.Precio_PVP || 0,
            Fecha_Entrega: venta.Fecha_Entrega,
            Estado_Entrega: venta.Estado_Entrega || "PENDIENTE",
            Total: venta.Total || (venta.Cantidad * (venta.Precio_PVP || 0))
        };
        
        return this.enviarDatos(data);
    },

    // ========== Crear Producto en Inventario ==========
    async crearProducto(producto) {
        const data = {
            pestaña: HOJAS.INVENTARIO,
            Fecha: new Date().toISOString().split('T')[0],
            ID: `P-${Date.now().toString().slice(-6)}`,
            Producto: producto.Producto.toUpperCase(),
            Stock: producto.Stock || 0,
            Precio_Distribuidor: producto.Precio_Distribuidor || 0,
            Precio_Venta: producto.Precio_Venta || 0,
            Ventas: 0,
            Proveedor: producto.Proveedor || "GENERAL"
        };
        
        return this.enviarDatos(data);
    },

    // ========== Actualizar Stock ==========
    async actualizarStock(idProducto, nuevoStock) {
        // Método simplificado: primero obtener el producto, luego actualizar
        // Como el script no soporta PUT, usamos un enfoque alternativo
        const inventario = await this.obtenerDatos(HOJAS.INVENTARIO);
        const producto = inventario.find(p => p.ID === idProducto);
        
        if (!producto) throw new Error("Producto no encontrado");
        
        // Registrar el cambio como una compra interna
        return this.enviarDatos({
            pestaña: HOJAS.COMPRAS,
            Fecha: new Date().toISOString().split('T')[0],
            Proveedor: "AJUSTE_INTERNO",
            Producto: producto.Producto,
            Cantidad: nuevoStock - (producto.Stock || 0),
            Precio_Distribuidor: producto.Precio_Distribuidor || 0,
            Total: 0,
            Estado_Entrega: "COMPLETADO",
            Fecha_Recepción: new Date().toISOString().split('T')[0],
            ID_Compra: `AJ-${Date.now().toString().slice(-6)}`,
            Observaciones: "Ajuste de stock manual"
        });
    },

    // ========== Crear Compra ==========
    async crearCompra(compra) {
        const data = {
            pestaña: HOJAS.COMPRAS,
            Fecha: compra.Fecha || new Date().toISOString().split('T')[0],
            Proveedor: compra.Proveedor,
            Producto: compra.Producto,
            Cantidad: compra.Cantidad,
            Precio_Distribuidor: compra.Precio_Distribuidor,
            Total: compra.Cantidad * compra.Precio_Distribuidor,
            Estado_Entrega: compra.Estado_Entrega || "PENDIENTE",
            Fecha_Recepción: compra.Fecha_Recepción || "",
            ID_Compra: `CP-${Date.now().toString().slice(-6)}`,
            Observaciones: compra.Observaciones || ""
        };
        
        return this.enviarDatos(data);
    },

    // ========== Crear Proveedor ==========
    async crearProveedor(proveedor) {
        const data = {
            pestaña: HOJAS.PROVEEDORES,
            "Nombre del Proveedor": proveedor.Nombre.toUpperCase(),
            RUC: proveedor.RUC,
            Provincia: proveedor.Provincia || "",
            Ciudad: proveedor.Ciudad || "",
            Dirección: proveedor.Dirección || "",
            "Contacto / Teléfono": proveedor.Contacto || "",
            Categoría: proveedor.Categoría || "",
            "Fecha Registro": new Date().toLocaleDateString()
        };
        
        return this.enviarDatos(data);
    },

    // ========== Obtener productos con stock bajo ==========
    async obtenerStockCritico(limite = 5) {
        const inventario = await this.obtenerDatos(HOJAS.INVENTARIO);
        return inventario.filter(p => (p.Stock || 0) <= limite);
    },

    // ========== Obtener resumen de ventas ==========
    async obtenerResumenVentas() {
        const ventas = await this.obtenerDatos(HOJAS.VENTAS);
        const total = ventas.reduce((sum, v) => sum + (v.Total || 0), 0);
        const hoy = new Date().toISOString().split('T')[0];
        const ventasHoy = ventas.filter(v => v.Fecha?.split('T')[0] === hoy);
        const totalHoy = ventasHoy.reduce((sum, v) => sum + (v.Total || 0), 0);
        
        return {
            totalGeneral: total,
            totalHoy: totalHoy,
            cantidadVentas: ventas.length,
            ventasHoy: ventasHoy.length,
            ultimasVentas: ventas.slice(-10).reverse()
        };
    },

    // ========== Obtener dashboard completo ==========
    async obtenerDashboard() {
        try {
            const [clientes, ventas, inventario, proveedores, compras] = await Promise.all([
                this.obtenerDatos(HOJAS.CLIENTES),
                this.obtenerDatos(HOJAS.VENTAS),
                this.obtenerDatos(HOJAS.INVENTARIO),
                this.obtenerDatos(HOJAS.PROVEEDORES),
                this.obtenerDatos(HOJAS.COMPRAS)
            ]);
            
            const stockTotal = inventario.reduce((sum, p) => sum + (p.Stock || 0), 0);
            const valorBodega = inventario.reduce((sum, p) => sum + ((p.Stock || 0) * (p.Precio_Venta || 0)), 0);
            const productosCriticos = inventario.filter(p => (p.Stock || 0) <= 5).length;
            
            return {
                clientes: clientes.length,
                ventasTotales: ventas.length,
                ventasMonto: ventas.reduce((sum, v) => sum + (v.Total || 0), 0),
                inventarioTotal: stockTotal,
                valorBodega: valorBodega,
                productosCriticos: productosCriticos,
                proveedores: proveedores.length,
                compras: compras.length,
                ultimasVentas: ventas.slice(-5).reverse()
            };
        } catch (error) {
            console.error("Error obteniendo dashboard:", error);
            throw error;
        }
    }
};

// Función global para mostrar errores (opcional)
window.mostrarError = function(mensaje) {
    console.error("ERROR:", mensaje);
    // Puedes implementar un toast o alert personalizado
    if (typeof alert === 'function') {
        alert("❌ " + mensaje);
    }
};

// Exportar para uso global
window.DairyAPI = DairyAPI;
window.HOJAS = HOJAS;

console.log("✅ API Config cargado correctamente");
