import { useEffect, useState, useMemo } from 'react'

const validStatus = ['loading', 'idle', 'ready', 'error'] as const
type Status = typeof validStatus[number]
const isValidStatus = (value: string): value is Status => validStatus.includes(value)

export function useScriptIsReady(src: string) {
  return useMemo(() => {
    const script: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`)
    if (!script) {
      return false
    }

    const dataStatus = script.getAttribute('data-status') as Status

    return dataStatus === 'ready'
  }, [src])
}

export function useScript(src: string) {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState<Status>(src ? 'loading' : 'idle')

  useEffect(
    () => {
      // Allow falsy src value if waiting on other data needed for
      // constructing the script URL passed to this hook.
      if (!src) {
        setStatus('idle')
        return
      }

      // Fetch existing script element by src
      // It may have been added by another intance of this hook
      let script: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`)

      if (script === null) {
        // Create script
        script = document.createElement('script')
        script.src = src
        script.async = true
        script.setAttribute('data-status', 'loading')
        // Add script to document body
        document.body.appendChild(script)

        // Store status in attribute on script
        // This can be read by other instances of this hook
        const setAttributeFromEvent = (event: Event) => {
          if (script) {
            script.setAttribute(
              'data-status',
              event.type === 'load' ? 'ready' : 'error',
            )
          }
        }

        script.addEventListener('load', setAttributeFromEvent)
        script.addEventListener('error', setAttributeFromEvent)
      } else {
        // Grab existing script status from attribute and set to state.
        const dataStatus = script.getAttribute('data-status')

        if (dataStatus && isValidStatus(dataStatus)) {
          setStatus(dataStatus)
        }
      }

      // Script event handler to update status in state
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent = (event: Event) => {
        setStatus(event.type === 'load' ? 'ready' : 'error')
      }

      // Add event listeners
      script.addEventListener('load', setStateFromEvent)
      script.addEventListener('error', setStateFromEvent)

      // Remove event listeners on cleanup
      // eslint-disable-next-line consistent-return
      return () => {
        if (script) {
          script.removeEventListener('load', setStateFromEvent)
          script.removeEventListener('error', setStateFromEvent)
        }
      }
    },
    [src], // Only re-run effect if script src changes
  )

  return status
}
