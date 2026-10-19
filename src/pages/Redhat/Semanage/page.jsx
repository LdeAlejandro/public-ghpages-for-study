
import { useEffect, useRef, useState } from "react";
import "./page.css";

export const metadata = {
  title: "SEMANAGE — SELinux Interactive Lab",
  category: "RHCSA",
  description:
    "Practice SELinux file contexts, port mappings, booleans, login mappings and troubleshooting with an animated visual laboratory.",
  keywords: [
    "Linux", "RHEL", "RHCSA", "SELinux", "semanage",
    "fcontext", "restorecon", "matchpathcon", "ls -Z",
    "semanage port", "semanage login", "setsebool",
    "getsebool", "http_port_t", "httpd_sys_content_t",
    "SELinux troubleshooting",
  ],
  created: "2026-10-11",
};

const SPEEDS = [0.5, 1, 2, 3, 5, 10];

const SCENARIOS = [
  {
    id: "inspect",
    group: "File Contexts",
    label: "Inspect",
    title: "Inspect SELinux file contexts",
    description: "Compare current and expected security contexts.",
    commands: [
      "ls -Zd /webdata",
      "ls -Z /webdata/index.html",
      "matchpathcon /webdata/index.html",
    ],
    explanation:
      "ls -Z reads the current label; matchpathcon determines the expected label from policy.",
    tip: "A context contains user, role, type and security level. The type is especially important for file access.",
  },
  {
    id: "fcontext",
    group: "File Contexts",
    label: "Add fcontext",
    title: "Configure a persistent Apache file context",
    description: "Allow Apache to serve content from /webdata.",
    commands: [
      "semanage fcontext -a -t httpd_sys_content_t '/webdata(/.*)?'",
      "restorecon -Rv /webdata",
      "ls -Zd /webdata",
    ],
    explanation:
      "semanage fcontext registers the expected label. restorecon applies it to existing files.",
    tip: "A semanage fcontext rule does not relabel existing files until restorecon is executed.",
  },
  {
    id: "write",
    group: "File Contexts",
    label: "Writable Dir",
    title: "Allow Apache to write uploaded content",
    description: "Label /webdata/uploads with httpd_sys_rw_content_t.",
    commands: [
      "semanage fcontext -a -t httpd_sys_rw_content_t '/webdata/uploads(/.*)?'",
      "restorecon -Rv /webdata/uploads",
      "ls -Zd /webdata/uploads",
    ],
    explanation:
      "httpd_sys_rw_content_t is suitable for Apache content that must be writable, subject to normal permissions and policy.",
    tip: "Grant write access only to the directories that need it.",
  },
  {
    id: "modify",
    group: "File Contexts",
    label: "Modify Rule",
    title: "Modify a local file context rule",
    description: "Change the existing /webdata rule to a writable Apache type.",
    commands: [
      "semanage fcontext -a -t httpd_sys_content_t '/webdata(/.*)?'",
      "semanage fcontext -m -t httpd_sys_rw_content_t '/webdata(/.*)?'",
      "restorecon -Rv /webdata",
    ],
    explanation:
      "Use -m to modify an existing local rule, then restore the affected labels.",
    tip: "Use -a to add, -m to modify and -d to delete a local mapping.",
  },
  {
    id: "remove",
    group: "File Contexts",
    label: "Remove Rule",
    title: "Remove a local file context rule",
    description: "Delete the custom /webdata mapping and restore policy defaults.",
    commands: [
      "semanage fcontext -a -t httpd_sys_content_t '/webdata(/.*)?'",
      "restorecon -Rv /webdata",
      "semanage fcontext -d '/webdata(/.*)?'",
      "restorecon -Rv /webdata",
    ],
    explanation:
      "Removing a local rule does not automatically restore the old labels. Run restorecon afterward.",
    tip: "List local customizations using semanage fcontext -l -C.",
  },
  {
    id: "port",
    group: "Ports",
    label: "Add Port",
    title: "Allow Apache to bind to TCP port 8080",
    description: "Associate TCP port 8080 with http_port_t.",
    commands: [
      "semanage port -l | grep http_port_t",
      "semanage port -a -t http_port_t -p tcp 8080",
      "semanage port -l -C",
    ],
    explanation:
      "SELinux port types control which confined services may bind to network ports.",
    tip: "SELinux port assignments and firewalld rules are independent.",
  },
  {
    id: "deleteport",
    group: "Ports",
    label: "Remove Port",
    title: "Remove a custom SELinux port mapping",
    description: "Add and then remove a local TCP port mapping.",
    commands: [
      "semanage port -a -t http_port_t -p tcp 8080",
      "semanage port -d -p tcp 8080",
      "semanage port -l -C",
    ],
    explanation:
      "Use semanage port -d to remove a locally added port mapping.",
    tip: "Inspect the mapping before deleting it.",
  },
  {
    id: "boolean",
    group: "Booleans",
    label: "Network Boolean",
    title: "Enable Apache outbound connections",
    description: "Allow Apache to connect to a backend application.",
    commands: [
      "getsebool httpd_can_network_connect",
      "setsebool -P httpd_can_network_connect on",
      "getsebool httpd_can_network_connect",
    ],
    explanation:
      "The httpd_can_network_connect boolean controls outbound network access for confined Apache processes.",
    tip: "The -P option makes the boolean setting persistent.",
  },
  {
    id: "nfs",
    group: "Booleans",
    label: "NFS Boolean",
    title: "Permit Apache to access NFS content",
    description: "Enable the httpd_use_nfs SELinux boolean.",
    commands: [
      "getsebool httpd_use_nfs",
      "setsebool -P httpd_use_nfs on",
      "getsebool httpd_use_nfs",
    ],
    explanation:
      "This boolean enables policy permissions for Apache access to NFS content.",
    tip: "The NFS mount and Linux file permissions must also allow access.",
  },
  {
    id: "login",
    group: "SELinux Users",
    label: "Login Mapping",
    title: "Inspect SELinux user mappings",
    description: "Examine the relationship between Linux logins and SELinux users.",
    commands: [
      "semanage login -l",
      "semanage user -l",
      "id -Z",
    ],
    explanation:
      "SELinux users and roles are distinct from ordinary Linux accounts and groups.",
    tip: "semanage login -l displays Linux login mappings.",
  },
  {
    id: "troubleshoot",
    group: "Troubleshooting",
    label: "Troubleshoot",
    title: "Investigate an SELinux access denial",
    description: "Inspect enforcement mode, audit records and file labels.",
    commands: [
      "getenforce",
      "ausearch -m AVC,USER_AVC -ts recent",
      "ls -Z /webdata/index.html",
      "semanage fcontext -l -C",
    ],
    explanation:
      "Use audit messages and security contexts to identify the cause of a denial before changing policy.",
    tip: "Avoid disabling SELinux as a routine troubleshooting solution.",
  },
];

