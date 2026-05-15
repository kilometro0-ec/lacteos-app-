/**
 * LÓGICA LÁCTEA - CLIENTE API v3.7 (VERSIÓN ORIGINAL FUNCIONAL)
 */
const DAIRY_API_URL = "https://script.google.com/macros/s/AKfycbxdHI4S_hIDh0J3TL4xIPCX0WlCud6xnTtymMUoyfHn7KPj2LsbkFfmHNZYwizou8fQnA/exec";

const DairyAPI = {
    // 1. LECTURA DE DATOS (doGet)
    obtenerDatos: async (pestaña) => {
        try {
            const response = await fetch(`${DAIRY_API_URL}?pestaña=${pestaña}`);
            if (!response.ok) throw new Error("Error en red");
            return await response.json();
        } catch (error) {
            console.error("Error al obtener:", error);
            return [];
        }
    },

    // 2. ENVÍO DE DATOS (doPost con no-cors)
    enviarDatos: async (datos) => {
        try {
            await fetch(DAIRY_API_URL, {
                method: 'POST',
                mode: 'no-cors', 
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(datos)
            });
            return "OK";
        } catch (error) {
            console.error("Error al enviar:", error);
            throw error;
        }
    },

    // 3. ALIAS PARA COMPATIBILIDAD
    guardarDatos: async (pestaña, datos) => {
        const payload = { pestaña: pestaña, ...datos };
        return await DairyAPI.enviarDatos(payload);
    },

    // 4. FUNCIONES ESPECÍFICAS (AGREGADAS PARA TUS OTRAS PANTALLAS)
    crearCliente: async (cliente) => {
        return DairyAPI.enviarDatos({
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

    eliminarCliente: async (id) => {
        return DairyAPI.enviarDatos({
            pestaña: "Clientes",
            ID: id,
            accion: "ELIMINAR"
        });
    },

    crearVenta: async (venta) => {
        return DairyAPI.enviarDatos({
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

    marcarEntregado: async (idVenta, fechaEntrega) => {
        return DairyAPI.enviarDatos({
            pestaña: "Ventas",
            accion: "editar_estado",
            ID_Venta: idVenta,
            Estado: "ENTREGADO",
            Fecha_Entrega: fechaEntrega || new Date().toISOString().split('T')[0]
        });
    },

    eliminarItemVenta: async (idVenta, producto, cantidad) => {
        return DairyAPI.enviarDatos({
            pestaña: "Ventas",
            accion: "eliminar_item_y_devolver_stock",
            ID_Venta: idVenta,
            Producto: producto,
            Cantidad: cantidad
        });
    },

    crearProducto: async (producto) => {
        return DairyAPI.enviarDatos({
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

    eliminarProducto: async (id) => {
        return DairyAPI.enviarDatos({
            pestaña: "Inventario",
            ID: id,
            accion: "ELIMINAR"
        });
    },

    crearProveedor: async (proveedor) => {
        return DairyAPI.enviarDatos({
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

    eliminarProveedor: async (ruc) => {
        return DairyAPI.enviarDatos({
            pestaña: "Proveedores",
            ID: ruc,
            accion: "ELIMINAR"
        });
    },

    crearCompra: async (compra) => {
        return DairyAPI.enviarDatos({
            pestaña: "Compras",
            Fecha: compra.Fecha || new Date().toISOString().split('T')[0],
            Proveedor: compra.Proveedor,
            Producto: compra.Producto,
            Cantidad: compra.Cantidad,
            Precio_Distribuidor: compra.Precio_Distribuidor,
            Estado_Entrega: compra.Estado_Entrega || "PENDIENTE",
            Observaciones: compra.Observaciones || ""
        });
    },

    obtenerDashboard: async () => {
        try {
            const [clientes, ventas, inventario] = await Promise.all([
                DairyAPI.obtenerDatos("Clientes"),
                DairyAPI.obtenerDatos("Ventas"),
                DairyAPI.obtenerDatos("Inventario")
            ]);
            
            const totalVentas = Array.isArray(ventas) ? ventas.reduce((sum, v) => sum + (Number(v.Total) || 0), 0) : 0;
            const stockTotal = Array.isArray(inventario) ? inventario.reduce((sum, p) => sum + (Number(p.Stock) || 0), 0) : 0;
            const valorBodega = Array.isArray(inventario) ? inventario.reduce((sum, p) => sum + ((Number(p.Stock) || 0) * (Number(p.Precio_Venta) || 0)), 0) : 0;
            
            return {
                totalClientes: Array.isArray(clientes) ? clientes.length : 0,
                totalVentas: Array.isArray(ventas) ? ventas.length : 0,
                montoVentas: totalVentas,
                stockTotal: stockTotal,
                valorBodega: valorBodega,
                productosCriticos: Array.isArray(inventario) ? inventario.filter(p => (Number(p.Stock) || 0) <= 5).length : 0
            };
        } catch (error) {
            console.error("Error en dashboard:", error);
            return { totalClientes: 0, totalVentas: 0, montoVentas: 0, stockTotal: 0, valorBodega: 0, productosCriticos: 0 };
        }
    }
};

window.DairyAPI = DairyAPI;
console.log("✅ API v3.7 cargada - Modo original funcional");
