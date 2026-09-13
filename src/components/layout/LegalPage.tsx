import { PageHero } from '@/components/layout/PageHero'

/** Hüquqi mətn skeleti — məzmun Mərhələ 2-də CMS `pages` kolleksiyasından gələcək */
export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { h: string; p: string[] }[] }) {
  return (
    <>
      <PageHero title={title} lead={updated} />
      <section className="container-site mt-4">
        <div className="prose-gmb max-w-3xl">
          {sections.map((s) => (
            <div key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((x, i) => (
                <p key={i}>{x}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
