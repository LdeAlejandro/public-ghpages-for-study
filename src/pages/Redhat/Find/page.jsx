
import { useEffect, useMemo, useState } from "react";
import "./page.css";

export const metadata = {
  title: "FIND — Interactive Visual Lab",
  category: "RHCSA",
  description:
    "Interactive Linux find command simulator with animated filesystem traversal, filters, permissions, and practical RHCSA examples.",
  keywords: [
    "Linux", "RHEL", "RHCSA", "find", "name", "iname",
    "type", "user", "group", "perm", "size", "mtime",
    "exec", "delete", "print0", "filesystem"
  ],
  created: "2026-10-11",
};

const FILES = [
  {
    path: "/lab",
    type: "d",
    user: "root",
    group: "root",
    perm: "755",
    size: 0,
    age: 10,
  },
  {
    path: "/lab/docs",
    type: "d",
    user: "root",
    group: "developers",
    perm: "2775",
    size: 0,
    age: 5,
  },
  {
    path: "/lab/docs/report.txt",
    type: "f",
    user: "developer",
    group: "developers",
    perm: "644",
    size: 2048,
    age: 2,
  },
  {
    path: "/lab/docs/README.TXT",
    type: "f",
    user: "developer",
    group: "developers",
    perm: "664",
    size: 1024,
    age: 1,
  },
  {
    path: "/lab/docs/notes.log",
    type: "f",
    user: "analyst",
    group: "finance",
    perm: "640",
    size: 8192,
    age: 9,
  },
  {
    path: "/lab/scripts",
    type: "d",
    user: "root",
    group: "root",
    perm: "755",
    size: 0,
    age: 15,
  },
  {
    path: "/lab/scripts/backup.sh",
    type: "f",
    user: "root",
    group: "root",
    perm: "755",
    size: 4096,
    age: 12,
  },
  {
    path: "/lab/scripts/check.sh",
    type: "f",
    user: "developer",
    group: "developers",
    perm: "750",
    size: 1536,
    age: 3,
  },
  {
    path: "/lab/scripts/suid-test",
    type: "f",
    user: "root",
    group: "root",
    perm: "4755",
    size: 12288,
    age: 20,
  },
  {
    path: "/lab/scripts/sgid-test",
    type: "f",
    user: "root",
    group: "developers",
    perm: "2755",
    size: 6144,
    age: 20,
  },
  {
    path: "/lab/archive",
    type: "d",
    user: "root",
    group: "root",
    perm: "755",
    size: 0,
    age: 40,
  },
  {
    path: "/lab/archive/old.log",
    type: "f",
    user: "root",
    group: "root",
    perm: "600",
    size: 10485760,
    age: 45,
  },
  {
    path: "/lab/archive/data.bin",
    type: "f",
    user: "analyst",
    group: "finance",
    perm: "660",
    size: 5242880,
    age: 30,
  },
  {
    path: "/lab/archive/backup.tar.gz",
    type: "f",
    user: "root",
    group: "root",
    perm: "600",
    size: 20971520,
    age: 60,
  },
  {
    path: "/lab/shared",
    type: "d",
    user: "root",
    group: "developers",
    perm: "2775",
    size: 0,
    age: 6,
  },
  {
    path: "/lab/shared/project.txt",
    type: "f",
    user: "developer",
    group: "developers",
    perm: "664",
    size: 3072,
    age: 1,
  },
  {
    path: "/lab/shared/public.txt",
    type: "f",
    user: "analyst",
    group: "developers",
    perm: "666",
    size: 512,
    age: 4,
  },
];

