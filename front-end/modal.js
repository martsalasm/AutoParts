// --- Referencias a los elementos del DOM ---
// Buscamos los elementos del modal en la página actual.
// Si no existen, estas constantes serán 'null', pero no causarán un error aún.
const warningModal = document.getElementById('warningModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalIcon = document.getElementById('modalIcon');

// --- Iconos SVG (sin cambios) ---
const successIcon = `
    <svg class="w-16 h-16 text-[#4caf50]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
`;
const errorIcon = `
    <svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
`;


/**
 * Muestra el modal.
 * ESTA FUNCIÓN ES LA ÚNICA QUE SE EXPORTA.
 * Ahora comprueba si el modal existe antes de hacer nada.
 * @param {string} title - El título a mostrar.
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - 'success' o 'error' para el icono.
 */
export function showModal(title, message, type = 'success') {

    if (!warningModal) {
        console.log("Modal no encontrado.");
        return;
    }

    // modal existe
    // asignar valores y mostrar.
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalIcon.innerHTML = type === 'success' ? successIcon : errorIcon;

    warningModal.classList.remove('hidden');
    setTimeout(() => {
        warningModal.classList.add('opacity-100');
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function hideModal() {
    if (!warningModal) return;
    
    modalContent.classList.add('scale-95', 'opacity-0');
    warningModal.classList.remove('opacity-100');
    setTimeout(() => {
        warningModal.classList.add('hidden');
    }, 300);
}


if (warningModal) {
    closeModalBtn.addEventListener('click', hideModal);

    warningModal.addEventListener('click', (event) => {
        // Cierra el modal si se hace clic en el fondo oscuro
        if (event.target === warningModal) {
            hideModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        // Cierra el modal al presionar la tecla "Escape"
        if (event.key === 'Escape' && !warningModal.classList.contains('hidden')) {
            hideModal();
        }
    });
}