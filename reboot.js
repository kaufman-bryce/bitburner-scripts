/** @param {NS} ns **/
export async function main(ns) {
  ns.tprint(
    "Running /script/customStats.js, PID:" +
      ns.exec("/script/customStats.js", "home")
  );
  ns.tprint(
    "Running /script/scan.js, PID:" +
      ns.exec("/script/scan.js", "home", 1, true)
  );
  ns.tprint(
    "Running /script/thirdparty/kamukrass/upgrade-servers.js, PID:" +
      ns.exec("/script/thirdparty/kamukrass/upgrade-servers.js", "home")
  );
  ns.tprint(
    "Running /script/thirdparty/kamukrass/stock-trader.js, PID:" +
      ns.exec("/script/thirdparty/kamukrass/stock-trader.js", "home")
  );
  ns.tprint(
    "Running /script/thirdparty/kamukrass/distributed-hack.js, PID:" +
      ns.exec("/script/thirdparty/kamukrass/distributed-hack.js", "home")
  );
}