const SCENARIOS = [
  {
    id: "name",
    label: "Name",
    title: "Find files by name",
    description:
      "Use -name for case-sensitive matching and -iname for case-insensitive matching.",
    command: "find /lab -type f -iname '*.txt'",
    explanation:
      "The shell passes the quoted pattern to find. The -iname filter matches .txt and .TXT files regardless of case.",
    matches: (file) =>
      file.type === "f" && /\.txt$/i.test(file.path),
    tip: "Use quotes around wildcard patterns so the shell does not expand them before find runs.",
  },
  {
    id: "type",
    label: "Type",
    title: "Find directories",
    description:
      "Filter entries by type. Use f for regular files, d for directories, and l for symbolic links.",
    command: "find /lab -type d",
    explanation:
      "The -type d expression matches directories, including the starting directory itself.",
    matches: (file) => file.type === "d",
    tip: "Use -type f when you only want regular files.",
  },
  {
    id: "owner",
    label: "Owner",
    title: "Find files owned by a user",
    description:
      "Search for files belonging to developer.",
    command: "find /lab -type f -user developer",
    explanation:
      "The -user expression checks the file owner. The -group expression works similarly for group ownership.",
    matches: (file) =>
      file.type === "f" && file.user === "developer",
    tip: "For RHCSA, remember -user, -group, -uid, and -gid.",
  },
  {
    id: "permissions",
    label: "Permissions",
    title: "Find SUID files",
    description:
      "Search for regular files that have the SUID bit enabled.",
    command: "find /lab -type f -perm -4000",
    explanation:
      "The leading minus sign means all specified permission bits must be present. Here, the SUID bit must be enabled.",
    matches: (file) =>
      file.type === "f" &&
      (parseInt(file.perm, 8) & 0o4000) === 0o4000,
    tip: "-perm -6000 requires both SUID and SGID. -perm /6000 accepts either bit.",
  },
  {
    id: "size",
    label: "Size",
    title: "Find files larger than 5 MiB",
    description:
      "Use -size to filter files according to their size.",
    command: "find /lab -type f -size +5M",
    explanation:
      "The + operator means greater than. The M suffix uses 1,048,576-byte units, rounded up, so +5M selects files larger than 5 MiB.",
    matches: (file) =>
      file.type === "f" && file.size > 5 * 1024 * 1024,
    tip: "Common suffixes: c = bytes, k = KiB, M = MiB, G = GiB.",
  },
  {
    id: "time",
    label: "Time",
    title: "Find files modified more than 7 days ago",
    description:
      "Use -mtime to filter files by modification age.",
    command: "find /lab -type f -mtime +7",
    explanation:
      "With -mtime +7, find matches files whose modification age is at least 8 complete 24-hour periods.",
    matches: (file) =>
      file.type === "f" && file.age >= 8,
    tip: "For a rolling threshold of more than 7 days, use -mmin +10080.",
  },
  {
    id: "combined",
    label: "Combined",
    title: "Combine multiple filters",
    description:
      "Find developer-owned regular files ending in .txt.",
    command:
      "find /lab -type f -user developer -name '*.txt'",
    explanation:
      "Expressions are combined with an implicit AND. Every condition must match for the file to appear in the output.",
    matches: (file) =>
      file.type === "f" &&
      file.user === "developer" &&
      file.path.endsWith(".txt"),
    tip: "Use \\( ... -o ... \\) when you need logical OR.",
  },
  {
    id: "actions",
    label: "Actions",
    title: "Execute an action on matching files",
    description:
      "Find .log files and copy them into a destination directory.",
    command:
      "mkdir -p /backup/logs\nfind /lab -type f -name '*.log' -exec cp -t /backup/logs -- {} +",
    explanation:
      "The -exec action passes matching paths to cp. The {} placeholder represents the selected files, and + batches multiple paths into fewer command executions.",
    matches: (file) =>
      file.type === "f" && file.path.endsWith(".log"),
    tip: "To preserve source directory structure, use cp --parents with an appropriate working directory. -delete permanently removes matches; test with -print first.",
  },
];

function basename(path) {
  return path.split("/").pop();
}

function getDepth(path) {
  return path.split("/").filter(Boolean).length - 1;
}

function formatSize(size) {
  if (!size) return "—";
  if (size >= 1048576) return `${(size / 1048576).toFixed(1)} MiB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KiB`;
  return `${size} B`;
}

function FileIcon({ type }) {
  return (
    <span className={`find-file-icon ${type === "d" ? "directory" : ""}`}>
      {type === "d" ? "▣" : "▤"}
    </span>
  );
}

