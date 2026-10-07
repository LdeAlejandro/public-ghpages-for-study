import { useState } from 'react'
import './page.css'

export const metadata = {
  title: 'Modal Must Exercises',
  category: 'English',
  description:
    'Practice must, must not, mustn’t, obligation, prohibition, necessity, and logical conclusions through interactive exercises.',
  keywords: [
    'english',
    'grammar',
    'modal verbs',
    'must',
    'must not',
    "mustn't",
    'obligation',
    'prohibition',
    'deduction',
    'exercises',
    'practice',
  ],
  created: '2026-10-07',
}

const exercises = [
  // EASY
  {
    id: 1,
    level: 'Easy',
    type: 'choice',
    title: 'Basic structure',
    question: 'You ___ wear your seat belt.',
    options: ['must', 'must to', 'musts'],
    answer: 'must',
    explanation:
      'Use must + base verb: “You must wear your seat belt.”',
  },
  {
    id: 2,
    level: 'Easy',
    type: 'choice',
    title: 'Base verb',
    question: 'She must ___ for the exam.',
    options: ['studies', 'to study', 'study'],
    answer: 'study',
    explanation:
      'After must, use the base form of the verb without “to”: must study.',
  },
  {
    id: 3,
    level: 'Easy',
    type: 'truefalse',
    title: 'No conjugation',
    question: '“He musts work tomorrow” is correct.',
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'Must does not change with he, she, or it. The correct form is “He must work tomorrow.”',
  },
  {
    id: 4,
    level: 'Easy',
    type: 'fill',
    title: 'Obligation',
    question: 'Employees ___ wear their ID badges.',
    answer: 'must',
    explanation:
      'Must expresses a strong requirement: “Employees must wear their ID badges.”',
  },
  {
    id: 5,
    level: 'Easy',
    type: 'choice',
    title: 'Prohibition',
    question: 'You ___ smoke here. It is prohibited.',
    options: ["mustn't", "don't have to", 'must'],
    answer: "mustn't",
    explanation:
      'Mustn’t means that the action is prohibited or not allowed.',
  },
  {
    id: 6,
    level: 'Easy',
    type: 'truefalse',
    title: 'Meaning of must',
    question: '“You must finish this today” expresses obligation.',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      'Must can express strong obligation or necessity.',
  },

  // MEDIUM
  {
    id: 7,
    level: 'Medium',
    type: 'choice',
    title: "Mustn't vs don't have to",
    question:
      'Tomorrow is a holiday. You ___ come to work, but you can if you want.',
    options: ["mustn't", "don't have to", 'must'],
    answer: "don't have to",
    explanation:
      'Don’t have to means the action is not necessary. It does not mean the action is prohibited.',
  },
  {
    id: 8,
    level: 'Medium',
    type: 'choice',
    title: 'Security rule',
    context:
      'Company policy prohibits employees from sharing their passwords.',
    question: 'Employees ___ share their passwords.',
    options: ["mustn't", "don't have to", 'must'],
    answer: "mustn't",
    explanation:
      'The action is prohibited, so we use mustn’t.',
  },
  {
    id: 9,
    level: 'Medium',
    type: 'choice',
    title: 'Logical conclusion',
    context:
      'Alex worked for fourteen hours and has barely slept.',
    question: 'He ___ tired.',
    options: ['must be', 'must to be', 'must being'],
    answer: 'must be',
    explanation:
      'Must be can express a strong logical conclusion based on evidence.',
  },
  {
    id: 10,
    level: 'Medium',
    type: 'fill',
    title: 'Logical deduction',
    context:
      'It is 35°C outside.',
    question: 'It ___ hot outside.',
    answer: 'must be',
    explanation:
      'The evidence strongly suggests that it is hot, so “must be” expresses a logical conclusion.',
  },
  {
    id: 11,
    level: 'Medium',
    type: 'choice',
    title: 'Question form',
    question: 'Which question is correct?',
    options: [
      'Do I must bring my ID?',
      'Must I bring my ID?',
      'Must I to bring my ID?',
    ],
    answer: 'Must I bring my ID?',
    explanation:
      'The question structure is Must + subject + base verb?',
  },
  {
    id: 12,
    level: 'Medium',
    type: 'truefalse',
    title: 'Prohibition or optional?',
    question:
      '“You mustn’t attend the meeting” means attending the meeting is optional.',
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'Mustn’t means the action is prohibited. “Don’t have to attend” would mean it is optional.',
  },

  // HARD
  {
    id: 13,
    level: 'Hard',
    type: 'choice',
    title: 'System administration',
    context:
      'Only administrators are permitted to modify this configuration file.',
    question: 'Regular users ___ modify this file.',
    options: ["mustn't", "don't have to", 'must'],
    answer: "mustn't",
    explanation:
      'The action is not permitted, so mustn’t expresses prohibition.',
  },
  {
    id: 14,
    level: 'Hard',
    type: 'choice',
    title: 'Server deduction',
    context:
      'The server answers every request immediately and monitoring shows very low latency.',
    question: 'The connection ___ very fast.',
    options: ['must be', 'must to be', 'must being'],
    answer: 'must be',
    explanation:
      'The evidence supports a strong conclusion, so “must be” is appropriate.',
  },
  {
    id: 15,
    level: 'Hard',
    type: 'fill',
    title: 'Password policy',
    context:
      'The company requires every password to contain at least eight characters.',
    question: 'Passwords ___ contain at least eight characters.',
    answer: 'must',
    explanation:
      'This is a requirement, so must expresses obligation.',
  },
  {
    id: 16,
    level: 'Hard',
    type: 'choice',
    title: 'Different meanings',
    question:
      'Which sentence means that bringing a laptop is optional?',
    options: [
      "You mustn't bring a laptop.",
      "You don't have to bring a laptop.",
      'You must bring a laptop.',
    ],
    answer: "You don't have to bring a laptop.",
    explanation:
      'Don’t have to means there is no necessity. You may bring one, but it is optional.',
  },
  {
    id: 17,
    level: 'Hard',
    type: 'choice',
    title: 'Find the mistake',
    question: 'Which sentence is incorrect?',
    options: [
      'She must finish the report.',
      'They must leave now.',
      'He must to restart the server.',
    ],
    answer: 'He must to restart the server.',
    explanation:
      'Must is followed directly by the base verb. The correct form is “He must restart the server.”',
  },
  {
    id: 18,
    level: 'Hard',
    type: 'truefalse',
    title: 'Meaning check',
    question:
      '“She must be busy” can express a logical conclusion rather than an obligation.',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      'Yes. In this context, must means that the speaker strongly believes she is busy based on available evidence.',
  },
]

