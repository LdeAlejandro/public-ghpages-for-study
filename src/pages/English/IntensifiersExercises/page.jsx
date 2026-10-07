import { useState } from 'react'
import './page.css'

export const metadata = {
  title: 'Intensifiers Exercises',
  category: 'English',
  description:
    'Practice pretty, really, so, incredibly, and unbelievably through interactive exercises based on levels of intensity.',
  keywords: [
    'english',
    'grammar',
    'intensifiers',
    'exercises',
    'pretty',
    'really',
    'so',
    'incredibly',
    'unbelievably',
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
    title: 'Weakest intensifier',
    question:
      'Which intensifier has the lowest intensity in this lesson?',
    options: [
      'pretty',
      'really',
      'incredibly',
      'unbelievably',
    ],
    answer: 'pretty',
    explanation:
      'Pretty is the weakest intensifier in this lesson: pretty (+).',
  },
  {
    id: 2,
    level: 'Easy',
    type: 'choice',
    title: 'Strongest intensifier',
    question:
      'Which intensifier expresses the strongest intensity?',
    options: [
      'pretty',
      'so',
      'incredibly',
      'unbelievably',
    ],
    answer: 'unbelievably',
    explanation:
      'Unbelievably has the highest intensity in this lesson: unbelievably (++++).',
  },
  {
    id: 3,
    level: 'Easy',
    type: 'choice',
    title: 'Strength level',
    question: 'Which intensifier represents +++?',
    options: [
      'pretty',
      'really',
      'incredibly',
      'unbelievably',
    ],
    answer: 'incredibly',
    explanation:
      'The scale is pretty (+), really/so (++), incredibly (+++), and unbelievably (++++).',
  },
  {
    id: 4,
    level: 'Easy',
    type: 'truefalse',
    title: 'Really and so',
    question:
      'In this lesson, “really” and “so” have the same intensity level.',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      'Your lesson places both really and so at the ++ level.',
  },
  {
    id: 5,
    level: 'Easy',
    type: 'choice',
    title: 'Meaning of pretty',
    question: 'You must be pretty hungry by now!',
    options: [
      'Pretty means beautiful.',
      'Pretty makes hungry stronger.',
      'Pretty makes hungry weaker.',
    ],
    answer: 'Pretty makes hungry stronger.',
    explanation:
      'Here, pretty is an intensifier. It means something similar to fairly or quite.',
  },
  {
    id: 6,
    level: 'Easy',
    type: 'fill',
    title: 'Complete the scale',
    question:
      'pretty → really / so → ______ → unbelievably',
    answer: 'incredibly',
    explanation:
      'Incredibly (+++) comes between really/so (++) and unbelievably (++++).',
  },

  // MEDIUM
  {
    id: 7,
    level: 'Medium',
    type: 'choice',
    title: 'Choose the intensity',
    context:
      'Your day was very busy, but you do not want to use the strongest possible description.',
    question: 'My day was ___ busy.',
    options: [
      'pretty',
      'incredibly',
      'unbelievably',
    ],
    answer: 'incredibly',
    explanation:
      'Incredibly (+++) gives a very strong description without using the maximum level, unbelievably (++++).',
  },
  {
    id: 8,
    level: 'Medium',
    type: 'choice',
    title: 'Conversational emphasis',
    context:
      'You really enjoyed the food and want your reaction to sound expressive.',
    question: 'This pizza is ___ good!',
    options: [
      'so',
      'pretty',
      'unbelievably',
    ],
    answer: 'so',
    explanation:
      'So is commonly used for expressive or emotional emphasis: “This pizza is so good!”',
  },
  {
    id: 9,
    level: 'Medium',
    type: 'fill',
    title: 'Moderate intensity',
    context:
      'You are tired, but you do not want to make the description extremely strong.',
    question: "I'm ___ tired.",
    answer: 'pretty',
    explanation:
      'Pretty (+) gives the mildest level of emphasis among the intensifiers in this lesson.',
  },
  {
    id: 10,
    level: 'Medium',
    type: 'truefalse',
    title: 'Word position',
    question:
      'In “The test was incredibly difficult,” the intensifier comes before the adjective.',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      'The pattern is intensifier + adjective: incredibly + difficult.',
  },
  {
    id: 11,
    level: 'Medium',
    type: 'choice',
    title: 'Correct word order',
    question: 'Which sentence has the correct word order?',
    options: [
      'The server is slow incredibly.',
      'The server incredibly is slow.',
      'The server is incredibly slow.',
    ],
    answer: 'The server is incredibly slow.',
    explanation:
      'With an adjective, the intensifier normally goes immediately before the adjective: incredibly slow.',
  },
  {
    id: 12,
    level: 'Medium',
    type: 'choice',
    title: 'Compare strength',
    question:
      'Which sentence expresses a stronger degree of difficulty?',
    options: [
      'The exam was pretty difficult.',
      'The exam was incredibly difficult.',
    ],
    answer: 'The exam was incredibly difficult.',
    explanation:
      'Incredibly (+++) is much stronger than pretty (+).',
  },

  // HARD
  {
    id: 13,
    level: 'Hard',
    type: 'choice',
    title: 'Busy schedule',
    context:
      'By 9:00 you had already taken a test, registered for class, and bought your books.',
    question: 'How was your morning?',
    options: [
      'Pretty busy.',
      'Really busy.',
      'Unbelievably busy.',
    ],
    answer: 'Unbelievably busy.',
    explanation:
      'For an extremely busy schedule, unbelievably (++++) expresses the strongest degree in this lesson.',
  },
  {
    id: 14,
    level: 'Hard',
    type: 'choice',
    title: 'Intensity order',
    question:
      'Which sequence correctly goes from weaker to stronger?',
    options: [
      'pretty → really → incredibly → unbelievably',
      'unbelievably → incredibly → really → pretty',
      'really → pretty → unbelievably → incredibly',
    ],
    answer:
      'pretty → really → incredibly → unbelievably',
    explanation:
      'The progression is pretty (+), really/so (++), incredibly (+++), unbelievably (++++).',
  },
  {
    id: 15,
    level: 'Hard',
    type: 'fill',
    title: 'Maximum intensity',
    context:
      'The traffic was much worse than you expected. You want the strongest description from this lesson.',
    question: 'The traffic was ___ bad.',
    answer: 'unbelievably',
    explanation:
      'Unbelievably (++++) represents the highest intensity in the lesson.',
  },
  {
    id: 16,
    level: 'Hard',
    type: 'choice',
    title: 'IT context',
    context:
      'An application normally responds immediately, but today every action takes several seconds. You want a very strong description, but not the maximum one.',
    question: 'The application is ___ slow today.',
    options: [
      'pretty',
      'incredibly',
      'unbelievably',
    ],
    answer: 'incredibly',
    explanation:
      'Incredibly (+++) is very strong, while unbelievably (++++) is the maximum level in this scale.',
  },
  {
    id: 17,
    level: 'Hard',
    type: 'truefalse',
    title: 'Intensity meaning',
    question:
      '“I am unbelievably busy” expresses a stronger degree than “I am really busy.”',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      'Really is ++ while unbelievably is ++++ in this lesson.',
  },
  {
    id: 18,
    level: 'Hard',
    type: 'choice',
    title: 'Same strength, different feeling',
    question:
      'Which pair is shown at the same intensity level in this lesson?',
    options: [
      'pretty and incredibly',
      'really and so',
      'incredibly and unbelievably',
      'pretty and really',
    ],
    answer: 'really and so',
    explanation:
      'Both really and so are shown as ++. So can sound more expressive depending on the context.',
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

function IntensifiersExercises() {
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

        <h1>Intensifiers Exercises</h1>

        <p className="page-intro">
          Practice choosing between pretty, really, so,
          incredibly, and unbelievably according to the
          intensity you want to express.
        </p>
      </header>

      <section className="progress-container">
        <div className="progress-info">
          <div>
            <span className="progress-label">
              Progress
            </span>
            <br />

            <strong>
              {score} / {exercises.length} | 
            </strong>
          </div>

          <span className="progress-percentage">
             {progress}%
          </span>
        </div>

        <div className="progress-track">
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
          The more + signs, the stronger the description.
        </p>
      </section>

      <ExerciseSection
        title="Easy"
        description="Learn the intensity scale and identify the basic meaning of each intensifier."
        exercises={easy}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Medium"
        description="Choose intensifiers according to context, strength, and sentence structure."
        exercises={medium}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Hard"
        description="Use intensity differences in realistic conversations and situations."
        exercises={hard}
        onComplete={handleComplete}
      />

      <section className="final-reminder">
        <span>Quick Reference</span>

        <h2>From weaker to stronger</h2>

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

export default IntensifiersExercises