const USE_CASES = [
  {
    category: "File Contexts",
    title: "Apache cannot read a custom directory",
    problem: "Apache returns access errors for files stored under /webdata.",
    commands: [
      "semanage fcontext -a -t httpd_sys_content_t '/webdata(/.*)?'",
      "restorecon -Rv /webdata",
      "ls -Zd /webdata",
    ],
    explanation: "Persistently configure and apply an Apache-readable SELinux file type.",
  },
  {
    category: "File Contexts",
    title: "Apache needs a writable uploads directory",
    problem: "A web application needs to save uploaded files.",
    commands: [
      "semanage fcontext -a -t httpd_sys_rw_content_t '/webdata/uploads(/.*)?'",
      "restorecon -Rv /webdata/uploads",
    ],
    explanation: "Use a writable HTTP type for the upload directory, together with appropriate Linux permissions.",
  },
  {
    category: "File Contexts",
    title: "Files have incorrect SELinux labels",
    problem: "Copied or moved files have labels that do not match policy.",
    commands: [
      "matchpathcon /webdata/index.html",
      "ls -Z /webdata/index.html",
      "restorecon -Rv /webdata",
    ],
    explanation: "Compare the current label with the expected label and restore it.",
  },
  {
    category: "File Contexts",
    title: "Remove a custom context rule",
    problem: "A previously configured local mapping is no longer needed.",
    commands: [
      "semanage fcontext -l -C",
      "semanage fcontext -d '/webdata(/.*)?'",
      "restorecon -Rv /webdata",
    ],
    explanation: "Delete the local mapping and reapply policy-defined labels.",
  },
  {
    category: "Ports",
    title: "Apache cannot listen on port 8080",
    problem: "Apache is configured for TCP port 8080 but SELinux blocks binding.",
    commands: [
      "semanage port -l | grep http_port_t",
      "semanage port -a -t http_port_t -p tcp 8080",
    ],
    explanation: "Add a port mapping if the port is not already assigned to an SELinux type.",
  },
  {
    category: "Ports",
    title: "Remove an unused port assignment",
    problem: "A custom SELinux port mapping is no longer required.",
    commands: [
      "semanage port -l -C",
      "semanage port -d -p tcp 8080",
    ],
    explanation: "Remove a local port customization after verifying it exists.",
  },
  {
    category: "Booleans",
    title: "Apache cannot connect to a backend",
    problem: "Apache needs outbound TCP connectivity to an application.",
    commands: [
      "getsebool httpd_can_network_connect",
      "setsebool -P httpd_can_network_connect on",
    ],
    explanation: "Enable persistent outbound network access for Apache.",
  },
  {
    category: "Booleans",
    title: "Apache needs to access NFS",
    problem: "Web content is hosted on an NFS-mounted directory.",
    commands: [
      "getsebool httpd_use_nfs",
      "setsebool -P httpd_use_nfs on",
    ],
    explanation: "Enable the appropriate NFS access boolean.",
  },
  {
    category: "Booleans",
    title: "Apache serves user home directories",
    problem: "User web content is stored under home directories.",
    commands: [
      "getsebool httpd_enable_homedirs",
      "setsebool -P httpd_enable_homedirs on",
    ],
    explanation: "Enable home-directory serving and verify file labels and permissions.",
  },
  {
    category: "SELinux Users",
    title: "Inspect login security mappings",
    problem: "Determine the SELinux user associated with Linux logins.",
    commands: [
      "semanage login -l",
      "semanage user -l",
      "id -Z",
    ],
    explanation: "Review SELinux users, roles and login mappings.",
  },
  {
    category: "Troubleshooting",
    title: "Investigate an AVC denial",
    problem: "A service fails despite correct Linux permissions.",
    commands: [
      "getenforce",
      "ausearch -m AVC,USER_AVC -ts recent",
      "ls -Z /webdata/index.html",
      "semanage fcontext -l -C",
    ],
    explanation: "Check the audit records and current labels before changing policy.",
  },
];

