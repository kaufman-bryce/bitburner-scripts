/** @param {NS} ns **/
export async function main(ns) {
  let servers = new Set();

  function netmap(targ = "home", depth = 0, parent = null) {
    servers[targ] = ns.getServer(targ);
    servers[targ].parent = parent;
    servers[targ].depth = depth;
    servers[targ].children = ns.scan(targ).filter((child) => child != parent);
    servers[targ].children.forEach((child) => netmap(child, depth + 1, targ));
    servers[targ].files = ns.ls(targ).filter((file) => {
      const isScript =
        file.endsWith(".js") ||
        file.endsWith(".ns") ||
        file.endsWith(".script");
      return !isScript;
    });
  }
  do {
    netmap();
    servers.forEach((server) => {
      if (!ns.serverExists(server.hostname)) {
        servers.delete(server);
      }
    });
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
