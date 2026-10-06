import { useState } from 'react'
import './page.css'

export const metadata = {
  title: 'Past Perfect Exercises',
  category: 'English',
  description:
    'Practice the Past Perfect with interactive exercises, scenarios, timelines and detailed explanations.',
  keywords: [
    'english',
    'grammar',
    'past perfect',
    'exercises',
    'had',
    'v3',
    'past participle',
    'practice',
  ],
}

const exercises = [
  {
    id: 1,
    level: 'Easy',
    type: 'multiple',
    label: 'Choose the correct form',
    question: 'When I arrived at the station, the train ________.',
    options: ['left', 'had left', 'has left'],
    answer: 'had left',
    explanation:
      'The train left before you arrived. The earlier past action uses the Past Perfect: had + V3.',
    wrongExplanation:
      'Look at the timeline. The train left first, and you arrived later.',
  },

  {
    id: 2,
    level: 'Easy',
    type: 'fill',
    label: 'Complete the sentence',
    question:
      'She was hungry because she ________ breakfast. (not / eat)',
    answer: "hadn't eaten",
    explanation:
      'Not eating happened before she became hungry. Negative Past Perfect = had not + V3. Eat → ate → eaten.',
    wrongExplanation:
      'You need had + not + the past participle "eaten".',
  },

  {
    id: 3,
    level: 'Easy',
    type: 'truefalse',
    label: 'True or False',
    question:
      '"Had went" is the correct Past Perfect form of "go".',
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'The correct form is "had gone". Go → went → gone. Past Perfect requires V3, not V2.',
    wrongExplanation:
      '"Went" is V2. After "had", we need V3: gone.',
  },

  {
    id: 4,
    level: 'Easy',
    type: 'timeline',
    label: 'Timeline',
    context:
      '8:00 PM — The movie started.  |  8:20 PM — We arrived.',
    question: 'Which event happened first?',
    options: [
      'We arrived.',
      'The movie started.',
      'They happened at the same time.',
    ],
    answer: 'The movie started.',
    explanation:
      'The movie started at 8:00 and you arrived at 8:20. Therefore: "The movie had started when we arrived."',
    wrongExplanation:
      'Compare the times: 8:00 happened before 8:20.',
  },

  {
    id: 5,
    level: 'Easy',
    type: 'multiple',
    label: 'Identify the Past Perfect',
    question: 'Which sentence contains the Past Perfect?',
    options: [
      'She went home.',
      'She has gone home.',
      'She had gone home before I arrived.',
    ],
    answer: 'She had gone home before I arrived.',
    explanation:
      '"Had gone" follows the Past Perfect structure: had + V3.',
    wrongExplanation:
      'Look specifically for had + past participle.',
  },

  {
    id: 6,
    level: 'Medium',
    type: 'fill',
    label: 'Write the verb',
    question: 'By the time we arrived, they ________. (leave)',
    answer: 'had left',
    explanation:
      'Leaving happened before arriving. Leave → left → left, so the Past Perfect is "had left".',
    wrongExplanation:
      'Use had + V3. The V3 of "leave" is "left".',
  },

  {
    id: 7,
    level: 'Medium',
    type: 'fill',
    label: 'Negative form',
    question:
      'Tom failed the exam because he ________ enough. (not / study)',
    answer: "hadn't studied",
    explanation:
      'The studying should have happened before the exam. Negative Past Perfect = had not + V3.',
    wrongExplanation:
      'The structure must be had + not + V3.',
  },

  {
    id: 8,
    level: 'Medium',
    type: 'multiple',
    label: 'Find the mistake',
    question: 'Which sentence is grammatically incorrect?',
    options: [
      'She had finished before I arrived.',
      'They had eaten before the movie.',
      'He had went home before midnight.',
    ],
    answer: 'He had went home before midnight.',
    explanation:
      '"Had went" is incorrect. The V3 of "go" is "gone", so the correct sentence is "He had gone home before midnight."',
    wrongExplanation:
      'Check the verb after "had". It must be V3.',
  },

  {
    id: 9,
    level: 'Medium',
    type: 'timeline',
    label: 'Understand the timeline',
    context:
      '02:13 — The server stopped.  |  02:15 — The monitoring system generated an alert.',
    question: 'Which sentence best represents the timeline?',
    options: [
      'The server had stopped before the monitoring system generated the alert.',
      'The server has stopped before the monitoring system generated the alert.',
      'The server stopped after the alert.',
    ],
    answer:
      'The server had stopped before the monitoring system generated the alert.',
    explanation:
      'The server stopped first at 02:13. The alert happened later at 02:15. The earlier action uses the Past Perfect.',
    wrongExplanation:
      'Compare the timestamps before choosing the tense.',
  },

  {
    id: 10,
    level: 'Medium',
    type: 'truefalse',
    label: 'Grammar judgment',
    question:
      '"After she had finished work, she went home." is grammatically correct.',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      '"Had finished" describes the earlier completed action and "went" describes the later past action.',
    wrongExplanation:
      'Past Perfect + Simple Past is completely valid here.',
  },

  {
    id: 11,
    level: 'Medium',
    type: 'multiple',
    label: 'Past Simple or Past Perfect?',
    question:
      'When I opened the refrigerator, I discovered that someone ________ the cake.',
    options: ['ate', 'had eaten', 'has eaten'],
    answer: 'had eaten',
    explanation:
      'The cake was eaten before you opened the refrigerator and discovered it.',
    wrongExplanation:
      'Opening the refrigerator is the reference point in the past. Eating happened before that.',
  },

  {
    id: 12,
    level: 'Medium',
    type: 'fill',
    label: 'Question form',
    question:
      'Complete the question: ________ she ________ before the meeting started? (arrive)',
    answer: 'had she arrived',
    explanation:
      'Past Perfect questions use: Had + subject + V3. Therefore: "Had she arrived...?"',
    wrongExplanation:
      'For questions, move "had" before the subject: Had + she + arrived.',
  },

  {
    id: 13,
    level: 'Hard',
    type: 'fill',
    label: 'Special structure',
    context:
      'First: I ate breakfast. Later: I left the house.',
    question:
      'Complete: I ________ breakfast before I left the house. (have)',
    answer: 'had had',
    explanation:
      'The first "had" is the Past Perfect auxiliary. The second "had" is V3 of "have". Have → had → had.',
    wrongExplanation:
      'Past Perfect is had + V3. Because the main verb is "have", its V3 is also "had".',
  },

  {
    id: 14,
    level: 'Hard',
    type: 'multiple',
    label: 'Cause and consequence',
    context:
      'Maria was exhausted during her meeting. She only slept two hours the night before.',
    question: 'Which sentence explains the situation best?',
    options: [
      'Maria was exhausted because she had only slept for two hours.',
      'Maria was exhausted because she has only slept for two hours.',
      'Maria had been exhausted because she slept tomorrow.',
    ],
    answer:
      'Maria was exhausted because she had only slept for two hours.',
    explanation:
      'Sleeping happened before the meeting. Her exhaustion was the later consequence.',
    wrongExplanation:
      'Both events belong to a finished past context, and sleeping happened first.',
  },

  {
    id: 15,
    level: 'Hard',
    type: 'timeline',
    label: 'Incident timeline',
    context:
      '01:42 — Database connection failed.  |  01:43 — API requests began returning HTTP 500.  |  01:48 — Engineer started troubleshooting.',
    question:
      'What had happened before the engineer started troubleshooting?',
    options: [
      'The database connection had failed and the API had begun returning HTTP 500.',
      'The engineer had fixed everything.',
      'The database will fail.',
    ],
    answer:
      'The database connection had failed and the API had begun returning HTTP 500.',
    explanation:
      'Both the database failure and the HTTP 500 errors happened before the engineer began troubleshooting.',
    wrongExplanation:
      'Use the timestamps to reconstruct the sequence before thinking about the tense.',
  },

  {
    id: 16,
    level: 'Hard',
    type: 'multiple',
    label: 'Meaning changes',
    question:
      'Which sentence clearly means that the thief escaped BEFORE the police arrived?',
    options: [
      'The thief escaped when the police arrived.',
      'The thief had escaped when the police arrived.',
      'The thief has escaped when the police arrived.',
    ],
    answer:
      'The thief had escaped when the police arrived.',
    explanation:
      'Past Perfect explicitly places the escape before the arrival of the police.',
    wrongExplanation:
      '"Escaped when" can suggest the actions occurred around the same time. "Has escaped" does not fit the finished past reference.',
  },

  {
    id: 17,
    level: 'Hard',
    type: 'fill',
    label: 'Complete from context',
    context:
      'You started studying Linux in 2025. Before that, you never used Linux.',
    question:
      'Complete: Before I started studying Linux, I ________ it before. (never / use)',
    answer: 'had never used',
    explanation:
      '"Started studying" is the later past event. Your previous lack of experience belongs to the period before it: had never used.',
    wrongExplanation:
      'Use had + never + V3.',
  },

  {
    id: 18,
    level: 'Hard',
    type: 'truefalse',
    label: 'Advanced judgment',
    question:
      'Past Perfect must always be used whenever one past event happened before another past event.',
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'Past Perfect is useful when the earlier relationship needs to be established or emphasized. Sometimes words such as "before" and "after" already make the order clear, so Simple Past can also be natural.',
    wrongExplanation:
      'Past Perfect is not a mechanical rule for every pair of past events. Context matters.',
  },
]

