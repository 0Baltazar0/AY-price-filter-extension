import { fetchItems, ItemController } from "./entryController";
import { ayoIsBad, ayoLowest } from "./ayo_utils";

const ITEM_SELECTOR = "article";

export class Script {
  private ITEM_SELECTOR = ITEM_SELECTOR;
  private DO_DELETE: boolean = false;
  private DO_RUN: boolean | undefined = undefined;
  private REMOVE_NO_LOWEST: boolean = false;
  private TOLERANCE: number = 0;
  observer: MutationObserver;
  constructor() {
    window.addEventListener("popstate", (event) => {
      console.log("fire");
      this.DO_RUN = false;
      setTimeout(() => {
        this.DO_RUN = true;
        this.execute();
      }, 5000);
    });
    this.observer = new MutationObserver(this.execute.bind(this));
    chrome.storage.local
      .get({
        AYO_ITEM_SELECTOR: ITEM_SELECTOR,
        AYO_DELETE: false,
        AYO_DO_RUN: true,
        AYO_REMOVE_NO_LOWEST: false,
        AY_TOLERANCE: 0,
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
        case "AYO_TOLERANCE":
          if (typeof data[key] == "number") {
            this.TOLERANCE = data[key];
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
      if (ayoIsBad(li, this.TOLERANCE)) {
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
    setTimeout(() => {
      this.DO_RUN = true;
    }, 5000);
    if (this.DO_RUN) {
      this.DO_RUN = false;
      const entries = fetchItems(this.ITEM_SELECTOR);
      this.filterItems(entries);
    }
  }
}

function main() {
  new Script();
}

window.addEventListener("load", main);
