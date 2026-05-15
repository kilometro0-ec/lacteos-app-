// ============================================================
// API CONFIG - LÓGICA LÁCTEA
// Versión completa con todas las operaciones CRUD
// ============================================================

const API_BASE_URL = "https://script.google.com/macros/s/AKfycbylcwykYDTyDp6CRTn1BH9pWBIkNjUn7QrZkLVyVyz1CG6_I8apT1utBtZIQ3Jio5NFaw/exec";

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
            throw error;
        }
    },

    // ========== POST: Crear o actualizar datos ==========
    async enviarDatos(datos) {
        try {
            console.log(`📤 Enviando datos a: ${datos.pestaña}`);
            
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            
            const json = await response.json();
            if (json.error) throw new Error(json.error);
            
            console.log(`✅ Datos guardados: ${json.accion || 'completado'}`);
            return json;
        } catch (error) {
            console.error(`❌ Error al enviar:`, error);
            throw error;
        }
    },

    // ========== DELETE: Eliminar un registro ==========
    async eliminarDato(pestaña, id) {
        try {
            console.log(`🗑️ Eliminando de ${pestaña}: ${id}`);
            
            const response = await fetch(API_BASE_URL, {
                method: 'DELETE',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pestaña, ID: id })
            });
            
            const json = await response.json();
            if (json.error) throw new Error(json.error);
            
            console.log(`✅ Eliminado correctamente`);
            return json;
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
            ...datos
        });
    },

    async eliminarCliente(id) {
        return this.eliminarDato("Clientes", id);
    },

    // ========== PRODUCTOS / INVENTARIO ==========
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

    async actualizarProducto(id, datos) {
        return this.enviarDatos({
            pestaña: "Inventario",
            ID: id,
            ...datos
        });
    },

    async eliminarProducto(id) {
        return this.eliminarDato("Inventario", id);
    },

    async actualizarStock(idProducto, nuevoStock) {
        return this.enviarDatos({
            pestaña: "Inventario",
            ID: idProducto,
            Stock: nuevoStock
        });
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

    // ========== PROVEEDORES ==========
    async crearProveedor(proveedor) {
        return this.enviarDatos({
            pestaña: "Proveedores",
            "Nombre del Proveedor": proveedor.Nombre.toUpperCase(),
            RUC: proveedor.RUC,
            Provincia: proveedor.Provincia || "",
            Ciudad: proveedor.Ciudad || "",
            Dirección: proveedor.Dirección || "",
            "Contacto / Teléfono": proveedor.Contacto || "",
            Categoría: proveedor.Categoría || "",
            "Fecha Registro": new Date().toLocaleDateString()
        });
    },

    async eliminarProveedor(ruc) {
        return this.eliminarDato("Proveedores", ruc);
    },

    // ========== COMPRAS ==========
    async crearCompra(compra) {
        return this.enviarDatos({
            pestaña: "Compras",
            Fecha: compra.Fecha || new Date().toISOString().split('T')[0],
            Proveedor: compra.Proveedor,
            Producto: compra.Producto,
            Cantidad: compra.Cantidad,
            Precio_Distribuidor: compra.Precio_Distribuidor,
            Total: compra.Cantidad * compra.Precio_Distribuidor,
            Estado_Entrega: compra.Estado_Entrega || "PENDIENTE",
            Fecha_Recepción: compra.Fecha_Recepción || "",
            Observaciones: compra.Observaciones || ""
        });
    },

    // ========== DASHBOARD Y REPORTES ==========
    async obtenerDashboard() {
        try {
            const [clientes, ventas, inventario, proveedores] = await Promise.all([
                this.obtenerDatos("Clientes"),
                this.obtenerDatos("Ventas"),
                this.obtenerDatos("Inventario"),
                this.obtenerDatos("Proveedores")
            ]);
            
            const totalVentas = ventas.reduce((sum, v) => sum + (v.Total || 0), 0);
            const stockTotal = inventario.reduce((sum, p) => sum + (p.Stock || 0), 0);
            const valorBodega = inventario.reduce((sum, p) => sum + ((p.Stock || 0) * (p.Precio_Venta || 0)), 0);
            const productosCriticos = inventario.filter(p => (p.Stock || 0) <= 5).length;
            
            return {
                totalClientes: clientes.length,
                totalVentas: ventas.length,
                montoVentas: totalVentas,
                stockTotal: stockTotal,
                valorBodega: valorBodega,
                productosCriticos: productosCriticos,
                totalProveedores: proveedores.length
            };
        } catch (error) {
            console.error("Error obteniendo dashboard:", error);
            throw error;
        }
    },

    // ========== OBTENER CLIENTES CON RANKING ==========
    async obtenerRankingClientes() {
        const [clientes, ventas] = await Promise.all([
            this.obtenerDatos("Clientes"),
            this.obtenerDatos("Ventas")
        ]);
        
        const stats = {};
        ventas.forEach(v => {
            const cliente = v.Cliente;
            if (cliente && cliente !== "CONSUMO_INTERNO") {
                if (!stats[cliente]) stats[cliente] = { total: 0, cantidad: 0 };
                stats[cliente].total += v.Total || 0;
                stats[cliente].cantidad += 1;
            }
        });
        
        return clientes.map(c => ({
            ...c,
            montoTotal: stats[c.Nombre]?.total || 0,
            numVentas: stats[c.Nombre]?.cantidad || 0
        })).sort((a, b) => b.montoTotal - a.montoTotal);
    }
};

// Exportar para uso global
window.DairyAPI = DairyAPI;
console.log("✅ API Config completo cargado");
