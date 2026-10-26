import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { A11Y_MOTION_EVENT } from '../../motion/useReducedMotion'

const STORAGE_KEY = 'shira-a11y'
const TEXT_LABELS = ['100%', '115%', '130%', '145%'] as const

type A11yState = {
  text: 0 | 1 | 2 | 3
  contrast: boolean
  gray: boolean
  links: boolean
  readable: boolean
  spacing: boolean
  motion: boolean
  cursor: boolean
}

const DEFAULT_STATE: A11yState = {
  text: 0,
  contrast: false,
  gray: false,
  links: false,
  readable: false,
  spacing: false,
  motion: false,
  cursor: false,
}

function readA11y(): A11yState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as Partial<A11yState>
    const text = parsed.text
    return {
      text: text === 1 || text === 2 || text === 3 ? text : 0,
      contrast: Boolean(parsed.contrast),
      gray: Boolean(parsed.gray),
      links: Boolean(parsed.links),
      readable: Boolean(parsed.readable),
      spacing: Boolean(parsed.spacing),
      motion: Boolean(parsed.motion),
      cursor: Boolean(parsed.cursor),
    }
  } catch {
    return DEFAULT_STATE
  }
}

function applyA11y(state: A11yState) {
  const root = document.documentElement
  if (state.text === 0) delete root.dataset.a11yText
  else root.dataset.a11yText = String(state.text)
  root.classList.toggle('a11y-contrast', state.contrast)
  root.classList.toggle('a11y-gray', state.gray)
  root.classList.toggle('a11y-links', state.links)
  root.classList.toggle('a11y-readable', state.readable)
  root.classList.toggle('a11y-spacing', state.spacing)
  root.classList.toggle('a11y-motion', state.motion)
  root.classList.toggle('a11y-cursor', state.cursor)
  window.dispatchEvent(new Event(A11Y_MOTION_EVENT))
}

applyA11y(readA11y())

function AccessIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="6.2" r="2.7" fill="currentColor" />
      <path
        d="M7.2 13.2h17.6M16 13.2v7.4M16 20.6l-5.2 7M16 20.6l5.2 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AccessibilityWidget() {
  const titleId = useId()
  const dockRef = useRef<HTMLDivElement>(null)
  const tabRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<A11yState>(readA11y)

  useLayoutEffect(() => {
    applyA11y(state)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  useEffect(() => {
    if (open) {
      wasOpen.current = true
      panelRef.current?.focus()
      return
    }
    if (wasOpen.current) tabRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    function onPointer(event: PointerEvent) {
      if (!dockRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  function patch(partial: Partial<A11yState>) {
    setState((current) => ({ ...current, ...partial }))
  }

  function changeText(direction: -1 | 1) {
    setState((current) => {
      const next = Math.min(3, Math.max(0, current.text + direction)) as A11yState['text']
      return { ...current, text: next }
    })
  }

  const panel = (
    <>
      {state.gray ? <div className="a11y-gray-veil" aria-hidden="true" /> : null}
      <div className="a11y-dock" ref={dockRef}>
        {open ? (
          <div
            ref={panelRef}
            className="a11y-panel"
            id="a11y-panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            tabIndex={-1}
          >
            <div className="a11y-panel-head">
              <div>
                <h2 id={titleId}>נגישות</h2>
                <span className="a11y-rule" aria-hidden="true" />
              </div>
              <button
                type="button"
                className="a11y-close"
                onClick={() => setOpen(false)}
                aria-label="סגירת תפריט הנגישות"
              >
                ×
              </button>
            </div>

            <div className="a11y-size">
              <span>גודל טקסט</span>
              <div className="a11y-size-controls">
                <button
                  type="button"
                  onClick={() => changeText(1)}
                  disabled={state.text === 3}
                  aria-label="הגדלת טקסט"
                >
                  א+
                </button>
                <span aria-live="polite">{TEXT_LABELS[state.text]}</span>
                <button
                  type="button"
                  onClick={() => changeText(-1)}
                  disabled={state.text === 0}
                  aria-label="הקטנת טקסט"
                >
                  א−
                </button>
              </div>
            </div>

            <div className="a11y-options">
              <Toggle
                pressed={state.contrast}
                onClick={() => patch({ contrast: !state.contrast })}
                label="ניגודיות גבוהה"
              />
              <Toggle
                pressed={state.gray}
                onClick={() => patch({ gray: !state.gray })}
                label="גווני אפור"
              />
              <Toggle
                pressed={state.links}
                onClick={() => patch({ links: !state.links })}
                label="הדגשת קישורים"
              />
              <Toggle
                pressed={state.readable}
                onClick={() => patch({ readable: !state.readable })}
                label="גופן קריא"
              />
              <Toggle
                pressed={state.spacing}
                onClick={() => patch({ spacing: !state.spacing })}
                label="מרווח קריאה"
              />
              <Toggle
                pressed={state.motion}
                onClick={() => patch({ motion: !state.motion })}
                label="עצירת אנימציות"
              />
              <Toggle
                pressed={state.cursor}
                onClick={() => patch({ cursor: !state.cursor })}
                label="סמן גדול"
              />
            </div>

            <button
              type="button"
              className="a11y-reset"
              onClick={() => setState(DEFAULT_STATE)}
            >
              איפוס הגדרות
            </button>
          </div>
        ) : null}

        <button
          ref={tabRef}
          type="button"
          className={open ? 'a11y-tab is-open' : 'a11y-tab'}
          aria-expanded={open}
          aria-controls="a11y-panel"
          onClick={() => setOpen((value) => !value)}
        >
          <AccessIcon />
          <span>נגישות</span>
        </button>
      </div>
    </>
  )

  return createPortal(panel, document.body)
}

function Toggle({
  pressed,
  onClick,
  label,
}: {
  pressed: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button type="button" className="a11y-option" aria-pressed={pressed} onClick={onClick}>
      <span>{label}</span>
      <span className="a11y-switch" aria-hidden="true" />
    </button>
  )
}
