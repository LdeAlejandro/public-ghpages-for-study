
import { useEffect, useRef, useState } from "react";
import "./page.css";

export const metadata = {
  title: "UMASK — Interactive Visual Lab",
  category: "RHCSA",
  description:
    "Learn Linux umask with animated permission bits, practical scenarios and an interactive calculator.",
  keywords: [
    "linux", "rhel", "rhcsa", "umask", "chmod",
    "permissions", "files", "directories",
    "bashrc", "profile", "sgid", "security"
  ],
  created: "2026-10-11",
};

const STEP_DURATION = 5;
const SPEEDS = [0.5, 1, 1.5, 2, 3];

const scenarios = {
  standard: {
    label: "Default 022",
    objective: "Create files and directories with standard Linux permissions.",
    steps: [
      {
        title: "Inspect the current umask",
        description:
          "The umask controls which permission bits are removed when new files and directories are created.",
        command: "umask\numask -S",
        output: "0022\nu=rwx,g=rx,o=rx",
        mask: "022",
        focus: "mask",
        explain: "022 removes write permission from group and others.",
      },
      {
        title: "Create a new file",
        description:
          "Regular files start with a maximum permission mode of 666, before the umask is applied.",
        command: "touch example.txt\nstat -c '%a %n' example.txt",
        output: "644 example.txt",
        mask: "022",
        focus: "file",
        explain: "666 & ~022 = 644. Execute bits are not added automatically.",
      },
      {
        title: "Create a directory",
        description:
          "Directories start with a maximum permission mode of 777, before the umask is applied.",
        command: "mkdir example-dir\nstat -c '%a %n' example-dir",
        output: "755 example-dir",
        mask: "022",
        focus: "directory",
        explain: "777 & ~022 = 755. The execute bit allows directory traversal.",
      },
      {
        title: "Verify the permissions",
        description:
          "Compare the file and directory permissions using ls -l.",
        command: "ls -ld example.txt example-dir",
        output:
          "drwxr-xr-x 2 root root 6 example-dir\n-rw-r--r-- 1 root root 0 example.txt",
        mask: "022",
        focus: "both",
        explain: "The same umask produces different results for files and directories.",
      },
    ],
  },

  private: {
    label: "Private 077",
    objective: "Create private files and directories accessible only to the owner.",
    steps: [
      {
        title: "Set a restrictive umask",
        description:
          "UMASK 077 removes all permissions from group and others.",
        command: "umask 077\numask",
        output: "0077",
        mask: "077",
        focus: "mask",
        explain: "Only the owner keeps permissions.",
      },
      {
        title: "Create a private file",
        description:
          "The new file can be read and written only by its owner.",
        command: "touch private.txt\nstat -c '%a %n' private.txt",
        output: "600 private.txt",
        mask: "077",
        focus: "file",
        explain: "666 & ~077 = 600.",
      },
      {
        title: "Create a private directory",
        description:
          "The owner has full access, while group and others have none.",
        command: "mkdir private-dir\nstat -c '%a %n' private-dir",
        output: "700 private-dir",
        mask: "077",
        focus: "directory",
        explain: "777 & ~077 = 700.",
      },
      {
        title: "Verify private permissions",
        description:
          "Inspect the resulting permissions.",
        command: "ls -ld private.txt private-dir",
        output:
          "drwx------ 2 root root 6 private-dir\n-rw------- 1 root root 0 private.txt",
        mask: "077",
        focus: "both",
        explain: "Useful for private files and sensitive working directories.",
      },
    ],
  },

  shared: {
    label: "Shared 002",
    objective:
      "Allow users in the same group to collaborate on newly created files.",
    steps: [
      {
        title: "Set a collaborative umask",
        description:
          "UMASK 002 preserves group write permissions.",
        command: "umask 002\numask",
        output: "0002",
        mask: "002",
        focus: "mask",
        explain: "Only write permission for others is removed.",
      },
      {
        title: "Create a shared file",
        description:
          "Both owner and group receive read/write permissions.",
        command: "touch shared.txt\nstat -c '%a %n' shared.txt",
        output: "664 shared.txt",
        mask: "002",
        focus: "file",
        explain: "666 & ~002 = 664.",
      },
      {
        title: "Create a shared directory",
        description:
          "Owner and group receive full access.",
        command: "mkdir shared-dir\nstat -c '%a %n' shared-dir",
        output: "775 shared-dir",
        mask: "002",
        focus: "directory",
        explain: "777 & ~002 = 775.",
      },
      {
        title: "Use SGID for group inheritance",
        description:
          "SGID makes newly created entries inherit the directory's group.",
        command:
          "chgrp developers shared-dir\nchmod g+s shared-dir\nls -ld shared-dir",
        output: "drwxrwsr-x 2 root developers 6 shared-dir",
        mask: "002",
        focus: "directory",
        explain:
          "SGID controls group inheritance; umask controls permission bits. Both matter for collaboration.",
      },
    ],
  },

  restricted: {
    label: "Restricted 027",
    objective:
      "Allow the owner full access, group read access and no access for others.",
    steps: [
      {
        title: "Configure umask 027",
        description:
          "This is useful when other users must not access newly created files.",
        command: "umask 027\numask",
        output: "0027",
        mask: "027",
        focus: "mask",
        explain: "Group loses write; others lose all permissions.",
      },
      {
        title: "Create a restricted file",
        description:
          "The owner can read/write, and the group can only read.",
        command: "touch report.txt\nstat -c '%a %n' report.txt",
        output: "640 report.txt",
        mask: "027",
        focus: "file",
        explain: "666 & ~027 = 640.",
      },
      {
        title: "Create a restricted directory",
        description:
          "The group can enter and read the directory, but cannot modify it.",
        command: "mkdir reports\nstat -c '%a %n' reports",
        output: "750 reports",
        mask: "027",
        focus: "directory",
        explain: "777 & ~027 = 750.",
      },
      {
        title: "Persist for future Bash sessions",
        description:
          "Add the umask to the user's shell startup configuration.",
        command:
          "echo 'umask 027' >> ~/.bashrc\nsource ~/.bashrc\numask",
        output: "0027",
        mask: "027",
        focus: "mask",
        explain:
          "The .bashrc setting applies when Bash reads that file. It does not automatically configure every service or noninteractive process.",
      },
    ],
  },
  persistent: {
  label: "Persistent User",
  objective:
    "Configure a persistent umask of 027 for the user developer without changing the default umask of other users.",
  steps: [
    {
      title: "Inspect the target user",
      description:
        "Verify that the developer account exists and inspect its login shell and home directory.",
      command:
        "getent passwd developer\nls -la /home/developer",
      output:
        "developer:x:1001:1001::/home/developer:/bin/bash",
      mask: "022",
      focus: "mask",
      explain:
        "The configuration must be applied to the target user's shell startup file, not to the global system configuration.",
    },
    {
      title: "Configure the user's .bashrc",
      description:
        "Add umask 027 to the user's Bash startup file. This makes the setting available to future interactive Bash sessions.",
      command:
        "echo 'umask 027' >> /home/developer/.bashrc\ntail -n 3 /home/developer/.bashrc",
      output:
        "# User specific aliases and functions\numask 027",
      mask: "027",
      focus: "mask",
      explain:
        "The ~/.bashrc file belongs to the user. This approach does not modify the default umask for other accounts.",
    },
    {
      title: "Apply the configuration",
      description:
        "Start a new interactive Bash session as developer to load the configuration.",
      command:
        "su - developer\numask\numask -S",
      output:
        "0027\nu=rwx,g=rx,o=",
      mask: "027",
      focus: "mask",
      explain:
        "A new Bash session reads the user's startup configuration. Existing sessions are not automatically updated.",
    },
    {
      title: "Verify file permissions",
      description:
        "Create a file as developer and verify that its permissions reflect umask 027.",
      command:
        "touch ~/test-file\nstat -c '%a %n' ~/test-file",
      output:
        "640 /home/developer/test-file",
      mask: "027",
      focus: "file",
      explain:
        "A new regular file starts with a maximum mode of 666. With umask 027, its permissions become 640.",
    },
    {
      title: "Verify directory permissions",
      description:
        "Create a directory as developer and verify its resulting permissions.",
      command:
        "mkdir ~/test-dir\nstat -c '%a %n' ~/test-dir",
      output:
        "750 /home/developer/test-dir",
      mask: "027",
      focus: "directory",
      explain:
        "A new directory starts with a maximum mode of 777. With umask 027, its permissions become 750.",
    },
    {
      title: "Confirm persistence",
      description:
        "Exit the current session, start a new login session and verify that the user's umask remains configured.",
      command:
        "exit\nsu - developer\numask",
      output:
        "0027",
      mask: "027",
      focus: "both",
      explain:
        "The configuration survives logout and reboot because it is stored in the user's home directory. This applies to Bash sessions that load .bashrc, not automatically to every process.",
    },
  ],
},
};

