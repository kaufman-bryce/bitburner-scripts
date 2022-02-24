/** @param {NS} ns **/
export async function main(ns) {
  for (const sym of ns.stock.getSymbols()) {
    const shares = ns.stock.getPosition(sym)[0];
    if (shares > 0) {
      ns.stock.sell(sym, shares);
    }
  }
}
