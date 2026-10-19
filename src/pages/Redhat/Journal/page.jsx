
import { useEffect, useMemo, useRef, useState } from "react";
import "./page.css";

export const metadata = {
  title: "JOURNALCTL — Interactive Visual Lab",
  category: "RHCSA",
  description:
    "Interactive systemd journal laboratory with animated terminal, service filters, priority levels, boot history, log timeline and journalctl command builder.",
  keywords: [
    "Linux",
    "RHEL",
    "RHCSA",
    "journalctl",
    "systemd",
    "journald",
    "systemd-journald",
    "logs",
    "journalctl -u",
    "journalctl -b",
    "journalctl -p",
    "journalctl -f",
    "journalctl --since",
    "journalctl --until",
    "journalctl -k",
    "journalctl --list-boots",
    "persistent journal",
    "troubleshooting",
  ],
  created: "2026-10-11",
};

const SPEEDS = [0.5, 1, 2, 3, 5, 10];

const LEVELS = [
  { value: 0, name: "emerg", label: "EMERGENCY", color: "#fb7185" },
  { value: 1, name: "alert", label: "ALERT", color: "#f87171" },
  { value: 2, name: "crit", label: "CRITICAL", color: "#fb923c" },
  { value: 3, name: "err", label: "ERROR", color: "#f59e0b" },
  { value: 4, name: "warning", label: "WARNING", color: "#fbbf24" },
  { value: 5, name: "notice", label: "NOTICE", color: "#a78bfa" },
  { value: 6, name: "info", label: "INFO", color: "#60a5fa" },
  { value: 7, name: "debug", label: "DEBUG", color: "#64748b" },
];

const BOOTS = [
  {
    id: "-2",
    label: "Previous boot -2",
    date: "2026-10-09",
    bootId: "a42f6c8d71e049bc9f0132d0a45e8f12",
  },
  {
    id: "-1",
    label: "Previous boot -1",
    date: "2026-10-10",
    bootId: "b53a9d7e62c140adb8e2341f6a9c0d73",
  },
  {
    id: "0",
    label: "Current boot",
    date: "2026-10-11",
    bootId: "c64b0e8f53d241c9a7f3452b8d1e0a94",
  },
];

