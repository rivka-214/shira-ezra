type Props = {
  title: string
  note?: string
}

export function MediaGallery({ title, note }: Props) {
  return (
    <div>
      {title ? <h2>{title}</h2> : null}
      {note ? <p className="muted">{note}</p> : null}
      <div className="missing-block" role="status">
        המדיה לתחום זה תתווסף בהמשך. לא מוצגות דוגמאות זמניות.
      </div>
    </div>
  )
}
