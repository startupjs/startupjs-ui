import { useMedia } from 'startupjs'

export default function useLayout ({
  layout,
  label,
  description
}: {
  layout?: 'pure' | 'rows' | 'columns'
  label?: string
  description?: string
} = {}): 'pure' | 'rows' | 'columns' {
  const { tablet } = useMedia()

  const hasLabel = Boolean(label)
  const hasDescription = Boolean(description)
  layout = layout ?? (hasLabel || hasDescription ? 'rows' : 'pure')
  if (layout !== 'pure' && !tablet) layout = 'rows'
  return layout
}
