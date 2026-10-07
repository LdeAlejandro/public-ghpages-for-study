import { useState } from 'react'
import './page.css'

export const metadata = {
  title: 'May and Might Exercises',
  category: 'English',
  description:
    'Practice may and might through interactive exercises about possibility, uncertainty, negative possibility, permission, and common mistakes.',
  keywords: [
    'english',
    'grammar',
    'modal verbs',
    'may',
    'might',
    'may not',
    'might not',
    'possibility',
    'uncertainty',
    'permission',
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
    question: 'It ___ rain this afternoon.',
    options: ['may', 'may to', 'mays'],
    answer: 'may',
    explanation:
      'Use may + base verb to express possibility: “It may rain.”',
  },
  {
    id: 2,
    level: 'Easy',
    type: 'choice',
    title: 'Base verb',
    question: 'She might ___ to the party tonight.',
    options: ['comes', 'come', 'to come'],
    answer: 'come',
    explanation:
      'After might, use the base form directly: “She might come.”',
  },
  {
    id: 3,
    level: 'Easy',
    type: 'truefalse',
    title: 'No -s',
    question: '“He mays arrive late” is grammatically correct.',
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'Modal verbs do not take -s with he, she, or it. Say “He may arrive late.”',
  },
  {
    id: 4,
    level: 'Easy',
    type: 'fill',
    title: 'Complete with may',
    question: 'We ___ travel next year, but we have not decided yet.',
    answer: 'may',
    explanation:
      'May expresses possibility when something is not certain.',
  },
  {
    id: 5,
    level: 'Easy',
    type: 'choice',
    title: 'Uncertain plan',
    question:
      'I have not decided what to do tonight. I ___ stay home.',
    options: ['might', 'might to', 'mights'],
    answer: 'might',
    explanation:
      'Might is natural for an uncertain or tentative possibility.',
  },
  {
    id: 6,
    level: 'Easy',
    type: 'truefalse',
    title: 'Meaning',
    question:
      '“They might arrive late” means that arriving late is possible, but not certain.',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      'Might expresses possibility rather than certainty.',
  },

  // MEDIUM
  {
    id: 7,
    level: 'Medium',
    type: 'choice',
    title: 'Negative possibility',
    question:
      'Maria is not sure whether she can come. She ___ come tonight.',
    options: ['might not', "doesn't might", 'might not to'],
    answer: 'might not',
    explanation:
      'Use might not + base verb for negative possibility: “She might not come.”',
  },
  {
    id: 8,
    level: 'Medium',
    type: 'fill',
    title: 'Possible problem',
    context:
      'The weather is getting worse and your flight is scheduled for tonight.',
    question: 'The flight ___ leave on time.',
    answer: 'may not',
    acceptedAnswers: ['may not', 'might not'],
    explanation:
      'Both “may not” and “might not” can express the possibility that the flight will not leave on time.',
  },
  {
    id: 9,
    level: 'Medium',
    type: 'choice',
    title: 'Permission',
    question:
      'You want to politely ask your teacher if you can ask a question.',
    options: [
      'May I ask a question?',
      'May I to ask a question?',
      'Do I may ask a question?',
    ],
    answer: 'May I ask a question?',
    explanation:
      '“May I + base verb?” can be used to politely or formally ask for permission.',
  },
  {
    id: 10,
    level: 'Medium',
    type: 'choice',
    title: 'May vs might',
    question:
      'Which statement about may and might is the most accurate?',
    options: [
      'May always means exactly 50% probability.',
      'Might always means exactly 30% probability.',
      'Both can express possibility, and might can sound more tentative.',
    ],
    answer:
      'Both can express possibility, and might can sound more tentative.',
    explanation:
      'May and might often overlap. They do not represent fixed percentages of probability.',
  },
  {
    id: 11,
    level: 'Medium',
    type: 'choice',
    title: 'Find the mistake',
    question: 'Which sentence is incorrect?',
    options: [
      'She may arrive later.',
      'He might call tonight.',
      'They may to travel tomorrow.',
    ],
    answer: 'They may to travel tomorrow.',
    explanation:
      'Do not use “to” after may. The correct sentence is “They may travel tomorrow.”',
  },
  {
    id: 12,
    level: 'Medium',
    type: 'truefalse',
    title: 'Similar meanings',
    question:
      'In many situations, both “It may rain” and “It might rain” are possible.',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      'Yes. Both may and might can express uncertainty about a possible event.',
  },

  // HARD
  {
    id: 13,
    level: 'Hard',
    type: 'choice',
    title: 'Troubleshooting',
    context:
      'The application cannot connect to the database. You have not identified the cause yet.',
    question:
      'Which sentence appropriately expresses a possible cause?',
    options: [
      'The firewall might be blocking the connection.',
      'The firewall might to block the connection.',
      'The firewall mights block the connection.',
    ],
    answer:
      'The firewall might be blocking the connection.',
    explanation:
      'Might can introduce a possible explanation when the cause is uncertain. “Might be blocking” describes a possible ongoing cause.',
  },
  {
    id: 14,
    level: 'Hard',
    type: 'choice',
    title: 'Possible outcome',
    context:
      'A deployment is scheduled tonight, but the database has been unstable.',
    question: 'Which sentence best expresses the uncertainty?',
    options: [
      'The deployment might fail if the database becomes unavailable.',
      'The deployment might fails if the database becomes unavailable.',
      'The deployment might to fail if the database becomes unavailable.',
    ],
    answer:
      'The deployment might fail if the database becomes unavailable.',
    explanation:
      'Use might + base verb: “might fail.”',
  },
  {
    id: 15,
    level: 'Hard',
    type: 'fill',
    title: 'Possible availability',
    context:
      'You have plans after work, but they are not confirmed.',
    question: 'I ___ be available after work.',
    answer: 'might',
    acceptedAnswers: ['might', 'may'],
    explanation:
      'Both “might be available” and “may be available” can express uncertainty about your availability.',
  },
  {
    id: 16,
    level: 'Hard',
    type: 'choice',
    title: 'Meaning of may not',
    context:
      'Your friend says: “I may not go to the party tonight.”',
    question: 'What does the sentence most naturally mean here?',
    options: [
      'It is possible that the speaker will not go.',
      'The speaker is prohibited from going.',
      'The speaker definitely will not go.',
    ],
    answer:
      'It is possible that the speaker will not go.',
    explanation:
      'In this context, “may not” expresses negative possibility: perhaps the speaker will not go.',
  },
  {
    id: 17,
    level: 'Hard',
    type: 'choice',
    title: 'Context changes meaning',
    context:
      'An exam rule says: “Students may not use mobile phones during the exam.”',
    question: 'What does “may not” mean here?',
    options: [
      'Students possibly will not use their phones.',
      'Students are not permitted to use their phones.',
      'Students are uncertain about using their phones.',
    ],
    answer:
      'Students are not permitted to use their phones.',
    explanation:
      'In rules and permission contexts, “may not” can mean “not permitted.”',
  },
  {
    id: 18,
    level: 'Hard',
    type: 'truefalse',
    title: 'Probability myth',
    question:
      'English grammar assigns fixed probability percentages to may and might, so “may” always indicates a higher exact probability than “might.”',
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'There is no fixed percentage rule. Both express possibility, although might can sometimes sound more tentative.',
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

function getAcceptedAnswers(exercise) {
  return exercise.acceptedAnswers ?? [exercise.answer]
}

function checkFillAnswer(exercise, input) {
  const normalizedInput = normalizeAnswer(input)

  return getAcceptedAnswers(exercise).some(
    (answer) => normalizeAnswer(answer) === normalizedInput,
  )
}

function Exercise({ exercise, onComplete }) {
  const [selected, setSelected] = useState(null)
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [completed, setCompleted] = useState(false)

  const isFill = exercise.type === 'fill'

  const isCorrect = isFill
    ? checkFillAnswer(exercise, input)
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

    const correct = checkFillAnswer(exercise, input)

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

function MayAndMightExercises() {
  const [score, setScore] = useState(0)

  const easy = exercises.filter(
    (exercise) => exercise.level === 'Easy',
  )

  const medium = exercises.filter(
    (exercise) => exercise.level === 'Medium',
  )

  const hard = exercises.filter(
    (exercise) => exercise.level === 'Hard',
  )

  const progress = Math.round(
    (score / exercises.length) * 100,
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

        <h1>May and Might Exercises</h1>

        <p className="page-intro">
          Practice <strong>may</strong> and <strong>might</strong>{' '}
          through possibility, uncertainty, negative forms,
          permission, real-life situations, and common mistakes.
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
        description="Practice the basic structure of may and might and recognize simple possibilities."
        exercises={easy}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Medium"
        description="Practice negative possibility, permission, meaning, and common grammar mistakes."
        exercises={medium}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Hard"
        description="Use may and might in realistic situations, IT scenarios, ambiguous contexts, and subtle meaning differences."
        exercises={hard}
        onComplete={handleComplete}
      />

      <section className="final-reminder">
        <span>Quick Reference</span>

        <h2>may / might + base verb</h2>

        <div className="final-grid">
          <div>
            <strong>May</strong>
            <p>It may rain.</p>
          </div>

          <div>
            <strong>Might</strong>
            <p>It might rain.</p>
          </div>

          <div>
            <strong>Negative</strong>
            <p>It might not rain.</p>
          </div>

          <div>
            <strong>Permission</strong>
            <p>May I come in?</p>
          </div>
        </div>

        <p className="final-warning">
          <strong>Remember:</strong> may/might + base verb ·
          no <strong>to</strong> · no <strong>-s</strong>
        </p>
      </section>
    </main>
  )
}

export default MayAndMightExercises