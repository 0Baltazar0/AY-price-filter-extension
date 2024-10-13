const HIDE_CLASS = "extension-hide";

export class ItemController {
  constructor(public element: Element, public fire: boolean = false) {}

  execute(mode: "delete" | "hide") {
    if (this.fire) {
      switch (mode) {
        case "delete":
          this.element.remove();
        case "hide":
          this.element.classList.add(HIDE_CLASS);
      }
    } else {
      this.element.classList.remove(HIDE_CLASS);
    }
  }
}

export function fetchItems(selector: string) {
  return Array.from(document.querySelectorAll(selector)).map(
    (el) => new ItemController(el)
  );
}

export function fetchInspirations(selector: string) {
  return Array.from(document.querySelectorAll(selector)).map(
    (el) => new ItemController(el)
  );
}
