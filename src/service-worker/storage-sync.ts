import { SyncStorageMessage } from "@/shared/communication-interfaces";
import { z } from "zod";

function storageSynchronizer(
  msg: z.infer<typeof SyncStorageMessage>,
  port: chrome.runtime.Port
): void {
  let data: z.infer<typeof SyncStorageMessage>;
  console.log("Message recieved", msg);
  try {
    data = SyncStorageMessage.parse(msg);
    switch (data.action) {
      case "sync":
        return;
      case "set":
        chrome.storage.local
          .set({ [data.field]: data.data })
          .then(() => console.log("Store updated"))
          .catch((err) => console.error(err));

        port.postMessage({
          ...data,
          action: "sync",
        });
        return;
      case "get":
        chrome.storage.local.get({ [data.field]: true }, (resp) => {
          port.postMessage({
            action: "sync",
            field: data.field,
            data: resp[data.field],
          });
        });
        return;
      case "delete":
        chrome.storage.local
          .set({ [data.field]: undefined })
          .then(() => console.log("Store updated"))
          .catch((err) => console.error(err));

        port.postMessage({
          action: "sync",
          field: data.field,
          data: undefined,
        });
        return;

      default:
        console.log("Faulty action statement", data.action);
        break;
    }
  } catch (error) {
    console.log("Faulty message received", msg, error);
    return;
  }
}

export function setupStorageSync() {
  chrome.runtime.onConnect.addListener((port) => {
    // This function can facilitate targeted messages, by setting up issue specific channels
    console.log(port, port.name == "storage");
    if (port.name == "storage") {
      // A barebone example of centralized storage access facilitated by the service worker
      console.log("Port Open");
      port.onMessage.addListener(storageSynchronizer);
      chrome.storage.local.onChanged.addListener((changes) => {
        console.log("Local storage changed", changes);
        Object.keys(changes).forEach((key) => {
          port.postMessage({
            action: "sync",
            field: key,
            data: changes[key].newValue,
          });
        });
      });
    }
  });
}
