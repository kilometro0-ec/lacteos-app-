/**
 * VENTAS SERVICE - LÓGICA LÁCTEA ERP
 * Responsable: lógica de ventas, validación y armado de payload
 */

const VentasService = (() => {

  // =========================
  // VALIDAR VENTA
  // =========================
  function validarVenta(carrito, cliente) {

    if (!cliente) {
      throw new Error("CLIENTE_NO_SELECCIONADO");
    }

    if (!carrito || Object.keys(carrito).length === 0) {
      throw new Error("CARRITO_VACIO");
    }

    Object.keys(carrito).forEach(producto => {
      const cantidad = carrito[producto];

      if (cantidad <= 0) {
        throw new Error(`CANTIDAD_INVALIDA: ${producto}`);
      }
    });

    return true;
  }


  // =========================
  // CALCULAR TOTAL
  // =========================
  function calcularTotal(carrito, productosRef = []) {

    let total = 0;

    Object.keys(carrito).forEach(nombre => {

      const producto = productosRef.find(p => p.Producto === nombre);

      if (!producto) return;

      const subtotal = carrito[nombre] * (producto.Precio_Venta || 0);

      total += subtotal;
    });

    return total;
  }


  // =========================
  // BUILD PAYLOAD ERP
  // =========================
  function buildPayload(carrito, cliente, productosRef = []) {

    const items = Object.keys(carrito).map(nombre => {

      const producto = productosRef.find(p => p.Producto === nombre);

      return {
        Producto: nombre,
        Cantidad: carrito[nombre],
        Precio: producto?.Precio_Venta || 0,
        Subtotal: carrito[nombre] * (producto?.Precio_Venta || 0)
      };
    });

    const total = items.reduce((acc, i) => acc + i.Subtotal, 0);

    return {
      ID_Venta: generarID(),
      Cliente: cliente,
      Productos: items,
      Total: total,
      Fecha: new Date().toISOString().split("T")[0],
      Estado: "PENDIENTE"
    };
  }


  // =========================
  // GENERAR VENTA FINAL
  // =========================
  function generarVenta(carrito, cliente, productosRef = []) {

    validarVenta(carrito, cliente);

    const payload = buildPayload(carrito, cliente, productosRef);

    return payload;
  }


  // =========================
  // ID GENERATOR
  // =========================
  function generarID() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 900 + 100);
    return `V-${timestamp}${random}`;
  }


  // =========================
  // API PÚBLICA
  // =========================
  return {
    generarVenta,
    calcularTotal,
    validarVenta,
    buildPayload
  };

})();
