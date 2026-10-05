type Step = { title: string; text: string }

type Props = {
  title: string
  intro?: string
  steps: Step[]
  variant?: 'column' | 'row'
}

export function ProcessSteps({ title, intro, steps, variant = 'column' }: Props) {
  return (
    <div className={`process process-${variant}`}>
      <h2>{title}</h2>
      {intro ? <p className="lead">{intro}</p> : null}
      <ol className="steps">
        {steps.map((s, i) => (
          <li key={s.title}>
            <span className="num">{i + 1}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