const LOGS = [
  {
    id: 1,
    boot: "-2",
    time: "2026-10-09 08:00:01",
    unit: "systemd",
    process: "systemd[1]",
    priority: 6,
    message: "Starting Network Manager...",
    kernel: false,
  },
  {
    id: 2,
    boot: "-2",
    time: "2026-10-09 08:00:02",
    unit: "kernel",
    process: "kernel",
    priority: 6,
    message: "Linux version 6.12.0-55.el10.x86_64",
    kernel: true,
  },
  {
    id: 3,
    boot: "-2",
    time: "2026-10-09 08:00:05",
    unit: "NetworkManager",
    process: "NetworkManager[742]",
    priority: 6,
    message: "NetworkManager state is now CONNECTED_GLOBAL",
    kernel: false,
  },
  {
    id: 4,
    boot: "-2",
    time: "2026-10-09 08:02:10",
    unit: "sshd",
    process: "sshd[921]",
    priority: 6,
    message: "Server listening on 0.0.0.0 port 22.",
    kernel: false,
  },
  {
    id: 5,
    boot: "-2",
    time: "2026-10-09 08:10:12",
    unit: "httpd",
    process: "httpd[1124]",
    priority: 3,
    message: "AH00526: Syntax error in /etc/httpd/conf/httpd.conf",
    kernel: false,
  },
  {
    id: 6,
    boot: "-2",
    time: "2026-10-09 08:11:00",
    unit: "systemd",
    process: "systemd[1]",
    priority: 3,
    message: "Failed to start The Apache HTTP Server.",
    kernel: false,
  },
  {
    id: 7,
    boot: "-1",
    time: "2026-10-10 07:00:01",
    unit: "kernel",
    process: "kernel",
    priority: 6,
    message: "Linux version 6.12.0-55.el10.x86_64",
    kernel: true,
  },
  {
    id: 8,
    boot: "-1",
    time: "2026-10-10 07:00:03",
    unit: "systemd",
    process: "systemd[1]",
    priority: 6,
    message: "Reached target Multi-User System.",
    kernel: false,
  },
  {
    id: 9,
    boot: "-1",
    time: "2026-10-10 07:02:00",
    unit: "crond",
    process: "crond[1010]",
    priority: 6,
    message: "(CRON) STARTUP (1.6.1)",
    kernel: false,
  },
  {
    id: 10,
    boot: "-1",
    time: "2026-10-10 07:15:00",
    unit: "crond",
    process: "CROND[1290]",
    priority: 6,
    message: "(root) CMD (/usr/bin/logger cron-check)",
    kernel: false,
  },
  {
    id: 11,
    boot: "-1",
    time: "2026-10-10 08:01:14",
    unit: "sshd",
    process: "sshd[1460]",
    priority: 4,
    message: "Failed password for invalid user admin from 192.168.15.30 port 51422 ssh2",
    kernel: false,
  },
  {
    id: 12,
    boot: "-1",
    time: "2026-10-10 08:03:22",
    unit: "sshd",
    process: "sshd[1462]",
    priority: 6,
    message: "Accepted publickey for developer from 192.168.15.5 port 51820 ssh2",
    kernel: false,
  },
  {
    id: 13,
    boot: "-1",
    time: "2026-10-10 09:20:00",
    unit: "NetworkManager",
    process: "NetworkManager[750]",
    priority: 4,
    message: "device (ens160): state change: activated -> disconnected",
    kernel: false,
  },
  {
    id: 14,
    boot: "-1",
    time: "2026-10-10 09:20:03",
    unit: "kernel",
    process: "kernel",
    priority: 4,
    message: "e1000: ens160: NIC Link is Down",
    kernel: true,
  },
  {
    id: 15,
    boot: "-1",
    time: "2026-10-10 09:21:10",
    unit: "NetworkManager",
    process: "NetworkManager[750]",
    priority: 6,
    message: "device (ens160): state change: disconnected -> activated",
    kernel: false,
  },
  {
    id: 16,
    boot: "0",
    time: "2026-10-11 06:00:01",
    unit: "kernel",
    process: "kernel",
    priority: 6,
    message: "Linux version 6.12.0-55.el10.x86_64",
    kernel: true,
  },
  {
    id: 17,
    boot: "0",
    time: "2026-10-11 06:00:02",
    unit: "kernel",
    process: "kernel",
    priority: 6,
    message: "Command line: BOOT_IMAGE=/vmlinuz root=/dev/mapper/rhel-root ro",
    kernel: true,
  },
  {
    id: 18,
    boot: "0",
    time: "2026-10-11 06:00:04",
    unit: "systemd",
    process: "systemd[1]",
    priority: 6,
    message: "Starting Network Manager...",
    kernel: false,
  },
  {
    id: 19,
    boot: "0",
    time: "2026-10-11 06:00:06",
    unit: "NetworkManager",
    process: "NetworkManager[744]",
    priority: 6,
    message: "device (ens160): state change: unmanaged -> unavailable",
    kernel: false,
  },
  {
    id: 20,
    boot: "0",
    time: "2026-10-11 06:00:08",
    unit: "NetworkManager",
    process: "NetworkManager[744]",
    priority: 6,
    message: "device (ens160): state change: unavailable -> activated",
    kernel: false,
  },
  {
    id: 21,
    boot: "0",
    time: "2026-10-11 06:00:10",
    unit: "systemd",
    process: "systemd[1]",
    priority: 6,
    message: "Started Network Manager.",
    kernel: false,
  },
  {
    id: 22,
    boot: "0",
    time: "2026-10-11 06:00:12",
    unit: "sshd",
    process: "sshd[1012]",
    priority: 6,
    message: "Server listening on 0.0.0.0 port 22.",
    kernel: false,
  },
  {
    id: 23,
    boot: "0",
    time: "2026-10-11 06:00:14",
    unit: "crond",
    process: "crond[1025]",
    priority: 6,
    message: "(CRON) STARTUP (1.6.1)",
    kernel: false,
  },
  {
    id: 24,
    boot: "0",
    time: "2026-10-11 06:01:00",
    unit: "httpd",
    process: "httpd[1101]",
    priority: 6,
    message: "AH00163: Apache configured -- resuming normal operations",
    kernel: false,
  },
  {
    id: 25,
    boot: "0",
    time: "2026-10-11 06:02:15",
    unit: "sshd",
    process: "sshd[1150]",
    priority: 4,
    message: "Failed password for root from 192.168.15.30 port 52201 ssh2",
    kernel: false,
  },
  {
    id: 26,
    boot: "0",
    time: "2026-10-11 06:02:17",
    unit: "sshd",
    process: "sshd[1150]",
    priority: 4,
    message: "Failed password for root from 192.168.15.30 port 52201 ssh2",
    kernel: false,
  },
  {
    id: 27,
    boot: "0",
    time: "2026-10-11 06:03:00",
    unit: "sshd",
    process: "sshd[1174]",
    priority: 6,
    message: "Accepted publickey for developer from 192.168.15.5 port 52518 ssh2",
    kernel: false,
  },
  {
    id: 28,
    boot: "0",
    time: "2026-10-11 06:05:00",
    unit: "crond",
    process: "CROND[1210]",
    priority: 6,
    message: "(root) CMD (/usr/bin/logger backup-check)",
    kernel: false,
  },
  {
    id: 29,
    boot: "0",
    time: "2026-10-11 06:06:40",
    unit: "httpd",
    process: "httpd[1101]",
    priority: 4,
    message: "AH00558: Could not reliably determine the server's fully qualified domain name",
    kernel: false,
  },
  {
    id: 30,
    boot: "0",
    time: "2026-10-11 06:07:30",
    unit: "httpd",
    process: "httpd[1101]",
    priority: 3,
    message: "AH00072: make_sock: could not bind to address 0.0.0.0:8080",
    kernel: false,
  },
  {
    id: 31,
    boot: "0",
    time: "2026-10-11 06:07:31",
    unit: "systemd",
    process: "systemd[1]",
    priority: 3,
    message: "httpd.service: Failed with result 'exit-code'.",
    kernel: false,
  },
  {
    id: 32,
    boot: "0",
    time: "2026-10-11 06:08:20",
    unit: "kernel",
    process: "kernel",
    priority: 4,
    message: "EXT4-fs warning (device dm-0): mounting filesystem with errors",
    kernel: true,
  },
  {
    id: 33,
    boot: "0",
    time: "2026-10-11 06:09:00",
    unit: "kernel",
    process: "kernel",
    priority: 3,
    message: "Buffer I/O error on dev sdb, logical block 128",
    kernel: true,
  },
  {
    id: 34,
    boot: "0",
    time: "2026-10-11 06:10:00",
    unit: "NetworkManager",
    process: "NetworkManager[744]",
    priority: 4,
    message: "device (ens160): state change: activated -> disconnected",
    kernel: false,
  },
  {
    id: 35,
    boot: "0",
    time: "2026-10-11 06:10:03",
    unit: "kernel",
    process: "kernel",
    priority: 4,
    message: "e1000: ens160: NIC Link is Down",
    kernel: true,
  },
  {
    id: 36,
    boot: "0",
    time: "2026-10-11 06:11:00",
    unit: "NetworkManager",
    process: "NetworkManager[744]",
    priority: 6,
    message: "device (ens160): state change: disconnected -> activated",
    kernel: false,
  },
  {
    id: 37,
    boot: "0",
    time: "2026-10-11 06:12:00",
    unit: "systemd",
    process: "systemd[1]",
    priority: 6,
    message: "Started The Apache HTTP Server.",
    kernel: false,
  },
  {
    id: 38,
    boot: "0",
    time: "2026-10-11 06:15:00",
    unit: "crond",
    process: "CROND[1390]",
    priority: 6,
    message: "(root) CMD (/usr/bin/logger cron-success)",
    kernel: false,
  },
  {
    id: 39,
    boot: "0",
    time: "2026-10-11 06:17:15",
    unit: "sshd",
    process: "sshd[1420]",
    priority: 5,
    message: "Disconnected from user developer 192.168.15.5 port 52518",
    kernel: false,
  },
  {
    id: 40,
    boot: "0",
    time: "2026-10-11 06:20:00",
    unit: "systemd-journald",
    process: "systemd-journald[512]",
    priority: 6,
    message: "Journal started",
    kernel: false,
  },
];

