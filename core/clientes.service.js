/**
 * clientes.service.js
 * Gestión de clientes (ERP Lógica Láctea)
 */

const ClientesService = (() => {

  // =========================
  // VALIDAR CLIENTE
  // =========================
  function validarCliente(data) {
    if (!data?.nombre) return { ok: false, msg: "Nombre obligatorio" };
    if (!data?.ci_ruc) return { ok: false, msg: "CI/RUC obligatorio" };
    return { ok: true };
  }

  // =========================
  // NORMALIZAR DATOS
  // =========================
  function buildPayload(data) {
    return {
      pestaña: "Clientes",
      ID: data.id || "CLI-" + Date.now().toString().slice(-6),
      Nombre: data.nombre,
      CI_RUC: data.ci_ruc,
      "Teléfono": data.telefono || "",
      "Dirección": data.direccion || "",
      Referencia: data.referencia || "",
      Sector: data.sector || "",
      "Fecha Registro": new Date().toLocaleDateString()
    };
  }

  // =========================
  // CREAR CLIENTE
  // =========================
  async function crearCliente(data) {
    const valid = validarCliente(data);
    if (!valid.ok) throw new Error(valid.msg);

    const payload = buildPayload(data);
    return await DairyAPI.guardarDatos("Clientes", payload);
  }

  // =========================
  // BUSCAR CLIENTE LOCAL
  // =========================
  function buscarCliente(lista, filtro) {
    if (!Array.isArray(lista)) return [];

    const q = (filtro || "").toLowerCase();

    return lista.filter(c =>
      (c.Nombre || "").toLowerCase().includes(q) ||
      (c.CI_RUC || "").toLowerCase().includes(q)
    );
  }

  // =========================
  // FORMATEAR CLIENTE PARA UI
  // =========================
  function formatCliente(cliente) {
    return {
      id: cliente.ID,
      nombre: cliente.Nombre,
      documento: cliente.CI_RUC,
      telefono: cliente["Teléfono"],
      direccion: cliente["Dirección"]
    };
  }

  return {
    validarCliente,
    buildPayload,
    crearCliente,
    buscarCliente,
    formatCliente
  };

})();
