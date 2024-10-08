import { SyncStorageMessage } from "@/shared/communication-interfaces";
import { z } from "zod";

function storageSynchronizer(
  msg: z.infer<typeof SyncStorageMessage>,
  port: chrome.runtime.Port
): void {
  let data: z.infer<typeof SyncStorageMessage>;
  try {
    data = SyncStorageMessage.parse(msg);
  } catch (error) {
    console.log("Faulty message received", msg, error);
    return;
  }
  switch (data.action) {
    case "sync":
      return;
    case "set":
      chrome.storage.local.set({ [data.field]: data.data });
      const set: z.infer<typeof SyncStorageMessage> = {
        ...data,
        action: "sync",
      };
      port.postMessage({ set });
      return;
    case "get":
      chrome.storage.local.get({ [data.field]: true }, (resp) => {
        const sync: z.infer<typeof SyncStorageMessage> = {
          action: "sync",
          field: data.field,
          data: resp[data.field],
        };
        port.postMessage(sync);
      });
      return;
    case "delete":
      chrome.storage.local.set({ [data.field]: undefined });
      const del: z.infer<typeof SyncStorageMessage> = {
        action: "sync",
        field: data.field,
        data: undefined,
      };
      port.postMessage({ del });
      return;

    default:
      console.log("Faulty action statement", data.action);
      break;
  }
}

export function setupStorageSync() {
  chrome.runtime.onConnect.addListener((port) => {
    // This function can facilitate targeted messages, by setting up issue specific channels
    console.log(port);
    if (port.name == "storage") {
      // A barebone example of synchronized storage access facilitated by the background worker
      port.onMessage.addListener(storageSynchronizer);
    }
  });
}
