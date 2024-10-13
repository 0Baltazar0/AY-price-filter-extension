import { ItemController } from "./entryController";

export function ayoFinalPrice(target: ItemController) {
  const fp = target.element.querySelector(".bg-yellow")?.innerHTML;
  return fp ? Number(fp.replace(/\D/g, "")) : undefined;
}
export function ayoLowest(
  target: ItemController
): [number, number] | undefined {
  const lp = target.element.querySelector(
    ".flex.flex-col > div+div"
  )?.innerHTML;
  if (lp) {
    return [
      Number(lp.split("Ft")[0].replace(/\D/g, "")),
      Number(lp.split("Ft")[1].replace(/\D/g, "")),
    ];
  }
  return undefined;
}
export function ayoIsBad(target: ItemController): boolean {
  const low = ayoFinalPrice(target);
  const change = ayoLowest(target);
  if (!low || !change) return false;
  if (low < change[0]) return false;
  return true;
}
