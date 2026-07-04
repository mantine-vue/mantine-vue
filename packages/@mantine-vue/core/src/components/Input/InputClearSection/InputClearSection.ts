import { h } from 'vue'

export type ClearSectionMode = 'both' | 'rightSection' | 'clear'

export interface InputClearSectionProps {
  __clearable?: boolean
  __clearSection?: any
  rightSection?: any
  __defaultRightSection?: any
  size?: string | number
  __clearSectionMode?: ClearSectionMode
}

const clearSectionOffset: Record<string, number> = {
  xs: 7,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 15,
}

function renderContent(content: any) {
  return typeof content === 'function' ? content() : content
}

export function InputClearSection({
  __clearable,
  __clearSection,
  rightSection,
  __defaultRightSection,
  size = 'sm',
  __clearSectionMode = 'both',
}: InputClearSectionProps) {
  const clearSection = __clearable && __clearSection

  if (__clearSectionMode === 'rightSection') {
    return rightSection === null ? null : renderContent(rightSection || __defaultRightSection)
  }

  if (__clearSectionMode === 'clear') {
    return rightSection === null ? null : renderContent(clearSection || __defaultRightSection)
  }

  if (clearSection && (rightSection || __defaultRightSection)) {
    return h(
      'div',
      {
        'data-combined-clear-section': true,
        style: {
          display: 'flex',
          gap: '2px',
          alignItems: 'center',
          paddingInlineEnd: `${clearSectionOffset[String(size)] ?? clearSectionOffset.sm}px`,
        },
      },
      [renderContent(clearSection), renderContent(rightSection || __defaultRightSection)],
    )
  }

  return rightSection === null
    ? null
    : renderContent(rightSection || clearSection || __defaultRightSection)
}
