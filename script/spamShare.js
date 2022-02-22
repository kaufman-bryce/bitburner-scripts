/** @param {NS} ns **/
export async function main(ns) {
  let servers = JSON.parse(ns.read("servers.txt")).servers;
  const shareScriptName = "/script/shareLoop.script";
  const shareScriptRam = 4;
  for (const server in servers) {
    const host = servers[server];
    if (host.purchasedByPlayer) {
      let ramUse = 0;
      if (host.hostname == "home") {
        const processes = ns.ps(host.hostname);
        for (let process of processes) {
          if (process.filename == shareScriptName) {
            ns.kill(process.pid);
          }
        }
        await ns.sleep(100);
        ramUse = Math.max(ns.getServerUsedRam(host.hostname) + 64, 64);
      } else {
        ns.killall(host.hostname);
      }
      let threads = Math.floor((host.maxRam - ramUse) / shareScriptRam);
      if (threads > 0) {
        await ns.scp(shareScriptName, host.hostname);
        ns.exec(shareScriptName, host.hostname, threads);
      }
    }
  }
}
