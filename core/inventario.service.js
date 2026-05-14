/**
 * INVENTARIO SERVICE - LÓGICA LÁCTEA ERP
 * Responsable: control total de stock, validaciones y movimientos
 */

const InventarioService = (() => {

  // =========================
  // OBTENER STOCK ACTUAL
  // =========================
  function obtenerStockActual(producto, inventario = []) {

    const item = inventario.find(p =>
      String(p.Producto).trim() === String(producto).trim()
    );

    return item ? Number(item.Stock) || 0 : 0;
  }


  // =========================
  // VALIDAR STOCK PARA VENTA
  // =========================
  function validarStock(producto, cantidad, inventario = []) {

    const stockActual = obtenerStockActual(producto, inventario);

    if (cantidad > stockActual) {
      throw new Error(`STOCK_INSUFICIENTE: ${producto}`);
    }

    return true;
  }


  // =========================
  // DESCONTAR STOCK (VENTAS)
  // =========================
  function descontarStock(producto, cantidad, inventario = []) {

    return inventario.map(item => {

      if (item.Producto === producto) {

        const nuevoStock = (Number(item.Stock) || 0) - Number(cantidad);

        return {
          ...item,
          Stock: nuevoStock < 0 ? 0 : nuevoStock
        };
      }

      return item;
    });
  }


  // =========================
  // AUMENTAR STOCK (COMPRAS)
  // =========================
  function aumentarStock(producto, cantidad, inventario = []) {

    return inventario.map(item => {

      if (item.Producto === producto) {

        return {
          ...item,
          Stock: (Number(item.Stock) || 0) + Number(cantidad)
        };
      }

      return item;
    });
  }


  // =========================
  // MOVIMIENTO DE INVENTARIO
  // =========================
  function moverStock(producto, cantidad, tipo, inventario = []) {

    if (tipo === "VENTA") {
      validarStock(producto, cantidad, inventario);
      return descontarStock(producto, cantidad, inventario);
    }

    if (tipo === "COMPRA") {
      return aumentarStock(producto, cantidad, inventario);
    }

    throw new Error("TIPO_MOVIMIENTO_INVALIDO");
  }


  // =========================
  // STOCK BAJO (ALERTA)
  // =========================
  function stockBajo(inventario = [], limite = 5) {

    return inventario.filter(p => (Number(p.Stock) || 0) <= limite);
  }


  // =========================
  // RESUMEN INVENTARIO
  // =========================
  function resumenInventario(inventario = []) {

    const totalProductos = inventario.length;

    const totalUnidades = inventario.reduce((acc, p) => {
      return acc + (Number(p.Stock) || 0);
    }, 0);

    const bajoStock = stockBajo(inventario).length;

    return {
      totalProductos,
      totalUnidades,
      productosBajoStock: bajoStock
    };
  }


  // =========================
  // VALIDAR DISPONIBILIDAD MULTIPLE (CARRITO)
  // =========================
  function validarCarrito(carrito, inventario = []) {

    Object.keys(carrito).forEach(producto => {

      const cantidad = carrito[producto];

      validarStock(producto, cantidad, inventario);
    });

    return true;
  }


  // =========================
  // API PÚBLICA
  // =========================
  return {
    obtenerStockActual,
    validarStock,
    descontarStock,
    aumentarStock,
    moverStock,
    stockBajo,
    resumenInventario,
    validarCarrito
  };

})();
