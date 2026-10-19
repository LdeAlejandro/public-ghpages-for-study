
import { useEffect, useMemo, useRef, useState } from "react";
import "./page.css";

export const metadata = {
  title: "NICE & RENICE — Interactive Visual Lab",
  category: "RHCSA",
  description:
    "Interactive Linux process priority laboratory with CPU scheduling simulation, animated terminal, nice and renice commands, and a priority calculator.",
  keywords: [
    "Linux", "RHEL", "RHCSA", "nice", "renice",
    "process priority", "CPU scheduling", "NI", "PR",
    "top", "ps", "PID", "process management",
  ],
  created: "2026-10-11",
};

const SPEEDS = [0.5, 1, 2, 3, 5, 10];

const INITIAL = [
  { pid: 1201, name: "backup.sh", user: "root", nice: 0, color: "#60a5fa" },
  { pid: 1202, name: "compression", user: "developer", nice: 10, color: "#a78bfa" },
  { pid: 1203, name: "database", user: "root", nice: -5, color: "#2dd4bf" },
  { pid: 1204, name: "report.sh", user: "analyst", nice: 15, color: "#fbbf24" },
];

const SCENARIOS = [
  {
    id: "default",
    label: "Default NI",
    title: "Inspect the default nice value",
    command: "ps -o pid,ni,comm -p 1201",
    description: "Inspect the nice value of a running process.",
    explanation: "Most normal processes start with nice 0 unless they inherit a different value.",
    tip: "NI 0 is the usual default. The allowed nice range is -20 to +19.",
    action: "inspect-one",
    pid: 1201,
  },
  {
    id: "nice10",
    label: "nice +10",
    title: "Start a process with reduced CPU priority",
    command: "nice -n 10 yes > /dev/null &",
    description: "Launch a new process with nice +10.",
    explanation: "A higher nice value means lower relative CPU scheduling weight.",
    tip: "nice changes the initial priority of a new command.",
    action: "nice",
    pid: 1202,
    value: 10,
  },
  {
    id: "nice19",
    label: "nice +19",
    title: "Start a low-priority background process",
    command: "nice -n 19 yes > /dev/null &",
    description: "Start a CPU-bound process with nice +19.",
    explanation: "Nice +19 gives a process the lowest weight within the normal nice range.",
    tip: "A nice +19 process still runs when CPU time is available.",
    action: "nice",
    pid: 1202,
    value: 19,
  },
  {
    id: "niceNegative",
    label: "nice -10",
    title: "Start a higher-priority process",
    command: "nice -n -10 yes > /dev/null &",
    description: "Run a process with increased CPU scheduling priority.",
    explanation: "Negative nice values increase scheduling weight and usually require elevated privileges.",
    tip: "Root or a process with CAP_SYS_NICE can normally raise scheduling priority.",
    action: "nice",
    pid: 1203,
    value: -10,
  },
  {
    id: "renice10",
    label: "renice +10",
    title: "Reduce the priority of an existing process",
    command: "renice -n 10 -p 1201",
    description: "Change the nice value of PID 1201 to +10.",
    explanation: "renice changes the priority of an already-running process.",
    tip: "Use renice -n VALUE -p PID.",
    action: "renice",
    pid: 1201,
    value: 10,
  },
  {
    id: "reniceNegative",
    label: "renice -5",
    title: "Increase the priority of an existing process",
    command: "renice -n -5 -p 1202",
    description: "Change PID 1202 to nice -5.",
    explanation: "Lowering the nice value increases relative scheduling weight.",
    tip: "Reducing the nice value normally requires elevated privileges.",
    action: "renice",
    pid: 1202,
    value: -5,
  },
  {
    id: "ps",
    label: "ps",
    title: "Inspect process scheduling information",
    command: "ps -eo pid,user,ni,pri,comm --sort=ni",
    description: "List processes ordered by their nice values.",
    explanation: "ps displays scheduling information, including the nice value.",
    tip: "The PRI field in ps is not necessarily identical to the PR field in top.",
    action: "ps",
  },
  {
    id: "top",
    label: "top",
    title: "Inspect processes using top",
    command: "top -b -n 1",
    description: "View process priorities and simulated CPU usage.",
    explanation: "top displays NI, PR, PID and CPU utilization.",
    tip: "In interactive top, press r to change the nice value of a process.",
    action: "top",
  },
];

