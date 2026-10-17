import { Moon, Sun } from 'lucide-react'
import { cn } from '../lib/cn'
import { useTheme } from '../lib/theme'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const options = [
    { value: 'light', label: 'Tema claro', Icon: Sun },
    { value: 'dark', label: 'Tema escuro', Icon: Moon },
  ] as const

  return (
    <div role="group" aria-label="Tema" className={cn('flex items-center rounded-full bg-surface-2 p-1', className)}>
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
          className={cn(
            'grid size-9 place-items-center rounded-full transition',
            theme === value ? 'bg-bg text-fg shadow-sm' : 'text-muted hover:text-fg',
          )}
        >
          <Icon size={18} strokeWidth={1.75} />
        </button>
      ))}
    </div>
  )
}