const EXERCISES = [
  {
    task: "Configure /webdata and its contents with the persistent SELinux type httpd_sys_content_t.",
    answer: "semanage fcontext -a -t httpd_sys_content_t '/webdata(/.*)?'",
    hint: "Use semanage fcontext -a with a recursive regular expression.",
  },
  {
    task: "Apply the expected SELinux file contexts recursively to /webdata.",
    answer: "restorecon -Rv /webdata",
    hint: "Use restorecon with recursive and verbose options.",
  },
  {
    task: "Assign TCP port 8080 to the SELinux type http_port_t.",
    answer: "semanage port -a -t http_port_t -p tcp 8080",
    hint: "Use semanage port -a with the type and protocol.",
  },
  {
    task: "Permanently enable Apache outbound network connections.",
    answer: "setsebool -P httpd_can_network_connect on",
    hint: "Use setsebool with the persistent flag.",
  },
];

const REFERENCE = [
  ["Current file context", "ls -Z /path"],
  ["Directory context", "ls -Zd /directory"],
  ["Expected context", "matchpathcon /path"],
  ["Add file context", "semanage fcontext -a -t httpd_sys_content_t '/webdata(/.*)?'"],
  ["Modify file context", "semanage fcontext -m -t httpd_sys_rw_content_t '/webdata(/.*)?'"],
  ["Delete file context", "semanage fcontext -d '/webdata(/.*)?'"],
  ["Apply file labels", "restorecon -Rv /webdata"],
  ["List local file rules", "semanage fcontext -l -C"],
  ["Add SELinux port", "semanage port -a -t http_port_t -p tcp 8080"],
  ["Modify SELinux port", "semanage port -m -t http_port_t -p tcp 8080"],
  ["Delete SELinux port", "semanage port -d -p tcp 8080"],
  ["List port mappings", "semanage port -l"],
  ["List local port mappings", "semanage port -l -C"],
  ["Read boolean", "getsebool httpd_can_network_connect"],
  ["Persistent boolean", "setsebool -P httpd_can_network_connect on"],
  ["List SELinux booleans", "semanage boolean -l"],
  ["List login mappings", "semanage login -l"],
  ["List SELinux users", "semanage user -l"],
  ["Inspect denials", "ausearch -m AVC,USER_AVC -ts recent"],
];

const INITIAL_FILES = [
  { path: "/var/www/html/index.html", type: "httpd_sys_content_t", defaultType: "httpd_sys_content_t" },
  { path: "/webdata", type: "default_t", defaultType: "default_t" },
  { path: "/webdata/index.html", type: "default_t", defaultType: "default_t" },
  { path: "/webdata/uploads", type: "default_t", defaultType: "default_t" },
  { path: "/webdata/uploads/photo.png", type: "default_t", defaultType: "default_t" },
  { path: "/srv/app/index.html", type: "var_t", defaultType: "var_t" },
];

function initialEnvironment() {
  return {
    files: INITIAL_FILES.map((f) => ({ ...f })),
    mappings: [],
    ports: [
      { port: 80, protocol: "tcp", type: "http_port_t", custom: false },
      { port: 443, protocol: "tcp", type: "http_port_t", custom: false },
      { port: 22, protocol: "tcp", type: "ssh_port_t", custom: false },
    ],
    booleans: [
      { name: "httpd_can_network_connect", value: false },
      { name: "httpd_enable_homedirs", value: false },
      { name: "httpd_use_nfs", value: false },
    ],
  };
}

function cloneEnvironment(env) {
  return JSON.parse(JSON.stringify(env));
}

function expectedType(env, path) {
  const match = env.mappings
    .filter((m) => path === m.root || path.startsWith(`${m.root}/`))
    .sort((a, b) => b.root.length - a.root.length)[0];

  return match?.type ||
    env.files.find((f) => f.path === path)?.defaultType ||
    "default_t";
}

function fileContext(type) {
  return `system_u:object_r:${type}:s0`;
}

