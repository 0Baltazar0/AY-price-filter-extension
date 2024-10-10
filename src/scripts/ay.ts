import { callbackData, storageFunction } from "@/shared/storage-comms";
let isActive = false;
let isStrict = false;
const observer = new MutationObserver(filter);
function onStoreChange(msg: callbackData) {
  console.log(`Storage message received`, msg, "activate", isActive);
  if (msg.field == "strict") {
    isStrict = Boolean(msg.data);
  }

  if (msg.field == "activate") {
    if (Boolean(msg.data) != isActive) {
      if (Boolean(msg.data)) {
        console.log("Observe Start");
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        console.log("Observe Stop");
        observer.disconnect();
      }
      isActive = Boolean(msg.data);
    }
  }
}
let { get } = storageFunction(onStoreChange);

function getBlocks(): NodeListOf<HTMLLIElement> {
  return document.querySelectorAll(
    "section> div> ul> li"
  ) as NodeListOf<HTMLLIElement>;
}
function finalPrice(target: HTMLLIElement) {
  const fp = target.querySelector('span[data-testid="finalPrice"]')?.innerHTML;
  return fp ? Number(fp.replace(/\D/g, "")) : undefined;
}
// const lpre = /"Legjobb ár az elmúlt 30 napban\*\*: ([\d\.]+) Ft ([\+\-]?[\d]+)"/
function lowest30(target: HTMLLIElement): [number, number] | undefined {
  const lp = target.querySelector(
    'div[data-testid="lowestProductPrice30D"'
  )?.innerHTML;
  if (lp) {
    return [
      Number(lp.split(":")[1].split("(")[0].replace(/\D/g, "")),
      Number(lp.split(":")[1].split("(")[1].replace(/\D/g, "")),
    ];
  }
  return undefined;
}
function isBad(target: HTMLLIElement): boolean {
  const low = finalPrice(target);
  const change = lowest30(target);
  console.log(low, change);
  if (!low || !change) return false;
  if (low < change[0]) return false;
  console.log("Yeeting", low, change);
  return true;
}
function filter() {
  const target_blocks = getBlocks();
  console.log("Filtering", target_blocks.length);
  target_blocks.forEach((li, index) => {
    if (index == 0) return;
    if (isBad(li)) {
      li.remove();
      // li.style.display = "none";
    } else {
      if (isStrict && lowest30(li) == undefined) li.remove();
    }
    const remains = getBlocks();
    if (remains.length == 1) {
      remains[0].scrollIntoView({ behavior: "smooth" });
    } else {
      if (isBad(remains[0]) || (isStrict && lowest30(remains[0]) == undefined))
        remains[0].remove();
    }
  });
}

function main() {
  get({ field: "activate" });
  get({ field: "strict" });
}

window.addEventListener("load", main);