function normalizeAnswer(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.!?]/g, '')
    .replace(/[’]/g, "'")
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

  const handleChoice = (option) => {
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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !submitted) {
      handleInput()
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
          <span className="exercise-number">
            {String(exercise.id).padStart(2, '0')}
          </span>

          <span className="exercise-type">
            {exercise.type === 'fill'
              ? 'Fill in'
              : exercise.type === 'truefalse'
                ? 'True / False'
                : 'Choose'}
          </span>
        </div>

        <span
          className={`level level-${exercise.level.toLowerCase()}`}
        >
          {exercise.level}
        </span>
      </div>

      <h3>{exercise.title}</h3>

      {exercise.context && (
        <div className="exercise-context">
          <span>Context</span>
          <p>{exercise.context}</p>
        </div>
      )}

      <p className="question">{exercise.question}</p>

      {isFill ? (
        <div className="fill-area">
          <input
            type="text"
            value={input}
            disabled={submitted}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
            aria-label="Your answer"
          />

          {!submitted && (
            <button
              type="button"
              className="check-button"
              onClick={handleInput}
              disabled={!input.trim()}
            >
              Check
            </button>
          )}
        </div>
      ) : (
        <div className="options">
          {exercise.options.map((option, index) => {
            let optionClass = 'option'

            if (submitted) {
              if (option === exercise.answer) {
                optionClass += ' correct'
              } else if (
                option === selected &&
                option !== exercise.answer
              ) {
                optionClass += ' incorrect'
              }
            }

            return (
              <button
                type="button"
                className={optionClass}
                key={option}
                disabled={submitted}
                onClick={() => handleChoice(option)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>

                <span>{option}</span>
              </button>
            )
          })}
        </div>
      )}

      {submitted && (
        <div
          className={`feedback ${
            isCorrect ? 'feedback-correct' : 'feedback-wrong'
          }`}
        >
          <div className="feedback-title">
            <span className="result-icon">
              {isCorrect ? '✓' : '×'}
            </span>

            <strong>
              {isCorrect ? 'Correct' : 'Not quite'}
            </strong>
          </div>

          {!isCorrect && (
            <p className="correct-answer">
              Correct answer:{' '}
              <strong>{exercise.answer}</strong>
            </p>
          )}

          <p className="explanation">
            {exercise.explanation}
          </p>

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

function ExerciseSection({
  title,
  description,
  exercises,
  onComplete,
}) {
  return (
    <section className="exercise-section">
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <span className="section-level">
          {exercises.length} exercises
        </span>
      </div>

      <div className="exercise-list">
        {exercises.map((exercise) => (
          <Exercise
            key={exercise.id}
            exercise={exercise}
            onComplete={onComplete}
          />
        ))}
      </div>
    </section>
  )
}

function ModalMustExercises() {
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

        <h1>Modal Must Exercises</h1>

        <p className="page-intro">
          Practice must through different types of exercises.
          Work with obligation, rules, prohibition, questions,
          logical conclusions, and common mistakes.
        </p>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <strong>{exercises.length}</strong>
          <span>Exercises</span>
        </div>

        <div className="stat-card">
          <strong>{score}</strong>
          <span>Completed</span>
        </div>

        <div className="stat-card">
          <strong>{progress}%</strong>
          <span>Progress</span>
        </div>
      </section>

      <section className="progress-container">
        <div className="progress-track">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="progress-count">
          {score} / {exercises.length}
        </span>
      </section>

      <ExerciseSection
        title="Easy"
        description="Practice the basic structure of must and identify obligation and prohibition."
        exercises={easy}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Medium"
        description="Distinguish mustn't from don't have to and practice logical conclusions and questions."
        exercises={medium}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Hard"
        description="Apply must to realistic rules, IT situations, deductions, and meaning differences."
        exercises={hard}
        onComplete={handleComplete}
      />

      <section className="final-reminder">
        <span>Quick Reference</span>

        <h2>Must + base verb</h2>

        <div className="final-grid">
          <div>
            <strong>Obligation</strong>
            <p>You must finish it.</p>
          </div>

          <div>
            <strong>Prohibition</strong>
            <p>You mustn't enter.</p>
          </div>

          <div>
            <strong>Conclusion</strong>
            <p>You must be tired.</p>
          </div>
        </div>

        <p className="final-warning">
          <strong>mustn't</strong> = prohibited ·{' '}
          <strong>don't have to</strong> = not necessary
        </p>
      </section>
    </main>
  )
}

export default ModalMustExercises