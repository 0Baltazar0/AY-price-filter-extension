import { ItemController } from "./entryController";

export function ayGetFinalPrice(target: ItemController) {
  const fp = target.element.querySelector(
    'span[data-testid="finalPrice"]'
  )?.innerHTML;
  return fp ? Number(fp.replace(/\D/g, "")) : undefined;
}
// const lpre = /"Legjobb ár az elmúlt 30 napban\*\*: ([\d\.]+) Ft ([\+\-]?[\d]+)"/
export function AyGetLowest(
  target: ItemController
): [number, number] | undefined {
  const lp = target.element.querySelector(
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
export function aYisBad(target: ItemController): boolean {
  const low = ayGetFinalPrice(target);
  const change = AyGetLowest(target);
  if (!low || !change) return false;
  if (low < change[0]) return false;
  return true;
}
