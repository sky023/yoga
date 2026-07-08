import {stegaClean} from 'next-sanity'
import type {StatMetricData} from '@/types/sanity'

const SIZE_CLASSES: Record<string, {value: string; label: string}> = {
  small: {
    value: 'text-3xl md:text-4xl',
    label: 'text-sm',
  },
  medium: {
    value: 'text-4xl md:text-5xl',
    label: 'text-base',
  },
  large: {
    value: 'text-5xl md:text-7xl',
    label: 'text-lg',
  },
}

export function StatMetricContent({data}: {data: StatMetricData}) {
  if (!data.value) return null

  const size = data.size || 'medium'
  const sizeClasses = SIZE_CLASSES[stegaClean(size)] || SIZE_CLASSES.medium

  return (
    <div className="text-center">
      <div className={`font-bold tracking-tight text-foreground ${sizeClasses.value}`}>
        {data.prefix && <span className="text-muted">{data.prefix}</span>}
        {data.value}
        {data.suffix && <span className="text-muted">{data.suffix}</span>}
      </div>
      {data.label && (
        <p className={`mt-2 font-medium text-muted ${sizeClasses.label}`}>
          {data.label}
        </p>
      )}
    </div>
  )
}
