import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(req: Request) {
  const dm = await draftMode()
  dm.disable()
  const to = new URL(req.url).searchParams.get('to') ?? '/'
  redirect(to.startsWith('/') ? to : '/')
}
