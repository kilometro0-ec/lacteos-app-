/**
 * PROVEEDORES SERVICE - LÓGICA LÁCTEA ERP
 * Responsable: gestión de proveedores y análisis de compras
 */

const ProveedoresService = (() => {

  // =========================
  // VALIDAR PROVEEDOR
  // =========================
  function validarProveedor(data) {

    if (!data) throw new Error("DATOS_VACIOS");

    if (!data["Nombre del Proveedor"]) {
      throw new Error("NOMBRE_PROVEEDOR_OBLIGATORIO");
    }

    return true;
  }


  // =========================
  // CREAR PROVEEDOR (PAYLOAD)
  // =========================
  function crearProveedor(data) {

    validarProveedor(data);

    return {
      "Nombre del Proveedor": data["Nombre del Proveedor"],
      "RUC": data.RUC || "",
      "Provincia": data.Provincia || "",
      "Ciudad": data.Ciudad || "",
      "Direccion": data.Direccion || "",
      "Contacto / Teléfono": data["Contacto / Teléfono"] || "",
      "Categoría": data.Categoría || "General",
      "Fecha Registro": new Date().toLocaleDateString()
    };
  }


  // =========================
  // FILTRAR PROVEEDOR
  // =========================
  function buscarProveedor(nombre, listaProveedores = []) {

    return listaProveedores.find(p =>
      String(p["Nombre del Proveedor"]).toLowerCase().trim() ===
      String(nombre).toLowerCase().trim()
    );
  }


  // =========================
  // HISTORIAL DE COMPRAS
  // =========================
  function historialCompras(nombreProveedor, compras = []) {

    return compras.filter(c =>
      c.Proveedor === nombreProveedor
    );
  }


  // =========================
  // TOTAL INVERTIDO POR PROVEEDOR
  // =========================
  function totalInvertido(nombreProveedor, compras = []) {

    const historial = historialCompras(nombreProveedor, compras);

    return historial.reduce((acc, item) => {
      return acc + (parseFloat(item.Total) || 0);
    }, 0);
  }


  // =========================
  // TOTAL UNIDADES COMPRADAS
  // =========================
  function totalUnidades(nombreProveedor, compras = []) {

    const historial = historialCompras(nombreProveedor, compras);

    return historial.reduce((acc, item) => {
      return acc + (parseFloat(item.Cantidad) || 0);
    }, 0);
  }


  // =========================
  // ANALÍTICA SIMPLE PROVEEDOR
  // =========================
  function analisisProveedor(nombreProveedor, compras = []) {

    return {
      proveedor: nombreProveedor,
      totalInvertido: totalInvertido(nombreProveedor, compras),
      totalUnidades: totalUnidades(nombreProveedor, compras),
      totalCompras: historialCompras(nombreProveedor, compras).length
    };
  }


  // =========================
  // API PÚBLICA
  // =========================
  return {
    validarProveedor,
    crearProveedor,
    buscarProveedor,
    historialCompras,
    totalInvertido,
    totalUnidades,
    analisisProveedor
  };

})();
