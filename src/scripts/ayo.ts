import { fetchItems, ItemController } from "./entryController";
import { ayoIsBad, ayoLowest } from "./ayo_utils";

const ITEM_SELECTOR = "article";

export class Script {
  private ITEM_SELECTOR = ITEM_SELECTOR;
  private DO_DELETE: boolean = false;
  private DO_RUN: boolean | undefined = undefined;
  private REMOVE_NO_LOWEST: boolean = false;
  observer: MutationObserver;
  constructor() {
    this.observer = new MutationObserver(this.execute.bind(this));
    chrome.storage.local
      .get({
        AYO_ITEM_SELECTOR: ITEM_SELECTOR,
        AYO_DELETE: false,
        AYO_DO_RUN: true,
        AYO_REMOVE_NO_LOWEST: false,
      })
      .then(this.updateStorage.bind(this));

    chrome.storage.local.onChanged.addListener((ch) => {
      this.updateStorage(
        Object.keys(ch).reduce((res, key) => {
          res[key] = ch[key].newValue;
          return res;
        }, {} as { [key: string]: any })
      );
    });
  }
  updateStorage(data: { [key: string]: any }) {
    console.log(data);
    Object.keys(data).forEach((key) => {
      switch (key) {
        case "AYO_ITEM_SELECTOR":
          if (data[key]) {
            this.ITEM_SELECTOR = data[key];
          }
          break;

        case "AYO_DELETE":
          if (typeof data[key] == "boolean") {
            this.DO_DELETE = data[key];
          }
          break;

        case "AYO_REMOVE_NO_LOWEST":
          if (typeof data[key] == "boolean") {
            this.REMOVE_NO_LOWEST = data[key];
          }
          break;
        case "AYO_DO_RUN":
          if (typeof data[key] == "boolean") {
            this.DO_RUN = data[key];
            if (this.DO_RUN == false) {
              console.log("stopping", this);
              this.observer.disconnect();
            } else {
              console.log("starting", this);
              this.observer.observe(document.body, {
                childList: true,
                subtree: true,
              });
            }
          }
      }
    });
  }
  filterItems(items: ItemController[]) {
    items.forEach((li, index) => {
      if (ayoIsBad(li)) {
        li.fire = true;
      } else {
        if (this.REMOVE_NO_LOWEST && ayoLowest(li) == undefined) li.fire = true;
      }
    });
    const remains = items.filter((item) => item.fire);
    if (remains.length == 1) {
      remains[0].fire = false;
    }
    items.forEach((item) => item.execute(this.DO_DELETE ? "delete" : "hide"));
    const lastItems = items.filter((item) => item.fire);
    if (lastItems.length == 1) {
      lastItems[0].element.scrollIntoView({ behavior: "smooth" });
    }
  }

  execute() {
    if (this.DO_RUN) {
      const entries = fetchItems(this.ITEM_SELECTOR);
      this.filterItems(entries);
    }
  }
}

function main() {
  new Script();
}

window.addEventListener("load", main);
