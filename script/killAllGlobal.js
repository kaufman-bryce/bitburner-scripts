/** @param {NS} ns **/
export async function main(ns) {
  let servers = JSON.parse(ns.read("servers.txt")).servers;
  const script = ns.args[0];
  let kills = 0;
  for (const server in servers) {
    let host = servers[server];
    const processes = ns.ps(host.hostname);
    for (let process of processes) {
      if (process.filename == script) {
        ns.kill(process.pid);
        kills++;
      }
    }
  }
  ns.tprint(`INFO Killed ${kills} processes.`)
}
