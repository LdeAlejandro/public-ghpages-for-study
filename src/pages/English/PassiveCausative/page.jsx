import './page.css'

export const metadata = {
  title: 'Passive Causative: Have and Get Something Done',
  category: 'English',
  description: 'Learn to arrange services using have or get + object + past participle and request express service.',
  keywords: ['english', 'grammar', 'passive causative', 'have something done', 'get something done', 'services'],
  created: '2026-10-19',
}

const services = [
  ['dry-clean a suit', 'have a suit dry-cleaned'],
  ['repair shoes', 'get shoes repaired'],
  ['frame a picture', 'have a picture framed'],
  ['deliver a package', 'get a package delivered'],
  ['lengthen / shorten a skirt', 'have a skirt lengthened / shortened'],
  ['print a sign', 'get a sign printed'],
  ['copy a report', 'have a report copied'],
]

function Section({ number, title, subtitle, children }) {
  return <section className="content-section"><div className="section-heading"><span className="section-number">{number}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>{children}</section>
}

export default function PassiveCausative() {
  return <main className="english-lesson-page">
    <header className="page-header"><span className="page-category">English · Grammar · Lesson 2</span><h1>Passive Causative</h1><p className="page-intro">Use <strong>have</strong> or <strong>get</strong> when you arrange for someone else to perform a service.</p></header>
    <section className="summary-card"><span className="summary-label">Main idea</span><p className="summary-text">Focus on the service and the object receiving it, not on the person doing the work.</p><div className="formula-card"><strong>have / get</strong><b>+</b> object <b>+</b> <strong>past participle</strong></div><p className="section-text">I <strong>had</strong> my suit <strong>dry-cleaned</strong>. · She <strong>got</strong> her sandals <strong>repaired</strong>.</p></section>
    <Section number="01" title="What Is the Passive Causative?" subtitle="Someone else does the work for you."><div className="comparison-list"><div><span>I <strong>repaired</strong> my shoes.</span><small>I did the work</small></div><div><span>I <strong>had</strong> my shoes <strong>repaired</strong>.</span><small>Someone else did the work</small></div></div><div className="note-card"><strong>Important distinction</strong><p>In the passive causative, the object receives the action. The person performing the service is often not mentioned.</p></div></Section>
    <Section number="02" title="Have and Get" subtitle="Both verbs use the same basic structure."><div className="example-grid"><div className="example-card"><strong>Have</strong><p>I had my suit dry-cleaned.</p><p>They're having the office painted tomorrow.</p></div><div className="example-card"><strong>Get</strong><p>She can get her sandals repaired in an hour.</p><p>We got the report copied.</p></div></div><p className="section-text">The lesson treats <strong>have</strong> and <strong>get</strong> as equivalent in meaning for arranging services. <strong>Get</strong> is often more conversational in everyday usage.</p></Section>
    <Section number="03" title="Past Participles" subtitle="The final verb describes the completed service."><div className="vocabulary-list">{[['dry-clean','dry-cleaned'], ['repair','repaired'], ['frame','framed'], ['deliver','delivered'], ['shorten','shortened'], ['print','printed'], ['cut','cut']].map(([base, participle]) => <div className="vocabulary-item" key={base}><strong>{base}</strong><span>{participle}</span></div>)}</div><div className="note-card"><strong>Remember</strong><p>Past participles are not always formed with -ed. For example: <strong>cut → cut</strong>.</p></div></Section>
    <Section number="04" title="Vocabulary: Services" subtitle="Common things you can arrange for someone to do."><div className="vocabulary-list">{services.map(([service, example]) => <div className="vocabulary-item" key={service}><strong>{service}</strong><span>{example}</span></div>)}</div><p className="section-text">You can also have sweaters or pants dry-cleaned, a photo framed, or a dress shortened.</p></Section>
    <Section number="05" title="Using Different Tenses" subtitle="Change have or get; keep the final verb as a past participle."><div className="comparison-list"><div><span>I <strong>had</strong> my suit <strong>dry-cleaned</strong>.</span><small>Past</small></div><div><span>They're <strong>having</strong> the office <strong>painted</strong>.</span><small>Present continuous</small></div><div><span>She <strong>can get</strong> her sandals <strong>repaired</strong>.</span><small>Modal</small></div><div><span>I'll <strong>have</strong> the sign <strong>printed</strong>.</span><small>Future</small></div></div></Section>
    <Section number="06" title="Mentioning the Service Provider" subtitle="Use by when the person or company performing the service matters."><div className="formula-card">have / get + object + past participle + <strong>by + provider</strong></div><div className="example-card">We're having the office painted <strong>by Royal Painting Services</strong>.</div><div className="note-card"><strong>Note</strong><p>The <strong>by</strong> phrase is optional and is used when the provider is important information.</p></div></Section>
    <Section number="07" title="Requesting Express Service" subtitle="Ask whether a service can be finished by a deadline."><div className="conversation-card"><div><span className="speaker">A</span><p>Do you think I could get this jacket dry-cleaned by tomorrow?</p></div><div><span className="speaker">B</span><p>Tomorrow? That might be difficult.</p></div><div><span className="speaker">A</span><p>I'm sorry, but it's pretty urgent. My friend is getting married this weekend.</p></div><div><span className="speaker">B</span><p>Well, I'll see what I can do. But it won't be ready until after 4:00.</p></div><div><span className="speaker">A</span><p>I really appreciate it. Thanks!</p></div></div><div className="note-card"><strong>Useful expressions</strong><p>Do you think I could … by tomorrow? · It's pretty urgent. · I'll see what I can do. · I really appreciate it.</p></div></Section>
    <Section number="08" title="Questions and Deadlines" subtitle="Use polite questions with have or get."><div className="example-grid"><div className="example-card">Could I <strong>have</strong> these pictures <strong>framed</strong>?</div><div className="example-card">Can I <strong>get</strong> these shirts <strong>dry-cleaned</strong> by tomorrow?</div><div className="example-card">Where can I <strong>have</strong> this bowl <strong>gift-wrapped</strong>?</div><div className="example-card">Could I <strong>get</strong> these sandals <strong>repaired</strong> here?</div></div><p className="section-text">Common deadline phrases: <strong>by tomorrow</strong>, <strong>before 6:00</strong>, <strong>by Friday</strong>.</p></Section>
    <Section number="09" title="Active vs. Passive Causative" subtitle="These structures are related, but they are not interchangeable."><div className="comparison-list"><div><span>I <strong>had the technician repair</strong> my laptop.</span><small>Person + base verb</small></div><div><span>I <strong>had my laptop repaired</strong>.</span><small>Object + past participle</small></div><div><span>I <strong>got the technician to repair</strong> my laptop.</span><small>Person + to + verb</small></div><div><span>I <strong>got my laptop repaired</strong>.</span><small>Object + past participle</small></div></div></Section>
    <section className="final-reminder"><span>Quick Reference</span><h2>Have / get something done.</h2><p><strong>have / get + object + past participle</strong></p><p>Use this structure to arrange services. Add <strong>by + provider</strong> only when needed.</p></section>
  </main>
}
