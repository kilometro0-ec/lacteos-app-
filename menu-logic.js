/**
 * LÓGICA LÁCTEA - CONTROL DE NAVEGACIÓN v2.3
 * Fix: Menú 100% fijo en dispositivos móviles.
 */

window.navegarA = function(url) {
    document.body.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    document.body.style.opacity = "0";
    document.body.style.transform = "translateY(-10px)";
    setTimeout(() => { window.location.href = url; }, 300);
};

const MenuLogic = {
    opciones: [
        { nombre: 'Panel', icon: 'dashboard', link: 'DashboardLacteo.html' },
        { nombre: 'Ventas', icon: 'add_shopping_cart', link: 'RegistrodeVentas.html' },
        { nombre: 'Stock', icon: 'inventory', link: 'ControldeInventario.html' },
        { nombre: 'Clientes', icon: 'group', link: 'GestiondeClientes.html' },
        { nombre: 'Rutas', icon: 'local_shipping', link: 'GestióndeDespachos.html' }
    ],

    render() {
        const container = document.getElementById('menu-container');
        if (!container) return;

        const pathActual = decodeURIComponent(window.location.pathname.split("/").pop()) || 'DashboardLacteo.html';

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes pageIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            /* Importante: Espacio para que el menú no tape el contenido */
            body {
                animation: pageIn 0.4s ease-out forwards;
                padding-bottom: 80px !important; 
            }

            .nav-fija {
                position: fixed !important;
                bottom: 0 !important;
                left: 0 !important;
                width: 100% !important;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-top: 1px solid #e9d5ff;
                padding: 12px 0 20px 0; /* Padding extra abajo para iPhone/Android modernos */
                z-index: 999999; /* Máximo nivel para que no se mueva */
                box-shadow: 0 -5px 20px rgba(162, 28, 175, 0.1);
            }

            .active-btn { color: #a21caf !important; position: relative; }
            .active-btn .material-symbols-outlined {
                font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                filter: drop-shadow(0 0 5px rgba(162, 28, 175, 0.3));
            }
            .active-btn::after {
                content: '';
                position: absolute;
                top: -8px;
                width: 15px;
                height: 3px;
                background: #a21caf;
                border-radius: 2px;
            }
        `;
        document.head.appendChild(style);

        let html = `
        <nav class="nav-fija">
            <div class="max-w-md mx-auto flex justify-around items-center px-4">
        `;

        this.opciones.forEach(opt => {
            const esActivo = (pathActual === opt.link);
            html += `
                <button onclick="navegarA('${opt.link}')" 
                        class="flex flex-col items-center gap-1 transition-all active:scale-90 ${esActivo ? 'active-btn' : 'text-gray-400'}">
                    <span class="material-symbols-outlined text-[24px]">
                        ${opt.icon}
                    </span>
                    <span class="text-[8px] font-black uppercase tracking-widest">${opt.nombre}</span>
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

document.addEventListener('DOMContentLoaded', () => {
    MenuLogic.render();
});
