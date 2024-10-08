export function manageLanding() {
  chrome.runtime.onMessage.addListener((msg) => {
    if (typeof msg == "string" && msg == "landing") {
      chrome.tabs.create({ url: "/landing.html", active: true });
    }
  });
}
