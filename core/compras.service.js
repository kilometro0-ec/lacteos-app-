/**
 * COMPRAS SERVICE - LÓGICA LÁCTEA ERP
 * Responsable: gestión de compras + estructura + integración con inventario
 */

const ComprasService = (() => {

  // =========================
  // VALIDAR COMPRA
  // =========================
  function validarCompra(compra) {

    if (!compra) throw new Error("COMPRA_VACIA");

    if (!compra.Proveedor) {
      throw new Error("PROVEEDOR_OBLIGATORIO");
    }

    if (!compra.Productos || !Array.isArray(compra.Productos) || compra.Productos.length === 0) {
      throw new Error("COMPRA_SIN_PRODUCTOS");
    }

    compra.Productos.forEach(p => {
      if (!p.Producto || p.Cantidad <= 0 || p.Precio < 0) {
        throw new Error("PRODUCTO_INVALIDO_EN_COMPRA");
      }
    });

    return true;
  }


  // =========================
  // GENERAR ID COMPRA
  // =========================
  function generarID() {
    const t = Date.now().toString().slice(-6);
    const r = Math.floor(Math.random() * 900 + 100);
    return `C-${t}${r}`;
  }


  // =========================
  // CALCULAR TOTAL COMPRA
  // =========================
  function calcularTotal(compra) {

    return compra.Productos.reduce((acc, p) => {
      return acc + (Number(p.Cantidad) * Number(p.Precio));
    }, 0);
  }


  // =========================
  // BUILD PAYLOAD ERP
  // =========================
  function buildPayload(compra) {

    const productos = compra.Productos.map(p => ({
      Producto: p.Producto,
      Cantidad: Number(p.Cantidad),
      Precio_Distribuidor: Number(p.Precio),
      Subtotal: Number(p.Cantidad) * Number(p.Precio)
    }));

    const total = productos.reduce((acc, p) => acc + p.Subtotal, 0);

    return {
      ID_Compra: generarID(),
      Fecha: new Date().toISOString().split("T")[0],
      Proveedor: compra.Proveedor,
      Productos: productos,
      Total: total,
      Estado_Entrega: "PENDIENTE",
      Fecha_Recepcion: "",
      Observaciones: compra.Observaciones || ""
    };
  }


  // =========================
  // PROCESAR COMPRA COMPLETA
  // =========================
  function procesarCompra(compra, inventarioService, inventarioActual = []) {

    validarCompra(compra);

    const payload = buildPayload(compra);

    let inventarioActualizado = inventarioActual;

    payload.Productos.forEach(item => {

      inventarioActualizado = inventarioService.moverStock(
        item.Producto,
        item.Cantidad,
        "COMPRA",
        inventarioActualizado
      );

    });

    return {
      compra: payload,
      inventarioActualizado
    };
  }


  // =========================
  // HISTORIAL PROVEEDOR
  // =========================
  function comprasPorProveedor(nombre, compras = []) {

    return compras.filter(c =>
      String(c.Proveedor).trim() === String(nombre).trim()
    );
  }


  // =========================
  // TOTAL PROVEEDOR
  // =========================
  function totalProveedor(nombre, compras = []) {

    return comprasPorProveedor(nombre, compras)
      .reduce((acc, c) => acc + (Number(c.Total) || 0), 0);
  }


  // =========================
  // CONTAR COMPRAS
  // =========================
  function contarCompras(nombre, compras = []) {

    return comprasPorProveedor(nombre, compras).length;
  }


  // =========================
  // API PÚBLICA
  // =========================
  return {
    validarCompra,
    generarID,
    calcularTotal,
    buildPayload,
    procesarCompra,
    comprasPorProveedor,
    totalProveedor,
    contarCompras
  };

})();
