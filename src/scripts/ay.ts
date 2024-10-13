import { fetchItems, ItemController } from "./entryController";
import { AyGetLowest, aYisBad } from "./ay_utils";

const ITEM_SELECTOR = "section > div > ul > li";
const INSPIRATION_SELECTOR = ".s8azd9n";

export class Script {
  private ITEM_SELECTOR = ITEM_SELECTOR;
  private INSPIRATION_SELECTOR = INSPIRATION_SELECTOR;
  private INSPIRATION_REMOVE: boolean = false;
  private DO_DELETE: boolean = false;
  private DO_RUN: boolean | undefined = undefined;
  private REMOVE_NO_LOWEST: boolean = false;
  observer: MutationObserver;
  constructor() {
    this.observer = new MutationObserver(this.execute.bind(this));
    chrome.storage.local
      .get({
        AY_ITEM_SELECTOR: true,
        AY_INSPIRATION_SELECTOR: true,
        AY_DELETE: true,
        AY_DO_RUN: true,
        AY_INSPIRATION_REMOVE: true,
        AY_REMOVE_NO_LOWEST: true,
      })
      .then(this.updateStorage);

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
    Object.keys(data).forEach((key) => {
      switch (key) {
        case "AY_ITEM_SELECTOR":
          if (data[key]) {
            this.ITEM_SELECTOR = data[key];
          }
          break;
        case "AY_INSPIRATION_SELECTOR":
          if (data[key]) {
            this.INSPIRATION_SELECTOR = data[key];
          }
          break;
        case "AY_DELETE":
          if (typeof data[key] == "boolean") {
            this.DO_DELETE = data[key];
          }
          break;
        case "AY_INSPIRATION_REMOVE":
          if (typeof data[key] == "boolean") {
            this.INSPIRATION_REMOVE = data[key];
          }
          break;
        case "AY_REMOVE_NO_LOWEST":
          if (typeof data[key] == "boolean") {
            this.REMOVE_NO_LOWEST = data[key];
          }
          break;
        case "AY_DO_RUN":
          if (typeof data[key] == "boolean") {
            this.DO_RUN = data[key];
            if (this.DO_RUN) {
              this.observer.disconnect();
            } else {
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
      if (aYisBad(li)) {
        li.fire = true;
      } else {
        if (this.REMOVE_NO_LOWEST && AyGetLowest(li) == undefined)
          li.fire = true;
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
  filterBanners(banners: ItemController[]) {
    banners.forEach((banner) => {
      if (this.INSPIRATION_REMOVE) {
        banner.fire = true;
      }
    });
    banners.forEach((banner) => {
      banner.execute(this.DO_DELETE ? "delete" : "hide");
    });
  }
  execute() {
    if (this.DO_RUN) {
      const entries = fetchItems(this.ITEM_SELECTOR);
      this.filterItems(entries);
      const banners = fetchItems(this.INSPIRATION_SELECTOR);
      this.filterBanners(banners);
    }
  }
}

function main() {
  new Script();
}

window.addEventListener("load", main);
