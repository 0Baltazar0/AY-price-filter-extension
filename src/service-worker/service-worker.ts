import { manageLanding } from "./manage-landing";
import { setupStorageSync } from "./storage-sync";

chrome.runtime.onMessage.addListener((msg, source, resp) => {
  // This pipeline can be accessed via site scripts, and popup scripts as well.
  if (msg == "polo") return;
  console.log(msg);
  console.log(source);
  resp("polo");
});

setupStorageSync();
manageLanding();
