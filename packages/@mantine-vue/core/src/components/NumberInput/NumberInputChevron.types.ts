import type { SVGAttributes } from 'vue'
export interface NumberInputChevronOwnProps {
  /** Chevron direction. */ direction: 'up' | 'down'
}
export interface NumberInputChevronProps
  extends Omit<SVGAttributes, 'direction'>, NumberInputChevronOwnProps {}
