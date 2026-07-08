import {stegaClean} from 'next-sanity'
import {GridRowSection} from './sections/GridRowSection'
import {HeroSection} from './sections/HeroSection'
import type {PageBuilderBlock} from '@/types/sanity'

export function SectionRenderer({sections}: {sections?: PageBuilderBlock[] | null}) {
  if (!sections || sections.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted">
        <p>No sections yet. Open the Studio to start building.</p>
      </div>
    )
  }

  return (
    <>
      {sections.map((section) => {
        const type = stegaClean(section._type) as PageBuilderBlock['_type']
        switch (type) {
          case 'heroSection':
            return <HeroSection key={section._key} data={section as Extract<PageBuilderBlock, {_type: 'heroSection'}>} />
          case 'gridRow':
            return <GridRowSection key={section._key} data={section as Extract<PageBuilderBlock, {_type: 'gridRow'}>} />
          default:
            return (
              <div
                key={section._key}
                className="border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted"
              >
                Unknown section type: <code>{section._type}</code>
              </div>
            )
        }
      })}
    </>
  )
}
