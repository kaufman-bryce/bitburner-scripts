/** @param {NS} ns **/
const emulateTerminalAction = (input) => {
  const terminalEl = eval("document").querySelector("#terminal-input");
  const propsKey = Object.keys(terminalEl)[1];

  terminalEl[propsKey].onChange({ target: { value: input } });
  terminalEl[propsKey].onKeyDown({ keyCode: 13, preventDefault: () => {} });
};

/** @param {NS} ns **/
export async function main(ns) {
  let servers = JSON.parse(ns.read("servers.txt")).servers;
  let target = ns.args[0];
  let termInput = "";
  while (servers[target].depth > 0) {
    termInput = `connect ${target}; ${termInput}`;
    target = servers[target].parent;
  }
  emulateTerminalAction(termInput);
}
export function autocomplete(data, args) {
  return [...data.servers];
}
