import { ItemController } from "./entryController";

export function ayoFinalPrice(target: ItemController) {
  const fp = target.element.querySelector(".bg-yellow")?.innerHTML;
  return fp ? Number(fp.replace(/\D/g, "")) : undefined;
}
export function ayoLowest(
  target: ItemController
): [number, number] | undefined {
  const lp = target.element.querySelector(
    ".flex.flex-col.text-gray-600 > div+div"
  )?.innerHTML;
  if (lp) {
    return [
      Number(lp.split("Ft")[0].replace(/\D/g, "")),
      Number(lp.split("Ft")[1].replace(/\D/g, "")),
    ];
  }
  return undefined;
}
export function ayoIsBad(
  target: ItemController,
  tolerance: number = 0
): boolean {
  const current = ayoFinalPrice(target);
  const lowest = ayoLowest(target);
  if (!current || !lowest) return false;
  if (tolerance >= 0) {
    return !((current - lowest[0]) / current <= tolerance / 100);
  }
  if (current < lowest[0]) return false;
  return true;
}
