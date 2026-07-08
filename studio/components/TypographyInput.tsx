import {useCallback} from 'react'
import {type ObjectInputProps, set, unset} from 'sanity'
import {Card, Flex, Text, Stack} from '@sanity/ui'
import {ColorInput, CompactSelect} from './BorderStyleInput'

const FONT_SIZES = [
  {title: '12px', value: '12'},
  {title: '14px', value: '14'},
  {title: '16px', value: '16'},
  {title: '18px', value: '18'},
  {title: '20px', value: '20'},
  {title: '24px', value: '24'},
  {title: '30px', value: '30'},
  {title: '36px', value: '36'},
  {title: '48px', value: '48'},
  {title: '60px', value: '60'},
  {title: '72px', value: '72'},
]

const ALIGN_OPTIONS = [
  {value: 'left', label: '≡ Left'},
  {value: 'center', label: '≡ Center'},
  {value: 'right', label: '≡ Right'},
] as const

export function TypographyInput(props: ObjectInputProps) {
  const {onChange, value} = props
  const vals = (value ?? {}) as Record<string, string | undefined>

  const handleChange = useCallback(
    (field: string, newValue: string) => {
      onChange(newValue === '' ? unset([field]) : set(newValue, [field]))
    },
    [onChange],
  )

  const hasValues = !!(vals.textAlign || vals.fontSize || vals.textColor)

  const handleClear = useCallback(() => {
    onChange([unset(['textAlign']), unset(['fontSize']), unset(['textColor'])])
  }, [onChange])

  return (
    <Card padding={3} radius={2} border tone="transparent">
      <Stack space={3}>
        <Flex align="center" justify="space-between">
          <Text
            size={0}
            weight="bold"
            muted
            style={{textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 10}}
          >
            Typography
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

        {/* Align buttons + font size */}
        <Flex gap={2} align="center">
          <Flex gap={0}>
            {ALIGN_OPTIONS.map((opt, i) => {
              const isSelected = vals.textAlign === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    handleChange('textAlign', isSelected ? '' : opt.value)
                  }
                  title={opt.label}
                  style={{
                    padding: '5px 10px',
                    fontSize: 11,
                    fontFamily: 'inherit',
                    border: '1px solid var(--card-border-color)',
                    borderLeft: i > 0 ? 'none' : undefined,
                    borderRadius:
                      i === 0
                        ? '4px 0 0 4px'
                        : i === ALIGN_OPTIONS.length - 1
                          ? '0 4px 4px 0'
                          : '0',
                    backgroundColor: isSelected
                      ? 'var(--card-badge-primary-bg-color)'
                      : 'var(--card-bg-color)',
                    color: isSelected
                      ? 'var(--card-badge-primary-fg-color)'
                      : 'var(--card-fg-color)',
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </Flex>

          <CompactSelect
            value={vals.fontSize}
            placeholder="Size"
            width={80}
            options={FONT_SIZES}
            onChange={(v) => handleChange('fontSize', v)}
          />

          <ColorInput
            value={vals.textColor}
            placeholder="#333"
            onChange={(v) => handleChange('textColor', v)}
          />
        </Flex>
      </Stack>
    </Card>
  )
}
