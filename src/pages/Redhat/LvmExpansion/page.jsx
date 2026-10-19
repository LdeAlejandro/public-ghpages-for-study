import { useEffect, useRef, useState } from 'react';
import './page.css';

export const metadata = {
  title: 'LVM Expansion — Visual Lab',
  category: 'RHCSA',
  description: 'Animated RHCSA LVM and XFS storage expansion laboratory.',
  keywords: ['linux', 'rhel', 'rhcsa', 'lvm', 'pv', 'vg', 'lv', 'xfs', 'lvextend', 'vgextend', 'xfs_growfs'],
  created: '2026-10-11',
};

const stage = (title, description, command, state, explanation, output) => ({
  title, description, command, state, explanation, output,
});

const scenarios = {
  free: {
    label: 'Use free VG space',
    objective: 'Extend /dev/vgdata/reports_lv by 2 GiB and grow its mounted XFS filesystem without losing data.',
    steps: [
      stage('Inspect storage', 'Read the current LV, filesystem and volume group sizes.', 'lsblk -f\nlvs -o lv_name,lv_size,vg_name,vg_size,vg_free', { vg: 8, lv: 4, fs: 4, disk: 8, pv: true, joined: true, focus: 'inspect' }, 'lsblk shows block devices and filesystem types. lvs reports logical volumes and VG capacity.', 'reports_lv: 4 GiB | VG free: 4 GiB'),
      stage('Check available space', 'Confirm the volume group has enough unallocated capacity.', 'vgs -o vg_name,vg_size,vg_free', { vg: 8, lv: 4, fs: 4, disk: 8, pv: true, joined: true, focus: 'vg' }, 'The VG has 4 GiB free. No new physical disk is required.', 'vgdata  8.00g  4.00g free'),
      stage('Extend the LV', 'Allocate 2 GiB from VG free space to the logical volume.', 'lvextend -L +2G /dev/vgdata/reports_lv', { vg: 8, lv: 6, fs: 4, disk: 8, pv: true, joined: true, focus: 'lv' }, '-L sets the size; +2G means add 2 GiB to the existing LV, not set its final size to 2 GiB.', 'Size of logical volume changed from 4 GiB to 6 GiB'),
      stage('Inspect the mismatch', 'The block device grew, but XFS still uses the old capacity.', 'lvs /dev/vgdata/reports_lv\ndf -hT /mnt/reports', { vg: 8, lv: 6, fs: 4, disk: 8, pv: true, joined: true, focus: 'gap' }, 'lvs checks the logical volume; df checks usable filesystem space. They can temporarily disagree.', 'LV: 6 GiB | XFS: 4 GiB | Gap: 2 GiB'),
      stage('Grow XFS online', 'Expand the mounted XFS filesystem to occupy the larger LV.', 'xfs_growfs /mnt/reports', { vg: 8, lv: 6, fs: 6, disk: 8, pv: true, joined: true, focus: 'fs' }, 'xfs_growfs takes the mounted filesystem path. XFS can grow while mounted.', 'XFS data blocks expanded to available device size'),
      stage('Verify the result', 'Confirm both the LV and XFS filesystem have grown.', 'lvs /dev/vgdata/reports_lv\ndf -hT /mnt/reports\nfindmnt /mnt/reports', { vg: 8, lv: 6, fs: 6, disk: 8, pv: true, joined: true, focus: 'verify' }, 'Check the LV size, filesystem size and mount point. Existing data remains in place.', 'LV: 6 GiB | XFS: 6 GiB | Mounted: yes'),
    ],
  },
  disk: {
    label: 'Add a new disk',
    objective: 'Add the dedicated empty lab disk /dev/vdc to vgdata, extend reports_lv by 2 GiB and grow XFS online.',
    steps: [
      stage('Identify the disk', 'Verify that /dev/vdc is the correct empty lab disk before modifying it.', 'lsblk -f\nwipefs -n /dev/vdc\nvgs', { vg: 8, lv: 8, fs: 8, disk: 12, pv: false, joined: false, focus: 'disk' }, 'wipefs -n previews signatures without writing. Never run pvcreate on a disk containing data you need.', '/dev/vdc: 4 GiB | VG free: 0 GiB'),
      stage('Initialize the PV', 'Prepare the empty disk for use by LVM.', 'pvcreate /dev/vdc\npvs /dev/vdc', { vg: 8, lv: 8, fs: 8, disk: 12, pv: true, joined: false, focus: 'pv' }, 'pvcreate writes LVM metadata to the selected device. It does not add the PV to a VG.', 'Physical volume /dev/vdc successfully created'),
      stage('Extend the VG', 'Join the new physical volume to vgdata.', 'vgextend vgdata /dev/vdc\nvgs -o vg_name,vg_size,vg_free', { vg: 12, lv: 8, fs: 8, disk: 12, pv: true, joined: true, focus: 'vg' }, 'vgextend adds the PV capacity to the volume group. Four new GiB become available.', 'vgdata: 12 GiB total | 4 GiB free'),
      stage('Extend the LV', 'Allocate 2 GiB from the expanded VG to reports_lv.', 'lvextend -L +2G /dev/vgdata/reports_lv', { vg: 12, lv: 10, fs: 8, disk: 12, pv: true, joined: true, focus: 'lv' }, 'The LV expands to 10 GiB. The filesystem remains at 8 GiB until it is grown.', 'LV: 10 GiB | XFS: 8 GiB'),
      stage('Grow XFS online', 'Grow the mounted XFS filesystem without unmounting.', 'xfs_growfs /mnt/reports', { vg: 12, lv: 10, fs: 10, disk: 12, pv: true, joined: true, focus: 'fs' }, 'The XFS filesystem expands to use the larger block device.', 'LV: 10 GiB | XFS: 10 GiB'),
      stage('Verify all layers', 'Verify the PV, VG, LV, filesystem and mount.', 'pvs\nvgs\nlvs\ndf -hT /mnt/reports\nfindmnt /mnt/reports', { vg: 12, lv: 10, fs: 10, disk: 12, pv: true, joined: true, focus: 'verify' }, 'Check each storage layer separately to confirm the full operation.', 'VG: 12 GiB | LV: 10 GiB | XFS: 10 GiB'),
    ],
  },
};

