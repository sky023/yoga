'use client'

import {stegaClean} from 'next-sanity'
import {useState, useCallback} from 'react'
import type {FormBlockData} from '@/types/sanity'

type FormField = FormBlockData['fields'][number]
type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function FormBlockContent({data}: {data: FormBlockData}) {
  const fields = data.fields || []
  const submitLabel = data.submitLabel || 'Submit'
  const submitAction = data.submitAction || 'webhook'
  const successMessage = data.successMessage || 'Thank you! Your submission has been received.'
  const errorMessage = data.errorMessage || 'Something went wrong. Please try again.'

  const [state, setState] = useState<SubmitState>('idle')

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setState('submitting')

      const formData = new FormData(e.currentTarget)
      const payload: Record<string, string> = {}
      formData.forEach((value, key) => {
        payload[key] = value.toString()
      })

      const cleanAction = stegaClean(submitAction)
      const endpoint =
        cleanAction === 'webhook'
          ? '/api/form-submit'
          : (data.customEndpoint || '/api/form-submit')

      try {
        const body =
          cleanAction === 'webhook'
            ? JSON.stringify({webhookUrl: data.webhookUrl, data: payload})
            : JSON.stringify(payload)

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body,
        })

        if (!res.ok) throw new Error('Submit failed')
        setState('success')
      } catch {
        setState('error')
      }
    },
    [submitAction, data.webhookUrl, data.customEndpoint],
  )

  if (state === 'success') {
    return (
      <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6 text-center">
        <p className="font-medium text-secondary">{successMessage}</p>
      </div>
    )
  }

  return (
    <div>
      {data.formTitle && (
        <h3 className="text-xl font-semibold text-foreground">{data.formTitle}</h3>
      )}
      {data.formDescription && (
        <p className="mt-1 text-sm text-muted">{data.formDescription}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className={`${data.formTitle || data.formDescription ? 'mt-6' : ''} space-y-4`}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            const isHalf = stegaClean(field.width) === 'half'
            const wrapClass = isHalf ? '' : 'sm:col-span-2'

            return (
              <div key={field._key} className={wrapClass}>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {field.label}
                  {field.required && <span className="ml-0.5 text-red-500">*</span>}
                </label>
                <FieldInput field={field} />
              </div>
            )
          })}
        </div>

        {state === 'error' && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={state === 'submitting'}
          className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
          style={{backgroundColor: stegaClean(data.buttonColor) || 'var(--primary)'}}
        >
          {state === 'submitting' ? 'Sending...' : submitLabel}
        </button>
      </form>
    </div>
  )
}

function FieldInput({field}: {field: FormField}) {
  const baseClass =
    'w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  switch (stegaClean(field.type)) {
    case 'textarea':
      return (
        <textarea
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          rows={4}
          className={`${baseClass} resize-y`}
        />
      )
    case 'select':
      return (
        <select name={field.name} required={field.required} className={baseClass}>
          <option value="">{field.placeholder || 'Select...'}</option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    case 'checkbox':
      return (
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name={field.name}
            required={field.required}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          {field.placeholder || field.label}
        </label>
      )
    default:
      return (
        <input
          type={field.type || 'text'}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          className={baseClass}
        />
      )
  }
}
