type Props = {
  hidden?: boolean
}

export function ScrollCue({ hidden }: Props) {
  return (
    <div
      className={`scroll-cue${hidden ? ' is-hidden' : ''}`}
      aria-hidden="true"
    >
      <span className="scroll-cue-label">גלילה</span>
      <span className="scroll-cue-line" />
    </div>
  )
}
