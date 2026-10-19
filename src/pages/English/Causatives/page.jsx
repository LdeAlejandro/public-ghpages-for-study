import './page.css'

export const metadata = {
  title: 'Causatives: Get, Have, and Make',
  category: 'English',
  description: 'Learn how to get, have, or make someone do something, and how to ask for favors.',
  keywords: ['english', 'grammar', 'causatives', 'get', 'have', 'make', 'favors'],
  created: '2026-10-19',
}

const patterns = [
  { word: 'get', formula: 'get + person + to + base verb', meaning: 'Persuade or arrange for someone to do something.', examples: ['I got the company to agree to a new date.', 'They got the students to clean up after the party.'] },
  { word: 'have', formula: 'have + person + base verb', meaning: 'Ask, instruct, or arrange for someone to do something.', examples: ['I had my assistant plan the meeting.', 'They had the bellman bring the bags to their rooms.'] },
  { word: 'make', formula: 'make + person + base verb', meaning: 'Require or force someone to do something.', examples: ['I made my brother help me finish the job.', 'They made him sign the form.'] },
]

const favors = [
  ['give someone a ride', 'Could you give me a ride to work?'],
  ['keep an eye on something', 'Could you keep an eye on my things?'],
  ['lend someone something', 'Would you mind lending me your pen?'],
  ['fill in for someone', 'Could you fill in for me?'],
  ['pick something up', 'Could you pick up a sandwich for me?'],
]

function Section({ number, title, subtitle, children }) {
  return <section className="content-section"><div className="section-heading"><span className="section-number">{number}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>{children}</section>
}

export default function Causatives() {
  return <main className="english-lesson-page">
    <header className="page-header"><span className="page-category">English · Grammar · Lesson 1</span><h1>Causatives: Get, Have, and Make</h1><p className="page-intro">Use causative verbs when one person causes another person to do something.</p></header>
    <section className="summary-card"><span className="summary-label">Main idea</span><p className="summary-text">The choice of verb changes the meaning: <strong>get</strong> often suggests persuasion, <strong>have</strong> suggests an instruction or arrangement, and <strong>make</strong> suggests an obligation.</p><div className="pattern-grid">{patterns.map(p => <div className="pattern-tile" key={p.word}><strong>{p.word}</strong><code>{p.formula}</code></div>)}</div></section>
    <Section number="01" title="How Causatives Work" subtitle="The person after the causative verb performs the action."><div className="formula-card">Subject <b>+</b> get / have / make <b>+</b> person <b>+</b> verb</div><p className="section-text">Pay attention to the verb after the person: <strong>get</strong> requires <strong>to</strong>, but <strong>have</strong> and <strong>make</strong> do not.</p></Section>
    {patterns.map((p, i) => <Section key={p.word} number={`0${i+2}`} title={`Using ${p.word.toUpperCase()}`} subtitle={p.meaning}><div className="formula-card"><strong>{p.formula}</strong></div><div className="example-grid">{p.examples.map(e => <div className="example-card" key={e}>{e}</div>)}</div><div className="note-card"><strong>Remember</strong><p>{p.word === 'get' ? 'Use to before the action: got him to help.' : p.word === 'have' ? 'Do not use to: had him help.' : 'Do not use to: made him help.'}</p></div></Section>)}
    <Section number="05" title="Compare the Three Verbs" subtitle="Similar structure, different implications."><div className="comparison-list"><div><span>I <strong>got</strong> him <strong>to clean</strong> the room.</span><small>Persuasion</small></div><div><span>I <strong>had</strong> him <strong>clean</strong> the room.</span><small>Instruction / arrangement</small></div><div><span>I <strong>made</strong> him <strong>clean</strong> the room.</span><small>Obligation</small></div></div></Section>
    <Section number="06" title="Vocabulary: Asking for Favors" subtitle="Useful phrases for getting help from another person."><div className="vocabulary-list">{favors.map(([term, example]) => <div className="vocabulary-item" key={term}><strong>{term}</strong><span>{example}</span></div>)}</div></Section>
    <Section number="07" title="Conversation: Asking for a Favor" subtitle="Use polite requests and offer an alternative when necessary."><div className="conversation-card"><div><span className="speaker">A</span><p>Martin, I wonder if you could do me a favor.</p></div><div><span className="speaker">B</span><p>Sure. What do you need?</p></div><div><span className="speaker">A</span><p>My car's at the repair shop and I need to pick it up at 3:00. Do you think you could give me a ride?</p></div><div><span className="speaker">B</span><p>I would, but I have a doctor's appointment at 2:00.</p></div><div><span className="speaker">A</span><p>Oh, that's OK. I understand.</p></div><div><span className="speaker">B</span><p>Maybe you could get Jack to take you.</p></div><div><span className="speaker">A</span><p>Good idea.</p></div></div><div className="note-card"><strong>Accepting a request</strong><p>I understand. · No problem. · Don't worry about it.</p></div></Section>
    <section className="final-reminder"><span>Quick Reference</span><h2>Choose the right causative.</h2><p><strong>get someone to do</strong> · <strong>have someone do</strong> · <strong>make someone do</strong></p><p>With <strong>get</strong>, use <strong>to</strong>. With <strong>have</strong> and <strong>make</strong>, use the base verb.</p></section>
  </main>
}