const DURATION = 4;
const SPEEDS = [0.5, 1, 1.5, 2, 3];

function CommandLine({ line, visible }) {
  const tokens = line.split(/(\s+)/);
  return <div className="lvm-command-line"><span className="lvm-prompt"># </span>{visible && tokens.map((token, i) => {
    let className = '';
    if (i === 0) className = 'lvm-cmd-name';
    else if (/^-/.test(token)) className = 'lvm-cmd-flag';
    else if (/^(\/dev\/|\/mnt\/)/.test(token)) className = 'lvm-cmd-path';
    else if (/^\+\d/.test(token)) className = 'lvm-cmd-number';
    return <span className={className} key={i}>{token}</span>;
  })}</div>;
}

function AnimatedTerminal({ step, progress, running, speed }) {
  const [copied, setCopied] = useState(false);
  const lines = step.command.split('\n');
  const chars = Math.floor(Math.min(1, progress / 0.43) * step.command.length);
  const visibleText = step.command.slice(0, chars);
  const displayed = visibleText.split('\n');
  useEffect(() => setCopied(false), [step]);
  async function copy() {
    try { await navigator.clipboard.writeText(step.command); setCopied(true); }
    catch { setCopied(false); }
  }
  return <section className="lvm-terminal">
    <header><span><i className="lvm-terminal-dot" /> root@rhcsa-server</span><button type="button" onClick={copy}>{copied ? 'Copied ✓' : 'Copy commands'}</button></header>
    <div className="lvm-terminal-body" aria-label="Simulated terminal output">
      {displayed.map((line, i) => <CommandLine key={i} line={line} visible={true} />)}
      {progress < 0.43 && running && <span className="lvm-cursor">▌</span>}
      {progress >= 0.53 && <div className="lvm-command-result"><span>✓</span> {step.output}</div>}
    </div>
    <footer>Simulated output · Commands are not executed on your machine</footer>
  </section>;
}

function CapacityBar({ title, value, total, color, previous, focus }) {
  return <div className={'lvm-capacity-card' + (focus ? ' is-focused' : '')} style={{ '--layer-color': color }}>
    <div className="lvm-capacity-heading"><span>{title}</span><strong>{value} <small>GiB</small></strong></div>
    <div className="lvm-capacity-track" role="img" aria-label={`${title}: ${value} of ${total} GiB`}>
      <div className="lvm-capacity-fill" style={{ width: `${100 * value / total}%` }} />
      {previous != null && previous < value && <div className="lvm-capacity-added" style={{ left: `${100 * previous / total}%`, width: `${100 * (value - previous) / total}%` }} />}
    </div>
    <span className="lvm-capacity-foot">{title === 'VOLUME GROUP' ? `${value} GiB total` : `Capacity: ${value} GiB`}</span>
  </div>;
}

