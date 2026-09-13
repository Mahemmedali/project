import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const fieldBase =
  'w-full rounded-btn border border-brand-line bg-white px-4 text-body text-brand-ink placeholder:text-brand-faint transition-colors focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 aria-[invalid=true]:border-brand-alert'

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, 'h-12', className)} {...rest} />
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, 'min-h-32 py-3', className)} {...rest} />
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(fieldBase, 'h-12 appearance-none pr-10', className)} {...rest}>
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-brand-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  optional,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  optional?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="flex items-baseline justify-between text-[14px] font-medium text-brand-navy">
        <span>{label}</span>
        {optional && <span className="text-caption font-normal text-brand-faint">{optional}</span>}
      </label>
      {children}
      {error ? (
        <p className="text-caption text-brand-alert" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-caption text-brand-faint">{hint}</p>
      ) : null}
    </div>
  )
}
