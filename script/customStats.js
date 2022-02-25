/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog("ALL");
  const args = ns.flags([["help", false]]);
  if (args.help) {
    ns.tprint(
      "This script enhances the Overview window with custom statistics.\n" +
        `Usage: run ${ns.getScriptName()}\n` +
        "Example:\n" +
        `> run ${ns.getScriptName()}`
    );
    return;
  }

  const doc = eval("document"); // This is expensive! (25GB RAM) Perhaps there's a way around it? ;)
  const hook0 = doc.getElementById("overview-extra-hook-0");
  const hook1 = doc.getElementById("overview-extra-hook-1");
  while (true) {
    try {
      const headers = [];
      const values = [];
      // Net Worth
      headers.push("NtWrth |");
      values.push(
        ns.nFormat(ns.getServerMoneyAvailable("home") + stockVal(), "$0,0.00a")
      );
      // Add script income per second
      headers.push("ScrInc |");
      values.push(
        ns.nFormat(ns.getScriptIncome()[0].toPrecision(5), "0,0.00a") + "/sec"
      );
      // Add script exp gain rate per second
      headers.push("ScrExp |");
      values.push(
        ns.nFormat(ns.getScriptExpGain().toPrecision(5), "0,0.00a") + "/sec"
      );
      //Add total Karma
      headers.push(" Karma |");
      values.push(ns.nFormat(ns.heart.break(), ",00.000a"));
      // TODO: Add more neat stuff

      // Now drop it into the placeholder elements
      hook0.innerText = headers.join(" \n");
      hook1.innerText = values.join("\n");
    } catch (err) {
      // This might come in handy later
      ns.print("ERROR: Update Skipped: " + String(err));
    }
    await ns.sleep(1000);
  }
  function stockVal() {
    const commission = 100000;
    const stockSymbols = ns.stock.getSymbols();
    let val = 0;
    for (const sym of stockSymbols) {
      const pos = ns.stock.getPosition(sym);
      const stock = {
        longShares: pos[0],
        longPrice: pos[1],
        shortShares: pos[2],
        shortPrice: pos[3],
        askPrice: ns.stock.getAskPrice(sym),
        bidPrice: ns.stock.getBidPrice(sym),
      };
      val +=
        stock.longShares * stock.longPrice +
        stock.shortShares * stock.shortPrice;
      val +=
        stock.longShares * (stock.bidPrice - stock.longPrice) - 2 * commission;
      val +=
        stock.shortShares * (stock.shortPrice - stock.askPrice) -
        2 * commission;
      return val;
    }
  }
}
