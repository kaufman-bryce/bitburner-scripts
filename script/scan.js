/** @param {NS} ns **/
export async function main(ns) {
  let servers = new Set();

  function netmap(targ = "home", depth = 0, parent = null) {
    // if (servers[targ] == undefined) {
      servers[targ] = ns.getServer(targ);
      servers[targ].parent = parent;
      servers[targ].depth = depth;
      servers[targ].children = ns.scan(targ).filter((child) => child != parent);
      servers[targ].children.forEach((child) => netmap(child, depth + 1, targ));
    // }
  }
  do {
    netmap();
    await ns.write(
      "servers.txt",
      JSON.stringify({
        lastUpdated: ns.getTimeSinceLastAug(),
        servers: servers,
      }),
      "w"
    );
    await ns.sleep(5000);
  } while (ns.args[0] == true);
}
