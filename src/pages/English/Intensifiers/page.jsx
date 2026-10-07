import './page.css'

export const metadata = {
  title: 'Intensifiers',
  category: 'English',
  description:
    'Learn how to use pretty, really, so, incredibly, and unbelievably to increase the intensity of descriptions.',
  keywords: [
    'english',
    'grammar',
    'intensifiers',
    'pretty',
    'really',
    'so',
    'incredibly',
    'unbelievably',
    'adjectives',
    'intensity',
  ],
   created: '2026-10-07',
}

const intensifiers = [
  {
    word: 'pretty',
    strength: 1,
    example: 'I am pretty busy today.',
  },
  {
    word: 'really',
    strength: 2,
    example: 'I am really busy today.',
  },
  {
    word: 'so',
    strength: 2,
    example: 'I am so busy today!',
  },
  {
    word: 'incredibly',
    strength: 3,
    example: 'I am incredibly busy today.',
  },
  {
    word: 'unbelievably',
    strength: 4,
    example: 'I am unbelievably busy today.',
  },
]

function Strength({ value }) {
  return (
    <span
      className="strength"
      aria-label={`Strength ${value} of 4`}
    >
      {'+'.repeat(value)}
    </span>
  )
}

function Intensifiers() {
  return (
    <main className="intensifiers-page">
      <header className="page-header">
        <span className="page-category">
          English · Grammar
        </span>

        <h1>Intensifiers</h1>

        <p className="page-intro">
          Intensifiers make descriptions stronger. We can use
          different intensifiers depending on how strongly we want
          to describe something.
        </p>
      </header>

      <section className="summary-card">
        <span className="summary-label">Main idea</span>

        <p className="summary-text">
          These intensifiers express different degrees of intensity,
          from <strong>pretty</strong> to{' '}
          <strong>unbelievably</strong>.
        </p>

        <div className="main-scale">
          <div>
            <span>pretty</span>
            <Strength value={1} />
          </div>

          <span className="scale-arrow">→</span>

          <div>
            <span>really / so</span>
            <Strength value={2} />
          </div>

          <span className="scale-arrow">→</span>

          <div>
            <span>incredibly</span>
            <Strength value={3} />
          </div>

          <span className="scale-arrow">→</span>

          <div>
            <span>unbelievably</span>
            <Strength value={4} />
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">01</span>

          <div>
            <h2>What Are Intensifiers?</h2>

            <p>
              Intensifiers change the strength of a description.
            </p>
          </div>
        </div>

        <p className="section-text">
          Compare these sentences:
        </p>

        <div className="comparison-list">
          <div>
            <span>I'm busy.</span>
            <small>Basic description</small>
          </div>

          <div>
            <span>
              I'm <strong>pretty</strong> busy.
            </span>
            <small>Stronger</small>
          </div>

          <div>
            <span>
              I'm <strong>really</strong> busy.
            </span>
            <small>Even stronger</small>
          </div>

          <div>
            <span>
              I'm <strong>incredibly</strong> busy.
            </span>
            <small>Very strong</small>
          </div>

          <div>
            <span>
              I'm <strong>unbelievably</strong> busy.
            </span>
            <small>Extremely strong</small>
          </div>
        </div>

        <div className="note-card">
          <strong>The basic idea</strong>

          <p>
            The adjective stays the same. The intensifier changes
            how strongly you describe it.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">02</span>

          <div>
            <h2>Strength Scale</h2>

            <p>
              The intensifiers in this lesson have different levels
              of strength.
            </p>
          </div>
        </div>

        <div className="intensifier-table">
          <div className="table-header">
            <span>Intensifier</span>
            <span>Strength</span>
            <span>Example</span>
          </div>

          {intensifiers.map((item) => (
            <div className="table-row" key={item.word}>
              <strong>{item.word}</strong>

              <Strength value={item.strength} />

              <span>{item.example}</span>
            </div>
          ))}
        </div>

        <div className="scale-explanation">
          <span>
            <strong>+</strong> noticeable
          </span>

          <span>
            <strong>++</strong> strong
          </span>

          <span>
            <strong>+++</strong> very strong
          </span>

          <span>
            <strong>++++</strong> extremely strong
          </span>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">03</span>

          <div>
            <h2>Pretty</h2>

            <p>
              The weakest intensifier in this lesson.
            </p>
          </div>
        </div>

        <div className="word-header">
          <strong>pretty</strong>
          <Strength value={1} />
        </div>

        <p className="section-text">
          Here, <strong>pretty</strong> means something similar to
          “fairly” or “quite.” It makes the adjective stronger, but
          not extremely strong.
        </p>

        <div className="example-grid">
          <div className="example-card">
            I'm <strong>pretty busy</strong> today.
          </div>

          <div className="example-card">
            I'm <strong>pretty tired</strong>.
          </div>

          <div className="example-card">
            The test was <strong>pretty difficult</strong>.
          </div>

          <div className="example-card">
            You must be <strong>pretty hungry</strong>.
          </div>
        </div>

        <div className="note-card">
          <strong>Important</strong>

          <p>
            In “pretty hungry,” <strong>pretty</strong> does not mean
            beautiful. It is an intensifier.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">04</span>

          <div>
            <h2>Really and So</h2>

            <p>
              Both have a stronger intensity than pretty in this
              lesson.
            </p>
          </div>
        </div>

        <div className="double-word-grid">
          <div className="word-card">
            <div className="word-header">
              <strong>really</strong>
              <Strength value={2} />
            </div>

            <p>
              A very common intensifier in everyday English.
            </p>

            <div className="mini-examples">
              <span>
                I'm <strong>really busy</strong>.
              </span>

              <span>
                The movie was <strong>really good</strong>.
              </span>

              <span>
                It's <strong>really cold</strong> today.
              </span>
            </div>
          </div>

          <div className="word-card">
            <div className="word-header">
              <strong>so</strong>
              <Strength value={2} />
            </div>

            <p>
              Often sounds expressive or emotional.
            </p>

            <div className="mini-examples">
              <span>
                I'm <strong>so busy</strong> today!
              </span>

              <span>
                This is <strong>so good!</strong>
              </span>

              <span>
                Why is it <strong>so cold?</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="comparison-box">
          <div>
            <span>Really</span>

            <p>
              I'm <strong>really tired.</strong>
            </p>
          </div>

          <div>
            <span>So</span>

            <p>
              I'm <strong>so tired!</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">05</span>

          <div>
            <h2>Incredibly</h2>

            <p>
              Used when you want to make a description very strong.
            </p>
          </div>
        </div>

        <div className="word-header">
          <strong>incredibly</strong>
          <Strength value={3} />
        </div>

        <div className="example-grid">
          <div className="example-card">
            My day was <strong>incredibly busy</strong>.
          </div>

          <div className="example-card">
            The exam was <strong>incredibly difficult</strong>.
          </div>

          <div className="example-card">
            The application is <strong>incredibly fast</strong>.
          </div>

          <div className="example-card">
            The restaurant was <strong>incredibly crowded</strong>.
          </div>
        </div>

        <div className="intensity-comparison">
          <span>busy</span>
          <span>→</span>
          <span>really busy</span>
          <span>→</span>
          <strong>incredibly busy</strong>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">06</span>

          <div>
            <h2>Unbelievably</h2>

            <p>
              The strongest intensifier in this lesson.
            </p>
          </div>
        </div>

        <div className="word-header strongest-word">
          <strong>unbelievably</strong>
          <Strength value={4} />
        </div>

        <p className="section-text">
          <strong>Unbelievably</strong> expresses an extremely high
          degree. The situation is so strong that it can feel hard to
          believe.
        </p>

        <div className="example-grid">
          <div className="example-card">
            My schedule is{' '}
            <strong>unbelievably busy</strong>.
          </div>

          <div className="example-card">
            The traffic was{' '}
            <strong>unbelievably bad</strong>.
          </div>

          <div className="example-card">
            The test was{' '}
            <strong>unbelievably difficult</strong>.
          </div>

          <div className="example-card">
            The service was{' '}
            <strong>unbelievably slow</strong>.
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">07</span>

          <div>
            <h2>Where Does the Intensifier Go?</h2>

            <p>
              With adjectives, these intensifiers normally come
              before the adjective.
            </p>
          </div>
        </div>

        <div className="formula-card">
          <span>Subject</span>
          <span>+</span>
          <span>be</span>
          <span>+</span>
          <strong>intensifier</strong>
          <span>+</span>
          <strong>adjective</strong>
        </div>

        <div className="sentence-breakdown">
          <span>I am</span>
          <strong className="highlight-intensifier">
            incredibly
          </strong>
          <strong>busy.</strong>
        </div>

        <div className="sentence-breakdown">
          <span>The test was</span>
          <strong className="highlight-intensifier">
            really
          </strong>
          <strong>difficult.</strong>
        </div>

        <div className="sentence-breakdown">
          <span>You must be</span>
          <strong className="highlight-intensifier">
            pretty
          </strong>
          <strong>hungry.</strong>
        </div>

        <div className="note-card">
          <strong>Pattern</strong>

          <p>
            pretty busy · really busy · so busy · incredibly busy ·
            unbelievably busy
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">08</span>

          <div>
            <h2>Describing a Busy Schedule</h2>

            <p>
              Intensifiers are useful when talking about how busy your
              day has been.
            </p>
          </div>
        </div>

        <div className="conversation-card">
          <div>
            <span className="speaker">A</span>

            <p>So how was your day?</p>
          </div>

          <div>
            <span className="speaker">B</span>

            <p>
              <strong>Unbelievably busy.</strong> By 9:00 I had
              already finished several things.
            </p>
          </div>

          <div>
            <span className="speaker">A</span>

            <p>That's a lot to do before 9:00!</p>
          </div>

          <div>
            <span className="speaker">B</span>

            <p>
              And I was <strong>really busy</strong> for the rest of
              the morning.
            </p>
          </div>

          <div>
            <span className="speaker">A</span>

            <p>
              You must be <strong>pretty tired</strong> by now!
            </p>
          </div>
        </div>

        <div className="note-card">
          <strong>Notice</strong>

          <p>
            You don't need to use the strongest intensifier every
            time. Choose one according to how strong you want the
            description to sound.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">09</span>

          <div>
            <h2>Compare the Intensity</h2>

            <p>
              The same adjective can communicate different levels of
              intensity.
            </p>
          </div>
        </div>

        <div className="full-scale">
          <div>
            <span className="scale-level">Base</span>
            <strong>busy</strong>
          </div>

          <div>
            <span className="scale-level">+</span>
            <strong>pretty busy</strong>
          </div>

          <div>
            <span className="scale-level">++</span>
            <strong>really busy</strong>
          </div>

          <div>
            <span className="scale-level">++</span>
            <strong>so busy</strong>
          </div>

          <div>
            <span className="scale-level">+++</span>
            <strong>incredibly busy</strong>
          </div>

          <div>
            <span className="scale-level">++++</span>
            <strong>unbelievably busy</strong>
          </div>
        </div>
      </section>

      <section className="final-reminder">
        <span>Quick Reference</span>

        <h2>Choose how strong you want to sound.</h2>

        <div className="final-scale">
          <div>
            <strong>+</strong>
            <span>pretty</span>
          </div>

          <span>→</span>

          <div>
            <strong>++</strong>
            <span>really / so</span>
          </div>

          <span>→</span>

          <div>
            <strong>+++</strong>
            <span>incredibly</span>
          </div>

          <span>→</span>

          <div>
            <strong>++++</strong>
            <span>unbelievably</span>
          </div>
        </div>

        <p>
          I'm <strong>pretty busy.</strong>
        </p>

        <p>
          I'm <strong>really busy.</strong>
        </p>

        <p>
          I'm <strong>incredibly busy.</strong>
        </p>

        <p>
          I'm <strong>unbelievably busy.</strong>
        </p>
      </section>
    </main>
  )
}

export default Intensifiers