const SCENARIOS = [
  {
    id: "all",
    label: "All logs",
    title: "Inspect the system journal",
    command: "journalctl --no-pager",
    description:
      "Read the available system journal entries without opening a pager.",
    explanation:
      "journalctl reads journal entries collected by systemd-journald.",
    tip: "Without filters, journalctl can show entries from multiple boots if historical journals are available.",
    filters: {},
  },
  {
    id: "unit",
    label: "Service -u",
    title: "Investigate Apache service logs",
    command: "journalctl -u httpd --no-pager",
    description:
      "Inspect journal entries associated with the httpd systemd unit.",
    explanation:
      "-u filters journal entries associated with a specified systemd unit.",
    tip: "Use journalctl -u httpd -b to inspect Apache logs from the current boot.",
    filters: { unit: "httpd" },
  },
  {
    id: "errors",
    label: "Errors -p",
    title: "Identify error-level messages",
    command: "journalctl -p err -b --no-pager",
    description:
      "Find errors and more severe events recorded during the current boot.",
    explanation:
      "-p err selects priorities 0 through 3, not only priority 3.",
    tip: "Priority levels run from 0 (emerg) to 7 (debug). Smaller numbers mean greater severity.",
    filters: { priority: 3, boot: "0" },
  },
  {
    id: "boot",
    label: "Current boot",
    title: "Inspect logs since the latest boot",
    command: "journalctl -b --no-pager",
    description:
      "Display entries belonging to the current boot.",
    explanation:
      "-b without an argument selects the current boot.",
    tip: "journalctl -b -1 selects the previous boot if those journals are available.",
    filters: { boot: "0" },
  },
  {
    id: "previous",
    label: "Previous boot",
    title: "Investigate the previous boot",
    command: "journalctl -b -1 --no-pager",
    description:
      "Inspect logs from the previous boot to investigate earlier failures.",
    explanation:
      "-b -1 selects the previous boot, while -b -2 selects the boot before that.",
    tip: "Historical boots may be unavailable if journals were not retained.",
    filters: { boot: "-1" },
  },
  {
    id: "kernel",
    label: "Kernel -k",
    title: "Investigate kernel messages",
    command: "journalctl -k --no-pager",
    description:
      "Read kernel messages from the current boot.",
    explanation:
      "-k is a shortcut for kernel messages from the current boot.",
    tip: "Kernel logs help diagnose storage, drivers, network links, and hardware errors.",
    filters: { kernel: true, boot: "0" },
  },
  {
    id: "follow",
    label: "Follow -f",
    title: "Follow SSH logs in real time",
    command: "journalctl -u sshd -f --no-pager",
    description:
      "Watch new SSH service journal entries as they arrive.",
    explanation:
      "-f follows the journal. Existing recent entries are displayed before new ones.",
    tip: "Press Ctrl+C in a real terminal to stop journalctl -f.",
    filters: { unit: "sshd", boot: "0" },
  },
  {
    id: "since",
    label: "Since / Until",
    title: "Inspect logs within a time range",
    command:
      "journalctl --since '2026-10-11 06:05:00' --until '2026-10-11 06:12:00' --no-pager",
    description:
      "Filter journal entries to a specific time window.",
    explanation:
      "--since and --until restrict journal entries by timestamp.",
    tip: "journalctl also supports relative dates such as --since '1 hour ago'.",
    filters: {
      since: "2026-10-11 06:05:00",
      until: "2026-10-11 06:12:00",
    },
  },
  {
    id: "tail",
    label: "Last 5",
    title: "Display the five most recent entries",
    command: "journalctl -n 5 --no-pager",
    description:
      "Read only the last five journal entries.",
    explanation:
      "-n limits the output to the most recent matching entries.",
    tip: "Combine -n with -u to show recent logs for a specific service.",
    filters: { limit: 5 },
  },
  {
    id: "reverse",
    label: "Reverse -r",
    title: "Display newest entries first",
    command: "journalctl -r -n 10 --no-pager",
    description:
      "Display the newest ten journal entries in reverse chronological order.",
    explanation:
      "-r reverses the display order. -n 10 limits the result to ten entries.",
    tip: "journalctl -r is useful when you want to see the latest failure first.",
    filters: { reverse: true, limit: 10 },
  },
  {
    id: "boots",
    label: "List boots",
    title: "List retained system boots",
    command: "journalctl --list-boots --no-pager",
    description:
      "Identify boot indexes, boot IDs, and their available journal ranges.",
    explanation:
      "--list-boots displays retained boot sessions, which you can reference with -b.",
    tip: "The latest boot is index 0. Older boots use negative indexes.",
    filters: { listBoots: true },
  },
  {
    id: "persistent",
    label: "Persistence",
    title: "Configure persistent journal storage",
    command:
      "mkdir -p /var/log/journal && systemctl restart systemd-journald",
    description:
      "Prepare persistent journal storage and restart systemd-journald.",
    explanation:
      "Persistent storage allows journals to survive a reboot when journald is configured to use persistent storage.",
    tip: "Storage=persistent in journald.conf is the explicit configuration. A restart alone does not guarantee historical entries exist.",
    filters: { persistence: true },
  },
];

