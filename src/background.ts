import { setupStorageSync } from "./background-worker/storage-sync";

chrome.runtime.onMessage.addListener((msg, source, resp) => {
  // This pipeline can be accessed via site scripts, and popup scripts as well.
  console.log(msg);
  console.log(source);
  resp("polo");
});

setupStorageSync();
