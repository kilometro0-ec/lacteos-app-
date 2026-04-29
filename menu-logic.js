/**
 * LÓGICA LÁCTEA - CONTROL DE NAVEGACIÓN v2.1
 * Corregido: Nombre "Panel" y efecto visual uniforme.
 */

const MenuLogic = {
    // Definición de los botones del menú y sus destinos exactos
    opciones: [
        { nombre: 'Panel', icon: 'dashboard', link: 'DashboardLacteo.html' },
        { nombre: 'Ventas', icon: 'add_shopping_cart', link: 'RegistrodeVentas.html' },
        { nombre: 'Stock', icon: 'inventory', link: 'ControldeInventario.html' },
        { nombre: 'Clientes', icon: 'group', link: 'GestiondeClientes.html' },
        { nombre: 'Rutas', icon: 'local_shipping', link: 'GestióndeDespachos.html' }
    ],

    /**
     * Inyecta el menú en el contenedor 'menu-container'
     */
    render() {
        const container = document.getElementById('menu-container');
        if (!container) return;

        // Detectar en qué página estamos (manejando tildes y variaciones)
        const pathActual = decodeURIComponent(window.location.pathname.split("/").pop()) || 'DashboardLacteo.html';

        // Estilos para el efecto de sombra morada (Glow) y animación
        const style = document.createElement('style');
        style.innerHTML = `
            .active-btn { 
                color: #a21caf !important; 
                position: relative;
            }
            .active-btn .material-symbols-outlined {
                font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                filter: drop-shadow(0 0 8px rgba(162, 28, 175, 0.4));
            }
            .active-btn::after {
                content: '';
                position: absolute;
                top: -12px;
                width: 20px;
                height: 4px;
                background: #a21caf;
                border-radius: 0 0 4px 4px;
            }
        `;
        document.head.appendChild(style);

        let html = `
        <nav class="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-purple-100 px-2 py-3 z-[100] shadow-[0_-10px_30px_rgba(162,28,175,0.1)]">
            <div class="max-w-md mx-auto flex justify-around items-center">
        `;

        this.opciones.forEach(opt => {
            // Comparación exacta incluyendo caracteres especiales para "Rutas"
            const esActivo = (pathActual === opt.link);
            
            html += `
                <button onclick="window.location.href='${opt.link}'" 
                        class="flex flex-col items-center gap-1 transition-all active:scale-95 ${esActivo ? 'active-btn' : 'text-gray-400'}">
                    <span class="material-symbols-outlined text-[26px]">
                        ${opt.icon}
                    </span>
                    <span class="text-[9px] font-black uppercase tracking-widest">${opt.nombre}</span>
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
