/**
 * Məlumat qatı — UI yalnız bu modulu istifadə edir.
 * DATABASE_URI varsa Payload Local API, yoxdursa mock fixtures (eyni imzalar).
 */
import 'server-only'
import type * as Mock from './mock'

type DataSource = typeof Mock

let sourcePromise: Promise<DataSource> | null = null
function source(): Promise<DataSource> {
  return (sourcePromise ??= process.env.DATABASE_URI ? import('./payload') : import('./mock'))
}

export const isCms = () => Boolean(process.env.DATABASE_URI)

export const getCategories: DataSource['getCategories'] = async (...a) => (await source()).getCategories(...a)
export const getCategoryBySlug: DataSource['getCategoryBySlug'] = async (...a) => (await source()).getCategoryBySlug(...a)
export const getCategoryAlternates: DataSource['getCategoryAlternates'] = async (...a) => (await source()).getCategoryAlternates(...a)
export const getArticles: DataSource['getArticles'] = async (...a) => (await source()).getArticles(...a)
export const getArticleBySlug: DataSource['getArticleBySlug'] = async (...a) => (await source()).getArticleBySlug(...a)
export const getBreaking: DataSource['getBreaking'] = async (...a) => (await source()).getBreaking(...a)
export const getMostRead: DataSource['getMostRead'] = async (...a) => (await source()).getMostRead(...a)
export const getEditorsPicks: DataSource['getEditorsPicks'] = async (...a) => (await source()).getEditorsPicks(...a)
export const getRelated: DataSource['getRelated'] = async (...a) => (await source()).getRelated(...a)
export const getAuthors: DataSource['getAuthors'] = async (...a) => (await source()).getAuthors(...a)
export const getAuthorBySlug: DataSource['getAuthorBySlug'] = async (...a) => (await source()).getAuthorBySlug(...a)
export const getTagBySlug: DataSource['getTagBySlug'] = async (...a) => (await source()).getTagBySlug(...a)
export const getTagAlternates: DataSource['getTagAlternates'] = async (...a) => (await source()).getTagAlternates(...a)
export const getPopularTags: DataSource['getPopularTags'] = async (...a) => (await source()).getPopularTags(...a)
export const getAd: DataSource['getAd'] = async (...a) => (await source()).getAd(...a)
export const getWeather: DataSource['getWeather'] = async (...a) => (await source()).getWeather(...a)
export const getSiteSettings: DataSource['getSiteSettings'] = async (...a) => (await source()).getSiteSettings(...a)
export const getAllArticleParams: DataSource['getAllArticleParams'] = async (...a) => (await source()).getAllArticleParams(...a)
export type { ArticleQuery } from './mock'
