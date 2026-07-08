import {useCallback} from 'react'
import {type StringInputProps, set, unset} from 'sanity'
import {ColorInput} from './BorderStyleInput'

export function ColorStringInput(props: StringInputProps) {
  const {value, onChange, schemaType} = props

  const handleChange = useCallback(
    (v: string) => {
      onChange(v === '' ? unset() : set(v))
    },
    [onChange],
  )

  return (
    <ColorInput
      value={value}
      placeholder={schemaType.placeholder || '#000000'}
      onChange={handleChange}
    />
  )
}
