/** @param {NS} ns **/
const emulateTerminalAction = (input) => {
  const terminalEl = eval("document").querySelector("#terminal-input");
  const propsKey = Object.keys(terminalEl)[1];

  terminalEl[propsKey].onChange({ target: { value: input } });
  terminalEl[propsKey].onKeyDown({ keyCode: 13, preventDefault: () => {} });
};

export async function main(ns) {
  let servers = JSON.parse(ns.read("servers.txt")).servers;
  let portPower = 0;
  const progs = [
    { name: "BruteSSH.exe", exe: ns.brutessh },
    { name: "FTPCrack.exe", exe: ns.ftpcrack },
    { name: "HTTPWorm.exe", exe: ns.httpworm },
    { name: "relaySMTP.exe", exe: ns.relaysmtp },
    { name: "SQLInject.exe", exe: ns.sqlinject },
  ];
  // How many ports can we force open?
  progs.forEach((prog) => {
    portPower += ns.fileExists(prog.name, "home") ? 1 : 0;
  });
  ns.tprint(
    `INFO: Current Port Power is ${portPower}, current Hack Level is ${ns.getHackingLevel()}.`
  );
  for (const server in servers) {
    let host = servers[server];
    // ns.tprint(`Checking ${host.hostname}			Admin: ${host.hasAdminRights} | PortsReq: ${host.numOpenPortsRequired} | Hackable: ${host.requiredHackingSkill <= ns.getHackingLevel()}`);
    if (
      host.hostname != "home" &&
      !host.hasAdminRights &&
      host.numOpenPortsRequired <= portPower &&
      host.requiredHackingSkill <= ns.getHackingLevel()
    ) {
      ns.tprint(`Breaching ${host.hostname}:`);
      for (let i = 0; i < host.numOpenPortsRequired; i++) {
        ns.tprint(`	Running ${progs[i].name}`);
        progs[i].exe(host.hostname);
      }
      ns.tprint(`	NUKE'd `);
      ns.nuke(host.hostname);
      host.hasAdminRights = true;
    }
    await ns.sleep(10);
    // if (!host.hostname == 'home' && host.hasAdminRights && !host.backdoorInstalled) {
    // 	ns.tprint(`Installing backdoor on ${host.hostname}`)
    // 	// ns.installBackdoor(host.hostname);
    // 	// emulateTerminalAction(`backdoor ${host.hostname}`);
    // }
  }
}
