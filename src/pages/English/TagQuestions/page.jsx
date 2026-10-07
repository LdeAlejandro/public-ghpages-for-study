import './page.css'

export const metadata = {
  title: 'Tag Questions',
  category: 'English',
  description:
    'Learn how to form and use tag questions with positive and negative statements, auxiliary verbs, and common special cases.',
  keywords: [
    'english',
    'grammar',
    'tag questions',
    'question tags',
    'auxiliary verbs',
    'do',
    'does',
    'did',
    'is',
    'are',
    'was',
    'were',
  ],
  created: '2026-10-07',
}

const examples = [
  {
    statement: 'You are tired,',
    tag: "aren't you?",
  },
  {
    statement: "She isn't working,",
    tag: 'is she?',
  },
  {
    statement: 'They like pizza,',
    tag: "don't they?",
  },
  {
    statement: "He doesn't live here,",
    tag: 'does he?',
  },
]

const auxiliaryGroups = [
  {
    title: 'Be',
    items: [
      ['She is Brazilian,', "isn't she?"],
      ["They aren't ready,", 'are they?'],
      ['He was tired,', "wasn't he?"],
      ["You weren't busy,", 'were you?'],
    ],
  },
  {
    title: 'Do / Does / Did',
    items: [
      ['You work here,', "don't you?"],
      ['She likes coffee,', "doesn't she?"],
      ['They arrived early,', "didn't they?"],
      ["He didn't call,", 'did he?'],
    ],
  },
  {
    title: 'Have',
    items: [
      ['You have finished,', "haven't you?"],
      ["She hasn't arrived,", 'has she?'],
      ['They had left,', "hadn't they?"],
    ],
  },
  {
    title: 'Modal Verbs',
    items: [
      ['You can swim,', "can't you?"],
      ["She won't come,", 'will she?'],
      ['They should leave,', "shouldn't they?"],
      ["He couldn't help,", 'could he?'],
    ],
  },
]

