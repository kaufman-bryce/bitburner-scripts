export async function main(ns) {
  let servers = JSON.parse(ns.read("servers.txt")).servers;
  const script = ns.args[0];
  for (const server in servers) {
    const processes = ns.ps(server.hostname);
    for (let process of processes) {
      if (process.filename == script) {
        ns.kill(process.pid);
      }
    }
  }
}
