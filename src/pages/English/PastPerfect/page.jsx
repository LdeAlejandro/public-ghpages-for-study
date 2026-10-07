import './page.css'

export const metadata = {
  title: 'Past Perfect',
  category: 'English',
  description:
    'Learn how to use the Past Perfect through scenarios, timelines and examples.',
  keywords: [
    'english',
    'grammar',
    'past perfect',
    'had',
    'v3',
    'past participle',
  ],
  created: '2026-10-06',
}

function PastPerfect() {
  return (
    <main className="lesson">
      <header className="lesson-header">
        <span className="lesson-category">English · Grammar</span>

        <h1>Past Perfect</h1>

        <p className="lesson-intro">
          Use the <strong>Past Perfect</strong> when talking about two events
          in the past and you want to make clear which event happened first.
        </p>
      </header>

      <section className="lesson-section">
        <h2>The main idea</h2>

        <div className="concept-card">
          <p className="concept-question">
            Two things happened in the past. Which happened first?
          </p>

          <div className="timeline">
            <div className="timeline-event first">
              <span className="timeline-label">FIRST</span>
              <strong>I had eaten breakfast.</strong>
              <span>Past Perfect</span>
            </div>

            <div className="timeline-arrow">→</div>

            <div className="timeline-event second">
              <span className="timeline-label">THEN</span>
              <strong>I went to work.</strong>
              <span>Simple Past</span>
            </div>
          </div>

          <p className="example-sentence">
            I <mark>had eaten</mark> breakfast before I went to work.
          </p>
        </div>
      </section>

      <section className="lesson-section">
        <h2>Structure</h2>

        <div className="formula">
          <span>Subject</span>
          <strong>+</strong>
          <span className="formula-highlight">had</span>
          <strong>+</strong>
          <span className="formula-highlight">V3</span>
        </div>

        <p className="section-note">
          <strong>V3</strong> means the past participle form of the verb.
        </p>

        <div className="verb-table-wrapper">
          <table className="verb-table">
            <thead>
              <tr>
                <th>Verb</th>
                <th>Past (V2)</th>
                <th>Past Participle (V3)</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>eat</td>
                <td>ate</td>
                <td>eaten</td>
              </tr>
              <tr>
                <td>go</td>
                <td>went</td>
                <td>gone</td>
              </tr>
              <tr>
                <td>see</td>
                <td>saw</td>
                <td>seen</td>
              </tr>
              <tr>
                <td>do</td>
                <td>did</td>
                <td>done</td>
              </tr>
              <tr>
                <td>finish</td>
                <td>finished</td>
                <td>finished</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section">
        <h2>Scenario 1 — Arriving somewhere</h2>

        <div className="scenario">
          <div className="scenario-story">
            <div className="event">
              <span className="event-number">1</span>
              <div>
                <strong>The movie started.</strong>
                <p>8:00 PM</p>
              </div>
            </div>

            <div className="event">
              <span className="event-number">2</span>
              <div>
                <strong>We arrived.</strong>
                <p>8:20 PM</p>
              </div>
            </div>
          </div>

          <div className="result">
            <span>Result</span>
            <p>
              When we arrived, the movie <mark>had already started</mark>.
            </p>
          </div>
        </div>
      </section>

      <section className="lesson-section">
        <h2>Scenario 2 — Missing something</h2>

        <div className="scenario">
          <div className="scenario-story">
            <div className="event">
              <span className="event-number">1</span>
              <div>
                <strong>The bus left.</strong>
                <p>This happened first.</p>
              </div>
            </div>

            <div className="event">
              <span className="event-number">2</span>
              <div>
                <strong>Sarah arrived at the bus stop.</strong>
                <p>This happened later.</p>
              </div>
            </div>
          </div>

          <div className="result">
            <span>Result</span>
            <p>
              The bus <mark>had left</mark> when Sarah arrived at the bus stop.
            </p>
          </div>
        </div>
      </section>

      <section className="lesson-section">
        <h2>Scenario 3 — Cause and result</h2>

        <div className="scenario">
          <div className="scenario-story">
            <div className="event">
              <span className="event-number">1</span>
              <div>
                <strong>Tom didn't sleep well.</strong>
                <p>Earlier event</p>
              </div>
            </div>

            <div className="event">
              <span className="event-number">2</span>
              <div>
                <strong>Tom was tired at work.</strong>
                <p>Later result</p>
              </div>
            </div>
          </div>

          <div className="result">
            <span>Result</span>
            <p>
              Tom was tired because he <mark>hadn't slept</mark> well.
            </p>
          </div>
        </div>
      </section>

      <section className="lesson-section">
        <h2>Positive, negative and questions</h2>

        <div className="grammar-grid">
          <article className="grammar-card">
            <span className="grammar-type">Positive</span>
            <h3>had + V3</h3>
            <p>
              She <mark>had finished</mark> her work before dinner.
            </p>
          </article>

          <article className="grammar-card">
            <span className="grammar-type">Negative</span>
            <h3>had not + V3</h3>
            <p>
              She <mark>hadn't finished</mark> her work before dinner.
            </p>
          </article>

          <article className="grammar-card">
            <span className="grammar-type">Question</span>
            <h3>Had + subject + V3?</h3>
            <p>
              <mark>Had she finished</mark> her work before dinner?
            </p>
          </article>
        </div>
      </section>

      <section className="lesson-section">
        <h2>Simple Past vs Past Perfect</h2>

        <div className="comparison">
          <div className="comparison-card">
            <span>Simple Past</span>
            <p className="comparison-example">
              I <strong>ate</strong> breakfast.
            </p>
            <p>
              Describes something that happened in the past.
            </p>
          </div>

          <div className="comparison-card highlighted">
            <span>Past Perfect</span>
            <p className="comparison-example">
              I <strong>had eaten</strong> breakfast before I left.
            </p>
            <p>
              Shows that eating happened before another past event.
            </p>
          </div>
        </div>
      </section>

      <section className="lesson-section">
        <h2>Common words</h2>

        <div className="word-list">
          <span>before</span>
          <span>after</span>
          <span>when</span>
          <span>by the time</span>
          <span>already</span>
          <span>just</span>
          <span>never</span>
        </div>

        <div className="examples">
          <p>
            I <mark>had finished</mark> my work <strong>before</strong> she
            called.
          </p>

          <p>
            <strong>By the time</strong> we arrived, they{' '}
            <mark>had already left</mark>.
          </p>

          <p>
            She <mark>had never seen</mark> snow before she moved to Canada.
          </p>

          <p>
            He <mark>had just finished</mark> dinner when I called him.
          </p>
        </div>
      </section>

      <section className="lesson-section">
        <h2>A useful way to think about it</h2>

        <div className="rule-box">
          <div className="rule-step">
            <span>1</span>
            <p>Identify two events in the past.</p>
          </div>

          <div className="rule-arrow">→</div>

          <div className="rule-step">
            <span>2</span>
            <p>Ask which event happened first.</p>
          </div>

          <div className="rule-arrow">→</div>

          <div className="rule-step">
            <span>3</span>
            <p>Use Past Perfect for the earlier event.</p>
          </div>
        </div>
      </section>

      <section className="lesson-section">
        <h2>More examples</h2>

        <div className="example-list">
          <div>
            <span>01</span>
            <p>
              I <mark>had had</mark> breakfast when we arrived.
            </p>
          </div>

          <div>
            <span>02</span>
            <p>
              She <mark>had studied</mark> English before she moved abroad.
            </p>
          </div>

          <div>
            <span>03</span>
            <p>
              They <mark>had already eaten</mark> when I got home.
            </p>
          </div>

          <div>
            <span>04</span>
            <p>
              I <mark>had never used</mark> Linux before I started studying
              RHEL.
            </p>
          </div>

          <div>
            <span>05</span>
            <p>
              The server <mark>had stopped</mark> before the technician
              checked it.
            </p>
          </div>
        </div>
      </section>

      <section className="lesson-section">
        <h2>Why "had had" is correct</h2>

        <div className="explanation-box">
          <p className="large-example">
            I <mark>had had</mark> breakfast when we arrived.
          </p>

          <div className="had-breakdown">
            <div>
              <strong>had</strong>
              <span>Past Perfect auxiliary</span>
            </div>

            <div className="plus">+</div>

            <div>
              <strong>had</strong>
              <span>V3 of "have"</span>
            </div>
          </div>

          <p>
            The verb is <strong>have</strong>. Its forms are:
            <code> have → had → had</code>. Therefore, the Past Perfect is
            <strong> had had</strong>.
          </p>
        </div>
      </section>

      <section className="lesson-section">
        <h2>Quick practice</h2>

        <div className="practice">
          <p>
            Complete the sentences using the <strong>Past Perfect</strong>.
          </p>

          <ol>
            <li>
              When I arrived, they ________ (leave).
            </li>
            <li>
              She was tired because she ________ (not sleep) well.
            </li>
            <li>
              By the time we got there, the movie ________ (start).
            </li>
            <li>
              He ________ never ________ (see) snow before.
            </li>
            <li>
              I ________ already ________ (finish) my work when she called.
            </li>
          </ol>

          <details>
            <summary>Show answers</summary>

            <div className="answers">
              <p>1. had left</p>
              <p>2. hadn't slept</p>
              <p>3. had started</p>
              <p>4. had never seen</p>
              <p>5. had already finished</p>
            </div>
          </details>
        </div>
      </section>

      <section className="lesson-section final-rule">
        <h2>Remember</h2>

        <p className="memory-rule">
          <strong>Past Perfect = the past before the past.</strong>
        </p>

        <div className="mini-timeline">
          <span>Earlier</span>
          <strong>had + V3</strong>
          <span>→</span>
          <strong>Simple Past</strong>
          <span>Later</span>
        </div>
      </section>
    </main>
  )
}

export default PastPerfect