function StorageDiagram({ state, previous, progress, mode }) {
  const { vg, lv, fs, disk, pv, joined, focus } = state;
  const free = vg - lv;
  const gap = lv - fs;
  const total = 12;
  const pulse = progress > 0.43 && progress < 0.9;
  return <section className="lvm-storage" aria-label="Animated storage layer diagram">
    <div className="lvm-storage-heading"><span>LIVE STORAGE MODEL</span><span className="lvm-storage-hint">Schematic capacities · GiB</span></div>
    <div className="lvm-storage-pipeline">
      <div className={'lvm-storage-node' + (focus === 'disk' || focus === 'pv' ? ' active' : '')}>
        <span className="lvm-node-kicker">PHYSICAL DISK / PV</span><strong>{mode === 'disk' ? '/dev/vdc' : '/dev/vdb'}</strong>
        <span>{mode === 'disk' ? `4 GiB · ${pv ? 'PV ready' : 'Not initialized'}` : '8 GiB · PV ready'}</span>
      </div>
      <div className={'lvm-pipeline-arrow' + (pulse && (focus === 'pv' || focus === 'vg') ? ' flowing' : '')}>→</div>
      <div className={'lvm-storage-node' + (focus === 'vg' ? ' active' : '')}>
        <span className="lvm-node-kicker">VOLUME GROUP</span><strong>vgdata</strong><span>{vg} GiB total · {free} GiB free</span>
      </div>
      <div className={'lvm-pipeline-arrow' + (pulse && focus === 'lv' ? ' flowing' : '')}>→</div>
      <div className={'lvm-storage-node' + (focus === 'lv' || focus === 'gap' ? ' active' : '')}>
        <span className="lvm-node-kicker">LOGICAL VOLUME</span><strong>reports_lv</strong><span>{lv} GiB allocated</span>
      </div>
      <div className={'lvm-pipeline-arrow' + (pulse && focus === 'fs' ? ' flowing' : '')}>→</div>
      <div className={'lvm-storage-node' + (focus === 'fs' || focus === 'verify' ? ' active' : '')}>
        <span className="lvm-node-kicker">FILESYSTEM</span><strong>XFS</strong><span>{fs} GiB · /mnt/reports</span>
      </div>
    </div>
    <div className="lvm-capacity-grid">
      <div className="lvm-capacity-card" style={{ '--layer-color': 'var(--lvm-vg)' }}>
        <div className="lvm-capacity-heading"><span>VG CAPACITY</span><strong>{vg} <small>GiB</small></strong></div>
        <div className="lvm-segments">{Array.from({ length: total }, (_, i) => <div key={i} className={i >= vg ? 'absent' : i < lv ? 'allocated' : 'free'} />)}</div>
        <span className="lvm-capacity-foot">{lv} GiB allocated · {free} GiB free</span>
      </div>
      <CapacityBar title="LOGICAL VOLUME" value={lv} total={total} color="var(--lvm-lv)" previous={previous?.lv} focus={focus === 'lv'} />
      <CapacityBar title="XFS FILESYSTEM" value={fs} total={total} color="var(--lvm-fs)" previous={previous?.fs} focus={focus === 'fs'} />
    </div>
    {gap > 0 ? <div className="lvm-storage-warning">⚠ {gap} GiB allocated to LV but not yet available in XFS. Run xfs_growfs.</div> : <div className="lvm-storage-success">✓ LV and filesystem capacities are synchronized.</div>}
    {mode === 'disk' && !joined && <p className="lvm-storage-note">The new disk is not part of vgdata yet. Run vgextend to make its capacity available.</p>}
  </section>;
}

