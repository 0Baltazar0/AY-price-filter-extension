import { callbackData, storageFunction } from "@/shared/storage-comms";
function logChange(msg: callbackData) {
  console.log(`Storage message received`, msg);
  if (msg.field == "windowVariable") {
    (window as any).windowVariable = msg.data;
  }
}
let { set } = storageFunction(logChange);
function injectWindow() {
  (window as any).storageSetter = (data: any) => {
    set({ field: "windowVariable", data });
  };
}
injectWindow();
