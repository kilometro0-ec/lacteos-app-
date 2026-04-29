/**
 * LÓGICA LÁCTEA - CONTROL DE NAVEGACIÓN v2.4 (Ultra-Compact)
 * Fix: Reducción de altura y proporciones para celular.
 */

window.navegarA = function(url) {
    document.body.style.transition = "opacity 0.2s ease";
    document.body.style.opacity = "0";
    setTimeout(() => { window.location.href = url; }, 200);
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
            /* Ajuste del cuerpo para no dejar tanto espacio muerto abajo */
            body {
                padding-bottom: 65px !important; 
            }

            .nav-fija {
                position: fixed !important;
                bottom: 0 !important;
                left: 0 !important;
                width: 100% !important;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                border-top: 1px solid #f3e8ff;
                /* ALTURA REDUCIDA */
                padding: 8px 0 12px 0; 
                z-index: 999999;
                box-shadow: 0 -4px 15px rgba(162, 28, 175, 0.05);
            }

            .menu-grid {
                max-width: 500px;
                margin: 0 auto;
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding: 0 10px;
            }

            .nav-btn {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
                color: #94a3b8;
                transition: all 0.2s ease;
                background: none;
                border: none;
                outline: none;
            }

            /* Iconos más pequeños */
            .nav-btn .material-symbols-outlined {
                font-size: 22px !important; 
                font-variation-settings: 'wght' 300;
            }

            /* Texto minúsculo pero legible */
            .nav-btn span:last-child {
                font-size: 8px !important;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .active-btn { 
                color: #a21caf !important; 
            }

            .active-btn .material-symbols-outlined {
                font-variation-settings: 'FILL' 1, 'wght' 400;
                transform: translateY(-2px);
            }

            /* Indicador activo minimalista */
            .active-btn::after {
                content: '';
                position: absolute;
                bottom: -4px;
                width: 12px;
                height: 2px;
                background: #a21caf;
                border-radius: 10px;
            }
        `;
        document.head.appendChild(style);

        let html = `<nav class="nav-fija"><div class="menu-grid">`;

        this.opciones.forEach(opt => {
            const esActivo = (pathActual === opt.link);
            html += `
                <button onclick="navegarA('${opt.link}')" class="nav-btn ${esActivo ? 'active-btn' : ''}">
                    <span class="material-symbols-outlined">${opt.icon}</span>
                    <span>${opt.nombre}</span>
                </button>
            `;
        });

        html += `</div></nav>`;
        container.innerHTML = html;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    MenuLogic.render();
});
