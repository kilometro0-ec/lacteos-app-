/**
 * LÓGICA LÁCTEA - CONTROL DE NAVEGACIÓN v2.0
 * Gestiona el menú inferior y la redirección entre módulos
 */

const MenuLogic = {
    // Definición de los botones del menú y sus destinos exactos
    opciones: [
        { nombre: 'Inicio', icon: 'home', link: 'DashboardLacteo.html' },
        { nombre: 'Ventas', icon: 'add_shopping_cart', link: 'RegistrodeVentas.html' },
        { nombre: 'Stock', icon: 'inventory', link: 'ControldeInventario.html' },
        { nombre: 'Clientes', icon: 'group', link: 'GestiondeClientes.html' },
        { nombre: 'Rutas', icon: 'local_shipping', link: 'GestióndeDespachos.html' }
    ],

    /**
     * Inyecta el menú en el contenedor 'menu-container' de cada página
     */
    render() {
        const container = document.getElementById('menu-container');
        if (!container) return;

        // Detectar en qué página estamos para marcar el botón activo
        const pathActual = window.location.pathname.split("/").pop() || 'DashboardLacteo.html';

        let html = `
        <nav class="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-purple-100 px-2 py-3 z-[100] shadow-[0_-5px_20px_rgba(162,28,175,0.05)]">
            <div class="max-w-md mx-auto flex justify-around items-center">
        `;

        this.opciones.forEach(opt => {
            const esActivo = pathActual === opt.link;
            html += `
                <button onclick="window.location.href='${opt.link}'" 
                        class="flex flex-col items-center gap-1 transition-all active:scale-90 ${esActivo ? 'text-[#a21caf]' : 'text-gray-400'}">
                    <span class="material-symbols-outlined ${esActivo ? 'active-icon' : ''}" 
                          style="${esActivo ? "font-variation-settings: 'FILL' 1" : ""}">
                        ${opt.icon}
                    </span>
                    <span class="text-[10px] font-black uppercase tracking-tighter">${opt.nombre}</span>
                </button>
            `;
        });

        html += `
            </div>
        </nav>
        `;

        container.innerHTML = html;
    }
};

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    MenuLogic.render();
});
