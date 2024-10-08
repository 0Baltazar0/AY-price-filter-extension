import { callbackData, storageFunction } from "@/shared/storage-comms";
function logChange(msg: callbackData) {
  console.log(`Storage message received`, msg);
  if (msg.field == "windowVariable") {
    (window as any).windowVariable = msg.data;
  }
}
let { set } = storageFunction(logChange);
function injectWindow() {
  console.log("inject started");
  (window as any).storageSetter = (data: any) => {
    set({ field: "windowVariable", data });
  };
  const input = document.createElement("input");
  input.addEventListener("change", (event) => {
    set({ field: "windowVariable", data: (event as any).target.value });
  });
  input.id = "injectedInput";
  document.body.appendChild(input);
  console.log(window, (window as any).storageSetter);
}
console.log("Script loaded");
window.addEventListener("load", injectWindow);
