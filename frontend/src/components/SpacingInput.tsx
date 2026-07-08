import {useCallback, useState} from 'react'
import {type ObjectInputProps, set, unset} from 'sanity'
import {Card, Flex, Text} from '@sanity/ui'
import {SPACING_OPTIONS} from '../schemaTypes/shared/constants'

const BREAKPOINTS = [
  {key: '', label: 'Mobile', icon: '📱', width: '375px'},
  {key: 'Md', label: 'Tablet', icon: '📱', width: '768px'},
  {key: 'Lg', label: 'Desktop', icon: '💻', width: '1024px'},
] as const

function SpacingSelect({
  value,
  onChange,
}: {
  value?: string
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: 60,
        padding: '3px 2px',
        fontSize: 11,
        fontFamily: 'inherit',
        border: '1px solid var(--card-border-color)',
        borderRadius: 4,
        backgroundColor: 'var(--card-bg-color)',
        color: value ? 'var(--card-fg-color)' : 'var(--card-muted-fg-color)',
        textAlign: 'center',
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none',
      }}
    >
      <option value="">—</option>
      {SPACING_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.title}
        </option>
      ))}
    </select>
  )
}

export function SpacingInput(props: ObjectInputProps) {
  const {onChange, value, schemaType} = props
  const vals = (value ?? {}) as Record<string, string | undefined>
  const title = schemaType.title ?? 'Spacing'
  const isPadding = schemaType.name === 'padding' || title.toLowerCase().includes('padding')

  const [activeBreakpoint, setActiveBreakpoint] = useState(0)
  const bp = BREAKPOINTS[activeBreakpoint]
  const suffix = bp.key // '', 'Md', 'Lg'

  const fieldTop = `top${suffix}`
  const fieldRight = `right${suffix}`
  const fieldBottom = `bottom${suffix}`
  const fieldLeft = `left${suffix}`

  const handleChange = useCallback(
    (side: string, newValue: string) => {
      if (newValue === '') {
        onChange(unset([side]))
      } else {
        onChange(set(newValue, [side]))
      }
    },
    [onChange],
  )

  // Check which breakpoints have values set
  const hasBaseValues = vals.top || vals.right || vals.bottom || vals.left
  const hasMdValues = vals.topMd || vals.rightMd || vals.bottomMd || vals.leftMd
  const hasLgValues = vals.topLg || vals.rightLg || vals.bottomLg || vals.leftLg
  const dots = [hasBaseValues, hasMdValues, hasLgValues]

  const ALL_FIELDS = [
    'top', 'right', 'bottom', 'left',
    'topMd', 'rightMd', 'bottomMd', 'leftMd',
    'topLg', 'rightLg', 'bottomLg', 'leftLg',
  ] as const

  const hasValues = ALL_FIELDS.some((f) => vals[f])

  const handleClear = useCallback(() => {
    onChange(ALL_FIELDS.map((f) => unset([f])))
  }, [onChange])

  const outerColor = isPadding
    ? 'rgba(124, 179, 66, 0.12)'
    : 'rgba(255, 167, 38, 0.12)'

  const labelColor = isPadding
    ? 'rgba(124, 179, 66, 0.7)'
    : 'rgba(255, 167, 38, 0.7)'

  return (
    <Card padding={2} radius={2} border tone="transparent">
      {/* Breakpoint toggle */}
      <Flex
        gap={0}
        style={{marginBottom: 6}}
      >
        {BREAKPOINTS.map((bpItem, i) => {
          const isActive = i === activeBreakpoint
          return (
            <button
              key={bpItem.key}
              type="button"
              onClick={() => setActiveBreakpoint(i)}
              style={{
                flex: 1,
                padding: '5px 4px',
                fontSize: 11,
                fontFamily: 'inherit',
                border: '1px solid var(--card-border-color)',
                borderLeft: i > 0 ? 'none' : undefined,
                borderRadius:
                  i === 0
                    ? '4px 0 0 4px'
                    : i === BREAKPOINTS.length - 1
                      ? '0 4px 4px 0'
                      : '0',
                backgroundColor: isActive
                  ? 'var(--card-badge-primary-bg-color)'
                  : 'var(--card-bg-color)',
                color: isActive
                  ? 'var(--card-badge-primary-fg-color)'
                  : 'var(--card-fg-color)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{bpItem.icon}</span>
              <span>{bpItem.label}</span>
              {/* Dot indicator for set values */}
              {dots[i] && !isActive && (
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: 'var(--card-badge-primary-bg-color)',
                    position: 'absolute',
                    top: 3,
                    right: 3,
                  }}
                />
              )}
            </button>
          )
        })}
      </Flex>

      {/* Breakpoint info */}
      <Flex justify="center" style={{marginBottom: 4}}>
        <Text size={0} muted style={{fontSize: 10}}>
          {bp.key === '' ? 'Base styles (all screens)' : `Overrides at ≥${bp.width}`}
        </Text>
      </Flex>

      {/* Box model */}
      <div
        style={{
          position: 'relative',
          backgroundColor: outerColor,
          borderRadius: 6,
          padding: 4,
        }}
      >
        {/* Title label */}
        <Flex align="center" justify="space-between" style={{position: 'absolute', top: 4, left: 8, right: 8}}>
          <Text
            size={0}
            style={{
              color: labelColor,
              fontWeight: 600,
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {title}
          </Text>
          {hasValues && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--card-muted-fg-color)',
                fontSize: 10,
                cursor: 'pointer',
                padding: '2px 4px',
              }}
            >
              Clear
            </button>
          )}
        </Flex>

        {/* Top */}
        <Flex justify="center" style={{paddingTop: 18, paddingBottom: 4}}>
          <SpacingSelect value={vals[fieldTop]} onChange={(v) => handleChange(fieldTop, v)} />
        </Flex>

        {/* Middle: left + content + right */}
        <Flex align="center" justify="center" gap={2}>
          <SpacingSelect value={vals[fieldLeft]} onChange={(v) => handleChange(fieldLeft, v)} />

          <div
            style={{
              flex: 1,
              maxWidth: 140,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isPadding ? 'var(--card-bg-color)' : outerColor,
              border: isPadding
                ? '1.5px dashed var(--card-border-color)'
                : '1.5px dashed rgba(255, 167, 38, 0.3)',
              borderRadius: 4,
            }}
          >
            <Text size={0} muted style={{fontSize: 10}}>
              {isPadding ? 'content' : 'padding'}
            </Text>
          </div>

          <SpacingSelect value={vals[fieldRight]} onChange={(v) => handleChange(fieldRight, v)} />
        </Flex>

        {/* Bottom */}
        <Flex justify="center" style={{paddingTop: 4, paddingBottom: 4}}>
          <SpacingSelect value={vals[fieldBottom]} onChange={(v) => handleChange(fieldBottom, v)} />
        </Flex>
      </div>
    </Card>
  )
}
