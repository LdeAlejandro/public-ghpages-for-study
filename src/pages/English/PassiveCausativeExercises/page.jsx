
import { useState } from 'react'
import './page.css'

export const metadata = {
  title: 'Passive Causative Exercises',
  category: 'English',
  description:
    'Practice have/get something done, services, past participles, and urgent deadlines.',
  keywords: [
    'english',
    'grammar',
    'passive causative',
    'have',
    'get',
    'past participle',
    'services',
    'exercises',
  ],
  created: '2026-10-19',
}

const exercises = [
  // EASY
  {
    id: 1,
    level: 'Easy',
    type: 'choice',
    title: 'Passive causative structure',
    question: 'Which pattern is used to arrange a service?',
    options: [
      'have / get + object + past participle',
      'have / get + object + to + base verb',
      'make + object + base verb',
    ],
    answer: 'have / get + object + past participle',
    explanation:
      'Passive causative: have/get + thing receiving the action + past participle.',
  },
  {
    id: 2,
    level: 'Easy',
    type: 'fill',
    title: 'Dry-clean a suit',
    question: 'I had my suit ___.',
    answer: 'dry-cleaned',
    explanation:
      'The service is dry-clean a suit; the past participle is dry-cleaned.',
  },
  {
    id: 3,
    level: 'Easy',
    type: 'choice',
    title: 'Repair shoes',
    question:
      'Which sentence means someone repaired your shoes for you?',
    options: [
      'I had my shoes repair.',
      'I got my shoes repaired.',
      'I got my shoes to repair.',
    ],
    answer: 'I got my shoes repaired.',
    explanation:
      'Get + shoes + repaired is the passive causative structure.',
  },
  {
    id: 4,
    level: 'Easy',
    type: 'truefalse',
    title: 'Who does the work?',
    question:
      '“I had my shoes repaired” normally means I personally repaired them.',
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'It means you arranged for another person to repair your shoes.',
  },
  {
    id: 5,
    level: 'Easy',
    type: 'choice',
    title: 'Frame a picture',
    question: 'Choose the correct passive causative.',
    options: [
      'I had the picture framed.',
      'I had the picture frame.',
      'I had the picture to frame.',
    ],
    answer: 'I had the picture framed.',
    explanation:
      'Have + picture + framed. Framed is the past participle.',
  },
  {
    id: 6,
    level: 'Easy',
    type: 'truefalse',
    title: 'Have and get',
    question:
      'For arranging services, both have and get can be used in the passive causative.',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      'Both are possible: I had my suit dry-cleaned / I got my suit dry-cleaned.',
  },

  // MEDIUM
  {
    id: 7,
    level: 'Medium',
    type: 'fill',
    title: 'Present continuous',
    context:
      'A company will paint your office tomorrow. The arrangement is already made.',
    question: "We're having the office ___ tomorrow.",
    answer: 'painted',
    explanation:
      'Having + object + past participle: having the office painted.',
  },
  {
    id: 8,
    level: 'Medium',
    type: 'fill',
    title: 'Get a repair',
    context:
      'A shoe repair shop will fix your sandals.',
    question: 'I can get my sandals ___ here.',
    answer: 'repaired',
    explanation:
      'Get + sandals + repaired is the passive causative.',
  },
  {
    id: 9,
    level: 'Medium',
    type: 'choice',
    title: 'Mentioning the provider',
    context:
      'It matters which company is painting the office.',
    question:
      'Which sentence correctly names the service provider?',
    options: [
      'We are having the office painted by Royal Painting Services.',
      'We are having the office painted to Royal Painting Services.',
      'We are having the office paint by Royal Painting Services.',
    ],
    answer:
      'We are having the office painted by Royal Painting Services.',
    explanation:
      'A by phrase identifies who performs the service when that information is important.',
  },
  {
    id: 10,
    level: 'Medium',
    type: 'fill',
    title: 'Future arrangement',
    context:
      'A print shop will produce your sign tomorrow.',
    question: "I'll have the sign ___ tomorrow.",
    answer: 'printed',
    explanation:
      'After have + the sign, use the past participle printed.',
  },
  {
    id: 11,
    level: 'Medium',
    type: 'choice',
    title: 'Express service',
    context:
      'You need your jacket cleaned no later than tomorrow.',
    question: 'Which request is natural and correct?',
    options: [
      'Could I get this jacket dry-cleaned by tomorrow?',
      'Could I get this jacket dry-clean by tomorrow?',
      'Could I get this jacket to dry-clean by tomorrow?',
    ],
    answer:
      'Could I get this jacket dry-cleaned by tomorrow?',
    explanation:
      'Get + jacket + dry-cleaned describes the service; by tomorrow sets the deadline.',
  },
  {
    id: 12,
    level: 'Medium',
    type: 'choice',
    title: 'Irregular past participle',
    question:
      'Which form correctly completes “I had my hair ___”?',
    options: ['cut', 'cutted', 'to cut'],
    answer: 'cut',
    explanation:
      'Cut is irregular: base form cut, past simple cut, past participle cut.',
  },

  // HARD
  {
    id: 13,
    level: 'Hard',
    type: 'choice',
    title: 'Active vs passive causative',
    question:
      'Which sentence focuses on the laptop receiving the repair, rather than naming the technician?',
    options: [
      'I had the technician repair my laptop.',
      'I got the technician to repair my laptop.',
      'I had my laptop repaired.',
    ],
    answer: 'I had my laptop repaired.',
    explanation:
      'Passive causative: have + laptop + repaired. The person performing the service is not named.',
  },
  {
    id: 14,
    level: 'Hard',
    type: 'choice',
    title: 'Polite question',
    context:
      'You want a shop to frame several pictures.',
    question: 'Which question is correct?',
    options: [
      'Could I have these pictures framed?',
      'Could I have these pictures frame?',
      'Could I have these pictures to frame?',
    ],
    answer: 'Could I have these pictures framed?',
    explanation:
      'Could I have + these pictures + framed is a polite passive causative question.',
  },
  {
    id: 15,
    level: 'Hard',
    type: 'fill',
    title: 'Deadline expression',
    context:
      'The photo shop closes at 6:00. You need your photos earlier than that.',
    question:
      'Could I have these photos printed ___ 6:00?',
    answer: 'before',
    explanation:
      'Before 6:00 means earlier than 6:00; by 6:00 would mean no later than 6:00.',
  },
  {
    id: 16,
    level: 'Hard',
    type: 'fill',
    title: 'Package delivery',
    context:
      'You arranged for a courier to take a package to the customer.',
    question:
      'I got the package ___ to the customer.',
    answer: 'delivered',
    explanation:
      'Get + package + delivered is the passive causative.',
  },
  {
    id: 17,
    level: 'Hard',
    type: 'truefalse',
    title: 'Optional provider',
    question:
      'The passive causative always requires a by phrase naming the person who performs the service.',
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'A by phrase is optional and is normally included only when the provider is important.',
  },
  {
    id: 18,
    level: 'Hard',
    type: 'choice',
    title: 'Service vs person',
    context:
      'A tailor will shorten your skirt. You want to focus on the skirt and the service.',
    question:
      'Which sentence uses the passive causative?',
    options: [
      'I had the tailor shorten my skirt.',
      'I got my skirt shortened.',
      'I made the tailor shorten my skirt.',
    ],
    answer: 'I got my skirt shortened.',
    explanation:
      'Get + skirt + shortened is passive causative. The other examples focus on the person doing the work.',
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

export default function PassiveCausativeExercises() {
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

        <h1>Passive Causative Exercises</h1>

        <p className="page-intro">
          Practice arranging services with have or get,
          using past participles, and requesting express
          service by a deadline.
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
            <strong>HAVE / GET</strong>
            <span>arrange a service</span>
          </div>

          <span>+</span>

          <div>
            <strong>OBJECT</strong>
            <span>receives the action</span>
          </div>

          <span>+</span>

          <div>
            <strong>PARTICIPLE</strong>
            <span>repaired / framed / cut</span>
          </div>
        </div>

        <p>
          Focus on the object receiving the service.
          Use by + provider only when relevant.
        </p>
      </section>

      <ExerciseSection
        title="Easy"
        description="Recognize the passive causative and common service vocabulary."
        exercises={easy}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Medium"
        description="Use past participles, different tenses, providers, and express-service requests."
        exercises={medium}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Hard"
        description="Distinguish active and passive causatives and use precise service language."
        exercises={hard}
        onComplete={handleComplete}
      />

      <section className="final-reminder">
        <span>Quick Reference</span>

        <h2>Have / get something done</h2>

        <div className="final-scale">
          <div>
            <strong>have / get</strong>
            <span>service arrangement</span>
          </div>

          <span>+</span>

          <div>
            <strong>object</strong>
            <span>thing affected</span>
          </div>

          <span>+</span>

          <div>
            <strong>past participle</strong>
            <span>work performed</span>
          </div>
        </div>

        <p>
          Example: I had my jacket dry-cleaned by Friday.
        </p>
      </section>
    </main>
  )
}
