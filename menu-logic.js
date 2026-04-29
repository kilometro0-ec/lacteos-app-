/**
 * LÓGICA LÁCTEA - Sistema de Menú Centralizado
 * Si quieres cambiar un botón, un icono o un nombre, hazlo SOLO AQUÍ.
 */

const menuPrincipal = `
<nav class="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-purple-100 pb-8 pt-4 z-[100] px-2 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]">
    <div class="flex justify-around items-center max-w-lg mx-auto">
        
        <button onclick="window.location.href='DashboardLacteo.html'" class="nav-item text-gray-400 flex flex-col items-center transition-all" data-name="dashboard">
            <div class="icon-container p-2 rounded-2xl transition-all active:scale-75">
                <span class="material-symbols-outlined text-[28px]">home</span>
            </div>
            <span class="text-[10px] font-black uppercase mt-1">Inicio</span>
        </button>

        <button onclick="window.location.href='Ventas.html'" class="nav-item text-gray-400 flex flex-col items-center transition-all" data-name="ventas">
            <div class="icon-container p-2 rounded-2xl transition-all active:scale-75">
                <span class="material-symbols-outlined text-[28px]">receipt_long</span>
            </div>
            <span class="text-[10px] font-black uppercase mt-1">Ventas</span>
        </button>

        <button onclick="window.location.href='ControldeInventario.html'" class="nav-item text-gray-400 flex flex-col items-center transition-all" data-name="inventario">
            <div class="icon-container p-2 rounded-2xl transition-all active:scale-75">
                <span class="material-symbols-outlined text-[28px]">inventory_2</span>
            </div>
            <span class="text-[10px] font-black uppercase mt-1">Stock</span>
        </button>

        <button onclick="window.location.href='GestióndeDespachos.html'" class="nav-item text-gray-400 flex flex-col items-center transition-all" data-name="despachos">
            <div class="icon-container p-2 rounded-2xl transition-all active:scale-75">
                <span class="material-symbols-outlined text-[28px]">local_shipping</span>
            </div>
            <span class="text-[10px] font-black uppercase mt-1">Ruta</span>
        </button>

        <button onclick="window.location.href='Finanzas.html'" class="nav-item text-gray-400 flex flex-col items-center transition-all" data-name="finanzas">
            <div class="icon-container p-2 rounded-2xl transition-all active:scale-75">
                <span class="material-symbols-outlined text-[28px]">payments</span>
            </div>
            <span class="text-[10px] font-black uppercase mt-1">Caja</span>
        </button>

    </div>
</nav>
`;

function inicializarMenu() {
    // 1. Inyectar el HTML en el contenedor
    const contenedor = document.getElementById('menu-container');
    if (contenedor) {
        contenedor.innerHTML = menuPrincipal;

        // 2. Resaltar automáticamente la página actual
        const urlActual = window.location.href.toLowerCase();
        const items = contenedor.querySelectorAll('.nav-item');

        items.forEach(item => {
            const identificador = item.getAttribute('data-name');
            // Si la URL contiene el nombre (ej. ventas.html tiene "ventas")
            if (urlActual.includes(identificador)) {
                item.style.color = "#a21caf"; // Color Morado Principal
                const iconBox = item.querySelector('.icon-container');
                iconBox.style.backgroundColor = "#f5f3ff";
                iconBox.style.transform = "translateY(-5px)";
                item.querySelector('span:last-child').style.fontWeight = "900";
            }
        });
    }
}

// Se ejecuta cuando el DOM está listo
document.addEventListener('DOMContentLoaded', inicializarMenu);
