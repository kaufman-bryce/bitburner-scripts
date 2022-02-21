/** @param {NS} ns **/
export async function main(ns) {
  const args = ns.flags([["help", false]]);
  if (args.help) {
    ns.tprint(
      "INFO\n\tHELP for File Search\n" +
        "\tDisplays non-script files by depth and host.\n" +
        `\tUsage: run ${ns.getScriptName()} ?EXTENSION \n` +
        "\tIf EXTENSION is provided, only shows files with that extension. Otherwise shows all non-scripts files."
    );
    return;
  }
  let servers = JSON.parse(ns.read("servers.txt")).servers;
  let files = [];
  let extension = args._[0];

  for (const server in servers) {
    const host = servers[server];
    let serverFiles = host.files;
    if (extension) {
      serverFiles = serverFiles.filter((file) => file.endsWith(extension));
    }
    if (serverFiles.length > 0) {
      serverFiles.forEach((file) => {
        files.push({ host: host.hostname, depth: host.depth, name: file });
      });
    }
  }
  if (files.length > 0) {
    files.sort((a, b) => {
      if (a.depth == b.depth) {
        return a.name < b.name ? -1 : 1;
      } else {
        return a.depth < b.depth ? -1 : 1;
      }
    });
    const litsFormatted = files.map((file) => {
      return (
        file.depth.toString(10).padEnd(6, " ") +
        "|" +
        file.host.padEnd(20, " ") +
        "|" +
        file.name
      );
    });
    ns.tprint(
      `LIST OF ALL ${extension ? extension + " " : ""}FILES: \n` +
        "Depth |        Host        |  Name\n" +
        litsFormatted.join("\n")
    );
  } else {
    ns.tprint("No literature found.");
  }
}