function TagQuestions() {
  return (
    <main className="tag-page">
      <header className="page-header">
        <span className="page-category">English · Grammar</span>

        <h1>Tag Questions</h1>

        <p className="page-intro">
          Tag questions are short questions added to the end of a
          statement. We often use them to confirm information or ask
          another person to agree with us.
        </p>
      </header>

      <section className="summary-card">
        <span className="summary-label">Main idea</span>

        <p className="summary-text">
          A positive statement normally takes a negative tag, while a
          negative statement normally takes a positive tag.
        </p>

        <div className="main-rule">
          <div>
            <span className="rule-positive">Positive statement</span>
            <span className="rule-arrow">→</span>
            <span className="rule-negative">Negative tag</span>
          </div>

          <div>
            <span className="rule-negative">Negative statement</span>
            <span className="rule-arrow">→</span>
            <span className="rule-positive">Positive tag</span>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <h2>Basic Structure</h2>
            <p>The tag usually does the opposite of the statement.</p>
          </div>
        </div>

        <div className="example-grid">
          {examples.map((example) => (
            <div
              className="example-card"
              key={`${example.statement}-${example.tag}`}
            >
              <span>{example.statement}</span>
              <strong>{example.tag}</strong>
            </div>
          ))}
        </div>

        <div className="note-card">
          <strong>Quick rule</strong>
          <p>
            Look at whether the statement is positive or negative first.
            Then make the tag the opposite.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">02</span>
          <div>
            <h2>Use the Same Auxiliary Verb</h2>
            <p>
              The tag normally repeats the auxiliary verb from the
              statement.
            </p>
          </div>
        </div>

        <div className="comparison">
          <div className="comparison-card">
            <span className="comparison-label">Statement</span>
            <p>
              She <strong>is</strong> working.
            </p>
          </div>

          <span className="comparison-arrow">→</span>

          <div className="comparison-card">
            <span className="comparison-label">Tag</span>
            <p>
              <strong>isn't</strong> she?
            </p>
          </div>
        </div>

        <div className="comparison">
          <div className="comparison-card">
            <span className="comparison-label">Statement</span>
            <p>
              They <strong>have</strong> finished.
            </p>
          </div>

          <span className="comparison-arrow">→</span>

          <div className="comparison-card">
            <span className="comparison-label">Tag</span>
            <p>
              <strong>haven't</strong> they?
            </p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">03</span>
          <div>
            <h2>When There Is No Auxiliary</h2>
            <p>
              With Simple Present and Simple Past statements, use
              do, does, or did when necessary.
            </p>
          </div>
        </div>

        <div className="formula-card">
          <span>Simple Present</span>
          <strong>do / does</strong>
        </div>

        <div className="sentence-example">
          <span>You like coffee,</span>
          <strong>don't you?</strong>
        </div>

        <div className="sentence-example">
          <span>She works here,</span>
          <strong>doesn't she?</strong>
        </div>

        <div className="formula-card">
          <span>Simple Past</span>
          <strong>did</strong>
        </div>

        <div className="sentence-example">
          <span>They arrived yesterday,</span>
          <strong>didn't they?</strong>
        </div>

        <div className="sentence-example">
          <span>He didn't call you,</span>
          <strong>did he?</strong>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">04</span>
          <div>
            <h2>Choose the Correct Pronoun</h2>
            <p>
              The subject in the statement normally becomes a pronoun
              in the tag.
            </p>
          </div>
        </div>

        <div className="pronoun-list">
          <div>
            <span>Maria is tired,</span>
            <strong>isn't she?</strong>
          </div>

          <div>
            <span>John works here,</span>
            <strong>doesn't he?</strong>
          </div>

          <div>
            <span>The computer is working,</span>
            <strong>isn't it?</strong>
          </div>

          <div>
            <span>The students arrived,</span>
            <strong>didn't they?</strong>
          </div>
        </div>

        <div className="note-card">
          <strong>Remember</strong>
          <p>
            Don't repeat the person's name in the tag. Use the
            appropriate pronoun instead.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">05</span>
          <div>
            <h2>Common Auxiliary Verbs</h2>
            <p>
              These patterns cover many of the tag questions you'll
              encounter.
            </p>
          </div>
        </div>

        <div className="auxiliary-grid">
          {auxiliaryGroups.map((group) => (
            <div className="auxiliary-card" key={group.title}>
              <h3>{group.title}</h3>

              {group.items.map(([statement, tag]) => (
                <div
                  className="auxiliary-example"
                  key={`${statement}-${tag}`}
                >
                  <span>{statement}</span>
                  <strong>{tag}</strong>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">06</span>
          <div>
            <h2>Special Cases</h2>
            <p>
              A few common tag questions don't follow the most obvious
              pattern.
            </p>
          </div>
        </div>

        <div className="special-cases">
          <article className="special-card">
            <span className="special-title">I am</span>
            <p>
              I'm late, <strong>aren't I?</strong>
            </p>
            <small>
              We normally use <strong>aren't I?</strong>, not
              “amn't I?”
            </small>
          </article>

          <article className="special-card">
            <span className="special-title">Let's</span>
            <p>
              Let's go, <strong>shall we?</strong>
            </p>
          </article>

          <article className="special-card">
            <span className="special-title">Imperatives</span>
            <p>
              Open the door, <strong>will you?</strong>
            </p>
          </article>

          <article className="special-card">
            <span className="special-title">Nobody / Nothing</span>
            <p>
              Nobody called, <strong>did they?</strong>
            </p>
            <small>
              Words such as nobody, nothing, and never already have a
              negative meaning, so the tag is positive.
            </small>
          </article>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">07</span>
          <div>
            <h2>Meaning and Intonation</h2>
            <p>
              The same structure can be used either to check information
              or to ask for agreement.
            </p>
          </div>
        </div>

        <div className="intonation-grid">
          <div className="intonation-card">
            <span className="intonation-symbol">↗</span>

            <div>
              <h3>Rising intonation</h3>
              <p>You aren't sure and are genuinely asking.</p>
              <blockquote>
                You work here, <strong>don't you? ↗</strong>
              </blockquote>
            </div>
          </div>

          <div className="intonation-card">
            <span className="intonation-symbol">↘</span>

            <div>
              <h3>Falling intonation</h3>
              <p>
                You expect the other person to agree or confirm what
                you believe.
              </p>
              <blockquote>
                It's a beautiful day, <strong>isn't it? ↘</strong>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="section-number">08</span>
          <div>
            <h2>How to Build a Tag Question</h2>
            <p>Use this process when you're unsure.</p>
          </div>
        </div>

        <div className="steps">
          <div className="step">
            <span>1</span>
            <p>
              Check whether the statement is
              <strong> positive or negative</strong>.
            </p>
          </div>

          <div className="step">
            <span>2</span>
            <p>
              Find the <strong>auxiliary verb</strong>.
            </p>
          </div>

          <div className="step">
            <span>3</span>
            <p>
              Make the auxiliary <strong>opposite</strong>.
            </p>
          </div>

          <div className="step">
            <span>4</span>
            <p>
              Change the subject to the correct
              <strong> pronoun</strong>.
            </p>
          </div>
        </div>

        <div className="build-example">
          <span className="build-title">Example</span>

          <p className="build-sentence">
            Sarah <strong>likes</strong> cats.
          </p>

          <div className="build-flow">
            <span>Positive statement</span>
            <span>→</span>
            <span>Simple Present</span>
            <span>→</span>
            <span>does</span>
            <span>→</span>
            <span>negative</span>
            <span>→</span>
            <strong>doesn't she?</strong>
          </div>

          <p className="build-result">
            Sarah likes cats, <strong>doesn't she?</strong>
          </p>
        </div>
      </section>

      <section className="final-reminder">
        <span>Quick Reference</span>

        <h2>Statement + opposite auxiliary + pronoun?</h2>

        <div className="final-examples">
          <p>
            Positive → <strong>negative tag</strong>
          </p>

          <p>
            Negative → <strong>positive tag</strong>
          </p>
        </div>

        <p>
          She is tired, <strong>isn't she?</strong>
        </p>

        <p>
          She isn't tired, <strong>is she?</strong>
        </p>
      </section>
    </main>
  )
}

export default TagQuestions