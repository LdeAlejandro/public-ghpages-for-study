import { useState } from 'react'
import './page.css'

export const metadata = {
  title: 'Will Be Able To Exercises',
  category: 'English',
  description:
    'Practice will be able to through interactive exercises about future ability, negative forms, questions, short answers, and common mistakes.',
  keywords: [
    'english',
    'grammar',
    'will be able to',
    'be able to',
    'future ability',
    'can',
    'will',
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
    title: 'Future ability',
    question: 'Next year, I ___ drive.',
    options: [
      'will can',
      'will be able to',
      'will able to',
    ],
    answer: 'will be able to',
    explanation:
      'Use “will be able to + base verb” to talk about future ability.',
  },
  {
    id: 2,
    level: 'Easy',
    type: 'choice',
    title: 'Base verb',
    question: 'She will be able to ___ from home next week.',
    options: ['works', 'work', 'working'],
    answer: 'work',
    explanation:
      'After “will be able to,” use the base form of the verb: work.',
  },
  {
    id: 3,
    level: 'Easy',
    type: 'truefalse',
    title: 'Will can',
    question: '“I will can help you tomorrow” is correct.',
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'We do not use “will can.” Say “I will be able to help you tomorrow.”',
  },
  {
    id: 4,
    level: 'Easy',
    type: 'fill',
    title: 'Complete the structure',
    question: 'I will ___ to travel next year.',
    answer: 'be able',
    explanation:
      'The complete structure is “will be able to + base verb.”',
  },
  {
    id: 5,
    level: 'Easy',
    type: 'choice',
    title: 'Present or future?',
    question:
      'Which sentence clearly describes future ability?',
    options: [
      'I can drive.',
      'I will be able to drive next year.',
      'I drive every day.',
    ],
    answer: 'I will be able to drive next year.',
    explanation:
      '“Will be able to” expresses an ability that will exist in the future.',
  },
  {
    id: 6,
    level: 'Easy',
    type: 'truefalse',
    title: 'Same structure',
    question:
      '“Will be able to” has the same form with I, you, he, she, we, and they.',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      'The structure does not change: I will be able to, she will be able to, they will be able to, etc.',
  },

  // MEDIUM
  {
    id: 7,
    level: 'Medium',
    type: 'choice',
    title: 'Negative form',
    question:
      'I have an appointment tomorrow, so I ___ attend the meeting.',
    options: [
      "won't be able to",
      "won't can",
      "will not able to",
    ],
    answer: "won't be able to",
    explanation:
      'The negative form is “will not be able to” or “won’t be able to.”',
  },
  {
    id: 8,
    level: 'Medium',
    type: 'fill',
    title: 'Negative future ability',
    question:
      "The server will be offline, so users ___ access it.",
    answer: "won't be able to",
    explanation:
      '“Won’t be able to” expresses that something will not be possible in the future.',
  },
  {
    id: 9,
    level: 'Medium',
    type: 'choice',
    title: 'Question form',
    question: 'Which question is correct?',
    options: [
      'Will you able to come tomorrow?',
      'Will you be able to come tomorrow?',
      'Do you will be able to come tomorrow?',
    ],
    answer: 'Will you be able to come tomorrow?',
    explanation:
      'The question structure is “Will + subject + be able to + base verb?”',
  },
  {
    id: 10,
    level: 'Medium',
    type: 'choice',
    title: 'Short answer',
    question:
      '“Will you be able to help tomorrow?” Choose the correct short answer.',
    options: [
      'Yes, I will.',
      'Yes, I will be able.',
      'Yes, I able.',
    ],
    answer: 'Yes, I will.',
    explanation:
      'In a short answer, we normally use “Yes, I will” or “No, I won’t.”',
  },
  {
    id: 11,
    level: 'Medium',
    type: 'choice',
    title: 'Present vs future',
    context:
      'You cannot use the software now. After completing your training next month, you will have the necessary skills.',
    question: 'Which sentence best describes the situation?',
    options: [
      'I can use the software now.',
      'I will can use the software.',
      'I will be able to use the software after the training.',
    ],
    answer:
      'I will be able to use the software after the training.',
    explanation:
      'The ability will exist after the training, so “will be able to” is appropriate.',
  },
  {
    id: 12,
    level: 'Medium',
    type: 'truefalse',
    title: 'Opportunity',
    question:
      '“I’ll be able to meet you after work” can describe a future opportunity, not only a learned skill.',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      '“Be able to” can describe both ability and circumstances that make something possible.',
  },

  // HARD
  {
    id: 13,
    level: 'Hard',
    type: 'choice',
    title: 'System access',
    context:
      'A new account is being created today. The permissions will become active tomorrow.',
    question: 'Which sentence correctly describes the situation?',
    options: [
      'The user will can access the system tomorrow.',
      'The user will be able to access the system tomorrow.',
      'The user will be able access the system tomorrow.',
    ],
    answer:
      'The user will be able to access the system tomorrow.',
    explanation:
      'Use “will be able to + base verb”: will be able to access.',
  },
  {
    id: 14,
    level: 'Hard',
    type: 'choice',
    title: 'Maintenance window',
    context:
      'The production server is currently in use. The maintenance window begins at midnight.',
    question: 'Which sentence is correct?',
    options: [
      "We won't can restart the server now.",
      "We'll be able to restart the server after midnight.",
      "We'll able to restart the server after midnight.",
    ],
    answer:
      "We'll be able to restart the server after midnight.",
    explanation:
      'The maintenance window creates a future opportunity, so “we’ll be able to restart” is correct.',
  },
  {
    id: 15,
    level: 'Hard',
    type: 'fill',
    title: 'Future improvement',
    context:
      'You are studying English and expect your listening ability to improve.',
    question:
      'With more practice, I ___ understand movies without subtitles.',
    answer: 'will be able to',
    explanation:
      'The sentence describes an ability you expect to have in the future.',
  },
  {
    id: 16,
    level: 'Hard',
    type: 'choice',
    title: 'Find the mistake',
    question: 'Which sentence is incorrect?',
    options: [
      "She'll be able to work tomorrow.",
      "They won't be able to connect tonight.",
      'He will be able to works remotely.',
    ],
    answer: 'He will be able to works remotely.',
    explanation:
      'After “to,” use the base verb. The correct sentence is “He will be able to work remotely.”',
  },
  {
    id: 17,
    level: 'Hard',
    type: 'choice',
    title: 'Correct question and answer',
    question:
      'Which question-and-answer pair is grammatically correct?',
    options: [
      'Will she able to attend? — Yes, she will.',
      'Will she be able to attend? — Yes, she will.',
      'Does she will be able to attend? — Yes, she does.',
    ],
    answer:
      'Will she be able to attend? — Yes, she will.',
    explanation:
      'Use “Will + subject + be able to + verb?” The short answer uses will.',
  },
  {
    id: 18,
    level: 'Hard',
    type: 'truefalse',
    title: 'Meaning check',
    question:
      '“We’ll be able to deploy the application after the tests finish” means the deployment is possible now.',
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'The sentence means the opportunity to deploy will exist after the tests finish, not now.',
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

function WillBeAbleToExercises() {
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

        <h1>Will Be Able To Exercises</h1>

        <p className="page-intro">
          Practice future ability with will be able to. Complete
          sentences, choose the correct structure, form questions,
          use negative forms, and analyze real situations.
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
        description="Practice the basic structure and recognize future ability."
        exercises={easy}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Medium"
        description="Practice negative forms, questions, short answers, and future opportunities."
        exercises={medium}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Hard"
        description="Apply the structure to realistic situations, IT contexts, and common grammar mistakes."
        exercises={hard}
        onComplete={handleComplete}
      />

      <section className="final-reminder">
        <span>Quick Reference</span>

        <h2>will be able to + base verb</h2>

        <div className="final-grid">
          <div>
            <strong>Positive</strong>
            <p>I'll be able to work.</p>
          </div>

          <div>
            <strong>Negative</strong>
            <p>I won't be able to work.</p>
          </div>

          <div>
            <strong>Question</strong>
            <p>Will you be able to work?</p>
          </div>
        </div>

        <p className="final-warning">
          <strong>Never:</strong> will can · will able to ·
          be able to works
        </p>
      </section>
    </main>
  )
}

export default WillBeAbleToExercises