export async function main(ns) {
  let servers = JSON.parse(ns.read("servers.txt")).servers;
  const script = args[0];
  for (const server in servers) {
    const host = servers[server];
    const processes = ns.ps(host.hostname);
    for (let process of processes) {
      if (process.filename == script) {
        ns.kill(process.pid);
      }
    }
  }
}
