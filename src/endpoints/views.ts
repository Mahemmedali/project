import type { Endpoint, PayloadRequest } from 'payload'
import { clientIp, rateLimit } from '@/lib/rate-limit'

/** POST /api/articles/:id/view — "Ən çox oxunan" üçün baxış sayğacı (sendBeacon). Kolleksiya endpoint-i (Articles.ts) */
export const articleView: Endpoint = {
  path: '/:id/view',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const id = Number(req.routeParams?.id)
    if (!Number.isFinite(id)) return Response.json({ error: 'bad_id' }, { status: 400 })
    // eyni IP eyni məqaləni 10 dəqiqədə bir dəfə sayır
    if (!rateLimit(`view:${clientIp(req.headers)}:${id}`, 1, 10 * 60_000)) return Response.json({ ok: true, counted: false })
    try {
      await req.payload.db.updateOne({
        collection: 'articles',
        id,
        data: { views: { $inc: 1 } as unknown as number },
        req,
      })
    } catch {
      // $inc dəstəklənməyəndə (adapterə görə) sadə oxu-yaz
      const doc = await req.payload.findByID({ collection: 'articles', id, depth: 0, overrideAccess: true })
      await req.payload.update({ collection: 'articles', id, data: { views: (doc.views ?? 0) + 1 }, overrideAccess: true, context: { disableRevalidate: true } })
    }
    return Response.json({ ok: true, counted: true })
  },
}
