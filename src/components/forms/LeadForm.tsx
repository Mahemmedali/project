'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { IconCheck } from '@/components/brand/Icons'

const services = ['display', 'native', 'sponsored', 'newsletter', 'corporate', 'event'] as const
const budgets = ['b1', 'b2', 'b3', 'b4'] as const

/**
 * B2B sorğu forması. Mərhələ 1: yerli simulyasiya.
 * Mərhələ 5: POST /api/leads → b2b_leads + Resend bildirişi satış komandasına; Turnstile anti-spam.
 */
export function LeadForm({ defaultService }: { defaultService?: (typeof services)[number] }) {
  const t = useTranslations('b2b.form')
  const tf = useTranslations('b2b.formats')
  const tc = useTranslations('common')
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const req = ['company', 'contact', 'email', 'service']
    const errs: Record<string, string> = {}
    for (const k of req) if (!String(fd.get(k) ?? '').trim()) errs[k] = t('required')
    setErrors(errs)
    if (Object.keys(errs).length) return
    setState('loading')
    await new Promise((r) => setTimeout(r, 700)) // mock
    setState('success')
  }

  if (state === 'success') {
    return (
      <div className="flex items-start gap-4 rounded-card bg-brand-tint p-6" role="status">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white">
          <IconCheck size={22} />
        </span>
        <div>
          <p className="text-h3">{t('title')}</p>
          <p className="mt-1 text-body text-brand-muted">{t('success')}</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t('company')} htmlFor="company" error={errors.company}>
          <Input id="company" name="company" autoComplete="organization" aria-invalid={!!errors.company} />
        </Field>
        <Field label={t('contact')} htmlFor="contact" error={errors.contact}>
          <Input id="contact" name="contact" autoComplete="name" aria-invalid={!!errors.contact} />
        </Field>
        <Field label={t('email')} htmlFor="email" error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} />
        </Field>
        <Field label={t('phone')} htmlFor="phone" optional={tc('optional')}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+994" />
        </Field>
        <Field label={t('service')} htmlFor="service" error={errors.service}>
          <Select id="service" name="service" defaultValue={defaultService ?? ''} aria-invalid={!!errors.service}>
            <option value="" disabled>
              {t('servicePlaceholder')}
            </option>
            {services.map((s) => (
              <option key={s} value={s}>
                {tf(`${s}.name`)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={t('budget')} htmlFor="budget" optional={tc('optional')}>
          <Select id="budget" name="budget" defaultValue="">
            <option value="">{t('budgetPlaceholder')}</option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {t(`budgets.${b}`)}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label={t('message')} htmlFor="message" optional={tc('optional')}>
        <Textarea id="message" name="message" placeholder={t('messagePlaceholder')} />
      </Field>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-caption text-brand-faint">{t('privacy')}</p>
        <Button type="submit" size="lg" disabled={state === 'loading'}>
          {state === 'loading' ? '…' : t('submit')}
        </Button>
      </div>
    </form>
  )
}