function getPriority(priority) {
  return LEVELS.find((level) => level.value === priority) || LEVELS[6];
}

function formatLog(log) {
  const date = new Date(log.time.replace(" ", "T"));
  const month = date.toLocaleString("en-US", { month: "short" });

  return (
    `${month} ${String(date.getDate()).padStart(2, "0")} ` +
    `${String(date.getHours()).padStart(2, "0")}:` +
    `${String(date.getMinutes()).padStart(2, "0")}:` +
    `${String(date.getSeconds()).padStart(2, "0")} ` +
    `rhcsa-server ${log.process}: ${log.message}`
  );
}

function getFilteredLogs(filters = {}) {
  if (filters.listBoots || filters.persistence) return [];

  let result = [...LOGS];

  if (filters.unit) {
    result = result.filter((log) => log.unit === filters.unit);
  }

  if (filters.boot !== undefined && filters.boot !== "all") {
    result = result.filter((log) => log.boot === filters.boot);
  }

  if (filters.priority !== undefined) {
    result = result.filter(
      (log) => log.priority <= Number(filters.priority)
    );
  }

  if (filters.kernel) {
    result = result.filter((log) => log.kernel);
  }

  if (filters.since) {
    result = result.filter((log) => log.time >= filters.since);
  }

  if (filters.until) {
    result = result.filter((log) => log.time <= filters.until);
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();

    result = result.filter((log) =>
      `${log.unit} ${log.process} ${log.message}`
        .toLowerCase()
        .includes(search)
    );
  }

  result.sort((a, b) => a.time.localeCompare(b.time));

  if (filters.reverse) {
    result.reverse();
  }

  if (filters.limit !== undefined) {
    result = filters.reverse
      ? result.slice(0, filters.limit)
      : result.slice(-filters.limit);
  }

  return result;
}

function getBootOutput() {
  return BOOTS.map((boot) => {
    const logs = LOGS.filter((log) => log.boot === boot.id);
    const first = logs[0]?.time || boot.date;
    const last = logs[logs.length - 1]?.time || boot.date;

    return {
      id: boot.id,
      text: `${boot.id.padStart(3, " ")} ${boot.bootId} ${first} — ${last}`,
    };
  });
}

function getPersistentSteps() {
  return [
    {
      command: "mkdir -p /var/log/journal",
      output: "Persistent journal directory created.",
    },
    {
      command:
        "printf '[Journal]\\nStorage=persistent\\n' > /etc/systemd/journald.conf.d/90-persistent.conf",
      output:
        "Persistent journal configuration saved (directory must exist first).",
    },
    {
      command: "systemctl restart systemd-journald",
      output: "systemd-journald restarted.",
    },
    {
      command: "journalctl --disk-usage",
      output:
        "Archived and active journals take up 24.0M in the file system.",
    },
  ];
}

function PriorityLegend() {
  return (
    <div className="journal-priority-legend">
      {LEVELS.map((level) => (
        <div key={level.value}>
          <span
            className="journal-priority-dot"
            style={{ background: level.color }}
          />
          <strong>{level.value}</strong>
          <span>{level.name}</span>
        </div>
      ))}
    </div>
  );
}