const EXERCISES = [
  {
    question: "Start a command with nice +15.",
    answer: "nice -n 15 ./backup.sh",
    explanation: "nice -n 15 starts the command with a lower scheduling weight.",
  },
  {
    question: "Change PID 2500 to nice +10.",
    answer: "renice -n 10 -p 2500",
    explanation: "renice modifies an existing process by PID.",
  },
  {
    question: "Display the nice value of PID 1201.",
    answer: "ps -o pid,ni,comm -p 1201",
    explanation: "ps -o selects specific output columns.",
  },
  {
    question: "Which nice value has greater CPU scheduling weight: -10 or +10?",
    answer: "-10",
    explanation: "Lower nice values have greater relative scheduling weight.",
  },
];

function clamp(value) {
  return Math.max(-20, Math.min(19, Number(value) || 0));
}

function weight(nice) {
  return 1024 * Math.pow(1.25, -nice);
}

function getShares(processes) {
  const total = processes.reduce((sum, p) => sum + weight(p.nice), 0);
  return processes.map((p) => ({
    ...p,
    share: (weight(p.nice) / total) * 100,
  }));
}

function priorityColor(nice) {
  if (nice < 0) return "#2dd4bf";
  if (nice > 0) return "#fbbf24";
  return "#60a5fa";
}

function ProcessTable({ processes, activePid }) {
  return (
    <div className="nr-panel">
      <div className="nr-panel-head">
        <div>
          <span>PROCESS MONITOR</span>
          <strong>Running Processes</strong>
        </div>
        <small>SIMULATED</small>
      </div>

      <div className="nr-table-wrap">
        <table className="nr-table">
          <thead>
            <tr>
              <th>PID</th>
              <th>USER</th>
              <th>COMMAND</th>
              <th>NI</th>
              <th>PR*</th>
              <th>CPU SHARE</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.pid} className={activePid === p.pid ? "active" : ""}>
                <td>{p.pid}</td>
                <td>{p.user}</td>
                <td>{p.name}</td>
                <td>
                  <strong style={{ color: priorityColor(p.nice) }}>
                    {p.nice > 0 ? `+${p.nice}` : p.nice}
                  </strong>
                </td>
                <td>{20 + p.nice}</td>
                <td>
                  <div className="nr-table-share">
                    <div className="nr-mini-track">
                      <div
                        style={{
                          width: `${p.share}%`,
                          background: p.color,
                        }}
                      />
                    </div>
                    <span>{p.share.toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="nr-footnote">
        * PR is a simplified top-style value for normal scheduling.
        CPU shares are theoretical estimates for equally CPU-bound tasks.
      </p>
    </div>
  );
}

