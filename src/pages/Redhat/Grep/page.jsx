import { useEffect, useMemo, useState } from "react";
import "./page.css";
export const metadata = {
  title: "GREP — Interactive Visual Lab",
  category: "RHCSA",
  description:
    "Interactive grep laboratory with animated terminal, pattern matching, regular expressions, and RHCSA scenarios.",
  keywords: [
    "Linux", "RHEL", "RHCSA", "grep", "egrep",
    "regex", "regular expressions", "grep -i",
    "grep -v", "grep -n", "grep -r", "grep -E",
    "grep -c", "grep -w", "grep -o", "text processing"
  ],
  created: "2026-10-11",
};
const FILES = {
  "/var/log/app.log": [
    "2026-10-11 08:00:01 INFO Application started",
    "2026-10-11 08:02:14 INFO Database connected",
    "2026-10-11 08:05:33 ERROR Connection timeout",
    "2026-10-11 08:06:01 WARN Retrying connection",
    "2026-10-11 08:06:05 ERROR Authentication failed",
    "2026-10-11 08:07:10 INFO Connection restored",
    "2026-10-11 08:09:22 error lowercase message",
    "2026-10-11 08:12:44 ERROR Disk space low",
    "2026-10-11 08:15:00 INFO Backup completed",
  ],
  "/etc/passwd": [
    "root:x:0:0:root:/root:/bin/bash",
    "daemon:x:2:2:daemon:/sbin:/sbin/nologin",
    "developer:x:1001:1001:Developer:/home/developer:/bin/bash",
    "analyst:x:1002:1002:Analyst:/home/analyst:/bin/bash",
    "backup:x:1003:1003:Backup:/home/backup:/sbin/nologin",
    "operator:x:1004:1004:Operator:/home/operator:/bin/bash",
    "support:x:1005:1005:Support:/home/support:/bin/bash",
  ],
  "/etc/ssh/sshd_config": [
    "# OpenSSH server configuration",
    "Port 22",
    "PermitRootLogin no",
    "PasswordAuthentication yes",
    "PubkeyAuthentication yes",
    "X11Forwarding no",
    "# PasswordAuthentication no",
    "ClientAliveInterval 300",
  ],
  "/var/log/security.log": [
    "INFO sshd started",
    "ERROR Failed password for root",
    "WARN Invalid user admin",
    "ERROR Failed password for developer",
    "INFO Accepted publickey for operator",
    "WARN Failed login attempt",
  ],
  "/home/developer/notes.txt": [
    "Linux is a powerful operating system",
    "RHEL is used in enterprise environments",
    "grep searches text using patterns",
    "GREP can ignore case with -i",
    "The developer studies RHCSA",
    "Linux permissions protect files",
    "Linux and RHEL are important topics",
  ],
};
const SCENARIOS = [
  {
    id: "basic",
    label: "Basic search",
    title: "Find lines containing ERROR",
    command: "grep 'ERROR' /var/log/app.log",
    file: "/var/log/app.log",
    pattern: "ERROR",
    flags: "",
    description: "Search a log file for lines containing ERROR.",
    explanation:
      "grep prints every line containing the specified pattern.",
    tip: "By default, grep is case-sensitive.",
  },
  {
    id: "ignorecase",
    label: "Ignore case",
    title: "Find ERROR regardless of case",
    command: "grep -i 'error' /var/log/app.log",
    file: "/var/log/app.log",
    pattern: "error",
    flags: "i",
    description:
      "Match ERROR, error, Error, and other capitalization variants.",
    explanation:
      "-i ignores uppercase and lowercase differences.",
    tip: "Use grep -i when capitalization should not affect the result.",
  },
  {
    id: "invert",
    label: "Invert match",
    title: "Exclude INFO lines",
    command: "grep -v 'INFO' /var/log/app.log",
    file: "/var/log/app.log",
    pattern: "INFO",
    flags: "v",
    description:
      "Display every line that does not contain INFO.",
    explanation:
      "-v reverses the match and selects nonmatching lines.",
    tip: "grep -v '^#' can exclude comment lines.",
  },
  {
    id: "numbers",
    label: "Line numbers",
    title: "Display matching line numbers",
    command: "grep -n 'ERROR' /var/log/app.log",
    file: "/var/log/app.log",
    pattern: "ERROR",
    flags: "n",
    description:
      "Display the line number before each matching result.",
    explanation:
      "-n prefixes matching lines with their original line numbers.",
    tip: "Line numbers are useful when troubleshooting configuration files.",
  },
  {
    id: "count",
    label: "Count",
    title: "Count matching lines",
    command: "grep -c 'ERROR' /var/log/app.log",
    file: "/var/log/app.log",
    pattern: "ERROR",
    flags: "c",
    description:
      "Count how many lines contain ERROR.",
    explanation:
      "-c prints the number of matching lines, not the lines themselves.",
    tip: "grep -c counts matching lines, not total occurrences.",
  },
  {
    id: "regex",
    label: "Regex",
    title: "Find ERROR or WARN",
    command: "grep -E 'ERROR|WARN' /var/log/app.log",
    file: "/var/log/app.log",
    pattern: "ERROR|WARN",
    flags: "E",
    description:
      "Use extended regular expressions to match multiple alternatives.",
    explanation:
      "-E enables extended regex. The | symbol means OR.",
    tip: "grep -E replaces the need for the older egrep command.",
  },
  {
    id: "passwd",
    label: "Users",
    title: "Find accounts using Bash",
    command: "grep '/bin/bash$' /etc/passwd",
    file: "/etc/passwd",
    pattern: "/bin/bash$",
    flags: "",
    description:
      "Find user accounts whose login shell ends with /bin/bash.",
    explanation:
      "$ anchors the match to the end of a line.",
    tip: "In /etc/passwd, the last colon-separated field contains the login shell.",
  },
  {
    id: "comments",
    label: "Comments",
    title: "Exclude commented SSH settings",
    command: "grep -v '^#' /etc/ssh/sshd_config",
    file: "/etc/ssh/sshd_config",
    pattern: "^#",
    flags: "v",
    description:
      "Display lines that do not start with #.",
    explanation:
      "^ anchors a pattern to the beginning of a line. -v excludes matches.",
    tip: "To exclude blank lines too, use grep -Ev '^[[:space:]]*(#|$)'.",
  },
  {
    id: "whole",
    label: "Whole word",
    title: "Match Linux as a whole word",
    command: "grep -w 'Linux' /home/developer/notes.txt",
    file: "/home/developer/notes.txt",
    pattern: "Linux",
    flags: "w",
    description:
      "Match the complete word Linux rather than a substring.",
    explanation:
      "-w requires word boundaries around the matched text.",
    tip: "grep -w 'root' will not match the word rootless.",
  },
  {
    id: "only",
    label: "Only match",
    title: "Print only matched words",
    command: "grep -o 'Linux' /home/developer/notes.txt",
    file: "/home/developer/notes.txt",
    pattern: "Linux",
    flags: "o",
    description:
      "Display only the matched text rather than entire lines.",
    explanation:
      "-o prints each nonempty matching occurrence separately.",
    tip: "A single line can produce multiple outputs with grep -o.",
  },
];
const FLAG_INFO = [
  ["-i", "Ignore case", "Match regardless of capitalization"],
  ["-v", "Invert", "Select lines that do not match"],
  ["-n", "Line numbers", "Show original line numbers"],
  ["-c", "Count", "Count matching lines"],
  ["-E", "Extended regex", "Enable patterns such as ERROR|WARN"],
  ["-w", "Whole word", "Match complete words"],
  ["-o", "Only matching", "Print only matching portions"],
  ["-r", "Recursive", "Search files under directories"],
  ["-l", "Files with matches", "Print matching filenames"],
  ["-q", "Quiet", "Suppress output; use exit status"],
];
function createRegex(pattern, flags) {
  try {
    return new RegExp(pattern, flags.includes("i") ? "gi" : "g");
  } catch {
    return null;
  }
}
function getMatches(line, regex, wholeWord) {
  if (!regex) return [];
  const results = [];
  regex.lastIndex = 0;
  let match;
  while ((match = regex.exec(line)) !== null) {
    if (!match[0].length) {
      regex.lastIndex++;
      continue;
    }
    const start = match.index;
    const end = start + match[0].length;
    if (wholeWord) {
      const before = start === 0 ? "" : line[start - 1];
      const after = end >= line.length ? "" : line[end];
      const isWord = (character) => /[A-Za-z0-9_]/.test(character);
      if (isWord(before) || isWord(after)) {
        continue;
      }
    }
    results.push({ start, end, text: match[0] });
  }
  return results;
}
function analyzeLines(lines, pattern, flags) {
  const regex = createRegex(pattern, flags);
  if (!regex) {
    return { valid: false, rows: [], count: 0, output: [] };
  }
  const rows = lines.map((text, index) => {
    const matches = getMatches(text, regex, flags.includes("w"));
    const selected = flags.includes("v")
      ? matches.length === 0
      : matches.length > 0;
    return {
      text,
      lineNumber: index + 1,
      matches,
      selected,
    };
  });
  const selected = rows.filter((row) => row.selected);
  let output;
  if (flags.includes("c")) {
    output = [String(selected.length)];
  } else if (flags.includes("o") && !flags.includes("v")) {
    output = selected.flatMap((row) =>
      row.matches.map((match) =>
        flags.includes("n")
          ? `${row.lineNumber}:${match.text}`
          : match.text
      )
    );
  } else {
    output = selected.map((row) =>
      flags.includes("n")
        ? `${row.lineNumber}:${row.text}`
        : row.text
    );
  }
  return {
    valid: true,
    rows,
    count: selected.length,
    output,
  };
}
function HighlightLine({ text, matches, selected, invert }) {
  if (!selected || invert || matches.length === 0) {
    return <span>{text}</span>;
  }
  const fragments = [];
  let last = 0;
  matches.forEach((match, index) => {
    if (match.start > last) {
      fragments.push(
        <span key={`before-${index}`}>
          {text.slice(last, match.start)}
        </span>
      );
    }
    fragments.push(
      <mark key={`match-${index}`} className="grep-highlight">
        {text.slice(match.start, match.end)}
      </mark>
    );
    last = match.end;
  });
  if (last < text.length) {
    fragments.push(<span key="end">{text.slice(last)}</span>);
  }
  return <>{fragments}</>;
}
function FileInspector({ file, analysis, activeIndex, running }) {
  const lines = FILES[file] || [];
  return (
    <div className="grep-file-panel">
      <div className="grep-panel-heading">
        <div>
          <span className="grep-panel-kicker">SOURCE FILE</span>
          <strong>{file}</strong>
        </div>
        <span className="grep-file-count">
          {lines.length} LINES
        </span>
      </div>
      <div className="grep-file-lines">
        {analysis.rows.map((row, index) => {
          const visited = index <= activeIndex;
          const active = index === activeIndex;
          const matched = visited && row.selected;
          return (
            <div
              key={row.lineNumber}
              className={[
                "grep-file-line",
                active ? "active" : "",
                matched ? "matched" : "",
                visited && !row.selected ? "skipped" : "",
              ].join(" ")}
            >
              <span className="grep-line-number">
                {String(row.lineNumber).padStart(2, "0")}
              </span>
              <span className="grep-line-content">
                <HighlightLine
                  text={row.text}
                  matches={row.matches}
                  selected={matched}
                  invert={analysis.flags?.includes("v")}
                />
              </span>
              <span className="grep-line-status">
                {active && running
                  ? "SCANNING"
                  : matched
                    ? "MATCH"
                    : visited
                      ? "SKIP"
                      : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function AnimatedTerminal({
  scenario,
  analysis,
  activeIndex,
  running,
  speed,
}) {
  const [typed, setTyped] = useState(0);
  const command = scenario.command;
  useEffect(() => {
    if (!running || typed >= command.length) return;
    const timer = setTimeout(() => {
      setTyped((value) => Math.min(command.length, value + 1));
    }, Math.max(8, 48 / speed));
    return () => clearTimeout(timer);
  }, [running, typed, command, speed]);
  const commandComplete = typed >= command.length;
  const visibleRows = analysis.rows
    .filter((row, index) => index <= activeIndex && row.selected);
  let visibleOutput;
  if (!commandComplete) {
    visibleOutput = [];
  } else if (scenario.flags.includes("c")) {
    visibleOutput =
      activeIndex >= analysis.rows.length - 1
        ? [String(visibleRows.length)]
        : [];
  } else if (
    scenario.flags.includes("o") &&
    !scenario.flags.includes("v")
  ) {
    visibleOutput = visibleRows.flatMap((row) =>
      row.matches.map((match) =>
        scenario.flags.includes("n")
          ? `${row.lineNumber}:${match.text}`
          : match.text
      )
    );
  } else {
    visibleOutput = visibleRows.map((row) =>
      scenario.flags.includes("n")
        ? `${row.lineNumber}:${row.text}`
        : row.text
    );
  }
  return (
    <div className="grep-terminal">
      <div className="grep-terminal-header">
        <span>
          <i />
          root@rhcsa-server
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(command)}
        >
          Copy
        </button>
      </div>
      <div className="grep-terminal-body">
        <div className="grep-terminal-command">
          <span className="grep-prompt"># </span>
          <span>{command.slice(0, typed)}</span>
          {!commandComplete && (
            <span className="grep-cursor">▋</span>
          )}
        </div>
        {commandComplete && (
          <div className="grep-terminal-results">
            {visibleOutput.map((line, index) => (
              <div className="grep-output-line" key={`${index}-${line}`}>
                {line}
              </div>
            ))}
            {activeIndex >= analysis.rows.length - 1 && (
              <div className="grep-terminal-finished">
                <span className="grep-prompt"># </span>
                <span className="grep-cursor">▋</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="grep-terminal-footer">
        SIMULATED TERMINAL · NO COMMANDS EXECUTED
      </div>
    </div>
  );
}
function GrepCalculator() {
  const [file, setFile] = useState("/var/log/app.log");
  const [pattern, setPattern] = useState("ERROR");
  const [flags, setFlags] = useState([]);
  const [customText, setCustomText] = useState("");
  const useCustom = file === "custom";
  const lines = useMemo(
    () => useCustom
      ? customText.split("\n")
      : FILES[file] || [],
    [file, useCustom, customText]
  );
  const flagString = flags.join("");
  const analysis = useMemo(
    () => analyzeLines(lines, pattern, flagString),
    [lines, pattern, flagString]
  );
  const command = `grep ${flags.length ? `-${flagString} ` : ""}'${pattern.replace(/'/g, "'\\''")}' ${useCustom ? "custom.txt" : file}`;
  function toggleFlag(flag) {
    setFlags((current) =>
      current.includes(flag)
        ? current.filter((item) => item !== flag)
        : [...current, flag]
    );
  }
  return (
    <section className="grep-calculator">
      <div className="grep-section-heading">
        <span>INTERACTIVE TOOL</span>
        <h2>Grep Pattern Tester</h2>
        <p>
          Select a file, write a search pattern, and inspect the
          resulting matches instantly.
        </p>
      </div>
      <div className="grep-calculator-grid">
        <div className="grep-form-group">
          <label>FILE</label>
          <select
            value={file}
            onChange={(event) => setFile(event.target.value)}
          >
            {Object.keys(FILES).map((path) => (
              <option key={path} value={path}>
                {path}
              </option>
            ))}
            <option value="custom">Custom text</option>
          </select>
        </div>
        <div className="grep-form-group">
          <label>SEARCH PATTERN</label>
          <input
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            placeholder="Enter a regex pattern"
            spellCheck={false}
          />
        </div>
      </div>
      {useCustom && (
        <div className="grep-form-group grep-custom-text">
          <label>CUSTOM FILE CONTENT</label>
          <textarea
            value={customText}
            onChange={(event) => setCustomText(event.target.value)}
            placeholder={"ERROR Connection failed\nINFO Service started"}
            rows={7}
            spellCheck={false}
          />
        </div>
      )}
      <div className="grep-flag-controls">
        <span>OPTIONS</span>
        <div>
          {FLAG_INFO.filter(([flag]) =>
            ["-i", "-v", "-n", "-c", "-E", "-w", "-o"].includes(flag)
          ).map(([flag, label]) => (
            <button
              key={flag}
              className={flags.includes(flag.slice(1)) ? "active" : ""}
              onClick={() => toggleFlag(flag.slice(1))}
              title={label}
            >
              {flag}
            </button>
          ))}
        </div>
      </div>
      <div className="grep-command-preview">
        <div>
          <span>GENERATED COMMAND</span>
          <button onClick={() => navigator.clipboard.writeText(command)}>
            Copy
          </button>
        </div>
        <code>{command}</code>
      </div>
      {!analysis.valid ? (
        <div className="grep-invalid">
          Invalid regular expression. Check your search pattern.
        </div>
      ) : (
        <div className="grep-calculator-results">
          <div className="grep-panel-heading">
            <div>
              <span className="grep-panel-kicker">MATCH RESULTS</span>
              <strong>{analysis.count} matching lines</strong>
            </div>
          </div>
          <div className="grep-calculator-output">
            {analysis.output.length ? (
              analysis.output.map((line, index) => (
                <div key={index}>{line}</div>
              ))
            ) : (
              <span className="grep-no-results">
                No matching results.
              </span>
            )}
          </div>
        </div>
      )}
      <div className="grep-regex-reference">
        {[
          [".", "Any character"],
          ["^", "Start of line"],
          ["$", "End of line"],
          ["*", "Zero or more"],
          ["+", "One or more (-E)"],
          ["|", "OR (-E)"],
          ["[abc]", "Character class"],
          ["[0-9]", "Digit range"],
        ].map(([symbol, meaning]) => (
          <div key={symbol}>
            <code>{symbol}</code>
            <span>{meaning}</span>
          </div>
        ))}
      </div>
      <div className="grep-important-note">
        <strong>RHCSA reminder</strong>
        <p>
          This is a browser-based learning simulator. It uses
          JavaScript regular expressions, which are not identical
          to GNU grep's basic and extended regex engines.
          Verify advanced patterns on your RHEL system.
        </p>
      </div>
    </section>
  );
}
function GrepCheatsheet() {
  const commands = [
    ["Basic search", "grep 'ERROR' /var/log/app.log"],
    ["Ignore case", "grep -i 'error' /var/log/app.log"],
    ["Invert match", "grep -v 'INFO' /var/log/app.log"],
    ["Show line numbers", "grep -n 'ERROR' /var/log/app.log"],
    ["Count matching lines", "grep -c 'ERROR' /var/log/app.log"],
    ["Extended regex", "grep -E 'ERROR|WARN' /var/log/app.log"],
    ["Whole word", "grep -w 'Linux' notes.txt"],
    ["Only matches", "grep -o 'Linux' notes.txt"],
    ["Recursive search", "grep -r 'PermitRootLogin' /etc/ssh/"],
    ["Files with matches", "grep -rl 'ERROR' /var/log/"],
    ["Exclude comments", "grep -v '^#' /etc/ssh/sshd_config"],
    ["Exclude blank lines", "grep -Ev '^[[:space:]]*(#|$)' /etc/ssh/sshd_config"],
    ["Bash login shells", "grep '/bin/bash$' /etc/passwd"],
    ["Multiple patterns", "grep -e 'ERROR' -e 'WARN' app.log"],
  ];
  return (
    <section className="grep-cheatsheet">
      <div className="grep-section-heading">
        <span>RHCSA REFERENCE</span>
        <h2>Grep Command Reference</h2>
        <p>
          Useful commands for filtering logs, searching configuration
          files, and troubleshooting Linux systems.
        </p>
      </div>
      <div className="grep-command-list">
        {commands.map(([label, command]) => (
          <div className="grep-command-row" key={label}>
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
export default function GrepVisualLab() {
  const [scenarioId, setScenarioId] = useState("basic");
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [resetKey, setResetKey] = useState(0);
  const scenario = SCENARIOS.find(
    (item) => item.id === scenarioId
  );
  const lines = FILES[scenario.file];
  const analysis = useMemo(() => {
    const result = analyzeLines(
      lines,
      scenario.pattern,
      scenario.flags
    );
    return {
      ...result,
      flags: scenario.flags,
    };
  }, [lines, scenario.pattern, scenario.flags]);
  useEffect(() => {
    if (!running || activeIndex >= lines.length - 1) return;
    const timer = setInterval(() => {
      setActiveIndex((current) =>
        Math.min(lines.length - 1, current + 1)
      );
    }, Math.max(100, 650 / speed));
    return () => clearInterval(timer);
  }, [running, activeIndex, lines.length, speed]);
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
      Math.max(-1, Math.min(lines.length - 1, current + amount))
    );
  }
  const visited = Math.max(0, activeIndex + 1);
  const matches = analysis.rows
    .slice(0, visited)
    .filter((row) => row.selected).length;
  return (
    <main className="grep-study-page">
      <div className="grep-content">
        <header className="grep-page-header">
          <span className="grep-eyebrow">
            RHCSA / RHEL · INTERACTIVE LAB
          </span>
          <h1>Search Linux with Grep.</h1>
          <p>
            Learn how grep scans files, evaluates patterns, and
            filters command output through an animated terminal.
          </p>
        </header>
        <section className="grep-simulator">
          <div className="grep-simulator-header">
            <div>
              <span>INTERACTIVE SEARCH ENGINE</span>
              <h2>Grep Execution Simulator</h2>
            </div>
            <span className="grep-live-label">
              {running ? "● SCANNING" : "● READY"}
            </span>
          </div>
          <div className="grep-scenario-tabs">
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
          <div className="grep-objective">
            <span>SCENARIO</span>
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
          </div>
          <div className="grep-main-grid">
            <FileInspector
              file={scenario.file}
              analysis={analysis}
              activeIndex={activeIndex}
              running={running}
            />
            <div className="grep-inspector">
              <div className="grep-panel-heading">
                <div>
                  <span className="grep-panel-kicker">
                    PATTERN INSPECTOR
                  </span>
                  <strong>Match evaluation</strong>
                </div>
              </div>
              <div className="grep-pattern-display">
                <span>SEARCH PATTERN</span>
                <strong>{scenario.pattern}</strong>
              </div>
              <div className="grep-inspector-stats">
                <div>
                  <span>LINES SCANNED</span>
                  <strong>{visited}</strong>
                </div>
                <div>
                  <span>LINES MATCHED</span>
                  <strong>{matches}</strong>
                </div>
                <div>
                  <span>TOTAL LINES</span>
                  <strong>{lines.length}</strong>
                </div>
              </div>
              <div className="grep-inspector-explanation">
                <span>HOW IT WORKS</span>
                <p>{scenario.explanation}</p>
              </div>
              <div className="grep-inspector-tip">
                <strong>RHCSA TIP</strong>
                <p>{scenario.tip}</p>
              </div>
            </div>
          </div>
          <div className="grep-terminal-section">
            <AnimatedTerminal
              key={`${scenarioId}-${resetKey}`}
              scenario={scenario}
              analysis={analysis}
              activeIndex={activeIndex}
              running={running}
              speed={speed}
            />
          </div>
          <div className="grep-controls">
            <button
              className="grep-play"
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
            <div className="grep-control-spacer" />
            <span>Speed</span>
            <select
              value={speed}
              onChange={(event) =>
                setSpeed(Number(event.target.value))
              }
            >
              {[0.5, 1, 2, 3, 5, 10].map((value) => (
                <option key={value} value={value}>
                  {value}×
                </option>
              ))}
            </select>
            <button onClick={restart}>↺ Restart</button>
          </div>
          <div className="grep-progress">
            <div
              style={{
                width: `${(visited / lines.length) * 100}%`,
              }}
            />
          </div>
          <div className="grep-statistics">
            <div>
              <span>SCANNED</span>
              <strong>{visited}</strong>
            </div>
            <div>
              <span>MATCHED</span>
              <strong>{matches}</strong>
            </div>
            <div>
              <span>REMAINING</span>
              <strong>{lines.length - visited}</strong>
            </div>
          </div>
        </section>
        <GrepCalculator />
        <GrepCheatsheet />
        <footer className="grep-footer">
          RHCSA Visual Lab · Linux text processing · GREP
        </footer>
      </div>
    </main>
  );
}