function calculatePermissions(mask) {
  const value = parseInt(mask, 8);

  return {
    file: 0o666 & ~value,
    directory: 0o777 & ~value,
  };
}

function toOctal(value) {
  return value.toString(8).padStart(3, "0");
}

function toSymbolic(value) {
  const flags = [
    [0o400, 0o200, 0o100],
    [0o040, 0o020, 0o010],
    [0o004, 0o002, 0o001],
  ];

  return flags
    .map((group) =>
      group
        .map((bit, index) =>
          value & bit ? ["r", "w", "x"][index] : "-"
        )
        .join("")
    )
    .join("");
}

function PermissionBits({ value, title, accent }) {
  const symbolic = toSymbolic(value);
  const octal = toOctal(value);

  return (
    <div className="umask-permission-card">
      <div className="umask-card-top">
        <span>{title}</span>
        <strong style={{ color: accent }}>{octal}</strong>
      </div>

      <div className="umask-bit-grid">
        {["OWNER", "GROUP", "OTHERS"].map((group, groupIndex) => (
          <div className="umask-bit-group" key={group}>
            <span className="umask-bit-label">{group}</span>

            <div className="umask-bit-row">
              {symbolic
                .slice(groupIndex * 3, groupIndex * 3 + 3)
                .split("")
                .map((bit, index) => (
                  <div
                    key={index}
                    className={`umask-bit ${
                      bit !== "-" ? "allowed" : "denied"
                    }`}
                    style={{ "--bit-accent": accent }}
                  >
                    {bit}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="umask-symbolic">{symbolic}</div>
    </div>
  );
}

function PermissionDiagram({ mask, focus }) {
  const { file, directory } = calculatePermissions(mask);

  const maskDigits = mask.padStart(3, "0").split("");

  return (
    <div className="umask-diagram">
      <div className="umask-diagram-heading">
        <span>LIVE PERMISSION MODEL</span>
        <span>OCTAL / RWX</span>
      </div>

      <div className="umask-formula">
        <div className="umask-formula-box">
          <span>UMASK</span>
          <strong>{mask}</strong>
          <small>Permission bits removed</small>
        </div>

        <div className="umask-formula-arrow">→</div>

        <div className="umask-formula-box">
          <span>FILE BASE</span>
          <strong>666</strong>
          <small>rw-rw-rw-</small>
        </div>

        <div className="umask-formula-arrow">→</div>

        <div className="umask-formula-box">
          <span>DIRECTORY BASE</span>
          <strong>777</strong>
          <small>rwxrwxrwx</small>
        </div>
      </div>

      <div className="umask-mask-explanation">
        {["Owner", "Group", "Others"].map((name, index) => (
          <div key={name}>
            <span>{name}</span>
            <strong>{maskDigits[index]}</strong>
            <small>
              {toSymbolic(parseInt(maskDigits[index], 8) << (6 - index * 3))
                .slice(index * 3, index * 3 + 3)
                .replaceAll("-", "·")}
            </small>
          </div>
        ))}
      </div>

      <div className="umask-results">
        <div className={focus === "file" ? "umask-focused" : ""}>
          <PermissionBits
            title="NEW FILE"
            value={file}
            accent="#60A5FA"
          />
        </div>

        <div className={focus === "directory" ? "umask-focused" : ""}>
          <PermissionBits
            title="NEW DIRECTORY"
            value={directory}
            accent="#2DD4BF"
          />
        </div>
      </div>

      <div className="umask-diagram-note">
        Files: 666 &amp; ~{mask} = {toOctal(file)}
        <span> · </span>
        Directories: 777 &amp; ~{mask} = {toOctal(directory)}
      </div>
    </div>
  );
}

function AnimatedTerminal({ command, output, running, speed, step }) {
  const [visible, setVisible] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    setVisible(0);
    setShowOutput(false);
  }, [step, command]);

  useEffect(() => {
    if (!running) return;

    if (visible >= command.length) {
      setShowOutput(true);
      return;
    }

    const timer = setTimeout(() => {
      setVisible((current) =>
        Math.min(command.length, current + 1)
      );
    }, 35 / speed);

    return () => clearTimeout(timer);
  }, [visible, command, running, speed]);

  return (
    <div className="umask-terminal">
      <div className="umask-terminal-header">
        <div>
          <span className="umask-terminal-dot" />
          root@rhcsa-server
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(command)}
        >
          Copy
        </button>
      </div>

      <pre>
        <code>
          <span className="umask-terminal-prompt"># </span>
          {command.slice(0, visible)}
          {!showOutput && <span className="umask-cursor">▋</span>}
          {showOutput && (
            <span className="umask-terminal-output">
              {"\n"}
              {output}
            </span>
          )}
        </code>
      </pre>

      <div className="umask-terminal-footer">
        Simulated output — commands are not executed
      </div>
    </div>
  );
}

function UmaskCalculator() {
  const [mask, setMask] = useState("022");

  const valid = /^[0-7]{1,3}$/.test(mask);
  const normalized = valid ? mask.padStart(3, "0") : "022";
  const { file, directory } = calculatePermissions(normalized);

  return (
    <section className="umask-calculator">
      <div className="umask-section-heading">
        <div>
          <span>INTERACTIVE TOOL</span>
          <h2>UMASK Calculator</h2>
          <p>Try different masks and see the resulting permissions.</p>
        </div>
      </div>

      <div className="umask-calculator-controls">
        <label htmlFor="umask-input">UMASK VALUE</label>
        <input
          id="umask-input"
          value={mask}
          onChange={(event) => setMask(event.target.value)}
          maxLength={3}
          placeholder="022"
        />

        {["000", "002", "022", "027", "077", "037"].map((value) => (
          <button
            key={value}
            className={normalized === value ? "active" : ""}
            onClick={() => setMask(value)}
          >
            {value}
          </button>
        ))}
      </div>

      {!valid && (
        <p className="umask-error">
          Enter one to three octal digits (0–7).
        </p>
      )}

      {valid && (
        <>
          <PermissionDiagram mask={normalized} focus="both" />

          <div className="umask-calculator-summary">
            <span>
              FILE: <strong>{toOctal(file)}</strong>
            </span>
            <span>
              DIRECTORY: <strong>{toOctal(directory)}</strong>
            </span>
          </div>
        </>
      )}
    </section>
  );
}

export default function UmaskVisualLab() {
  const [mode, setMode] = useState("standard");
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [elapsed, setElapsed] = useState(0);

  const intervalRef = useRef(null);

  const scenario = scenarios[mode];
  const frame = scenario.steps[step];
  const total = scenario.steps.length;

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      if (!document.hidden) {
        setElapsed((current) => current + 0.1 * speed);
      }
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [running, speed]);

  useEffect(() => {
    if (elapsed < STEP_DURATION) return;

    setElapsed(0);

    if (step < total - 1) {
      setStep((current) => current + 1);
    } else {
      setRunning(false);
    }
  }, [elapsed, step, total]);

  function selectScenario(value) {
    setMode(value);
    setStep(0);
    setElapsed(0);
    setRunning(false);
  }

  function navigate(next) {
    setStep(Math.max(0, Math.min(total - 1, next)));
    setElapsed(0);
    setRunning(false);
  }

  function togglePlayback() {
    if (!running && step === total - 1) {
      setStep(0);
      setElapsed(0);
    }

    setRunning((current) => !current);
  }

  function restart() {
    setStep(0);
    setElapsed(0);
    setRunning(false);
  }

  return (
    <main className="umask-study-page">
      <div className="umask-content">
        <header className="umask-page-header">
          <span className="umask-eyebrow">
            RHCSA / RHEL 10 · INTERACTIVE LAB
          </span>

          <div className="umask-page-title">
            <div>
              <h1>Control permissions from the start.</h1>
              <p>
                Watch Linux umask change file and directory permissions.
              </p>
            </div>
            <span className="umask-tag">UMASK / RWX</span>
          </div>
        </header>

        <section className="umask-simulation">
          <div className="umask-toolbar">
            <div>
              <h2>Understanding UMASK</h2>
              <p>Every permission bit has a purpose.</p>
            </div>

            <div className="umask-tabs">
              {Object.entries(scenarios).map(([key, item]) => (
                <button
                  key={key}
                  className={mode === key ? "active" : ""}
                  onClick={() => selectScenario(key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="umask-objective">
            <span>LAB OBJECTIVE</span>
            <p>{scenario.objective}</p>
          </div>

          <div className="umask-step-heading">
            <div>
              <span>
                STEP {step + 1} / {total}
              </span>
              <h3>{frame.title}</h3>
              <p>{frame.description}</p>
            </div>

            <span className="umask-playback-status">
              {running ? "▶ Playing" : "Ⅱ Paused"}
            </span>
          </div>

          <PermissionDiagram
            mask={frame.mask}
            focus={frame.focus}
          />

          <div className="umask-bottom">
            <AnimatedTerminal
              key={`${mode}-${step}`}
              command={frame.command}
              output={frame.output}
              running={running}
              speed={speed}
              step={step}
            />

            <div className="umask-explanation">
              <span>WHY THIS COMMAND?</span>
              <p>{frame.explain}</p>

              <div className="umask-remember">
                <span>REMEMBER</span>
                <p>
                  UMASK removes permissions. It does not grant permissions
                  that are absent from the creation mode.
                </p>
              </div>
            </div>
          </div>

          <div className="umask-player">
            <button
              className="umask-play"
              onClick={togglePlayback}
            >
              {running ? "Ⅱ Pause" : "▶ Play"}
            </button>

            <button
              onClick={() => navigate(step - 1)}
              disabled={step === 0}
            >
              ← Prev
            </button>

            <button
              onClick={() => navigate(step + 1)}
              disabled={step === total - 1}
            >
              Next →
            </button>

            <div className="umask-player-spacer" />

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

          <div className="umask-progress">
            <div
              style={{
                width: `${(elapsed / STEP_DURATION) * 100}%`,
              }}
            />
          </div>

          <div className="umask-chapters">
            {scenario.steps.map((item, index) => (
              <button
                key={index}
                className={index === step ? "active" : ""}
                onClick={() => navigate(index)}
              >
                <span>0{index + 1}</span>
                {item.title}
              </button>
            ))}
          </div>
        </section>

        <UmaskCalculator />

        <footer className="umask-footer">
          RHCSA Visual Lab · Linux permissions · UMASK
        </footer>
      </div>
    </main>
  );
}
