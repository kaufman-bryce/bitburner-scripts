/** @param {NS} ns **/
export async function main(ns) {
  let servers = JSON.parse(ns.read("servers.txt")).servers;
  // ns.tprint(servers[0]);
  const script = "/script/earlyHackTemplate.script";
  const mem = ns.getScriptRam(script);
  const target = ns.args[0];
  let hostCount = 0;
  let threadCount = 0;

  for (const server in servers) {
    const host = servers[server];
    let threads = Math.floor(host.maxRam / mem);
    if (host.hostname == "home") {
      const processes = ns.ps("home");
      for (let process of processes) {
        if (process.filename == script) {
          ns.kill(process.pid);
        }
      }
      const homeRamMaxPercent =
        (host.maxRam - ns.getScriptRam(ns.getScriptName())) * 0.9;
      const homeRamMaxOffset = host.maxRam - 48;
      const homeRamCutoff = ns.args[1] > 0 ? ns.args[1] : Math.pow(2 ^ 20);
      const homeRamMax = Math.min(
        homeRamCutoff,
        Math.max(homeRamMaxOffset, homeRamMaxPercent)
      );

      threads = Math.floor(homeRamMax / mem);
      ns.exec(
        script,
        host.hostname,
        threads,
        target,
        servers[target].moneyMax,
        servers[target].minDifficulty
      );
      hostCount++;
      threadCount += threads;
    } else if (host.hasAdminRights == true && threads > 0) {
      ns.killall(host.hostname);
      await ns.scp(script, "home", host.hostname);
      ns.exec(
        script,
        host.hostname,
        threads,
        target,
        servers[target].moneyMax,
        servers[target].minDifficulty
      );
      hostCount++;
      threadCount += threads;
    }
  }

  ns.tprint(
    `${script} deployed and running on ${hostCount} servers with ${threadCount} threads.`
  );
}
