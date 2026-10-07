import { useState } from 'react'
import './page.css'

export const metadata = {
  title: 'Tag Questions Exercises',
  category: 'English',
  description:
    'Practice tag questions with interactive exercises covering auxiliary verbs, pronouns, positive and negative statements, and special cases.',
  keywords: [
    'english',
    'grammar',
    'tag questions',
    'question tags',
    'exercises',
    'practice',
    'auxiliary verbs',
    'pronouns',
  ],
  created: '2026-10-07',
}

const exercises = [
  // EASY
  {
    id: 1,
    level: 'Easy',
    type: 'choice',
    title: 'Positive statement',
    question: 'You are tired, ___',
    options: ["aren't you?", 'are you?', "don't you?"],
    answer: "aren't you?",
    explanation:
      'The statement is positive and uses "are", so the tag is negative: "aren\'t you?"',
  },
  {
    id: 2,
    level: 'Easy',
    type: 'choice',
    title: 'Negative statement',
    question: "She isn't working today, ___",
    options: ["isn't she?", 'is she?', 'does she?'],
    answer: 'is she?',
    explanation:
      'The statement is negative, so the tag is positive. The auxiliary verb is "is".',
  },
  {
    id: 3,
    level: 'Easy',
    type: 'fill',
    title: 'Simple Present',
    question: 'You like coffee, ___',
    answer: "don't you?",
    explanation:
      'There is no auxiliary in the statement, so Simple Present uses "do". The statement is positive, so we use "don\'t you?"',
  },
  {
    id: 4,
    level: 'Easy',
    type: 'truefalse',
    title: 'Check the tag',
    question: 'She works here, doesn’t she?',
    options: ['True', 'False'],
    answer: 'True',
    explanation:
      '"Works" is Simple Present with she. We use "does", and because the statement is positive, the tag is negative.',
  },
  {
    id: 5,
    level: 'Easy',
    type: 'choice',
    title: 'Choose the pronoun',
    question: 'John is your brother, ___',
    options: ["isn't John?", "isn't he?", "doesn't he?"],
    answer: "isn't he?",
    explanation:
      'The subject "John" becomes the pronoun "he". The verb is "is", so the tag is "isn\'t he?"',
  },
  {
    id: 6,
    level: 'Easy',
    type: 'fill',
    title: 'Simple Past',
    question: 'They arrived yesterday, ___',
    answer: "didn't they?",
    explanation:
      '"Arrived" is Simple Past. There is no auxiliary in the statement, so the tag uses "did".',
  },

  // MEDIUM
  {
    id: 7,
    level: 'Medium',
    type: 'choice',
    title: 'Present Perfect',
    question: 'You have finished the report, ___',
    options: ["haven't you?", "don't you?", "didn't you?"],
    answer: "haven't you?",
    explanation:
      'The statement already contains the auxiliary "have", so the tag uses the same auxiliary: "haven\'t you?"',
  },
  {
    id: 8,
    level: 'Medium',
    type: 'fill',
    title: 'Past Perfect',
    question: 'She had left before you arrived, ___',
    answer: "hadn't she?",
    explanation:
      'The statement uses Past Perfect with "had", so the tag also uses "had": "hadn\'t she?"',
  },
  {
    id: 9,
    level: 'Medium',
    type: 'choice',
    title: 'Modal verb',
    question: 'You can speak English, ___',
    options: ["can't you?", "don't you?", 'can you?'],
    answer: "can't you?",
    explanation:
      'The modal verb is "can". The statement is positive, so the tag uses the negative form "can\'t".',
  },
  {
    id: 10,
    level: 'Medium',
    type: 'truefalse',
    title: 'Negative + positive',
    question: "He didn't call you, didn't he?",
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'The statement is already negative: "didn\'t call". The tag must therefore be positive: "did he?"',
  },
  {
    id: 11,
    level: 'Medium',
    type: 'choice',
    title: 'IT context',
    context: 'You are confirming that a service is currently online.',
    question: 'The server is running, ___',
    options: ["isn't it?", "doesn't it?", 'is it?'],
    answer: "isn't it?",
    explanation:
      '"The server" becomes "it". The statement uses "is", so the negative tag is "isn\'t it?"',
  },
  {
    id: 12,
    level: 'Medium',
    type: 'fill',
    title: 'Plural subject',
    question: 'The developers fixed the problem, ___',
    answer: "didn't they?",
    explanation:
      '"Fixed" is Simple Past, so we use "did". "The developers" becomes "they".',
  },

  // HARD
  {
    id: 13,
    level: 'Hard',
    type: 'choice',
    title: 'Special case: I am',
    question: "I'm late, ___",
    options: ["amn't I?", "aren't I?", 'am I?'],
    answer: "aren't I?",
    explanation:
      'The standard tag after "I am" is the special form "aren\'t I?"',
  },
  {
    id: 14,
    level: 'Hard',
    type: 'fill',
    title: "Special case: Let's",
    question: "Let's start the meeting, ___",
    answer: 'shall we?',
    explanation:
      'After "Let\'s", the usual tag is "shall we?"',
  },
  {
    id: 15,
    level: 'Hard',
    type: 'choice',
    title: 'Negative meaning',
    question: 'Nobody called you, ___',
    options: ["didn't they?", 'did they?', 'did he?'],
    answer: 'did they?',
    explanation:
      '"Nobody" has a negative meaning, so the tag is positive. "They" is commonly used as the pronoun.',
  },
  {
    id: 16,
    level: 'Hard',
    type: 'choice',
    title: 'Never',
    question: 'She never complains, ___',
    options: ["doesn't she?", 'does she?', "isn't she?"],
    answer: 'does she?',
    explanation:
      '"Never" gives the statement a negative meaning, so the tag is positive. "Complains" is Simple Present, so we use "does".',
  },
  {
    id: 17,
    level: 'Hard',
    type: 'fill',
    title: 'IT troubleshooting',
    context:
      'A technician believes the database was working before the incident and wants confirmation.',
    question: 'The database had been working normally, ___',
    answer: "hadn't it?",
    explanation:
      'The auxiliary is "had". The statement is positive and "the database" becomes "it", giving us "hadn\'t it?"',
  },
  {
    id: 18,
    level: 'Hard',
    type: 'truefalse',
    title: 'Rule check',
    question:
      'A tag question must always use do, does, or did.',
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'The tag normally uses the auxiliary or modal required by the statement: is, are, have, can, will, should, and many others. Do/does/did are used when needed with Simple Present or Simple Past.',
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
            placeholder="Type the tag question..."
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

        <span className={`section-level ${title.toLowerCase()}`}>
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

function TagQuestionsExercises() {
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

        <h1>Tag Questions Exercises</h1>

        <p className="page-intro">
          Practice building tag questions by identifying the
          auxiliary verb, changing positive and negative forms,
          and choosing the correct pronoun.
        </p>
      </header>

      <section className="progress-container">
        <div className="progress-info">
          <div>
            <span className="progress-label">Progress</span>
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

        <div className="rule-flow">
          <span>Positive statement</span>
          <strong>→</strong>
          <span>Negative tag</span>
        </div>

        <div className="rule-flow">
          <span>Negative statement</span>
          <strong>→</strong>
          <span>Positive tag</span>
        </div>

        <p>
          Keep the auxiliary verb and change the subject to the
          correct pronoun.
        </p>
      </section>

      <ExerciseSection
        title="Easy"
        description="Start with the basic positive/negative pattern and common tenses."
        exercises={easy}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Medium"
        description="Work with perfect tenses, modal verbs, pronouns, and real contexts."
        exercises={medium}
        onComplete={handleComplete}
      />

      <ExerciseSection
        title="Hard"
        description="Practice special cases and statements with negative meaning."
        exercises={hard}
        onComplete={handleComplete}
      />

      <section className="final-reminder">
        <span>Remember</span>

        <h2>Find the auxiliary first.</h2>

        <div className="final-formula">
          <strong>Positive</strong>
          <span>→</span>
          <span>negative tag</span>

          <strong>Negative</strong>
          <span>→</span>
          <span>positive tag</span>
        </div>

        <p>
          Sarah works here, <strong>doesn't she?</strong>
        </p>

        <p>
          Sarah doesn't work here, <strong>does she?</strong>
        </p>
      </section>
    </main>
  )
}

export default TagQuestionsExercises