export default function LvmExpansion({ autoPlay = false }) {
  const [mode, setMode] = useState('free');
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(autoPlay);
  const [elapsed, setElapsed] = useState(0);
  const lastTick = useRef(null);
  const scenario = scenarios[mode];
  const step = scenario.steps[index];
  const previous = index > 0 ? scenario.steps[index - 1].state : null;
  const progress = Math.min(1, elapsed / DURATION);

  useEffect(() => {
    if (!running) { lastTick.current = null; return; }
    let raf;
    const tick = time => {
      if (lastTick.current != null && !document.hidden) {
        const delta = Math.min(0.1, (time - lastTick.current) / 1000) * speed;
        setElapsed(t => Math.min(DURATION, t + delta));
      }
      lastTick.current = time;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); lastTick.current = null; };
  }, [running, speed]);

  useEffect(() => {
    if (!running || elapsed < DURATION) return;
    if (index < scenario.steps.length - 1) { setIndex(i => i + 1); setElapsed(0); }
    else setRunning(false);
  }, [elapsed, running, index, scenario.steps.length]);

  function seek(i) { setIndex(Math.max(0, Math.min(scenario.steps.length - 1, i))); setElapsed(0); setRunning(false); }
  function switchMode(next) { setMode(next); setIndex(0); setElapsed(0); setRunning(false); }
  function toggle() {
    if (!running && index === scenario.steps.length - 1 && elapsed >= DURATION) { setIndex(0); setElapsed(0); }
    setRunning(v => !v);
  }
  function reset() { setIndex(0); setElapsed(0); setRunning(false); }
  function keydown(e) {
    if (/BUTTON|INPUT|TEXTAREA|SELECT|A/.test(e.target.tagName)) return;
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); seek(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); seek(index - 1); }
  }
  return <main className="lvm-study-page" tabIndex={0} onKeyDown={keydown}>
    <div className="lvm-content">
      <div className="lvm-eyebrow">RHCSA / RHEL 10 · INTERACTIVE LAB</div>
      <div className="lvm-title-row"><div><h1>Make room. Keep your data.</h1><p>Watch Linux storage change as each command runs.</p></div><span className="lvm-rhel-tag">LVM + XFS</span></div>
      <div className="lvm-panel">
        <header className="lvm-toolbar"><div><h2>Extend a logical volume</h2><p>Every command has a visible consequence.</p></div><div className="lvm-tabs">{Object.entries(scenarios).map(([key, item]) => <button type="button" key={key} aria-pressed={mode === key} onClick={() => switchMode(key)}>{item.label}</button>)}</div></header>
        <div className="lvm-objective"><span>LAB OBJECTIVE</span><p>{scenario.objective}</p></div>
        <div className="lvm-step-header"><div><span>STEP {index + 1} / {scenario.steps.length}</span><h3>{step.title}</h3><p>{step.description}</p></div><span className="lvm-phase">{running ? '● Playing' : 'Ⅱ Paused'}</span></div>
        <StorageDiagram state={step.state} previous={previous} progress={progress} mode={mode} />
        <div className="lvm-lower">
          <AnimatedTerminal step={step} progress={progress} running={running} speed={speed} />
          <aside className="lvm-explainer"><span>WHY THIS COMMAND?</span><p>{step.explanation}</p><div className="lvm-tip"><strong>REMEMBER</strong><p>{step.state.lv !== step.state.fs ? 'Growing an LV does not automatically grow its filesystem.' : 'PV → VG → LV → filesystem → mount point'}</p></div></aside>
        </div>
        <div className="lvm-controls"><button type="button" onClick={toggle} className="lvm-play">{running ? 'Ⅱ Pause' : '▶ Play'}</button><button type="button" onClick={() => seek(index - 1)} disabled={index === 0}>← Prev</button><button type="button" onClick={() => seek(index + 1)} disabled={index === scenario.steps.length - 1}>Next →</button><label>Speed <select value={speed} onChange={e => setSpeed(Number(e.target.value))}>{SPEEDS.map(n => <option key={n} value={n}>{n}×</option>)}</select></label><button type="button" onClick={reset}>↺ Restart</button></div>
        <div className="lvm-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}><div style={{ width: `${progress * 100}%` }} /></div>
        <nav className="lvm-chapters" aria-label="Lab steps">{scenario.steps.map((s, i) => <button key={i} type="button" onClick={() => seek(i)} className={i === index ? 'active' : i < index ? 'done' : ''}><span>{String(i + 1).padStart(2, '0')}</span>{s.title}</button>)}</nav>
      </div>
      <div className="lvm-shortcut"><div><span>ONE-COMMAND ALTERNATIVE</span><code>lvextend -r -L +2G /dev/vgdata/reports_lv</code></div><p><strong>-r</strong> requests filesystem resizing together with LV expansion, provided the VG has enough free space. The lab uses separate commands so you can see each layer change.</p></div>
      <footer className="lvm-footer">Illustrative values and simulated terminal output. Nothing is executed. XFS can grow online but cannot be shrunk.</footer>
    </div>
  </main>;
}
