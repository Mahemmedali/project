import type { Block } from 'payload'

/** Səhifə blokları — "Haqqımızda", "Media kit" və s. üçün */
export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero' },
  fields: [
    { name: 'eyebrow', label: 'Üst etiket', type: 'text' },
    { name: 'title', label: 'Başlıq', type: 'text', required: true },
    { name: 'lead', label: 'Giriş', type: 'textarea' },
    { name: 'tone', label: 'Fon', type: 'select', defaultValue: 'light', options: [
      { label: 'Ağ', value: 'light' }, { label: 'Səhər mavisi', value: 'blue' }, { label: 'Dərin göy', value: 'navy' },
    ] },
    { name: 'cta', label: 'Düymə', type: 'group', fields: [
      { name: 'label', label: 'Mətn', type: 'text' }, { name: 'url', label: 'URL', type: 'text' },
    ] },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Mətn', plural: 'Mətn' },
  fields: [{ name: 'content', label: 'Məzmun', type: 'richText', required: true }],
}

export const CardGridBlock: Block = {
  slug: 'cardGrid',
  labels: { singular: 'Kart şəbəkəsi', plural: 'Kart şəbəkələri' },
  fields: [
    { name: 'title', label: 'Başlıq', type: 'text' },
    { name: 'cards', label: 'Kartlar', type: 'array', minRows: 1, fields: [
      { name: 'title', label: 'Başlıq', type: 'text', required: true },
      { name: 'text', label: 'Mətn', type: 'textarea' },
      { name: 'icon', label: 'İkon', type: 'select', options: ['check', 'bolt', 'users', 'sparkle', 'mail', 'newspaper', 'trending', 'briefcase', 'calendar', 'layout'].map((v) => ({ label: v, value: v })) },
    ] },
  ],
}

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'Çağırış (CTA)', plural: 'CTA' },
  fields: [
    { name: 'title', label: 'Başlıq', type: 'text', required: true },
    { name: 'text', label: 'Mətn', type: 'textarea' },
    { name: 'label', label: 'Düymə mətni', type: 'text', required: true },
    { name: 'url', label: 'URL', type: 'text', required: true },
  ],
}

export const MediaKitTableBlock: Block = {
  slug: 'mediaKitTable',
  labels: { singular: 'Media kit cədvəli', plural: 'Media kit cədvəlləri' },
  fields: [
    { name: 'title', label: 'Başlıq', type: 'text' },
    { name: 'rows', label: 'Sətirlər', type: 'array', fields: [
      { name: 'format', label: 'Format', type: 'text', required: true },
      { name: 'size', label: 'Ölçü', type: 'text' },
      { name: 'placement', label: 'Yerləşmə', type: 'text' },
      { name: 'weight', label: 'Maks. çəki', type: 'text' },
      { name: 'price', label: 'Qiymət', type: 'text' },
    ] },
    { name: 'note', label: 'Qeyd', type: 'textarea' },
  ],
}

export const pageBlocks = [HeroBlock, RichTextBlock, CardGridBlock, CTABlock, MediaKitTableBlock]