function normalizeAnswer(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.!?]/g, '')
    .replace(/\s+/g, ' ')
}

function Exercise({ exercise, onComplete }) {
  const [selected, setSelected] = useState(null)
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [completed, setCompleted] = useState(false)

  const isFill = exercise.type === 'fill'

  const isCorrect = isFill
    ? normalizeAnswer(input) === normalizeAnswer(exercise.answer)
    : selected === exercise.answer

  const handleMultipleChoice = (option) => {
    if (submitted) return

    setSelected(option)
    setSubmitted(true)

    if (option === exercise.answer && !completed) {
      setCompleted(true)
      onComplete()
    }
  }

  const handleInput = () => {
    if (!input.trim()) return

    const correct =
      normalizeAnswer(input) === normalizeAnswer(exercise.answer)

    setSubmitted(true)

    if (correct && !completed) {
      setCompleted(true)
      onComplete()
    }
  }

  const handleTryAgain = () => {
    setSubmitted(false)

    if (isFill) {
      setInput('')
    } else {
      setSelected(null)
    }
  }

  return (
    <article className="exercise-card">
      <div className="exercise-header">
        <div className="exercise-meta">
          <span
            className={`level level-${exercise.level.toLowerCase()}`}
          >
            {exercise.level}
          </span>

          <span className="exercise-type">
            {exercise.label}
          </span>
        </div>

        <span className="exercise-number">
          {String(exercise.id).padStart(2, '0')}
        </span>
      </div>

      {exercise.context && (
        <div className="exercise-context">
          <span>Context</span>
          <p>{exercise.context}</p>
        </div>
      )}

      <h3>{exercise.question}</h3>

      {!isFill && (
        <div className="options">
          {exercise.options.map((option, index) => {
            let optionClass = 'option'

            if (submitted) {
              if (option === exercise.answer) {
                optionClass += ' correct'
              } else if (option === selected) {
                optionClass += ' incorrect'
              }
            }

            return (
              <button
                type="button"
                className={optionClass}
                key={option}
                onClick={() => handleMultipleChoice(option)}
                disabled={submitted}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>

                <p>{option}</p>

                {submitted &&
                  option === exercise.answer && (
                    <strong className="result-icon">
                      ✓
                    </strong>
                  )}

                {submitted &&
                  option === selected &&
                  option !== exercise.answer && (
                    <strong className="result-icon">
                      ✕
                    </strong>
                  )}
              </button>
            )
          })}
        </div>
      )}

      {isFill && (
        <div className="fill-area">
          <input
            type="text"
            value={input}
            placeholder="Type your answer..."
            onChange={(event) => {
              setInput(event.target.value)

              if (submitted) {
                setSubmitted(false)
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleInput()
              }
            }}
          />

          <button
            type="button"
            className="check-button"
            onClick={handleInput}
          >
            Check answer
          </button>
        </div>
      )}

      {submitted && (
        <div
          className={`feedback ${
            isCorrect
              ? 'feedback-correct'
              : 'feedback-wrong'
          }`}
        >
          <div className="feedback-title">
            <span>{isCorrect ? '✓' : '✕'}</span>

            {isCorrect
              ? 'Correct!'
              : 'Not quite.'}
          </div>

          {!isCorrect && (
            <div className="correct-answer">
              <span>Correct answer</span>
              <strong>{exercise.answer}</strong>
            </div>
          )}

          <div className="explanation">
            <h4>
              {isCorrect
                ? 'Why is this correct?'
                : 'Explanation'}
            </h4>

            <p>{exercise.explanation}</p>
          </div>

          {!isCorrect &&
            exercise.wrongExplanation && (
              <div className="wrong-explanation">
                <h4>Why was it wrong?</h4>
                <p>
                  {exercise.wrongExplanation}
                </p>
              </div>
            )}

          {!isCorrect && (
            <button
              type="button"
              className="try-again"
              onClick={handleTryAgain}
            >
              Try again
            </button>
          )}
        </div>
      )}
    </article>
  )
}

