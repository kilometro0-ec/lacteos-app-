/**
 * COMPRAS SERVICE - LÓGICA LÁCTEA ERP
 * Responsable: registro de compras, validación y actualización de inventario
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

    if (!compra.Productos || compra.Productos.length === 0) {
      throw new Error("COMPRA_SIN_PRODUCTOS");
    }

    return true;
  }


  // =========================
  // GENERAR ID COMPRA
  // =========================
  function generarID() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 900 + 100);
    return `C-${timestamp}${random}`;
  }


  // =========================
  // CALCULAR TOTAL COMPRA
  // =========================
  function calcularTotal(compra) {

    return compra.Productos.reduce((acc, item) => {
      return acc + (Number(item.Cantidad) * Number(item.Precio));
    }, 0);
  }


  // =========================
  // BUILD PAYLOAD COMPRA
  // =========================
  function buildPayload(compra) {

    const productos = compra.Productos.map(p => ({
      Producto: p.Producto,
      Cantidad: Number(p.Cantidad),
      Precio_Distribuidor: Number(p.Precio),
      Subtotal: Number(p.Cantidad) * Number(p.Precio)
    }));

    return {
      ID_Compra: generarID(),
      Fecha: new Date().toISOString().split("T")[0],
      Proveedor: compra.Proveedor,
      Productos: productos,
      Total: calcularTotal({ Productos: productos }),
      Estado_Entrega: "PENDIENTE",
      Fecha_Recepcion: ""
    };
  }


  // =========================
  // PROCESAR COMPRA COMPLETA
  // =========================
  function procesarCompra(compra, inventarioService, inventarioActual = []) {

    validarCompra(compra);

    const payload = buildPayload(compra);

    // actualizar inventario (SUMA STOCK)
    let nuevoInventario = inventarioActual;

    payload.Productos.forEach(item => {
      nuevoInventario = inventarioService.moverStock(
        item.Producto,
        item.Cantidad,
        "COMPRA",
        nuevoInventario
      );
    });

    return {
      compra: payload,
      inventarioActualizado: nuevoInventario
    };
  }


  // =========================
  // HISTORIAL POR PROVEEDOR
  // =========================
  function comprasPorProveedor(nombreProveedor, compras = []) {

    return compras.filter(c =>
      c.Proveedor === nombreProveedor
    );
  }


  // =========================
  // TOTAL COMPRADO A PROVEEDOR
  // =========================
  function totalProveedor(nombreProveedor, compras = []) {

    return comprasPorProveedor(nombreProveedor, compras)
      .reduce((acc, c) => acc + (Number(c.Total) || 0), 0);
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
    totalProveedor
  };

})();
