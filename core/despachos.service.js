/**
 * despachos.service.js
 * Lógica de gestión de despachos (ERP Lógica Láctea)
 */

const DespachosService = (() => {

  // =========================
  // VALIDAR DESPACHO
  // =========================
  function validarDespacho(data) {
    if (!data?.cliente) return { ok: false, msg: "Cliente requerido" };
    if (!Array.isArray(data?.productos) || data.productos.length === 0) {
      return { ok: false, msg: "Debe existir al menos un producto" };
    }

    return { ok: true };
  }

  // =========================
  // CALCULAR RESUMEN
  // =========================
  function calcularTotalProductos(productos) {
    return productos.reduce((acc, item) => {
      const cant = Number(item.Cantidad) || 0;
      const precio = Number(item.Precio) || 0;
      return acc + (cant * precio);
    }, 0);
  }

  // =========================
  // BUILD PAYLOAD (GOOGLE SHEETS)
  // =========================
  function buildPayload(data) {
    return {
      pestaña: "Despachos",
      ID_Despacho: "DES-" + Date.now().toString().slice(-6),
      Cliente: data.cliente,
      Direccion: data.direccion || "",
      Productos: JSON.stringify(data.productos),
      Total: calcularTotalProductos(data.productos),
      Estado: data.estado || "PENDIENTE",
      Fecha: new Date().toISOString()
    };
  }

  // =========================
  // CREAR DESPACHO
  // =========================
  async function crearDespacho(data) {

    const valid = validarDespacho(data);
    if (!valid.ok) throw new Error(valid.msg);

    const payload = buildPayload(data);

    return await DairyAPI.guardarDatos("Despachos", payload);
  }

  // =========================
  // CAMBIAR ESTADO DESPACHO
  // =========================
  async function cambiarEstado(idDespacho, nuevoEstado) {
    return await DairyAPI.guardarDatos("Despachos", {
      accion: "actualizar_estado",
      ID_Despacho: idDespacho,
      Estado: nuevoEstado
    });
  }

  return {
    validarDespacho,
    calcularTotalProductos,
    buildPayload,
    crearDespacho,
    cambiarEstado
  };

})();
