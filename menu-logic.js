/**
 * LÓGICA LÁCTEA - CONTROL DE NAVEGACIÓN v3.0 (Premium Edition)
 * Sistema de navegación con identidad de marca Magenta/Púrpura.
 */

window.navegarA = function(url) {
    // Efecto de salida suave (Smooth Out)
    document.body.style.transition = "opacity 0.25s ease";
    document.body.style.opacity = "0";
    setTimeout(() => { window.location.href = url; }, 250);
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

        // Detectar página actual para marcar el estado activo
        const pathActual = decodeURIComponent(window.location.pathname.split("/").pop()) || 'DashboardLacteo.html';

        // Inyección de Estilos Premium
        const style = document.createElement('style');
        style.innerHTML = `
            body { 
                padding-bottom: 85px !important; 
            }

            .nav-fija {
                position: fixed !important;
                bottom: 0 !important;
                left: 0 !important;
                width: 100% !important;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                border-top: 1px solid #e9d5ff;
                padding: 10px 0 20px 0;
                z-index: 999999;
                box-shadow: 0 -10px 25px rgba(162, 28, 175, 0.08);
            }

            .menu-grid {
                max-width: 500px;
                margin: 0 auto;
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding: 0 12px;
            }

            .nav-btn {
                position: relative;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                color: #94a3b8; /* Slate 400 */
                background: none;
                border: none;
                outline: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
            }

            .nav-btn .material-symbols-outlined {
                font-size: 24px !important;
                font-variation-settings: 'wght' 300, 'FILL' 0;
            }

            .nav-btn span:last-child {
                font-size: 9px !important;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            /* --- ESTADO ACTIVO (MARCA PREMIUM) --- */
            .active-btn {
                color: #a21caf !important; /* Primary Púrpura */
            }

            .active-btn .material-symbols-outlined {
                font-variation-settings: 'wght' 500, 'FILL' 1 !important;
                transform: translateY(-4px);
                color: #db2777; /* Secondary Magenta */
            }

            /* Indicador de píldora inferior */
            .active-btn::after {
                content: '';
                position: absolute;
                bottom: -8px;
                width: 20px;
                height: 4px;
                background: linear-gradient(90deg, #a21caf, #db2777);
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(219, 39, 119, 0.4);
            }

            /* Feedback táctil */
            .nav-btn:active {
                transform: scale(0.9);
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);

        // Generación del HTML del menú
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

// Ejecución automática al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    MenuLogic.render();
    
    // Suavizado de entrada (Fade In)
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.4s ease";
    requestAnimationFrame(() => {
        document.body.style.opacity = "1";
    });
});
