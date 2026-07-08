'use client'

import {useState, useEffect} from 'react'
import type {CountdownTimerData} from '@/types/sanity'

interface TimeRemaining {
  readonly days: number
  readonly hours: number
  readonly minutes: number
  readonly seconds: number
  readonly isExpired: boolean
}

function computeTimeRemaining(targetDate: string): TimeRemaining {
  const difference = new Date(targetDate).getTime() - Date.now()

  if (difference <= 0) {
    return {days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true}
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  }
}

function TimeUnit({value, label}: {value: number; label: string}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-2xl font-bold tabular-nums text-primary sm:h-20 sm:w-20 sm:text-3xl">
        {String(value).padStart(2, '0')}
      </div>
      <span className="mt-2 text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </span>
    </div>
  )
}

export function CountdownTimerContent({data}: {data: CountdownTimerData}) {
  const expiredMessage = data.expiredMessage || 'This event has ended.'

  const [time, setTime] = useState<TimeRemaining>(() =>
    data.targetDate ? computeTimeRemaining(data.targetDate) : {days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true},
  )

  useEffect(() => {
    if (!data.targetDate) return

    setTime(computeTimeRemaining(data.targetDate))

    const interval = setInterval(() => {
      const next = computeTimeRemaining(data.targetDate)
      setTime(next)
      if (next.isExpired) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [data.targetDate])

  if (!data.targetDate) return null

  return (
    <div className="text-center">
      {data.title && (
        <h3 className="mb-6 text-xl font-semibold text-foreground">
          {data.title}
        </h3>
      )}
      {time.isExpired ? (
        <p className="text-lg text-muted">{expiredMessage}</p>
      ) : (
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <TimeUnit value={time.days} label="Days" />
          <span className="text-2xl font-bold text-muted">:</span>
          <TimeUnit value={time.hours} label="Hours" />
          <span className="text-2xl font-bold text-muted">:</span>
          <TimeUnit value={time.minutes} label="Minutes" />
          <span className="text-2xl font-bold text-muted">:</span>
          <TimeUnit value={time.seconds} label="Seconds" />
        </div>
      )}
    </div>
  )
}