function tokenize(input) {
  return input.match(/'[^']*'|"[^"]*"|\S+/g)?.map((s) =>
    s.replace(/^(['"])(.*)\1$/, "$2")
  ) || [];
}

function mappingRoot(pattern) {
  if (pattern.endsWith("(/.*)?")) return pattern.slice(0, -6);
  if (pattern.endsWith("/.*")) return pattern.slice(0, -3);
  return pattern;
}

function executeCommand(environment, rawCommand) {
  const env = cloneEnvironment(environment);
  const command = rawCommand.trim();
  const args = tokenize(command);
  const output = [];
  let success = true;
  let changed = false;

  const fail = (message) => {
    success = false;
    output.push(message);
  };

  if (!command) return { env, output, success, changed };

  if (command === "help") {
    output.push(
      "Supported commands:",
      "ls -Z /path | ls -Zd /path",
      "matchpathcon /path",
      "semanage fcontext -a|-m|-d|-l",
      "semanage port -a|-m|-d|-l",
      "semanage boolean -l",
      "semanage login -l | semanage user -l",
      "restorecon -Rv /path",
      "getsebool NAME | getsebool -a",
      "setsebool -P NAME on|off",
      "getenforce | id -Z | ausearch -m AVC,USER_AVC -ts recent",
      "clear | help"
    );
  } else if (args[0] === "ls" && (args[1] === "-Z" || args[1] === "-Zd" || args[1] === "-dZ")) {
    const path = args[2];
    const file = env.files.find((f) => f.path === path);
    if (!file) fail(`ls: cannot access '${path || ""}': No such file or directory`);
    else output.push(`${fileContext(file.type)} ${file.path}`);
  } else if (args[0] === "matchpathcon" && args.length === 2) {
    const path = args[1];
    if (!env.files.some((f) => f.path === path)) fail(`matchpathcon: ${path}: No such file`);
    else output.push(`${path} ${fileContext(expectedType(env, path))}`);
  } else if (args[0] === "semanage" && args[1] === "fcontext") {
    const mode = args[2];

    if (mode === "-l") {
      const local = args.includes("-C");
      output.push("SELinux fcontext mappings");
      const mappings = local ? env.mappings : env.mappings;
      mappings.forEach((m) => output.push(
        `${m.pattern}    all files    ${fileContext(m.type)}`
      ));
      if (!mappings.length) output.push(
        local ? "(no local customizations)" : "(simulator displays local mappings only)"
      );
    } else if (["-a", "-m", "-d"].includes(mode)) {
      const pattern = args.at(-1);
      const root = mappingRoot(pattern || "");
      const typeIndex = args.indexOf("-t");
      const type = typeIndex >= 0 ? args[typeIndex + 1] : null;
      const existing = env.mappings.find((m) => m.pattern === pattern);

      if (!pattern?.startsWith("/")) {
        fail("semanage fcontext: provide an absolute path or pattern");
      } else if (mode !== "-d" && (!type || !/^[a-z0-9_]+_t$/.test(type))) {
        fail("semanage fcontext: invalid or missing SELinux type");
      } else if (mode === "-a" && existing) {
        fail("ValueError: File context mapping already defined");
      } else if (mode !== "-a" && !existing) {
        fail("ValueError: Local file context mapping not found");
      } else {
        if (mode === "-d") {
          env.mappings = env.mappings.filter((m) => m.pattern !== pattern);
        } else if (mode === "-m") {
          existing.type = type;
        } else {
          env.mappings.push({ pattern, root, type });
        }
        changed = true;
        output.push("Local file context configuration updated.");
      }
    } else fail("Usage: semanage fcontext -a|-m|-d|-l ...");
  } else if (args[0] === "restorecon") {
    const path = args.at(-1);
    const recursive = args.some((a) => a.startsWith("-") && a.includes("R"));
    const verbose = args.some((a) => a.startsWith("-") && a.includes("v"));
    const targets = env.files.filter((f) =>
      f.path === path || (recursive && f.path.startsWith(`${path}/`))
    );

    if (!targets.length) fail(`restorecon: ${path}: No such file or directory`);
    else {
      let count = 0;
      targets.forEach((f) => {
        const expected = expectedType(env, f.path);
        if (f.type !== expected) {
          if (verbose) output.push(`Relabeled ${f.path} from ${fileContext(f.type)} to ${fileContext(expected)}`);
          f.type = expected;
          count++;
        }
      });
      changed = count > 0;
      if (!output.length) output.push("No relabeling required.");
    }
  } else if (args[0] === "semanage" && args[1] === "port") {
    const mode = args[2];

    if (mode === "-l") {
      const local = args.includes("-C");
      const rows = local ? env.ports.filter((p) => p.custom) : env.ports;
      output.push("SELinux Port Type       Proto    Port Number");
      rows.forEach((p) => output.push(
        `${p.type.padEnd(23)} ${p.protocol.padEnd(8)} ${p.port}`
      ));
      if (!rows.length) output.push("(no local port customizations)");
    } else if (["-a", "-m", "-d"].includes(mode)) {
      const protocol = args[args.indexOf("-p") + 1];
      const port = Number(args.at(-1));
      const type = args.includes("-t") ? args[args.indexOf("-t") + 1] : null;
      const existing = env.ports.find((p) => p.port === port && p.protocol === protocol);

      if (!["tcp", "udp"].includes(protocol) || !Number.isInteger(port) || port < 1 || port > 65535) {
        fail("semanage port: invalid protocol or port");
      } else if (mode !== "-d" && (!type || !/^[a-z0-9_]+_t$/.test(type))) {
        fail("semanage port: missing or invalid SELinux type");
      } else if (mode === "-a" && existing) {
        fail(`ValueError: Port ${protocol}/${port} already defined`);
      } else if (mode !== "-a" && !existing) {
        fail(`ValueError: Port ${protocol}/${port} is not defined`);
      } else if (mode === "-d" && !existing.custom) {
        fail("Cannot remove a policy-provided mapping in this simulator");
      } else {
        if (mode === "-a") env.ports.push({ port, protocol, type, custom: true });
        if (mode === "-m") {
          existing.type = type;
          existing.custom = true;
        }
        if (mode === "-d") env.ports = env.ports.filter((p) => p !== existing);
        changed = true;
        output.push("SELinux port configuration updated.");
      }
    } else fail("Usage: semanage port -a|-m|-d|-l ...");
  } else if (args[0] === "getsebool") {
    if (args[1] === "-a") {
      env.booleans.forEach((b) => output.push(`${b.name} --> ${b.value ? "on" : "off"}`));
    } else {
      const item = env.booleans.find((b) => b.name === args[1]);
      if (!item) fail(`getsebool: SELinux boolean ${args[1] || ""} is not defined`);
      else output.push(`${item.name} --> ${item.value ? "on" : "off"}`);
    }
  } else if (args[0] === "setsebool") {
    const persistent = args.includes("-P");
    const name = args[persistent ? 2 : 1];
    const value = args[persistent ? 3 : 2];
    const item = env.booleans.find((b) => b.name === name);

    if (!item) fail(`setsebool: SELinux boolean ${name || ""} is not defined`);
    else if (!["on", "off", "1", "0"].includes(value)) fail("setsebool: expected on or off");
    else {
      item.value = value === "on" || value === "1";
      changed = true;
      output.push(`Boolean ${name} set to ${item.value ? "on" : "off"}${persistent ? " (persistent)" : " (runtime)"}.`);
    }
  } else if (args[0] === "semanage" && args[1] === "boolean" && args[2] === "-l") {
    output.push("SELinux boolean                 State");
    env.booleans.forEach((b) => output.push(`${b.name.padEnd(32)} ${b.value ? "on" : "off"}`));
  } else if (command === "semanage login -l") {
    output.push(
      "Login Name          SELinux User",
      "__default__         unconfined_u",
      "root                unconfined_u"
    );
  } else if (command === "semanage user -l") {
    output.push(
      "SELinux User        Roles",
      "unconfined_u        unconfined_r",
      "staff_u             staff_r",
      "user_u              user_r"
    );
  } else if (command === "id -Z") {
    output.push("unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023");
  } else if (command === "getenforce") {
    output.push("Enforcing");
  } else if (args[0] === "ausearch" && command.includes("AVC")) {
    output.push(
      "---- SIMULATED AUDIT EVENT ----",
      "type=AVC msg=audit(...): avc: denied { read }",
      "comm=\"httpd\" name=\"index.html\"",
      "scontext=system_u:system_r:httpd_t:s0",
      `tcontext=${fileContext(env.files.find((f) => f.path === "/webdata/index.html").type)}`,
      "tclass=file permissive=0"
    );
  } else if (command.startsWith("semanage port -l | grep ")) {
    const filter = command.split("grep ")[1].trim();
    env.ports.filter((p) => p.type.includes(filter)).forEach((p) =>
      output.push(`${p.type.padEnd(23)} ${p.protocol.padEnd(8)} ${p.port}`)
    );
    if (!output.length) output.push("(no matches)");
  } else {
    fail(`Unsupported command or syntax: ${command}. Type help for supported commands.`);
  }

  return { env, output, success, changed };
}

function AnimatedTerminal({
  commands,
  running,
  speed,
  resetId,
  onExecute,
  onComplete,
}) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    setIndex(0);
    setTyped(0);
    setHistory([]);
  }, [resetId]);

  useEffect(() => {
    if (!running || index >= commands.length) return;

    const command = commands[index];

    if (typed < command.length) {
      const timer = setTimeout(
        () => setTyped((n) => n + 1),
        Math.max(8, 48 / speed)
      );
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      const result = onExecute(command);
      setHistory((prev) => [...prev, {
        command,
        output: result.output,
        success: result.success,
      }]);
      setIndex((n) => n + 1);
      setTyped(0);
      if (index === commands.length - 1) onComplete();
    }, Math.max(120, 400 / speed));

    return () => clearTimeout(timer);
  }, [running, speed, index, typed, commands, onExecute, onComplete]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [history, typed]);

  return (
    <div className="sm-terminal">
      <div className="sm-terminal-head">
        <div className="sm-window-dots"><i /><i /><i /></div>
        <span>root@rhcsa-server:~ · animated</span>
        <button onClick={() => navigator.clipboard?.writeText(commands.join("\n"))}>
          Copy
        </button>
      </div>
      <div className="sm-terminal-output">
        {history.map((entry, i) => (
          <div className="sm-terminal-entry" key={i}>
            <div><span className="sm-prompt"># </span>{entry.command}</div>
            {entry.output.map((line, j) => (
              <div key={j} className={entry.success ? "sm-stdout" : "sm-stderr"}>{line}</div>
            ))}
          </div>
        ))}
        {index < commands.length ? (
          <div>
            <span className="sm-prompt"># </span>
            {commands[index].slice(0, typed)}
            <span className="sm-cursor">▋</span>
          </div>
        ) : (
          <div><span className="sm-prompt"># </span><span className="sm-cursor">▋</span></div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="sm-terminal-foot">SIMULATED RHEL TERMINAL · NO HOST COMMANDS EXECUTED</div>
    </div>
  );
}

function InteractiveTerminal({ environment, onExecute, onReset }) {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  const commands = history.map((h) => h.command);

  function run() {
    const value = command.trim();
    if (!value) return;

    if (value === "clear") {
      setHistory([]);
      setCommand("");
      setCursor(-1);
      return;
    }

    const result = onExecute(value);
    setHistory((prev) => [...prev, {
      command: value,
      output: result.output,
      success: result.success,
    }]);
    setCommand("");
    setCursor(-1);
  }

  function keyDown(event) {
    if (event.key === "Enter") run();

    if (event.key === "ArrowUp" && commands.length) {
      event.preventDefault();
      const next = cursor < 0 ? commands.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setCommand(commands[next]);
    }

    if (event.key === "ArrowDown" && cursor >= 0) {
      event.preventDefault();
      const next = cursor + 1;
      if (next >= commands.length) {
        setCursor(-1);
        setCommand("");
      } else {
        setCursor(next);
        setCommand(commands[next]);
      }
    }
  }

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [history]);

  return (
    <section className="sm-section">
      <div className="sm-section-heading sm-heading-row">
        <div>
          <span>HANDS-ON PRACTICE</span>
          <h2>SELinux Command Playground</h2>
          <p>Type supported Linux commands and inspect the simulated SELinux state.</p>
        </div>
        <button onClick={() => {
          setHistory([]);
          setCommand("");
          onReset();
        }}>Reset Environment</button>
      </div>

      <div className="sm-terminal">
        <div className="sm-terminal-head">
          <div className="sm-window-dots"><i /><i /><i /></div>
          <span>root@rhcsa-server:~ · interactive</span>
          <span className="sm-live">SIMULATED</span>
        </div>
        <div
          className="sm-terminal-output sm-interactive-output"
          ref={outputRef}
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((entry, i) => (
            <div className="sm-terminal-entry" key={i}>
              <div><span className="sm-prompt"># </span>{entry.command}</div>
              {entry.output.map((line, j) => (
                <div key={j} className={entry.success ? "sm-stdout" : "sm-stderr"}>{line}</div>
              ))}
            </div>
          ))}
          <div className="sm-input-line">
            <span className="sm-prompt">#</span>
            <input
              ref={inputRef}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={keyDown}
              spellCheck={false}
              autoComplete="off"
              placeholder="Type help or a SELinux command..."
            />
          </div>
        </div>
      </div>

      <div className="sm-command-hints">
        <span>TRY:</span>
        {[
          "ls -Zd /webdata",
          "semanage fcontext -l -C",
          "restorecon -Rv /webdata",
          "semanage port -l",
          "getsebool httpd_can_network_connect",
        ].map((cmd) => (
          <button key={cmd} onClick={() => {
            setCommand(cmd);
            inputRef.current?.focus();
          }}>{cmd}</button>
        ))}
      </div>

      <div className="sm-environment-summary">
        <span>{environment.mappings.length} LOCAL FILE RULES</span>
        <span>{environment.ports.filter((p) => p.custom).length} CUSTOM PORTS</span>
        <span>{environment.booleans.filter((b) => b.value).length} ENABLED BOOLEANS</span>
      </div>
    </section>
  );
}

