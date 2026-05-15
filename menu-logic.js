/**
 * LÓGICA LÁCTEA - Inyector Dinámico de Menú de Navegación
 */
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("menu-container");
    if (!container) return;

    // Estructura HTML del menú común para el ecosistema
    container.innerHTML = `
        <div class="bg-slate-950 text-slate-400 text-xs border-b border-slate-800 px-6 py-2 flex flex-wrap gap-6 items-center">
            <span class="text-white font-black tracking-widest text-[11px] uppercase mr-2 border-r border-slate-700 pr-4 flex items-center gap-1">
                🥛 Lógica Láctea <span class="text-[9px] bg-blue-600 text-white px-1 rounded">v${typeof DairyConfig !== 'undefined' ? DairyConfig.VERSION : '1.0'}</span>
            </span>
            <a href="dashboard.html" class="hover:text-white transition flex items-center gap-1"><i data-lucide="layout-dashboard" class="w-3.5 h-3.5"></i> Dashboard</a>
            <a href="inventario.html" class="text-white font-bold transition flex items-center gap-1"><i data-lucide="boxes" class="w-3.5 h-3.5"></i> Inventario</a>
            <a href="ventas.html" class="hover:text-white transition flex items-center gap-1"><i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i> Punto de Venta</a>
            <a href="compras.html" class="hover:text-white transition flex items-center gap-1"><i data-lucide="truck" class="w-3.5 h-3.5"></i> Compras / Abastecimiento</a>
            <a href="proveedores.html" class="hover:text-white transition flex items-center gap-1"><i data-lucide="users" class="w-3.5 h-3.5"></i> Proveedores</a>
        </div>
    `;
    
    // Refrescar íconos de Lucide instalados en el menú nuevo
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
