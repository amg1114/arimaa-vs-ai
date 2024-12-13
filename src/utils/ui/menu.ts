const DISABLED_BUTTON_CLASS = ["pointer-events-none", "!bg-gray-300", "!text-gray-500"];

const errorMessage = document.getElementById("errorMessage")!;

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
    hideErrorMessage();
}

export function showErrorMessage(message: string) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

export function hideErrorMessage() {
    errorMessage.classList.add("hidden");
}