function Scheduler({ processes, tick }) {
  return (
    <div className="nr-panel">
      <div className="nr-panel-head">
        <div>
          <span>CPU SCHEDULER</span>
          <strong>Relative CPU Distribution</strong>
        </div>
        <small>TICK {tick}</small>
      </div>

      <div className="nr-scheduler">
        <div className="nr-cpu-visual">
          <div className="nr-cpu-chip">
            <span>CPU</span>
            <strong>CORE 0</strong>
            <small>CONTENDED</small>
          </div>
          <div className="nr-cpu-pulse" />
        </div>

        <div className="nr-scheduler-bars">
          {processes.map((p) => (
            <div className="nr-scheduler-row" key={p.pid}>
              <div className="nr-bar-head">
                <span>{p.name}</span>
                <strong>{p.share.toFixed(1)}%</strong>
              </div>
              <div className="nr-bar-track">
                <div
                  className="nr-bar-fill"
                  style={{
                    width: `${p.share}%`,
                    background: p.color,
                  }}
                />
              </div>
              <div className="nr-bar-meta">
                <span>PID {p.pid}</span>
                <span>NI {p.nice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="nr-scheduler-note">
        These values illustrate relative scheduling weights, not
        measured CPU utilization. Actual CPU time also depends on
        runnable tasks, affinity, cgroups and the Linux scheduler.
      </div>
    </div>
  );
}

function AnimatedTerminal({
  scenario,
  processes,
  running,
  speed,
  onFinish,
}) {
  const [typed, setTyped] = useState(0);
  const [outputVisible, setOutputVisible] = useState(0);
  const finished = useRef(false);
  const bottom = useRef(null);

  const command = scenario.command;

  const output = useMemo(() => {
    if (scenario.action === "inspect-one") {
      const p = processes.find((item) => item.pid === scenario.pid);
      return [
        "PID    NI  COMMAND",
        `${p.pid}  ${String(p.nice).padStart(4)}  ${p.name}`,
      ];
    }

    if (scenario.action === "ps") {
      return [
        "PID    USER         NI   PRI  COMMAND",
        ...[...processes]
          .sort((a, b) => a.nice - b.nice)
          .map(
            (p) =>
              `${String(p.pid).padEnd(6)} ` +
              `${p.user.padEnd(12)} ` +
              `${String(p.nice).padEnd(4)} ` +
              `${String(20 + p.nice).padEnd(4)} ${p.name}`
          ),
      ];
    }

    if (scenario.action === "top") {
      return [
        "top - 07:00:00 up 1 day, 4 users",
        "Tasks: 4 total, 4 running, 0 sleeping",
        "",
        "PID    USER         PR   NI   %CPU   COMMAND",
        ...processes.map(
          (p) =>
            `${String(p.pid).padEnd(6)} ` +
            `${p.user.padEnd(12)} ` +
            `${String(20 + p.nice).padEnd(4)} ` +
            `${String(p.nice).padEnd(4)} ` +
            `${p.share.toFixed(1).padEnd(6)} ${p.name}`
        ),
      ];
    }

    if (scenario.action === "renice") {
      const p = INITIAL.find((item) => item.pid === scenario.pid);
      return [
        `${scenario.pid} (${p.name}): old priority ${p.nice}, new priority ${scenario.value}`,
      ];
    }

    return [
      `[1] ${scenario.pid}`,
      `Process started with nice value ${scenario.value}`,
    ];
  }, [scenario, processes]);

  useEffect(() => {
    setTyped(0);
    setOutputVisible(0);
    finished.current = false;
  }, [scenario.id]);

  useEffect(() => {
    if (!running) return;

    if (typed < command.length) {
      const timer = setTimeout(() => {
        setTyped((n) => Math.min(command.length, n + 1));
      }, Math.max(8, 48 / speed));

      return () => clearTimeout(timer);
    }

    if (outputVisible < output.length) {
      const timer = setTimeout(() => {
        setOutputVisible((n) => n + 1);
      }, Math.max(60, 220 / speed));

      return () => clearTimeout(timer);
    }

    if (!finished.current) {
      finished.current = true;
      onFinish();
    }
  }, [
    running,
    typed,
    command,
    speed,
    outputVisible,
    output,
    onFinish,
  ]);

  useEffect(() => {
    bottom.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [typed, outputVisible]);

  return (
    <div className="nr-terminal">
      <div className="nr-terminal-head">
        <div className="nr-terminal-dots">
          <i />
          <i />
          <i />
        </div>
        <span>root@rhcsa-server:~</span>
        <button onClick={() => navigator.clipboard.writeText(command)}>
          Copy
        </button>
      </div>

      <div className="nr-terminal-body">
        <div>
          <span className="nr-prompt">root@rhcsa-server:~# </span>
          {command.slice(0, typed)}
          {typed < command.length && (
            <span className="nr-cursor">▋</span>
          )}
        </div>

        {typed >= command.length && (
          <div className="nr-terminal-output">
            {output.slice(0, outputVisible).map((line, index) => (
              <div key={index}>{line || "\u00a0"}</div>
            ))}

            {outputVisible === output.length && (
              <div className="nr-terminal-ready">
                <span className="nr-prompt">root@rhcsa-server:~# </span>
                <span className="nr-cursor">▋</span>
              </div>
            )}
          </div>
        )}

        <span ref={bottom} />
      </div>

      <div className="nr-terminal-footer">
        SIMULATED RHEL TERMINAL · NO COMMANDS EXECUTED
      </div>
    </div>
  );
}

function PriorityScale({ value }) {
  const position = ((value + 20) / 39) * 100;

  return (
    <div className="nr-scale">
      <div className="nr-scale-head">
        <span>HIGHER PRIORITY</span>
        <span>DEFAULT</span>
        <span>LOWER PRIORITY</span>
      </div>

      <div className="nr-scale-track">
        <div
          className="nr-scale-marker"
          style={{ left: `${position}%` }}
        />
      </div>

      <div className="nr-scale-bottom">
        <span>-20</span>
        <span>0</span>
        <span>+19</span>
      </div>
    </div>
  );
}

function Calculator() {
  const [nice, setNice] = useState(0);
  const [other, setOther] = useState(10);
  const [mode, setMode] = useState("nice");
  const [pid, setPid] = useState("1201");
  const [command, setCommand] = useState("./backup.sh");

  const firstWeight = weight(nice);
  const secondWeight = weight(other);
  const share = (firstWeight / (firstWeight + secondWeight)) * 100;

  const generated =
    mode === "nice"
      ? `nice -n ${nice} ${command}`
      : `renice -n ${nice} -p ${pid}`;

  return (
    <section className="nr-section">
      <div className="nr-section-heading">
        <span>INTERACTIVE RHCSA TOOL</span>
        <h2>Priority Calculator</h2>
        <p>
          Compare nice values, understand relative CPU scheduling
          weight and generate Linux commands.
        </p>
      </div>

      <div className="nr-calculator-grid">
        <div className="nr-calculator-card">
          <div className="nr-mode-switch">
            <button
              className={mode === "nice" ? "active" : ""}
              onClick={() => setMode("nice")}
            >
              nice · New process
            </button>
            <button
              className={mode === "renice" ? "active" : ""}
              onClick={() => setMode("renice")}
            >
              renice · Existing PID
            </button>
          </div>

          <div className="nr-slider-label">
            <span>SELECT NICE VALUE</span>
            <strong style={{ color: priorityColor(nice) }}>
              {nice > 0 ? `+${nice}` : nice}
            </strong>
          </div>

          <input
            className="nr-range"
            type="range"
            min="-20"
            max="19"
            value={nice}
            onChange={(e) => setNice(clamp(e.target.value))}
          />

          <PriorityScale value={nice} />

          <div className="nr-presets">
            {[-20, -10, -5, 0, 5, 10, 19].map((value) => (
              <button
                key={value}
                className={nice === value ? "active" : ""}
                onClick={() => setNice(value)}
              >
                {value > 0 ? `+${value}` : value}
              </button>
            ))}
          </div>

          <div className="nr-input-group">
            <label>{mode === "nice" ? "COMMAND" : "PROCESS PID"}</label>
            <input
              value={mode === "nice" ? command : pid}
              onChange={(e) =>
                mode === "nice"
                  ? setCommand(e.target.value)
                  : setPid(e.target.value)
              }
            />
          </div>

          <div className="nr-generated">
            <div>
              <span>GENERATED COMMAND</span>
              <button
                onClick={() => navigator.clipboard.writeText(generated)}
              >
                Copy
              </button>
            </div>
            <code>{generated}</code>
          </div>

          {nice < 0 && (
            <div className="nr-warning">
              Negative nice values generally require appropriate
              privileges, such as root or CAP_SYS_NICE.
            </div>
          )}
        </div>

        <div className="nr-calculator-card">
          <div className="nr-calculator-metrics">
            <div>
              <span>NICE VALUE</span>
              <strong>{nice}</strong>
            </div>
            <div>
              <span>TOP PR*</span>
              <strong>{20 + nice}</strong>
            </div>
            <div>
              <span>RELATIVE WEIGHT</span>
              <strong>{Math.round(firstWeight).toLocaleString()}</strong>
            </div>
          </div>

          <div className="nr-compare-heading">
            <h3>CPU Priority Comparison</h3>
            <p>
              Compare two equally CPU-bound processes competing
              on one CPU.
            </p>
          </div>

          <div className="nr-compare-controls">
            <label>SECOND PROCESS NICE VALUE</label>
            <input
              type="range"
              min="-20"
              max="19"
              value={other}
              onChange={(e) => setOther(clamp(e.target.value))}
            />
            <strong>{other > 0 ? `+${other}` : other}</strong>
          </div>

          <div className="nr-compare-bars">
            <div>
              <div className="nr-bar-head">
                <span>Process A · NI {nice}</span>
                <strong>{share.toFixed(1)}%</strong>
              </div>
              <div className="nr-bar-track">
                <div
                  className="nr-bar-fill"
                  style={{ width: `${share}%`, background: "#60a5fa" }}
                />
              </div>
            </div>

            <div>
              <div className="nr-bar-head">
                <span>Process B · NI {other}</span>
                <strong>{(100 - share).toFixed(1)}%</strong>
              </div>
              <div className="nr-bar-track">
                <div
                  className="nr-bar-fill"
                  style={{
                    width: `${100 - share}%`,
                    background: "#a78bfa",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="nr-info">
            A difference of one nice level corresponds to
            approximately a 1.25× difference in scheduling weight
            in this simplified model.
          </div>
        </div>
      </div>
    </section>
  );
}

function Practice() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);

  const exercise = EXERCISES[index];

  const normalize = (value) =>
    value.trim().replace(/\s+/g, " ").toLowerCase();

  const correct = normalize(answer) === normalize(exercise.answer);

  function next() {
    setIndex((current) => (current + 1) % EXERCISES.length);
    setAnswer("");
    setChecked(false);
  }

  return (
    <section className="nr-section">
      <div className="nr-section-heading">
        <span>RHCSA PRACTICE</span>
        <h2>Process Priority Challenges</h2>
        <p>
          Practice commands and concepts used in Linux process
          management.
        </p>
      </div>

      <div className="nr-practice">
        <div className="nr-practice-top">
          <span>CHALLENGE {index + 1} / {EXERCISES.length}</span>
          <div className="nr-practice-progress">
            <div
              style={{
                width: `${((index + 1) / EXERCISES.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <h3>{exercise.question}</h3>

        <div className="nr-practice-input">
          <span>$</span>
          <input
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setChecked(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") setChecked(true);
            }}
            placeholder="Enter your answer..."
            spellCheck={false}
          />
        </div>

        {checked && (
          <div className={`nr-feedback ${correct ? "correct" : "incorrect"}`}>
            <strong>{correct ? "Correct!" : "Review your answer"}</strong>
            <p>{exercise.explanation}</p>
            {!correct && <code>{exercise.answer}</code>}
          </div>
        )}

        <div className="nr-practice-actions">
          <button onClick={() => setChecked(true)}>Check Answer</button>
          <button onClick={next}>Next Challenge →</button>
        </div>
      </div>
    </section>
  );
}

function Cheatsheet() {
  const commands = [
    ["Start with nice +10", "nice -n 10 command"],
    ["Start with nice -5", "nice -n -5 command"],
    ["Change PID priority", "renice -n 10 -p 1234"],
    ["Increase PID priority", "renice -n -5 -p 1234"],
    ["Inspect nice value", "ps -o pid,ni,comm -p 1234"],
    ["List all process nice values", "ps -eo pid,user,ni,comm"],
    ["Sort by nice value", "ps -eo pid,ni,comm --sort=ni"],
    ["Interactive monitor", "top"],
    ["Batch top output", "top -b -n 1"],
    ["Show current shell nice", "ps -o ni= -p $$"],
    ["Inspect process limits", "ulimit -e"],
  ];

  return (
    <section className="nr-section">
      <div className="nr-section-heading">
        <span>RHCSA COMMAND REFERENCE</span>
        <h2>Nice & Renice Cheatsheet</h2>
        <p>
          Common commands for starting, modifying and inspecting
          process scheduling priorities.
        </p>
      </div>

      <div className="nr-cheatsheet">
        {commands.map(([label, command]) => (
          <div key={label} className="nr-cheat-row">
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

export default function NiceReniceLab() {
  const [scenarioId, setScenarioId] = useState("renice10");
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [tick, setTick] = useState(0);
  const [terminalKey, setTerminalKey] = useState(0);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId);

  const processes = useMemo(() => {
    const copy = INITIAL.map((p) => ({ ...p }));

    if (completed && scenario.value !== undefined) {
      const target = copy.find((p) => p.pid === scenario.pid);
      if (target) target.nice = scenario.value;
    }

    return getShares(copy);
  }, [scenario, completed]);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTick((current) => current + 1);
    }, Math.max(100, 500 / speed));

    return () => clearInterval(timer);
  }, [running, speed]);

  function selectScenario(id) {
    setScenarioId(id);
    setRunning(false);
    setCompleted(false);
    setTick(0);
    setTerminalKey((n) => n + 1);
  }

  function restart() {
    setRunning(false);
    setCompleted(false);
    setTick(0);
    setTerminalKey((n) => n + 1);
  }

  function handleFinish() {
    setCompleted(true);
    setRunning(false);
  }

  const active = processes.find((p) => p.pid === scenario.pid);

  return (
    <main className="nr-page">
      <div className="nr-content">
        <header className="nr-hero">
          <span>RHCSA / RHEL · INTERACTIVE LAB</span>
          <h1>Control Linux Process Priorities.</h1>
          <p>
            Explore nice and renice, understand CPU scheduling,
            monitor running processes and practice process
            management through interactive simulations.
          </p>
        </header>

        <section className="nr-simulator">
          <div className="nr-simulator-head">
            <div>
              <span>INTERACTIVE PROCESS PRIORITY EXPLORER</span>
              <h2>Nice & Renice Execution Simulator</h2>
            </div>
            <div className="nr-status">
              <i className={running ? "running" : ""} />
              {running ? "EXECUTING" : completed ? "COMPLETED" : "READY"}
            </div>
          </div>

          <div className="nr-tabs">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                className={scenarioId === s.id ? "active" : ""}
                onClick={() => selectScenario(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="nr-objective">
            <span>SCENARIO</span>
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
          </div>

          <div className="nr-main-grid">
            <ProcessTable processes={processes} activePid={scenario.pid} />
            <Scheduler processes={processes} tick={tick} />
          </div>

          <div className="nr-priority-overview">
            <div className="nr-overview-card">
              <span>NICE RANGE</span>
              <strong>-20 to +19</strong>
              <small>Lower = higher weight</small>
            </div>
            <div className="nr-overview-card">
              <span>DEFAULT NICE</span>
              <strong>0</strong>
              <small>Typical starting value</small>
            </div>
            <div className="nr-overview-card">
              <span>ACTIVE PROCESS</span>
              <strong>{active ? `PID ${active.pid}` : "ALL"}</strong>
              <small>{active?.name || "Process inspection"}</small>
            </div>
            <div className="nr-overview-card">
              <span>SCENARIO STATUS</span>
              <strong style={{ color: completed ? "#2dd4bf" : "#60a5fa" }}>
                {completed ? "APPLIED" : "PENDING"}
              </strong>
              <small>Simulation only</small>
            </div>
          </div>

          <div className="nr-explanation">
            <div>
              <span>HOW IT WORKS</span>
              <p>{scenario.explanation}</p>
            </div>
            <div>
              <span>RHCSA TIP</span>
              <p>{scenario.tip}</p>
            </div>
          </div>

          <div className="nr-terminal-area">
            <AnimatedTerminal
              key={terminalKey}
              scenario={scenario}
              processes={processes}
              running={running}
              speed={speed}
              onFinish={handleFinish}
            />
          </div>

          <div className="nr-controls">
            <button
              className="nr-play"
              onClick={() => {
                if (completed) {
                  restart();
                } else {
                  setRunning((value) => !value);
                }
              }}
            >
              {running ? "Ⅱ Pause" : completed ? "↺ Replay" : "▶ Play"}
            </button>

            <button onClick={restart}>↺ Restart</button>

            <div className="nr-controls-spacer" />

            <label>Playback speed</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              {SPEEDS.map((s) => (
                <option key={s} value={s}>
                  {s}×
                </option>
              ))}
            </select>
          </div>
        </section>

        <Calculator />
        <Practice />
        <Cheatsheet />

        <footer className="nr-footer">
          RHCSA Visual Lab · Process Scheduling · nice · renice
        </footer>
      </div>
    </main>
  );
}
