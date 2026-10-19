import { useEffect, useMemo, useRef, useState } from "react";
import "./page.css";

export const metadata = {
  title: "CRONTAB — Interactive Visual Lab",
  category: "RHCSA",
  description:
    "Interactive Linux cron laboratory with animated scheduling, terminal, execution workflow, expression calculator, and real-world use cases.",
  keywords: [
    "Linux", "RHEL", "RHCSA", "cron", "crontab", "crond",
    "scheduling", "automation", "cron expressions",
    "systemctl", "journalctl", "task scheduling",
  ],
  created: "2026-10-11",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SPEEDS = [0.5, 1, 2, 3, 5, 10];

const FIELDS = [
  { key: "minute", label: "MINUTE", range: "0–59", color: "#60a5fa", examples: ["*", "0", "15", "*/5", "*/15", "0,30"] },
  { key: "hour", label: "HOUR", range: "0–23", color: "#a78bfa", examples: ["*", "0", "2", "8-17", "*/2", "9,18"] },
  { key: "day", label: "DAY OF MONTH", range: "1–31", color: "#fbbf24", examples: ["*", "1", "15", "1,15", "1-5"] },
  { key: "month", label: "MONTH", range: "1–12", color: "#2dd4bf", examples: ["*", "1", "6", "12", "1-6"] },
  { key: "weekday", label: "DAY OF WEEK", range: "0–7", color: "#fb7185", examples: ["*", "0", "1-5", "6,0", "1,3,5"] },
];

const SCENARIOS = [
  {
    id: "every5",
    label: "Every 5 min",
    title: "Execute a task every five minutes",
    expression: "*/5 * * * *",
    command: "/usr/bin/logger 'cron-check'",
    user: "root",
    description: "Schedule a recurring command every five minutes.",
    explanation: "*/5 selects minutes 00, 05, 10, 15, and so on.",
    tip: "*/15 means every fifteen minutes. 15 means only minute 15.",
  },
  {
    id: "sunday",
    label: "Sunday 02:00",
    title: "Execute every Sunday at 02:00",
    expression: "0 2 * * 0",
    command: "/usr/bin/touch /root/cron-success",
    user: "root",
    description: "Create a marker file every Sunday at 02:00.",
    explanation: "Minute 0, hour 2, every month, Sunday.",
    tip: "Sunday can be represented by 0 or 7.",
  },
  {
    id: "weekdays",
    label: "Weekdays",
    title: "Execute Monday through Friday at 04:15",
    expression: "15 4 * * 1-5",
    command: "/usr/bin/logger 'weekday-job'",
    user: "root",
    description: "Schedule a task at 04:15 on weekdays.",
    explanation: "1-5 represents Monday through Friday.",
    tip: "Use hyphens for ranges and commas for lists.",
  },
  {
    id: "monthly",
    label: "1st & 15th",
    title: "Execute on the first and fifteenth",
    expression: "0 0 1,15 * *",
    command: "/usr/bin/logger 'monthly-check'",
    user: "root",
    description: "Execute at midnight on the first and fifteenth.",
    explanation: "The comma separates two calendar days.",
    tip: "1,15 means two dates. 1-15 means fifteen dates.",
  },
  {
    id: "business",
    label: "Business hours",
    title: "Execute hourly during business hours",
    expression: "30 8-17 * * 1-5",
    command: "/usr/bin/logger 'business-hours'",
    user: "root",
    description: "Execute hourly from 08:30 through 17:30 on weekdays.",
    explanation: "The hour range includes both 08 and 17.",
    tip: "30 8-17 runs once per hour, not every thirty minutes.",
  },
  {
    id: "half",
    label: "Every 30 min",
    title: "Execute every thirty minutes",
    expression: "*/30 * * * *",
    command: "/usr/bin/logger 'health-check'",
    user: "root",
    description: "Run a health check twice every hour.",
    explanation: "*/30 selects minute 00 and minute 30.",
    tip: "30 * * * * runs only once per hour.",
  },
  {
    id: "user",
    label: "Specific user",
    title: "Schedule a job for the developer account",
    expression: "15 3 * * *",
    command: "/usr/bin/logger 'developer-job'",
    user: "developer",
    description: "Manage a specific user's personal crontab.",
    explanation: "crontab -u developer -e edits the developer user's crontab.",
    tip: "Personal crontabs do not contain a username field.",
  },
  {
    id: "reboot",
    label: "@reboot",
    title: "Execute when the cron daemon starts",
    expression: "@reboot",
    command: "/usr/local/bin/startup-check.sh",
    user: "root",
    description: "Execute a command when crond starts.",
    explanation: "@reboot is event-based and does not have five time fields.",
    tip: "@reboot may execute when crond starts, not only when the system reboots.",
  },
];


const CHEATSHEET = [
  ["Edit current user's crontab", "crontab -e"],
  ["List current user's crontab", "crontab -l"],
  ["Edit another user's crontab", "crontab -u developer -e"],
  ["List another user's crontab", "crontab -u developer -l"],
  ["Remove current user's crontab", "crontab -r"],
  ["Check cron service", "systemctl status crond"],
  ["Enable cron service", "systemctl enable --now crond"],
  ["Inspect cron journal", "journalctl -u crond"],
  ["Recent cron logs", "journalctl -u crond --since today"],
  ["List system cron directories", "ls -l /etc/cron.d /etc/cron.daily"],
  ["System-wide cron configuration", "cat /etc/crontab"],
];

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatDate(date) {
  return `${WEEKDAYS[date.getDay()]} ${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseField(value, min, max) {
  if (!value || !/^[\d*,/-]+$/.test(value)) return null;

  const result = new Set();

  for (const part of value.split(",")) {
    const pieces = part.split("/");
    if (pieces.length > 2) return null;

    const [base, stepText] = pieces;
    const step = stepText === undefined ? 1 : Number(stepText);

    if (!Number.isInteger(step) || step < 1) return null;

    let start;
    let end;

    if (base === "*") {
      start = min;
      end = max;
    } else if (/^\d+-\d+$/.test(base)) {
      [start, end] = base.split("-").map(Number);
    } else if (/^\d+$/.test(base)) {
      start = Number(base);
      end = stepText === undefined ? start : max;
    } else {
      return null;
    }

    if (start < min || end > max || start > end) return null;

    for (let n = start; n <= end; n += step) {
      result.add(n);
    }
  }

  return result;
}

function parseCron(expression) {
  if (expression.trim() === "@reboot") return { reboot: true };

  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return null;

  const ranges = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 7]];
  const sets = parts.map((part, index) => parseField(part, ...ranges[index]));

  if (sets.some((set) => set === null)) return null;

  return { reboot: false, parts, sets };
}

function matchesCron(parsed, date) {
  if (!parsed || parsed.reboot) return false;

  const [minutes, hours, days, months, weekdays] = parsed.sets;

  const minuteMatch = minutes.has(date.getMinutes());
  const hourMatch = hours.has(date.getHours());
  const monthMatch = months.has(date.getMonth() + 1);
  const dayMatch = days.has(date.getDate());
  const weekdayMatch =
    weekdays.has(date.getDay()) ||
    (date.getDay() === 0 && weekdays.has(7));

  const dayRestricted = parsed.parts[2] !== "*";
  const weekdayRestricted = parsed.parts[4] !== "*";

  const calendarMatch =
    dayRestricted && weekdayRestricted
      ? dayMatch || weekdayMatch
      : dayMatch && weekdayMatch;

  return minuteMatch && hourMatch && monthMatch && calendarMatch;
}

function nextExecutions(expression, fromDate, count = 8) {
  const parsed = parseCron(expression);
  if (!parsed || parsed.reboot) return [];

  const results = [];
  const date = new Date(fromDate);
  date.setSeconds(0, 0);
  date.setMinutes(date.getMinutes() + 1);

  for (let i = 0; i < 527040 && results.length < count; i++) {
    if (matchesCron(parsed, date)) results.push(new Date(date));
    date.setMinutes(date.getMinutes() + 1);
  }

  return results;
}

function scenarioStart(expression) {
  const reference = new Date(2026, 9, 11, 0, 0);
  if (expression === "@reboot") return reference;

  const next = nextExecutions(expression, reference, 1)[0];
  return next
    ? new Date(next.getTime() - 10 * 60000)
    : reference;
}

function CronFields({ expression, active = -1 }) {
  if (expression === "@reboot") {
    return (
      <div className="cron-special">
        <strong>@reboot</strong>
        <span>Triggered when the cron daemon starts</span>
      </div>
    );
  }

  const values = expression.trim().split(/\s+/);

  return (
    <div className="cron-fields">
      {FIELDS.map((field, index) => (
        <div
          className={`cron-field ${active === index ? "active" : ""}`}
          style={{ "--field-color": field.color }}
          key={field.key}
        >
          <span>{field.label}</span>
          <strong>{values[index] || "?"}</strong>
          <small>{field.range}</small>
        </div>
      ))}
    </div>
  );
}

function ClockVisual({ date, executed }) {
  const minute = date.getMinutes();
  const hour = date.getHours() % 12;

  return (
    <div className={`cron-clock-panel ${executed ? "executed" : ""}`}>
      <div className="cron-clock">
        <div
          className="cron-clock-hour"
          style={{ transform: `rotate(${hour * 30 + minute * 0.5}deg)` }}
        />
        <div
          className="cron-clock-minute"
          style={{ transform: `rotate(${minute * 6}deg)` }}
        />
        <div className="cron-clock-center" />
        <span className="cron-clock-twelve">12</span>
        <span className="cron-clock-three">3</span>
        <span className="cron-clock-six">6</span>
        <span className="cron-clock-nine">9</span>
      </div>

      <div className="cron-clock-info">
        <span>SIMULATED SYSTEM TIME</span>
        <strong>{pad(date.getHours())}:{pad(date.getMinutes())}</strong>
        <p>{formatDate(date)}</p>
        <div className={`cron-execution-status ${executed ? "success" : ""}`}>
          {executed ? "✓ JOB EXECUTED" : "○ WAITING FOR MATCH"}
        </div>
      </div>
    </div>
  );
}

function CronTimeline({ events, currentDate }) {
  return (
    <div className="cron-timeline">
      <div className="cron-panel-heading">
        <span>UPCOMING EXECUTIONS</span>
        <span>NEXT 6 MATCHES</span>
      </div>

      {events.length === 0 ? (
        <p className="cron-empty">Event-based jobs have no predictable execution time.</p>
      ) : (
        <div className="cron-timeline-list">
          {events.map((date, index) => {
            const past = date.getTime() <= currentDate.getTime();

            return (
              <div className={`cron-timeline-item ${past ? "past" : ""}`} key={date.getTime()}>
                <span className="cron-timeline-marker" />
                <span>RUN {index + 1}</span>
                <strong>{formatDate(date)}</strong>
                {past && <em>DONE</em>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CronExecutionFlow({ stage, running, executed }) {
  const nodes = [
    { title: "Crontab", subtitle: "Install job", detail: "crontab -e" },
    { title: "crond", subtitle: "Read schedule", detail: "Scheduler" },
    { title: "Time Match", subtitle: "Compare fields", detail: "Minute / Hour" },
    { title: "Execute Job", subtitle: "Run command", detail: "CMD" },
  ];

  return (
    <div className="cron-flow">
      <div className="cron-panel-heading">
        <span>ANIMATED EXECUTION VISUALIZATION</span>
        <span>{executed ? "EXECUTED" : running ? "RUNNING" : "READY"}</span>
      </div>

      <div className="cron-flow-track">
        {nodes.map((node, index) => {
          const active = stage === index;
          const done = stage > index;

          return (
            <div className="cron-flow-group" key={node.title}>
              <div className={`cron-flow-node ${active ? "active" : ""} ${done ? "done" : ""}`}>
                <div className="cron-flow-node-head">
                  <span>{done ? "✓" : pad(index + 1)}</span>
                  <small>{done ? "DONE" : active ? "ACTIVE" : "WAITING"}</small>
                </div>
                <strong>{node.title}</strong>
                <p>{node.subtitle}</p>
                <code>{node.detail}</code>
                {active && running && <div className="cron-flow-loader"><i /></div>}
              </div>

              {index < nodes.length - 1 && (
                <div className={`cron-flow-connector ${done ? "done" : ""} ${active && running ? "moving" : ""}`}>
                  <div><i /></div>
                  <span>→</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="cron-flow-progress">
        <div style={{ width: `${Math.max(0, (stage + 1) / 4) * 100}%` }} />
      </div>

      <div className="cron-flow-caption">
        <span className={`cron-flow-dot ${running ? "pulsing" : ""}`} />
        {stage === 0 && "The cron entry is installed in the user's crontab."}
        {stage === 1 && "The crond scheduler reads the installed job."}
        {stage === 2 && "The scheduler compares the cron expression with simulated system time."}
        {stage === 3 && "The scheduled command is dispatched when its execution condition matches."}
      </div>
    </div>
  );
}

function AnimatedTerminal({ scenario, running, speed, executed, executionDate, rebootTriggered }) {
  const [typed, setTyped] = useState(0);
  const bottomRef = useRef(null);

  const editCommand =
    scenario.user === "root"
      ? "crontab -e"
      : `crontab -u ${scenario.user} -e`;

  const listCommand =
    scenario.user === "root"
      ? "crontab -l"
      : `crontab -u ${scenario.user} -l`;

  const cronLine = `${scenario.expression} ${scenario.command}`;

  const script = useMemo(() => [
    { type: "prompt", text: editCommand },
    { type: "comment", text: `# Editing ${scenario.user}'s crontab` },
    { type: "expression", text: cronLine },
    { type: "comment", text: "# Crontab installed successfully" },
    { type: "prompt", text: listCommand },
    { type: "expression", text: cronLine },
  ], [editCommand, listCommand, cronLine, scenario.user]);

  const total = script.reduce((sum, line) => sum + line.text.length + 1, 0);


  useEffect(() => {
    if (!running || typed >= total) return;

    const timer = setTimeout(
      () => setTyped((n) => Math.min(n + 1, total)),
      Math.max(8, 48 / speed)
    );

    return () => clearTimeout(timer);
  }, [running, typed, speed, total]);

  const visible = useMemo(() => {
    let remaining = typed;

    return script.map((line) => {
      const started = remaining > 0;
      const count = Math.min(line.text.length, Math.max(0, remaining));
      remaining -= line.text.length + 1;

      return { ...line, started, visible: line.text.slice(0, count) };
    }).filter((line) => line.started);
  }, [script, typed]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [typed, executed, rebootTriggered]);

  return (
    <div className="cron-terminal">
      <div className="cron-terminal-header">
        <span><i />{scenario.user}@rhcsa-server</span>
        <button onClick={() => navigator.clipboard?.writeText(cronLine)}>Copy</button>
      </div>

      <div className="cron-terminal-body">
        <div className="cron-animated-output">
          {visible.map((line, index) => (
            <div className={`cron-terminal-line ${line.type}`} key={index}>
              {line.type === "prompt" && <span className="cron-prompt"># </span>}
              {line.visible}
              {index === visible.length - 1 && typed < total && (
                <span className="cron-typing-cursor">▋</span>
              )}
            </div>
          ))}

          {typed >= total && (
            <>
              <div className="cron-log-separator"># Simulated crond execution log</div>
              {executed ? (
                <div className="cron-execution-log">
                  [{rebootTriggered ? "CROND START" : formatDate(executionDate)}] CMD ({scenario.command})
                </div>
              ) : (
                <div className="cron-waiting">Waiting for scheduled execution...</div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="cron-terminal-footer">
        SIMULATED TERMINAL · NO COMMANDS EXECUTED
      </div>
    </div>
  );
}

function CronCalculator() {
  const [fields, setFields] = useState({
    minute: "*/15",
    hour: "8-17",
    day: "*",
    month: "*",
    weekday: "1-5",
  });

  const [special, setSpecial] = useState(false);
  const [selected, setSelected] = useState(0);

  const expression = special
    ? "@reboot"
    : FIELDS.map((field) => fields[field.key]).join(" ");

  const parsed = useMemo(() => parseCron(expression), [expression]);

  const nextRuns = useMemo(
    () => parsed && !parsed.reboot
      ? nextExecutions(expression, new Date(), 10)
      : [],
    [expression, parsed]
  );

  function applyPreset(value) {
    if (value === "@reboot") {
      setSpecial(true);
      return;
    }

    const [minute, hour, day, month, weekday] = value.split(" ");
    setFields({ minute, hour, day, month, weekday });
    setSpecial(false);
  }

  return (
    <section className="cron-calculator">
      <div className="cron-section-heading">
        <span>INTERACTIVE RHCSA TOOL</span>
        <h2>Crontab Expression Calculator</h2>
        <p>Build a cron expression and calculate its next scheduled executions.</p>
      </div>

      <div className="cron-builder-presets">
        <span>QUICK PRESETS</span>
        <div>
          {SCENARIOS.map((item) => (
            <button key={item.id} onClick={() => applyPreset(item.expression)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {!special && (
        <>
          <div className="cron-builder-fields">
            {FIELDS.map((field, index) => (
              <div
                className={`cron-builder-field ${selected === index ? "selected" : ""}`}
                style={{ "--field-color": field.color }}
                key={field.key}
              >
                <label>{field.label}</label>
                <input
                  value={fields[field.key]}
                  onFocus={() => setSelected(index)}
                  onChange={(event) => setFields((prev) => ({
                    ...prev,
                    [field.key]: event.target.value,
                  }))}
                  spellCheck={false}
                />
                <small>{field.range}</small>
              </div>
            ))}
          </div>

          <div className="cron-field-help">
            <div>
              <span>SELECTED FIELD</span>
              <h3>{FIELDS[selected].label}</h3>
              <p>Choose a value, range, list, or step interval.</p>
            </div>
            <div className="cron-field-examples">
              {FIELDS[selected].examples.map((example) => (
                <button
                  key={example}
                  onClick={() => setFields((prev) => ({
                    ...prev,
                    [FIELDS[selected].key]: example,
                  }))}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="cron-expression-preview">
        <div className="cron-expression-header">
          <span>GENERATED CRONTAB EXPRESSION</span>
          <button onClick={() => navigator.clipboard?.writeText(expression)}>Copy</button>
        </div>
        <code>{expression}</code>
        <div className={`cron-expression-status ${parsed ? "valid" : "invalid"}`}>
          {parsed ? "✓ Valid expression" : "✕ Invalid expression"}
        </div>
      </div>

      {parsed && <CronFields expression={expression} active={special ? -1 : selected} />}

      <div className="cron-builder-results">
        <div className="cron-panel-heading">
          <span>NEXT 10 EXECUTIONS</span>
          <span>LOCAL TIME</span>
        </div>

        {!parsed ? (
          <p className="cron-empty">Correct the expression to calculate its schedule.</p>
        ) : special ? (
          <p className="cron-empty">@reboot is event-based and has no predictable clock time.</p>
        ) : nextRuns.length ? (
          <div className="cron-next-executions">
            {nextRuns.map((date, index) => (
              <div className="cron-next-execution" key={date.getTime()}>
                <span>#{index + 1}</span>
                <strong>{formatDate(date)}</strong>
                <span>{date.getFullYear()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="cron-empty">No execution found within the search window.</p>
        )}
      </div>

      <div className="cron-builder-reference">
        {[
          ["*", "Every value"],
          [",", "Value list"],
          ["-", "Range"],
          ["/", "Step interval"],
        ].map(([symbol, label]) => (
          <div key={symbol}>
            <code>{symbol}</code>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="cron-important-note">
        <strong>RHCSA NOTE</strong>
        <p>
          Personal crontabs use five scheduling fields followed by the command.
          System crontab files such as /etc/crontab include an additional username field.
          When both day-of-month and day-of-week are restricted, traditional cron matches either field.
        </p>
      </div>
    </section>
  );
}


function CronCheatsheet() {
  return (
    <section className="cron-cheatsheet">
      <div className="cron-section-heading">
        <span>RHCSA COMMAND REFERENCE</span>
        <h2>Crontab Cheatsheet</h2>
        <p>Common commands for managing scheduled tasks on RHEL.</p>
      </div>

      <div className="cron-command-list">
        {CHEATSHEET.map(([label, command]) => (
          <div className="cron-command-row" key={label}>
            <span>{label}</span>
            <code>{command}</code>
            <button onClick={() => navigator.clipboard?.writeText(command)}>
              Copy
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CrontabLab() {
  const [scenarioId, setScenarioId] = useState("every5");
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [resetId, setResetId] = useState(0);
  const [currentDate, setCurrentDate] = useState(() => scenarioStart("*/5 * * * *"));
  const [stage, setStage] = useState(0);
  const [rebootTriggered, setRebootTriggered] = useState(false);

  const scenario = SCENARIOS.find((item) => item.id === scenarioId);
  const parsed = useMemo(() => parseCron(scenario.expression), [scenario.expression]);
  const start = useMemo(() => scenarioStart(scenario.expression), [scenario.expression]);

  const executions = useMemo(
    () => nextExecutions(scenario.expression, start, 6),
    [scenario.expression, start]
  );

  const executedDates = executions.filter(
    (date) => date.getTime() <= currentDate.getTime()
  );

  const executed = scenario.expression === "@reboot"
    ? rebootTriggered
    : executedDates.length > 0;

  const executionDate = executedDates.at(-1) || currentDate;

  function reset(nextScenario = scenario) {
    setRunning(false);
    setStage(0);
    setRebootTriggered(false);
    setCurrentDate(scenarioStart(nextScenario.expression));
    setResetId((n) => n + 1);
  }

  function selectScenario(id) {
    const next = SCENARIOS.find((item) => item.id === id);
    setScenarioId(id);
    reset(next);
  }

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setStage((previous) => {
        if (previous < 2) return previous + 1;
        return previous;
      });
    }, Math.max(180, 1000 / speed));

    return () => clearInterval(timer);
  }, [running, speed]);

  useEffect(() => {
    if (!running || stage < 2 || executed) return;

    const timer = setInterval(() => {
      if (scenario.expression === "@reboot") {
        setRebootTriggered(true);
        setStage(3);
        setRunning(false);
      } else {
        setCurrentDate((previous) => {
          const next = new Date(previous.getTime() + 60000);
          if (matchesCron(parsed, next)) {
            setStage(3);
            setRunning(false);
          }
          return next;
        });
      }
    }, Math.max(70, 350 / speed));

    return () => clearInterval(timer);
  }, [running, stage, speed, executed, scenario.expression, parsed]);

  return (
    <main className="cron-study-page">
      <div className="cron-content">
        <header className="cron-page-header">
          <span className="cron-eyebrow">RHCSA / RHEL · INTERACTIVE LAB</span>
          <h1>Linux Task Scheduling with Crontab.</h1>
          <p>
            Understand how cron expressions work, visualize job execution,
            and explore practical Linux automation scenarios.
          </p>
        </header>

        <section className="cron-simulator">
          <div className="cron-simulator-header">
            <div>
              <span>INTERACTIVE CRON SCHEDULER</span>
              <h2>Crontab Execution Simulator</h2>
            </div>
            <div className="cron-live-label">
              <i className={running ? "pulsing" : ""} />
              {executed ? "EXECUTED" : running ? "RUNNING" : "READY"}
            </div>
          </div>

          <div className="cron-scenario-tabs">
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

          <div className="cron-objective">
            <span>SCENARIO</span>
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
          </div>

          <CronFields expression={scenario.expression} />

          <div className="cron-main-grid">
            <ClockVisual date={currentDate} executed={executed} />
            <CronTimeline events={executions} currentDate={currentDate} />
          </div>

          <div className="cron-flow-section">
            <CronExecutionFlow
              stage={stage}
              running={running}
              executed={executed}
            />
          </div>

          <div className="cron-explanation">
            <div>
              <span>HOW IT WORKS</span>
              <p>{scenario.explanation}</p>
            </div>
            <div>
              <span>RHCSA TIP</span>
              <p>{scenario.tip}</p>
            </div>
          </div>

          <div className="cron-terminal-section">
            <AnimatedTerminal
               key={`${scenario.id}-${resetId}`}
                scenario={scenario}
              running={running}
              speed={speed}
              executed={executed}
              executionDate={executionDate}
              rebootTriggered={rebootTriggered}
              resetId={resetId}
            />
          </div>

          <div className="cron-controls">
            <button
              className="cron-play"
              onClick={() => {
                if (executed) {
                  reset();
                } else {
                  setRunning((value) => !value);
                }
              }}
            >
              {executed ? "↺ Replay" : running ? "Ⅱ Pause" : "▶ Play"}
            </button>
            <button onClick={() => reset()}>↺ Restart</button>
            <div className="cron-control-spacer" />
            <span>Playback speed</span>
            <select
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            >
              {SPEEDS.map((value) => (
                <option value={value} key={value}>{value}×</option>
              ))}
            </select>
          </div>

          <div className="cron-statistics">
            <div>
              <span>CRON EXPRESSION</span>
              <strong>{scenario.expression}</strong>
            </div>
            <div>
              <span>EXECUTED JOBS</span>
              <strong>{scenario.expression === "@reboot" ? Number(rebootTriggered) : executedDates.length}</strong>
            </div>
            <div>
              <span>EXECUTION USER</span>
              <strong>{scenario.user}</strong>
            </div>
          </div>

          <div className="cron-simulation-note">
            Simulated system time: {formatDate(currentDate)}.
            No commands are executed on your system.
          </div>
        </section>

        <CronCalculator />
        <CronCheatsheet />

        <footer className="cron-footer">
          RHCSA Visual Lab · Linux Task Scheduling · CROND
        </footer>
      </div>
    </main>
  );
}