function LogInspector({ logs, activeIndex, running }) {
  return (
    <div className="journal-log-inspector">
      <div className="journal-panel-heading">
        <div>
          <span className="journal-panel-kicker">SYSTEMD JOURNAL</span>
          <strong>Log Event Explorer</strong>
        </div>
        <span className="journal-panel-meta">
          {logs.length} EVENTS
        </span>
      </div>

      <div className="journal-log-list">
        {logs.length === 0 ? (
          <div className="journal-empty">
            This scenario demonstrates journal configuration rather
            than log filtering.
          </div>
        ) : (
          logs.map((log, index) => {
            const priority = getPriority(log.priority);
            const visited = index <= activeIndex;
            const active = index === activeIndex;

            return (
              <div
                key={log.id}
                className={[
                  "journal-log-entry",
                  visited ? "visited" : "",
                  active ? "active" : "",
                ].join(" ")}
                style={{ "--priority-color": priority.color }}
              >
                <div className="journal-log-entry-top">
                  <span className="journal-log-time">
                    {log.time.split(" ")[1]}
                  </span>

                  <span className="journal-log-unit">
                    {log.unit}
                  </span>

                  <span className="journal-log-priority">
                    {priority.name.toUpperCase()}
                  </span>
                </div>

                <p>{log.message}</p>

                <div className="journal-log-entry-bottom">
                  <span>BOOT {log.boot}</span>
                  <span>{log.process}</span>
                  {active && running && <em>READING</em>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function JournalTimeline({ logs, activeIndex }) {
  const visibleLogs = logs.slice(0, activeIndex + 1);

  return (
    <div className="journal-timeline-panel">
      <div className="journal-panel-heading">
        <div>
          <span className="journal-panel-kicker">EVENT TIMELINE</span>
          <strong>Journal Activity</strong>
        </div>
      </div>

      <div className="journal-timeline-content">
        {visibleLogs.length === 0 ? (
          <div className="journal-empty">
            Press Play to inspect journal events.
          </div>
        ) : (
          visibleLogs.slice(-7).map((log) => {
            const priority = getPriority(log.priority);

            return (
              <div className="journal-timeline-item" key={log.id}>
                <span
                  className="journal-timeline-marker"
                  style={{ background: priority.color }}
                />

                <div>
                  <span>{log.time.split(" ")[1]}</span>
                  <strong>{log.unit}</strong>
                  <p>{log.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function AnimatedTerminal({
  scenario,
  logs,
  activeIndex,
  running,
  speed,
  resetKey,
}) {
  const [typed, setTyped] = useState(0);
  const bottomRef = useRef(null);

  const command = scenario.command;
  const commandComplete = typed >= command.length;

  useEffect(() => {
    setTyped(0);
  }, [resetKey, command]);

  useEffect(() => {
    if (!running || commandComplete) return;

    const timer = setTimeout(() => {
      setTyped((current) =>
        Math.min(command.length, current + 1)
      );
    }, Math.max(8, 48 / speed));

    return () => clearTimeout(timer);
  }, [running, typed, command, speed, commandComplete]);

  const visibleLogs = logs.slice(0, activeIndex + 1);

  const specialOutput = useMemo(() => {
    if (scenario.filters.listBoots) {
      return getBootOutput().map((item) => item.text);
    }

    if (scenario.filters.persistence) {
      return [
        "Persistent journal storage configured.",
        "systemd-journald restarted successfully.",
        "Journal files can now be retained across reboots.",
      ];
    }

    return [];
  }, [scenario]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [typed, activeIndex]);

  return (
    <div className="journal-terminal">
      <div className="journal-terminal-header">
        <span>
          <i />
          root@rhcsa-server
        </span>

        <button
          onClick={() =>
            navigator.clipboard.writeText(command)
          }
        >
          Copy
        </button>
      </div>

      <div className="journal-terminal-body">
        <div className="journal-terminal-command">
          <span className="journal-prompt"># </span>
          <span>{command.slice(0, typed)}</span>

          {!commandComplete && (
            <span className="journal-cursor">▋</span>
          )}
        </div>

        {commandComplete && (
          <div className="journal-terminal-results">
            {scenario.filters.listBoots ||
            scenario.filters.persistence ? (
              specialOutput.map((line, index) => (
                <div
                  key={index}
                  className="journal-terminal-output"
                >
                  {line}
                </div>
              ))
            ) : (
              <>
                {visibleLogs.map((log) => (
                  <div
                    className="journal-terminal-output"
                    key={log.id}
                    style={{
                      color:
                        log.priority <= 3
                          ? "#fb923c"
                          : log.priority === 4
                            ? "#fbbf24"
                            : "#b6c5d8",
                    }}
                  >
                    {formatLog(log)}
                  </div>
                ))}

                {scenario.id === "follow" && (
                  <div className="journal-follow-status">
                    ● Following journal...
                  </div>
                )}
              </>
            )}

            {activeIndex >= logs.length - 1 &&
              scenario.id !== "follow" && (
                <div className="journal-terminal-finished">
                  <span className="journal-prompt"># </span>
                  <span className="journal-cursor">▋</span>
                </div>
              )}
          </div>
        )}

        <span ref={bottomRef} />
      </div>

      <div className="journal-terminal-footer">
        SIMULATED RHEL TERMINAL · NO COMMANDS EXECUTED
      </div>
    </div>
  );
}

function JournalCommandBuilder() {
  const [unit, setUnit] = useState("httpd");
  const [boot, setBoot] = useState("0");
  const [priority, setPriority] = useState("all");
  const [limit, setLimit] = useState("all");
  const [reverse, setReverse] = useState(false);
  const [kernel, setKernel] = useState(false);
  const [search, setSearch] = useState("");
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");

  const filters = useMemo(
    () => ({
      unit: kernel ? "" : unit,
      boot,
      priority:
        priority === "all" ? undefined : Number(priority),
      limit: limit === "all" ? undefined : Number(limit),
      reverse,
      kernel,
      search,
      since: since.replace("T", " "),
      until: until.replace("T", " "),
    }),
    [
      unit,
      boot,
      priority,
      limit,
      reverse,
      kernel,
      search,
      since,
      until,
    ]
  );

  const results = useMemo(
    () => getFilteredLogs(filters),
    [filters]
  );

  const command = useMemo(() => {
    const parts = ["journalctl"];

    if (kernel) {
      parts.push("-k");
    } else if (unit) {
      parts.push("-u", unit);
    }

    if (boot !== "all") {
      parts.push("-b");

      if (boot !== "0") {
        parts.push(boot);
      }
    }

    if (priority !== "all") {
      parts.push("-p", getPriority(Number(priority)).name);
    }

    if (since) {
      parts.push("--since", `'${since.replace("T", " ")}'`);
    }

    if (until) {
      parts.push("--until", `'${until.replace("T", " ")}'`);
    }

    if (search) {
      parts.push("--grep", `'${search.replace(/'/g, "'\\''")}'`);
    }

    if (reverse) {
      parts.push("-r");
    }

    if (limit !== "all") {
      parts.push("-n", limit);
    }

    parts.push("--no-pager");

    return parts.join(" ");
  }, [
    unit,
    boot,
    priority,
    limit,
    reverse,
    kernel,
    search,
    since,
    until,
  ]);

  return (
    <section className="journal-builder">
      <div className="journal-section-heading">
        <span>INTERACTIVE RHCSA TOOL</span>
        <h2>Journalctl Command Builder</h2>
        <p>
          Combine service, priority, boot, time, and search filters
          to build journalctl commands and preview the results.
        </p>
      </div>

      <div className="journal-builder-grid">
        <div className="journal-form-group">
          <label>SYSTEMD UNIT</label>
          <select
            value={unit}
            disabled={kernel}
            onChange={(event) => setUnit(event.target.value)}
          >
            <option value="">All services</option>
            <option value="httpd">httpd</option>
            <option value="sshd">sshd</option>
            <option value="crond">crond</option>
            <option value="NetworkManager">NetworkManager</option>
            <option value="systemd">systemd</option>
            <option value="systemd-journald">systemd-journald</option>
          </select>
        </div>

        <div className="journal-form-group">
          <label>BOOT SESSION</label>
          <select
            value={boot}
            onChange={(event) => setBoot(event.target.value)}
          >
            <option value="all">All retained boots</option>
            <option value="0">Current boot (0)</option>
            <option value="-1">Previous boot (-1)</option>
            <option value="-2">Previous boot (-2)</option>
          </select>
        </div>

        <div className="journal-form-group">
          <label>MAXIMUM PRIORITY</label>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="all">All priorities</option>
            {LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.value} — {level.name}
              </option>
            ))}
          </select>
        </div>

        <div className="journal-form-group">
          <label>NUMBER OF ENTRIES</label>
          <select
            value={limit}
            onChange={(event) => setLimit(event.target.value)}
          >
            <option value="all">All matching entries</option>
            <option value="5">Last 5</option>
            <option value="10">Last 10</option>
            <option value="20">Last 20</option>
          </select>
        </div>

        <div className="journal-form-group">
          <label>SINCE</label>
          <input
            type="datetime-local"
            value={since}
            onChange={(event) => setSince(event.target.value)}
          />
        </div>

        <div className="journal-form-group">
          <label>UNTIL</label>
          <input
            type="datetime-local"
            value={until}
            onChange={(event) => setUntil(event.target.value)}
          />
        </div>

        <div className="journal-form-group journal-search-field">
          <label>MESSAGE SEARCH</label>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Failed, error, disconnected..."
            spellCheck={false}
          />
        </div>
      </div>

      <div className="journal-builder-options">
        <button
          className={reverse ? "active" : ""}
          onClick={() => setReverse((value) => !value)}
        >
          -r Reverse order
        </button>

        <button
          className={kernel ? "active" : ""}
          onClick={() => {
            setKernel((value) => !value);
            setBoot("0");
          }}
        >
          -k Kernel messages
        </button>
      </div>

      <div className="journal-command-preview">
        <div>
          <span>GENERATED COMMAND</span>

          <button
            onClick={() => navigator.clipboard.writeText(command)}
          >
            Copy
          </button>
        </div>

        <code>{command}</code>
      </div>

      <div className="journal-builder-results">
        <div className="journal-panel-heading">
          <div>
            <span className="journal-panel-kicker">FILTER PREVIEW</span>
            <strong>{results.length} matching events</strong>
          </div>
        </div>

        <div className="journal-builder-output">
          {results.length ? (
            results.map((log) => (
              <div
                key={log.id}
                style={{
                  "--priority-color": getPriority(log.priority).color,
                }}
              >
                <span className="journal-output-dot" />
                <code>{formatLog(log)}</code>
              </div>
            ))
          ) : (
            <p>No matching events in the sample journal.</p>
          )}
        </div>
      </div>

      <div className="journal-important-note">
        <strong>RHCSA reminder</strong>
        <p>
          The preview uses a fixed sample journal. In RHEL,
          journalctl reads the real systemd journal. The
          --grep option uses regular expressions; this
          educational preview uses case-insensitive substring
          matching instead.
        </p>
      </div>
    </section>
  );
}

function JournalPersistence() {
  const [enabled, setEnabled] = useState(false);
  const [step, setStep] = useState(0);

  const steps = getPersistentSteps();

  function nextStep() {
    if (step < steps.length) {
      setStep((current) => current + 1);
    }

    if (step + 1 >= steps.length) {
      setEnabled(true);
    }
  }

  function reset() {
    setStep(0);
    setEnabled(false);
  }

  return (
    <section className="journal-persistence">
      <div className="journal-section-heading">
        <span>RHCSA SYSTEM CONFIGURATION</span>
        <h2>Persistent Journal Storage</h2>
        <p>
          Understand how to retain systemd journal entries across
          reboots.
        </p>
      </div>

      <div className="journal-persistence-grid">
        <div className="journal-storage-diagram">
          <div className="journal-storage-card">
            <span>VOLATILE STORAGE</span>
            <strong>/run/log/journal/</strong>
            <p>Runtime journal storage, normally lost on reboot.</p>
          </div>

          <div className="journal-storage-arrow">↓</div>

          <div
            className={`journal-storage-card persistent ${
              enabled ? "enabled" : ""
            }`}
          >
            <span>PERSISTENT STORAGE</span>
            <strong>/var/log/journal/</strong>
            <p>
              {enabled
                ? "Persistent storage configured in this simulation."
                : "Configure journald to retain entries across reboots."}
            </p>
          </div>
        </div>

        <div className="journal-persistence-terminal">
          <div className="journal-panel-heading">
            <div>
              <span className="journal-panel-kicker">
                CONFIGURATION WALKTHROUGH
              </span>
              <strong>root@rhcsa-server</strong>
            </div>
          </div>

          <div className="journal-persistence-output">
            {steps.slice(0, step).map((item, index) => (
              <div key={index}>
                <div className="journal-persistence-command">
                  <span># </span>
                  {item.command}
                </div>

                <p>{item.output}</p>
              </div>
            ))}

            {step === 0 && (
              <p>Click Next Step to begin configuration.</p>
            )}

            {enabled && (
              <div className="journal-persistence-success">
                ✓ Persistent journal configuration completed.
              </div>
            )}
          </div>

          <div className="journal-persistence-controls">
            <button onClick={nextStep} disabled={enabled}>
              {enabled ? "Completed" : "Next Step →"}
            </button>

            <button onClick={reset}>↺ Reset</button>
          </div>
        </div>
      </div>

      <div className="journal-important-note">
        <strong>Important</strong>
        <p>
          Before using a journald configuration drop-in, create
          /etc/systemd/journald.conf.d/. This walkthrough is
          conceptual and does not modify your operating system.
          For real configuration, ensure Storage=persistent is
          set and verify storage with journalctl --disk-usage.
        </p>
      </div>
    </section>
  );
}

function JournalCheatsheet() {
  const commands = [
    ["All journal entries", "journalctl"],
    ["Without pager", "journalctl --no-pager"],
    ["Specific service", "journalctl -u httpd"],
    ["Current boot", "journalctl -b"],
    ["Previous boot", "journalctl -b -1"],
    ["List boots", "journalctl --list-boots"],
    ["Kernel messages", "journalctl -k"],
    ["Errors and higher", "journalctl -p err"],
    ["Exact error priority", "journalctl -p err..err"],
    ["Follow live logs", "journalctl -f"],
    ["Follow service", "journalctl -u sshd -f"],
    ["Last 20 entries", "journalctl -n 20"],
    ["Newest first", "journalctl -r"],
    ["Since yesterday", "journalctl --since yesterday"],
    ["Since one hour ago", "journalctl --since '1 hour ago'"],
    [
      "Time range",
      "journalctl --since '2026-10-11 06:00' --until '2026-10-11 07:00'",
    ],
    ["Search message", "journalctl --grep='Failed'"],
    ["Disk usage", "journalctl --disk-usage"],
    ["Verify journal", "journalctl --verify"],
    ["Journal service", "systemctl status systemd-journald"],
  ];

  return (
    <section className="journal-cheatsheet">
      <div className="journal-section-heading">
        <span>RHCSA COMMAND REFERENCE</span>
        <h2>Journalctl Cheatsheet</h2>
        <p>
          Common commands for diagnosing systemd services,
          filtering events, and inspecting Linux logs.
        </p>
      </div>

      <div className="journal-command-list">
        {commands.map(([label, command]) => (
          <div className="journal-command-row" key={label}>
            <span>{label}</span>
            <code>{command}</code>

            <button
              onClick={() => navigator.clipboard.writeText(command)}
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function JournalctlVisualLab() {
  const [scenarioId, setScenarioId] = useState("unit");
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [resetKey, setResetKey] = useState(0);

  const scenario = SCENARIOS.find(
    (item) => item.id === scenarioId
  );

  const logs = useMemo(
    () => getFilteredLogs(scenario.filters),
    [scenario]
  );

  const special =
    scenario.filters.listBoots ||
    scenario.filters.persistence;

  const maxIndex = special ? 0 : logs.length - 1;

  useEffect(() => {
    if (!running) return;

    if (activeIndex >= maxIndex) {
      if (scenario.id !== "follow") {
        return;
      }
      return;
    }

    const timer = setTimeout(() => {
      setActiveIndex((current) =>
        Math.min(maxIndex, current + 1)
      );
    }, Math.max(90, 700 / speed));

    return () => clearTimeout(timer);
  }, [running, activeIndex, maxIndex, speed, scenario.id]);

  function selectScenario(id) {
    setScenarioId(id);
    setRunning(false);
    setActiveIndex(-1);
    setResetKey((value) => value + 1);
  }

  function restart() {
    setRunning(false);
    setActiveIndex(-1);
    setResetKey((value) => value + 1);
  }

  function step(amount) {
    setRunning(false);
    setActiveIndex((current) =>
      Math.max(-1, Math.min(maxIndex, current + amount))
    );
  }

  const visited = Math.max(0, activeIndex + 1);
  const currentLog = logs[activeIndex];

  const errorCount = logs
    .slice(0, visited)
    .filter((log) => log.priority <= 3).length;

  const warningCount = logs
    .slice(0, visited)
    .filter((log) => log.priority === 4).length;

  return (
    <main className="journal-study-page">
      <div className="journal-content">
        <header className="journal-page-header">
          <span className="journal-eyebrow">
            RHCSA / RHEL · INTERACTIVE LAB
          </span>

          <h1>Explore Linux System Logs.</h1>

          <p>
            Master journalctl, understand systemd journal priorities,
            investigate service failures, and practice Linux
            troubleshooting with animated logs.
          </p>
        </header>

        <section className="journal-simulator">
          <div className="journal-simulator-header">
            <div>
              <span>INTERACTIVE JOURNAL EXPLORER</span>
              <h2>Journalctl Execution Simulator</h2>
            </div>

            <span className="journal-live-label">
              {running ? "● READING JOURNAL" : "● READY"}
            </span>
          </div>

          <div className="journal-scenario-tabs">
            {SCENARIOS.map((item) => (
              <button
                key={item.id}
                className={scenarioId === item.id ? "active" : ""}
                onClick={() => selectScenario(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="journal-objective">
            <span>SCENARIO</span>
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
          </div>

          <PriorityLegend />

          <div className="journal-main-grid">
            <LogInspector
              logs={logs}
              activeIndex={activeIndex}
              running={running}
            />

            <div className="journal-side-panels">
              <JournalTimeline
                logs={logs}
                activeIndex={activeIndex}
              />

              <div className="journal-inspector">
                <div className="journal-panel-heading">
                  <div>
                    <span className="journal-panel-kicker">
                      EVENT INSPECTOR
                    </span>
                    <strong>Selected journal entry</strong>
                  </div>
                </div>

                {currentLog ? (
                  <div className="journal-inspector-content">
                    <div>
                      <span>TIMESTAMP</span>
                      <strong>{currentLog.time}</strong>
                    </div>

                    <div>
                      <span>SYSTEMD UNIT</span>
                      <strong>{currentLog.unit}</strong>
                    </div>

                    <div>
                      <span>PRIORITY</span>
                      <strong
                        style={{
                          color: getPriority(currentLog.priority).color,
                        }}
                      >
                        {getPriority(currentLog.priority).name.toUpperCase()}
                      </strong>
                    </div>

                    <div>
                      <span>BOOT</span>
                      <strong>{currentLog.boot}</strong>
                    </div>

                    <div>
                      <span>MESSAGE</span>
                      <p>{currentLog.message}</p>
                    </div>
                  </div>
                ) : (
                  <p className="journal-empty">
                    Select Play to inspect a journal event.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="journal-explanation">
            <div>
              <span>HOW IT WORKS</span>
              <p>{scenario.explanation}</p>
            </div>

            <div>
              <strong>RHCSA TIP</strong>
              <p>{scenario.tip}</p>
            </div>
          </div>

          <div className="journal-terminal-section">
            <AnimatedTerminal
              key={`${scenarioId}-${resetKey}`}
              scenario={scenario}
              logs={logs}
              activeIndex={activeIndex}
              running={running}
              speed={speed}
              resetKey={resetKey}
            />
          </div>

          <div className="journal-controls">
            <button
              className="journal-play"
              onClick={() => setRunning((value) => !value)}
            >
              {running ? "Ⅱ Pause" : "▶ Play"}
            </button>

            <button onClick={() => step(-1)}>
              ← Previous
            </button>

            <button onClick={() => step(1)}>
              Next →
            </button>

            <div className="journal-control-spacer" />

            <span>Speed</span>

            <select
              value={speed}
              onChange={(event) =>
                setSpeed(Number(event.target.value))
              }
            >
              {SPEEDS.map((value) => (
                <option key={value} value={value}>
                  {value}×
                </option>
              ))}
            </select>

            <button onClick={restart}>↺ Restart</button>
          </div>

          <div className="journal-progress">
            <div
              style={{
                width: `${
                  logs.length
                    ? (visited / logs.length) * 100
                    : special && visited > 0
                      ? 100
                      : 0
                }%`,
              }}
            />
          </div>

          <div className="journal-statistics">
            <div>
              <span>EVENTS READ</span>
              <strong>{visited}</strong>
            </div>

            <div>
              <span>ERRORS</span>
              <strong>{errorCount}</strong>
            </div>

            <div>
              <span>WARNINGS</span>
              <strong>{warningCount}</strong>
            </div>

            <div>
              <span>TOTAL MATCHES</span>
              <strong>{logs.length}</strong>
            </div>
          </div>
        </section>

        <JournalCommandBuilder />
        <JournalPersistence />
        <JournalCheatsheet />

        <footer className="journal-footer">
          RHCSA Visual Lab · systemd-journald · Linux troubleshooting
        </footer>
      </div>
    </main>
  );
}
