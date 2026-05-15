// ============================================================
// API CONFIG - LÓGICA LÁCTEA
// Versión CORREGIDA para CORS
// ============================================================

// ⚠️ ACTUALIZA ESTA URL CON LA NUEVA QUE OBTENGAS
const API_BASE_URL = "https://script.google.com/macros/s/AKfycbzZs1vjmrcLET3Wwfwh4NfsfCd84SvmzkPbPY4a59TH9PRQkJryZ2hvnCHpooWOD-u4EQ/exec";

const DairyAPI = {
    // ========== GET ==========
    async obtenerDatos(pestaña) {
        try {
            const url = `${API_BASE_URL}?pestaña=${encodeURIComponent(pestaña)}&t=${Date.now()}`;
            console.log(`📡 Obteniendo: ${pestaña}`);
            
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const json = await response.json();
            if (json.error) throw new Error(json.error);
            
            return json.data || [];
        } catch (error) {
            console.error(`❌ Error en ${pestaña}:`, error);
            return [];
        }
    },

    // ========== POST ==========
    async enviarDatos(datos) {
        try {
            console.log(`📤 Enviando a: ${datos.pestaña}`, datos);
            
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const json = await response.json();
            if (json.error) throw new Error(json.error);
            
            console.log(`✅ Datos guardados`);
            return json;
        } catch (error) {
            console.error(`❌ Error POST:`, error);
            throw error;
        }
    },

    // ========== ELIMINAR ==========
    async eliminarDato(pestaña, id) {
        return this.enviarDatos({
            pestaña: pestaña,
            ID: id,
            accion: "ELIMINAR"
        });
    },

    // ========== CLIENTES ==========
    async crearCliente(cliente) {
        return this.enviarDatos({
            pestaña: "Clientes",
            ID: `C-${Date.now().toString().slice(-6)}`,
            Nombre: cliente.Nombre.toUpperCase(),
            CI_RUC: cliente.CI_RUC,
            Teléfono: cliente.Teléfono,
            Dirección: cliente.Dirección,
            Referencia: cliente.Referencia,
            Sector: cliente.Sector,
            "Fecha Registro": new Date().toLocaleDateString()
        });
    },

    async eliminarCliente(id) {
        return this.eliminarDato("Clientes", id);
    },

    // ========== VENTAS / DESPACHOS ==========
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

    async marcarEntregado(idVenta, fechaEntrega) {
        return this.enviarDatos({
            pestaña: "Ventas",
            accion: "editar_estado",
            ID_Venta: idVenta,
            Estado: "ENTREGADO",
            Fecha_Entrega: fechaEntrega || new Date().toISOString().split('T')[0]
        });
    },

    async eliminarItemVenta(idVenta, producto, cantidad) {
        return this.enviarDatos({
            pestaña: "Ventas",
            accion: "eliminar_item_y_devolver_stock",
            ID_Venta: idVenta,
            Producto: producto,
            Cantidad: cantidad
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

    async eliminarProducto(id) {
        return this.eliminarDato("Inventario", id);
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
            Estado_Entrega: compra.Estado_Entrega || "PENDIENTE",
            Observaciones: compra.Observaciones || ""
        });
    }
};

window.DairyAPI = DairyAPI;
console.log("✅ API Config cargado");
