// Built upon u/pwillia7 's stock script.
// u/ferrus_aub stock script using simple portfolio algorithm.
// https://www.reddit.com/r/Bitburner/comments/rn7l84/stock_script_to_end_your_financial_problems/
/** @param {NS} ns **/
export async function main(ns) {
  var maxSharePer = 1.0; // How much of max shares are we willing to buy?
  var stockBuyPer = 0.6; // Minimum stock forcast
  var stockVolPer = 0.05; // Maximum volitilty
  var moneyKeep = 1000000000; // Leave this much in wallet
  var moneyStrt = 2000000000; // Don't buy unless we have this much (reduces fee loss)
  var minSharePer = 5; // Minimum stocks in each purchase (increase to reduce fee loss when funds are low)

  while (true) {
    ns.disableLog("disableLog");
    ns.disableLog("sleep");
    ns.disableLog("getServerMoneyAvailable");
    // Sort symbols to prioritize highest forcast (/u/humm_what_not)
    var stocks = ns.stock.getSymbols().sort(function (a, b) {
      return ns.stock.getForecast(b) - ns.stock.getForecast(a);
    });
    for (const stock of stocks) {
      var position = ns.stock.getPosition(stock);
      if (position[0]) {
        //ns.print('Position: ' + stock + ', ')
        sellPositions(stock);
      }
      buyPositions(stock);
    }
    ns.print("Cycle Complete");
    await ns.sleep(6000);
  }
  function buyPositions(stock) {
    var maxShares = ns.stock.getMaxShares(stock) * maxSharePer - position[0];
    var askPrice = ns.stock.getAskPrice(stock);
    var forecast = ns.stock.getForecast(stock);
    var volPer = ns.stock.getVolatility(stock);
    var playerMoney = ns.getServerMoneyAvailable("home");

    if (forecast >= stockBuyPer && volPer <= stockVolPer) {
      if (
        playerMoney >= moneyStrt &&
        playerMoney - moneyKeep >
          ns.stock.getPurchaseCost(stock, minSharePer, "Long")
      ) {
        var shares = Math.min(
          (playerMoney - moneyKeep - 100000) / askPrice,
          maxShares
        );
        ns.stock.buy(stock, shares);
        //ns.print('Bought: '+ stock + '')
      }
    }
  }
  function sellPositions(stock) {
    var forecast = ns.stock.getForecast(stock);
    if (forecast < 0.5) {
      ns.stock.sell(stock, position[0]);
      //ns.print('Sold: '+ stock + '')
    }
  }
}
