import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

type Props = ComponentProps<'a'> & {
  variant?: 'primary' | 'outline' | 'light'
  size?: 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: Props) {
  return (
    <a
      {...props}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-ui font-medium whitespace-nowrap transition active:scale-[0.98]',
        size === 'md' ? 'h-[50px] px-6 text-[15px]' : 'h-[52px] px-7 text-[15px]',
        variant === 'primary' && 'bg-btn-bg text-btn-fg hover:opacity-85',
        variant === 'outline' && 'border border-fg text-fg hover:bg-fg hover:text-bg',
        variant === 'light' && 'bg-inv-fg text-inv-bg hover:opacity-85',
        className,
      )}
    />
  )
}