function PastPerfectExercises() {
  const [score, setScore] = useState(0)

  const easy = exercises.filter(
    (exercise) => exercise.level === 'Easy'
  )

  const medium = exercises.filter(
    (exercise) => exercise.level === 'Medium'
  )

  const hard = exercises.filter(
    (exercise) => exercise.level === 'Hard'
  )

  const progress = Math.round(
    (score / exercises.length) * 100
  )

  const handleComplete = () => {
    setScore((current) => current + 1)
  }

  return (
    <main className="exercise-page">
      <header className="page-header">
        <span className="page-category">
          English · Grammar Practice
        </span>

        <h1>Past Perfect Exercises</h1>

        <p>
          Practice Past Perfect through different types of
          exercises. Choose answers, complete sentences,
          analyze timelines, find mistakes and reason from
          real situations.
        </p>

        <div className="summary">
          <div>
            <strong>{exercises.length}</strong>
            <span>Exercises</span>
          </div>

          <div>
            <strong>{score}</strong>
            <span>Completed</span>
          </div>

          <div>
            <strong>{progress}%</strong>
            <span>Progress</span>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-track">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span>
            {score} / {exercises.length}
          </span>
        </div>
      </header>

      <section className="quick-rule">
        <span>Quick rule</span>

        <div className="rule-flow">
          <div>
            <small>Earlier past event</small>
            <strong>had + V3</strong>
          </div>

          <span className="arrow">→</span>

          <div>
            <small>Later past event</small>
            <strong>Simple Past</strong>
          </div>
        </div>
      </section>

      <section className="exercise-section">
        <div className="section-heading">
          <div>
            <span className="section-number">
              01
            </span>

            <h2>Build the foundation</h2>
          </div>

          <p>
            Recognize the structure, understand V3 and
            identify which event happened first.
          </p>
        </div>

        <div className="exercise-list">
          {easy.map((exercise) => (
            <Exercise
              key={exercise.id}
              exercise={exercise}
              onComplete={handleComplete}
            />
          ))}
        </div>
      </section>

      <section className="exercise-section">
        <div className="section-heading">
          <div>
            <span className="section-number">
              02
            </span>

            <h2>Use the tense</h2>
          </div>

          <p>
            Produce the grammar yourself and distinguish
            Simple Past from Past Perfect.
          </p>
        </div>

        <div className="exercise-list">
          {medium.map((exercise) => (
            <Exercise
              key={exercise.id}
              exercise={exercise}
              onComplete={handleComplete}
            />
          ))}
        </div>
      </section>

      <section className="exercise-section">
        <div className="section-heading">
          <div>
            <span className="section-number">
              03
            </span>

            <h2>Think in context</h2>
          </div>

          <p>
            Analyze causes, technical incidents, timelines
            and subtle differences in meaning.
          </p>
        </div>

        <div className="exercise-list">
          {hard.map((exercise) => (
            <Exercise
              key={exercise.id}
              exercise={exercise}
              onComplete={handleComplete}
            />
          ))}
        </div>
      </section>

      <section className="final-reminder">
        <span>Remember</span>

        <h2>
          Don't look for "had". Look for the timeline.
        </h2>

        <p>
          First identify the past events. Then ask:
          <strong> Which one happened first?</strong>{' '}
          Past Perfect helps you place that earlier event
          before another point in the past.
        </p>

        <div className="final-formula">
          <span>PAST BEFORE THE PAST</span>
          <strong>had + V3</strong>
        </div>
      </section>
    </main>
  )
}

export default PastPerfectExercises