function FilePanel({ environment }) {
  return (
    <div className="sm-panel">
      <div className="sm-panel-header">
        <div><span>SELINUX FILE LABELS</span><strong>File Context Explorer</strong></div>
        <small>{environment.files.length} FILES</small>
      </div>
      <div className="sm-table-scroll">
        <table className="sm-table">
          <thead>
            <tr><th>PATH</th><th>CURRENT TYPE</th><th>EXPECTED TYPE</th><th>STATUS</th></tr>
          </thead>
          <tbody>
            {environment.files.map((file) => {
              const expected = expectedType(environment, file.path);
              const matches = file.type === expected;
              return (
                <tr key={file.path}>
                  <td>{file.path}</td>
                  <td><code className={matches ? "sm-ok" : "sm-error"}>{file.type}</code></td>
                  <td><code>{expected}</code></td>
                  <td><span className={`sm-pill ${matches ? "ok" : "bad"}`}>{matches ? "MATCH" : "MISMATCH"}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PolicyPanel({ environment }) {
  return (
    <div className="sm-panel">
      <div className="sm-panel-header">
        <div><span>SELINUX POLICY</span><strong>Active Configuration</strong></div>
        <small>SIMULATED</small>
      </div>
      <div className="sm-policy-content">
        <div className="sm-policy-block">
          <h4>Port Mappings</h4>
          {environment.ports.map((p) => (
            <div className="sm-policy-row" key={`${p.protocol}-${p.port}`}>
              <code>{p.protocol}/{p.port}</code><span>{p.type}</span>
            </div>
          ))}
        </div>
        <div className="sm-policy-block">
          <h4>Booleans</h4>
          {environment.booleans.map((b) => (
            <div className="sm-policy-row" key={b.name}>
              <code>{b.name}</code>
              <span className={b.value ? "sm-ok" : "sm-dim"}>{b.value ? "ON" : "OFF"}</span>
            </div>
          ))}
        </div>
        <div className="sm-policy-block">
          <h4>Local File Context Rules</h4>
          {environment.mappings.length ? environment.mappings.map((m) => (
            <div className="sm-policy-row" key={m.pattern}>
              <code>{m.pattern}</code><span>{m.type}</span>
            </div>
          )) : <p className="sm-empty">No local customizations</p>}
        </div>
      </div>
    </div>
  );
}

function flowSteps(group) {
  if (group === "File Contexts") return [
    ["Define Rule", "semanage fcontext", "Register a persistent mapping"],
    ["Policy Mapping", "SELinux database", "Determine the expected type"],
    ["Apply Labels", "restorecon", "Relabel existing files"],
    ["Verify Context", "ls -Z", "Inspect the resulting context"],
  ];
  if (group === "Ports") return [
    ["Select Port", "tcp/8080", "Identify the port"],
    ["Assign Type", "http_port_t", "Select the SELinux port type"],
    ["Update Policy", "semanage port", "Store the local mapping"],
    ["Verify Mapping", "semanage port -l", "Inspect the port assignment"],
  ];
  if (group === "Booleans") return [
    ["Inspect Boolean", "getsebool", "Read the current setting"],
    ["Change State", "setsebool -P", "Set a persistent value"],
    ["Policy Behavior", "SELinux", "Update the selected policy behavior"],
    ["Verify State", "getsebool", "Read the new setting"],
  ];
  if (group === "SELinux Users") return [
    ["Linux Login", "account", "Identify the Linux login"],
    ["SELinux User", "mapping", "Resolve the SELinux user"],
    ["SELinux Role", "role", "Inspect available roles"],
    ["Security Context", "id -Z", "Inspect the current context"],
  ];
  return [
    ["Inspect Mode", "getenforce", "Check SELinux enforcement"],
    ["Audit Denial", "ausearch", "Inspect AVC events"],
    ["File Labels", "ls -Z", "Check actual contexts"],
    ["Local Rules", "semanage", "Inspect policy customizations"],
  ];
}

function AnimatedFlow({ scenario, environment, running, completed, speed, resetId }) {
  const steps = flowSteps(scenario.group);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    setStep(-1);
  }, [scenario.id, resetId]);

  useEffect(() => {
    if (completed) {
      setStep(steps.length);
      return;
    }
    if (!running) return;

    const timer = setInterval(() => {
      setStep((n) => Math.min(n + 1, steps.length - 1));
    }, Math.max(150, 1000 / speed));

    return () => clearInterval(timer);
  }, [running, completed, speed, steps.length]);

  const description =
    completed ? "Policy workflow completed." :
    step < 0 ? "Press Play to visualize the SELinux policy workflow." :
    steps[Math.min(step, steps.length - 1)][2];

  return (
    <div className="sm-panel sm-flow">
      <div className="sm-panel-header">
        <div><span>ANIMATED POLICY VISUALIZATION</span><strong>How SELinux Applies the Change</strong></div>
        <small>{completed ? "COMPLETE" : running ? "PROCESSING" : step >= 0 ? "PAUSED" : "READY"}</small>
      </div>

      <div className="sm-flow-steps">
        {steps.map(([title, subtitle], i) => {
          const active = step === i && !completed;
          const done = step > i || completed;
          return (
            <div className="sm-flow-group" key={title}>
              <div className={`sm-flow-node ${active ? "active" : ""} ${done ? "done" : ""}`}>
                <div className="sm-flow-node-top">
                  <span>{done ? "✓" : String(i + 1).padStart(2, "0")}</span>
                  <small>{done ? "DONE" : active ? "ACTIVE" : "WAITING"}</small>
                </div>
                <strong>{title}</strong>
                <small>{subtitle}</small>
                {active && <div className="sm-node-loader"><i /></div>}
              </div>
              {i < steps.length - 1 && (
                <div className={`sm-flow-link ${done ? "done" : ""} ${active && running ? "moving" : ""}`}>
                  <div className="sm-flow-line"><i /></div>
                  <span>→</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sm-flow-progress">
        <div style={{ width: `${Math.min(Math.max(step + 1, 0), steps.length) / steps.length * 100}%` }} />
      </div>

      <div className="sm-flow-info">
        <span className={running ? "sm-indicator pulsing" : "sm-indicator"} />
        <p>{description}</p>
        {scenario.group === "File Contexts" && (
          <code>{environment.files.find((f) => f.path === "/webdata/index.html")?.type}</code>
        )}
      </div>
    </div>
  );
}

function UseCases() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);
  const categories = ["All", "File Contexts", "Ports", "Booleans", "SELinux Users", "Troubleshooting"];

  const filtered = USE_CASES.filter((item) =>
    (category === "All" || item.category === category) &&
    [item.title, item.problem, item.explanation, ...item.commands]
      .join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="sm-section">
      <div className="sm-section-heading">
        <span>REAL-WORLD RHEL SCENARIOS</span>
        <h2>SEMANAGE Use Cases</h2>
        <p>Common SELinux problems, their solutions and verification commands.</p>
      </div>

      <div className="sm-usecase-toolbar">
        <div className="sm-filter-buttons">
          {categories.map((c) => (
            <button className={category === c ? "selected" : ""} key={c} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search use cases..." />
      </div>

      <div className="sm-usecase-count">{filtered.length} USE CASES</div>
      <div className="sm-usecase-grid">
        {filtered.map((item) => {
          const id = USE_CASES.indexOf(item);
          const expanded = open === id;
          return (
            <article className={`sm-usecase ${expanded ? "expanded" : ""}`} key={item.title}>
              <div className="sm-usecase-meta"><span>{item.category}</span><small>CASE {String(id + 1).padStart(2, "0")}</small></div>
              <h3>{item.title}</h3>
              <p>{item.problem}</p>
              <button className="sm-view-button" onClick={() => setOpen(expanded ? null : id)}>
                {expanded ? "Hide Solution −" : "View Solution →"}
              </button>
              {expanded && (
                <div className="sm-usecase-detail">
                  <div className="sm-code-heading">
                    <span>COMMANDS</span>
                    <button onClick={() => navigator.clipboard?.writeText(item.commands.join("\n"))}>Copy All</button>
                  </div>
                  <div className="sm-code-lines">
                    {item.commands.map((cmd, i) => <div key={i}><span># </span>{cmd}</div>)}
                  </div>
                  <div className="sm-usecase-explanation">
                    <strong>WHY IT WORKS</strong>
                    <p>{item.explanation}</p>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {!filtered.length && <p className="sm-empty">No matching use cases.</p>}
    </section>
  );
}

function Exercises() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);

  const exercise = EXERCISES[index];
  const correct = answer.trim().replace(/\s+/g, " ") === exercise.answer;

  function next() {
    setIndex((i) => (i + 1) % EXERCISES.length);
    setAnswer("");
    setChecked(false);
    setHint(false);
  }

  return (
    <section className="sm-section">
      <div className="sm-section-heading">
        <span>RHCSA EXAM PRACTICE</span>
        <h2>SELinux Configuration Challenges</h2>
        <p>Write the commands needed to complete practical RHEL administration tasks.</p>
      </div>
      <div className="sm-exercise">
        <div className="sm-exercise-top">
          <span>CHALLENGE {index + 1} / {EXERCISES.length}</span>
          <div><i style={{ width: `${(index + 1) / EXERCISES.length * 100}%` }} /></div>
        </div>
        <h3>{exercise.task}</h3>
        <div className="sm-answer">
          <span>#</span>
          <input
            value={answer}
            onChange={(e) => { setAnswer(e.target.value); setChecked(false); }}
            onKeyDown={(e) => e.key === "Enter" && setChecked(true)}
            placeholder="Enter your command..."
            spellCheck={false}
          />
        </div>
        {hint && <p className="sm-hint">{exercise.hint}</p>}
        {checked && (
          <div className={`sm-feedback ${correct ? "correct" : "incorrect"}`}>
            <strong>{correct ? "Correct!" : "Review the command"}</strong>
            {!correct && <code>{exercise.answer}</code>}
          </div>
        )}
        <div className="sm-exercise-actions">
          <button onClick={() => setHint((v) => !v)}>Hint</button>
          <button onClick={() => setChecked(true)}>Check Answer</button>
          <button onClick={next}>Next Challenge →</button>
        </div>
      </div>
    </section>
  );
}

function Cheatsheet() {
  return (
    <section className="sm-section">
      <div className="sm-section-heading">
        <span>RHCSA COMMAND REFERENCE</span>
        <h2>SEMANAGE Cheatsheet</h2>
        <p>Common SELinux administration commands for RHEL.</p>
      </div>
      <div className="sm-reference">
        {REFERENCE.map(([label, command]) => (
          <div className="sm-reference-row" key={label}>
            <span>{label}</span>
            <code>{command}</code>
            <button onClick={() => navigator.clipboard?.writeText(command)}>Copy</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SemanageLab() {
  const [scenarioId, setScenarioId] = useState("fcontext");
  const [environment, setEnvironment] = useState(initialEnvironment);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [resetId, setResetId] = useState(0);

  const environmentRef = useRef(environment);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);

  function reset() {
    const fresh = initialEnvironment();
    environmentRef.current = fresh;
    setEnvironment(fresh);
    setRunning(false);
    setCompleted(false);
    setResetId((n) => n + 1);
  }

  function selectScenario(id) {
    setScenarioId(id);
    reset();
  }

  function runCommand(command) {
    const result = executeCommand(environmentRef.current, command);
    environmentRef.current = result.env;
    setEnvironment(result.env);
    return result;
  }

  function finish() {
    setCompleted(true);
    setRunning(false);
  }

  return (
    <main className="sm-page">
      <div className="sm-content">
        <header className="sm-hero">
          <span>RHCSA / RHEL · INTERACTIVE LAB</span>
          <h1>Manage SELinux Policy with Semanage.</h1>
          <p>Practice persistent file contexts, port labeling, SELinux booleans and login mappings with animated commands, interactive policy visualization and realistic RHEL scenarios.</p>
        </header>

        <section className="sm-simulator">
          <div className="sm-simulator-header">
            <div><span>INTERACTIVE SELINUX EXPLORER</span><h2>Semanage Execution Simulator</h2></div>
            <div className="sm-simulator-status"><i className={running ? "pulsing" : ""} />{completed ? "COMPLETED" : running ? "EXECUTING" : "READY"}</div>
          </div>

          <div className="sm-scenario-tabs">
            {SCENARIOS.map((s) => (
              <button key={s.id} className={scenarioId === s.id ? "selected" : ""} onClick={() => selectScenario(s.id)}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="sm-objective">
            <span>SCENARIO · {scenario.group.toUpperCase()}</span>
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
          </div>

          <div className="sm-main-grid">
            <FilePanel environment={environment} />
            <PolicyPanel environment={environment} />
          </div>

          <div className="sm-flow-container">
            <AnimatedFlow
              scenario={scenario}
              environment={environment}
              running={running}
              completed={completed}
              speed={speed}
              resetId={resetId}
            />
          </div>

          <div className="sm-explanations">
            <div><span>HOW IT WORKS</span><p>{scenario.explanation}</p></div>
            <div><span>RHCSA TIP</span><p>{scenario.tip}</p></div>
          </div>

          <div className="sm-terminal-container">
            <AnimatedTerminal
              key={resetId}
              commands={scenario.commands}
              running={running}
              speed={speed}
              resetId={resetId}
              onExecute={runCommand}
              onComplete={finish}
            />
          </div>

          <div className="sm-controls">
            <button className="sm-primary" onClick={() => {
              if (completed) {
                reset();
              } else {
                setRunning((v) => !v);
              }
            }}>{completed ? "↺ Replay" : running ? "Ⅱ Pause" : "▶ Play"}</button>
            <button onClick={reset}>↺ Restart</button>
            <div className="sm-controls-spacer" />
            <label>Playback speed</label>
            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
              {SPEEDS.map((s) => <option value={s} key={s}>{s}×</option>)}
            </select>
          </div>
        </section>


        <UseCases />
      
        <Cheatsheet />

        <footer className="sm-footer">RHCSA Visual Lab · SELinux · semanage · restorecon</footer>
      </div>
    </main>
  );
}