function FileTree({ activeIndex, scenario, running }) {
  return (
    <div className="find-tree">
      <div className="find-panel-header">
        <span>FILESYSTEM EXPLORER</span>
        <span>{FILES.length} ENTRIES</span>
      </div>

      <div className="find-tree-list">
        {FILES.map((file, index) => {
          const visited = index <= activeIndex;
          const active = index === activeIndex;
          const matched = visited && scenario.matches(file);

          return (
            <div
              key={file.path}
              className={[
                "find-tree-item",
                visited ? "visited" : "",
                active ? "active" : "",
                matched ? "matched" : "",
              ].join(" ")}
              style={{ "--depth": getDepth(file.path) }}
            >
              <div className="find-tree-name">
                <FileIcon type={file.type} />
                <span>{basename(file.path)}</span>
              </div>

              <div className="find-tree-meta">
                <span>{file.user}</span>
                <span>{file.perm}</span>
                {matched && <strong>MATCH</strong>}
                {active && running && <span className="find-scanning">●</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Terminal({ command, matches, activeIndex }) {
  const scanned = FILES.slice(0, activeIndex + 1);
  const output = scanned
    .filter(matches)
    .map((file) => file.path);

  return (
    <div className="find-terminal">
      <div className="find-terminal-header">
        <span>
          <i className="find-terminal-status" />
          root@rhcsa-server
        </span>
        <button onClick={() => navigator.clipboard.writeText(command)}>
          Copy
        </button>
      </div>

      <pre>
        <span className="find-prompt"># </span>
        <span className="find-command">{command}</span>
        {"\n"}
        <span className="find-output">
          {output.join("\n")}
        </span>
        <span className="find-cursor">▋</span>
      </pre>

      <div className="find-terminal-footer">
        SIMULATED TERMINAL · NO COMMANDS EXECUTED
      </div>
    </div>
  );
}

function FindCheatsheet() {
  const commands = [
    ["Name", "find / -name '*.conf'"],
    ["Ignore case", "find /etc -iname '*.CONF'"],
    ["Directories", "find /var -type d"],
    ["Owner", "find /var -user developer"],
    ["Group", "find /shared -group developers"],
    ["SUID", "find / -type f -perm -4000 2>/dev/null"],
    ["SGID", "find / -type f -perm -2000 2>/dev/null"],
    ["SUID or SGID", "find / -type f -perm /6000 2>/dev/null"],
    ["Exact mode", "find / -type f -perm 4755 2>/dev/null"],
    ["More than 10 MiB", "find /var -type f -size +10M"],
    ["Modified within 7 days", "find /var -type f -mtime -7"],
    ["Empty files", "find /var -type f -empty"],
    ["Copy files", "find /var -type f -user developer -exec cp --parents -t /backup -- {} +"],
    ["Null separator", "find /var -type f -print0"],
  ];

  return (
    <section className="find-cheatsheet">
      <div className="find-section-heading">
        <span>RHCSA REFERENCE</span>
        <h2>Find command cheatsheet</h2>
        <p>Useful patterns for practical Linux administration.</p>
      </div>

      <div className="find-command-list">
        {commands.map(([label, command]) => (
          <div className="find-command-row" key={label}>
            <span>{label}</span>
            <code>{command}</code>
            <button onClick={() => navigator.clipboard.writeText(command)}>
              Copy
            </button>
          </div>
        ))}
      </div>

      <div className="find-important-note">
        <strong>Important: -perm behavior</strong>
        <p>
          <code>-perm 6000</code> requires an exact permission mode of 6000.
          <code> -perm -6000</code> requires both SUID and SGID bits.
          <code> -perm /6000</code> matches either SUID or SGID.
        </p>
      </div>
    </section>
  );
}

export default function FindVisualLab() {
  const [scenarioId, setScenarioId] = useState("name");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);

  const scenario = useMemo(
    () => SCENARIOS.find((item) => item.id === scenarioId),
    [scenarioId]
  );

 useEffect(() => {
  if (!running || activeIndex >= FILES.length - 1) return;

  const timer = setTimeout(() => {
    setActiveIndex((current) =>
      Math.min(FILES.length - 1, current + 1)
    );
  }, 550 / speed);

  return () => clearTimeout(timer);
}, [running, activeIndex, speed]);

  function selectScenario(id) {
    setScenarioId(id);
    setActiveIndex(-1);
    setRunning(false);
  }

  function togglePlayback() {
    if (running) {
      setRunning(false);
      return;
    }

    if (activeIndex >= FILES.length - 1) {
      setActiveIndex(-1);
    }

    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setActiveIndex(-1);
  }

  const visited = Math.max(0, activeIndex + 1);
  const matches = FILES.slice(0, visited).filter(scenario.matches);
  const progress = (visited / FILES.length) * 100;

  return (
    <main className="find-study-page">
      <div className="find-content">
        <header className="find-page-header">
          <span className="find-eyebrow">
            RHCSA / RHEL · INTERACTIVE LAB
          </span>
          <h1>Find anything in Linux.</h1>
          <p>
            Explore how the find command traverses a filesystem,
            evaluates conditions and returns matching entries.
          </p>
        </header>

        <section className="find-simulator">
          <div className="find-simulator-header">
            <div>
              <span>INTERACTIVE FILESYSTEM</span>
              <h2>Find Command Explorer</h2>
            </div>
            <span className="find-live-label">
              {running ? "● SCANNING" : "● READY"}
            </span>
          </div>

          <div className="find-scenario-tabs">
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

          <div className="find-objective">
            <span>SCENARIO</span>
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
          </div>

          <div className="find-main-grid">
            <FileTree
              activeIndex={activeIndex}
              scenario={scenario}
              running={running}
            />

            <div className="find-right-column">
              <div className="find-inspector">
                <div className="find-panel-header">
                  <span>FILTER EVALUATION</span>
                  <span>LIVE</span>
                </div>

                <div className="find-inspector-body">
                  {activeIndex < 0 ? (
                    <p className="find-placeholder">
                      Press Play to begin scanning the filesystem.
                    </p>
                  ) : (
                    <>
                      <div className="find-inspector-path">
                        {FILES[activeIndex].path}
                      </div>

                      <div className="find-inspector-properties">
                        <div>
                          <span>TYPE</span>
                          <strong>
                            {FILES[activeIndex].type === "d"
                              ? "Directory"
                              : "Regular file"}
                          </strong>
                        </div>
                        <div>
                          <span>OWNER</span>
                          <strong>{FILES[activeIndex].user}</strong>
                        </div>
                        <div>
                          <span>GROUP</span>
                          <strong>{FILES[activeIndex].group}</strong>
                        </div>
                        <div>
                          <span>PERMISSIONS</span>
                          <strong>{FILES[activeIndex].perm}</strong>
                        </div>
                        <div>
                          <span>SIZE</span>
                          <strong>{formatSize(FILES[activeIndex].size)}</strong>
                        </div>
                        <div>
                          <span>MODIFIED</span>
                          <strong>{FILES[activeIndex].age} days ago</strong>
                        </div>
                      </div>

                      <div
                        className={`find-inspector-result ${
                          scenario.matches(FILES[activeIndex])
                            ? "success"
                            : "failure"
                        }`}
                      >
                        {scenario.matches(FILES[activeIndex])
                          ? "✓ MATCH — Added to results"
                          : "✕ NO MATCH — Skipped"}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="find-explanation">
                <span>HOW IT WORKS</span>
                <p>{scenario.explanation}</p>
                <div className="find-tip">
                  <strong>RHCSA TIP</strong>
                  <p>{scenario.tip}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="find-terminal-section">
            <Terminal
              command={scenario.command}
              matches={scenario.matches}
              activeIndex={activeIndex}
            />
          </div>

          <div className="find-controls">
            <button className="find-play" onClick={togglePlayback}>
              {running ? "Ⅱ Pause" : "▶ Play"}
            </button>

            <button
              onClick={() => {
                setRunning(false);
                setActiveIndex((current) => Math.max(-1, current - 1));
              }}
              disabled={activeIndex < 0}
            >
              ← Previous
            </button>

            <button
              onClick={() => {
                setRunning(false);
                setActiveIndex((current) =>
                  Math.min(FILES.length - 1, current + 1)
                );
              }}
              disabled={activeIndex >= FILES.length - 1}
            >
              Next →
            </button>

            <div className="find-control-spacer" />

            <span>Speed</span>

            <select
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            >
              {[0.5, 1, 1.5, 2, 3].map((value) => (
                <option key={value} value={value}>
                  {value}×
                </option>
              ))}
            </select>

            <button onClick={reset}>↺ Reset</button>
          </div>

          <div className="find-progress">
            <div style={{ width: `${progress}%` }} />
          </div>

          <div className="find-statistics">
            <div>
              <span>SCANNED</span>
              <strong>{visited}/{FILES.length}</strong>
            </div>
            <div>
              <span>MATCHES</span>
              <strong>{matches.length}</strong>
            </div>
            <div>
              <span>FILTER</span>
              <strong>{scenario.label}</strong>
            </div>
          </div>
        </section>

        <FindCheatsheet />

        <footer className="find-footer">
          RHCSA Visual Lab · Linux filesystem search
        </footer>
      </div>
    </main>
  );
}
