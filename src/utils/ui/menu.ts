import { Dismiss } from "flowbite";

const DISABLED_BUTTON_CLASS = ["pointer-events-none", "!bg-gray-300", "!text-gray-500"];

export const simpleMovementButton = document.getElementById("btnSimpleMovement")!;
export const pushMovementButton = document.getElementById("btnPushMovement")!;
export const pullMovementButton = document.getElementById("btnPullMovement")!;

export function enableMovement(id: "btnSimpleMovement" | "btnPushMovement" | "btnPullMovement") {
    document.getElementById(id)!.classList.remove(...DISABLED_BUTTON_CLASS);
}

export function enableMenu() {
    simpleMovementButton.classList.remove(...DISABLED_BUTTON_CLASS);
    pushMovementButton.classList.remove(...DISABLED_BUTTON_CLASS);
    pullMovementButton.classList.remove(...DISABLED_BUTTON_CLASS);
}

export function disableMenu() {
    document.getElementById("btnSimpleMovement")!.classList.add(...DISABLED_BUTTON_CLASS);
    pushMovementButton.classList.add(...DISABLED_BUTTON_CLASS);
    pullMovementButton.classList.add(...DISABLED_BUTTON_CLASS);
}

export function showErrorMessage(message: string) {
    const toastContainer = document.getElementById("toast-container");

    if (!toastContainer) {
      console.error("Toast container not found!");
      return;
    }
  
    // Crear el HTML del toast
    const toast = document.createElement("div");
    toast.className =
      "flex items-center p-4 mb-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800";
    toast.innerHTML = `
      <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 101.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
      </div>
      <div class="ml-3 text-sm font-normal">${message}</div>
      <button class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    `;
  
    // Agregar evento para eliminar el toast
    const closeButton = toast.querySelector("button");
    const  toastHandler = new Dismiss(toast);

    closeButton?.addEventListener("click", () => {
      toastHandler.hide();
      toastHandler.destroy();
    });
  
    // Agregar el toast al contenedor
    toastContainer.appendChild(toast);
    // Remover automáticamente el toast después de 5 segundos
    setTimeout(() => {
        toastHandler.hide();
        toastHandler.destroy();
    }, 5000);
    
    
}