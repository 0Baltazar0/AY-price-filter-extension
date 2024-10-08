import { z } from "zod";
import { SyncStorageMessage } from "./communication-interfaces";

export type callbackData = Omit<z.infer<typeof SyncStorageMessage>, "action">;

export function storageFunction(syncCallBack: (data: callbackData) => void) {
  const channel = chrome.runtime.connect({ name: "storage" });
  channel.onMessage.addListener((msg: z.infer<typeof SyncStorageMessage>) => {
    try {
      const data = SyncStorageMessage.parse(msg);
      if (data.action == "sync") syncCallBack(data);
    } catch (error) {
      console.log("Storage Function error", error);
    }
  });
  return {
    set: (data: callbackData) => {
      channel.postMessage({ ...data, action: "set" });
    },
    get: (data: Omit<callbackData, "data">) => {
      channel.postMessage({ ...data, action: "get" });
    },
    del: (data: Omit<callbackData, "data">) => {
      channel.postMessage({ ...data, action: "delete" });
    },
    close: () => {
      channel.disconnect();
    },
  };
}
