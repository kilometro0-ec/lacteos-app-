/**
 * ERP CORE - LÓGICA LÁCTEA
 * Orquestador central de servicios
 */

import { VentasService } from "./ventas.service.js";
import { InventarioService } from "./inventario.service.js";
import { ComprasService } from "./compras.service.js";
import { ClientesService } from "./clientes.service.js";
import { ProveedoresService } from "./proveedores.service.js";
import { DespachosService } from "./despachos.service.js";

export const ERP = {

  ventas: VentasService,
  inventario: InventarioService,
  compras: ComprasService,
  clientes: ClientesService,
  proveedores: ProveedoresService,
  despachos: DespachosService,

  // 🔥 CONTROL CENTRAL
  async ejecutar(modulo, accion, data) {
    if (!this[modulo]) throw new Error("MÓDULO_NO_EXISTE");

    if (!this[modulo][accion]) {
      throw new Error("ACCIÓN_NO_EXISTE");
    }

    return await this[modulo][accion](data);
  }
};
