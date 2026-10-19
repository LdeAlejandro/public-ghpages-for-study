
import { useState } from 'react'
import './page.css'

export const metadata = {
  title: 'Causatives Exercises',
  category: 'English',
  description:
    'Practice get, have, and make, plus polite requests for favors.',
  keywords: [
    'english',
    'grammar',
    'causatives',
    'get',
    'have',
    'make',
    'exercises',
    'favors',
  ],
  created: '2026-10-19',
}

const exercises = [
  // EASY
  {
    id: 1,
    level: 'Easy',
    type: 'choice',
    title: 'GET: verb pattern',
    question: 'Which sentence uses get correctly?',
    options: [
      'I got my brother help me.',
      'I got my brother to help me.',
      'I got my brother helping me.',
    ],
    answer: 'I got my brother to help me.',
    explanation:
      'The active causative pattern is get + person + to + base verb.',
  },
  {
    id: 2,
    level: 'Easy',
    type: 'choice',
    title: 'HAVE: verb pattern',
    question: 'Which structure is correct?',
    options: [
      'have + person + to + verb',
      'have + person + base verb',
      'have + person + past participle',
    ],
    answer: 'have + person + base verb',
    explanation:
      'When someone performs an action at your request, use have + person + base verb.',
  },
  {
    id: 3,
    level: 'Easy',
    type: 'choice',
    title: 'Meaning of MAKE',
    question:
      'Which verb most clearly expresses an obligation?',
    options: ['get', 'have', 'make'],
    answer: 'make',
    explanation:
      'Make commonly means requiring or forcing someone to do something.',
  },
  {
    id: 4,
    level: 'Easy',
    type: 'truefalse',
    title: 'Using TO',
    question:
      'In the active causative, get normally requires to before the second verb.',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      'Say get someone to do something, but have/make someone do something.',
  },
  {
    id: 5,
    level: 'Easy',
    type: 'fill',
    title: 'Complete the pattern',
    question: 'I got my brother ___ me with the project.',
    answer: 'to help',
    explanation:
      'After get + person, use to + base verb: got my brother to help.',
  },
  {
    id: 6,
    level: 'Easy',
    type: 'choice',
    title: 'Vocabulary: transportation',
    question:
      'Which phrase means taking someone somewhere in your car?',
    options: [
      'lend someone a pen',
      'give someone a ride',
      'keep an eye on something',
    ],
    answer: 'give someone a ride',
    explanation:
      'Give someone a ride means drive that person to a destination.',
  },

  // MEDIUM
  {
    id: 7,
    level: 'Medium',
    type: 'fill',
    title: 'GET in the past',
    context:
      'You persuaded a company to change its schedule.',
    question: 'I got the company ___ to a new date.',
    answer: 'to agree',
    explanation:
      'Got + the company + to agree follows the active causative get pattern.',
  },
  {
    id: 8,
    level: 'Medium',
    type: 'fill',
    title: 'HAVE in the past',
    context:
      'Your assistant was responsible for arranging the meeting.',
    question: 'I had my assistant ___ the meeting.',
    answer: 'plan',
    explanation:
      'Had + person + base verb: had my assistant plan.',
  },
  {
    id: 9,
    level: 'Medium',
    type: 'fill',
    title: 'MAKE in the past',
    context: 'Signing the form was mandatory.',
    question: 'They made him ___ the form.',
    answer: 'sign',
    explanation:
      'Made + person + base verb: made him sign. Do not add to.',
  },
  {
    id: 10,
    level: 'Medium',
    type: 'choice',
    title: 'Vocabulary: watch belongings',
    context:
      'You are leaving your bag with a friend for five minutes.',
    question: 'What is the most natural request?',
    options: [
      'Could you keep an eye on my bag?',
      'Could you fill in for my bag?',
      'Could you give my bag a ride?',
    ],
    answer: 'Could you keep an eye on my bag?',
    explanation:
      'Keep an eye on something means watch it or look after it briefly.',
  },
  {
    id: 11,
    level: 'Medium',
    type: 'choice',
    title: 'Declining a favor politely',
    context:
      'A colleague asks you for a ride, but you have an appointment.',
    question: 'Which response is appropriate?',
    options: [
      'I would, but I have an appointment.',
      'I made you take me.',
      'You must give me a ride.',
    ],
    answer: 'I would, but I have an appointment.',
    explanation:
      'I would, but ... is a polite way to decline and explain why.',
  },
  {
    id: 12,
    level: 'Medium',
    type: 'choice',
    title: 'Suggesting another person',
    context:
      'You cannot drive your friend, so you suggest asking Jack.',
    question: 'Which sentence is correct?',
    options: [
      'Maybe you could get Jack take you.',
      'Maybe you could get Jack to take you.',
      'Maybe you could get Jack taken you.',
    ],
    answer: 'Maybe you could get Jack to take you.',
    explanation:
      'Get + Jack + to take is the correct active causative structure.',
  },

  // HARD
  {
    id: 13,
    level: 'Hard',
    type: 'choice',
    title: 'Meaning changes',
    context:
      'The employee did the work because the manager required it.',
    question: 'Which sentence best expresses that meaning?',
    options: [
      'The manager made the employee finish the report.',
      'The manager got the employee to finish the report.',
      'The manager had the report finished.',
    ],
    answer:
      'The manager made the employee finish the report.',
    explanation:
      'Make most directly emphasizes an obligation; get suggests persuasion or arrangement.',
  },
  {
    id: 14,
    level: 'Hard',
    type: 'choice',
    title: 'Spot the incorrect sentence',
    question:
      'Which sentence contains a causative grammar error?',
    options: [
      'They had the bellman bring the bags.',
      'She made her brother to wash the dishes.',
      'We got our friends to clean up.',
    ],
    answer:
      'She made her brother to wash the dishes.',
    explanation:
      'In the active causative, make takes a base verb without to: made her brother wash.',
  },
  {
    id: 15,
    level: 'Hard',
    type: 'fill',
    title: 'Vocabulary: replace a colleague',
    context:
      'A coworker cannot work their shift, so they ask you to substitute for them.',
    question: 'Could you ___ for me this afternoon?',
    answer: 'fill in',
    explanation:
      'Fill in for someone means temporarily do their job or take their place.',
  },
  {
    id: 16,
    level: 'Hard',
    type: 'choice',
    title: 'Word order',
    question: 'Choose the grammatically correct sentence.',
    options: [
      'I got the students to clean up after the party.',
      'I got to clean the students up after the party.',
      'I got the students clean up after the party.',
    ],
    answer:
      'I got the students to clean up after the party.',
    explanation:
      'The order is got + the students + to clean up.',
  },
  {
    id: 17,
    level: 'Hard',
    type: 'choice',
    title: 'Polite favor request',
    context:
      'You forgot your pen and want to ask a classmate for it temporarily.',
    question: 'Which request best fits the situation?',
    options: [
      'Would you mind lending me your pen?',
      'Would you mind making me your pen?',
      'Would you mind filling in your pen?',
    ],
    answer: 'Would you mind lending me your pen?',
    explanation:
      'Lend means allow another person to use something temporarily. After would you mind, use an -ing verb.',
  },
  {
    id: 18,
    level: 'Hard',
    type: 'truefalse',
    title: 'GET vs HAVE',
    question:
      '“I got my assistant to plan the meeting” and “I had my assistant plan the meeting” use different verb patterns.',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      'Get takes to plan; have takes plan. Both can describe arranging for someone to act.',
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
    if (!input.trim() || submitted) return

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
            {isFill
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
            aria-label={`Answer to question ${exercise.id}`}
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
              } else if (option === selected) {
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
                aria-pressed={selected === option}
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
          role="status"
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
              Correct answer: <strong>{exercise.answer}</strong>
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
  exercises: items,
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
          {items.length} exercises
        </span>
      </div>

      <div className="exercise-list">
        {items.map((exercise) => (
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

export default function CausativesExercises() {
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
          English · Grammar · Practice
        </span>

        <h1>Causatives Exercises</h1>

        <p className="page-intro">
          Practice get, have, and make with the correct verb
          patterns, meanings, and everyday requests for favors.
        </p>
      </header>

      <section
        className="progress-container"
        aria-label="Exercise progress"
      >
        <div className="progress-info">
          <div>
            <span className="progress-label">Progress</span>
            <strong>{score} / {exercises.length}</strong>
          </div>

          <span className="progress-percentage">
            {progress}%
          </span>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={exercises.length}
          aria-label="Completed exercises"
        >
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <section className="quick-rule">
        <span className="quick-rule-label">
          Before you answer
        </span>

        <div className="intensity-reference">
          <div>
            <strong>GET</strong>
            <span>person + to + verb</span>
          </div>

          <span>·</span>

          <div>
            <strong>HAVE</strong>
            <span>person + verb</span>
          </div>

          <span>·</span>

          <div>
            <strong>MAKE</strong>
            <span>person + verb</span>
          </div>
        </div>

        <p>
          Get uses to. Have and make use the base verb without to.
        </p>
      </section>

      <ExerciseSection
        title="Easy"
        description="Recognize the structures, meanings, and basic favor vocabulary."
        exercises={easy}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Medium"
        description="Complete causative sentences and respond naturally in everyday situations."
        exercises={medium}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Hard"
        description="Distinguish meanings, correct errors, and apply the patterns in context."
        exercises={hard}
        onComplete={handleComplete}
      />

      <section className="final-reminder">
        <span>Quick Reference</span>

        <h2>Get, have, or make?</h2>

        <div className="final-scale">
          <div>
            <strong>get</strong>
            <span>someone to do</span>
          </div>

          <span>·</span>

          <div>
            <strong>have</strong>
            <span>someone do</span>
          </div>

          <span>·</span>

          <div>
            <strong>make</strong>
            <span>someone do</span>
          </div>
        </div>

        <p>
          Choose the verb based on meaning: persuasion,
          instruction, or obligation.
        </p>
      </section>
    </main>
  )
}
