import {stegaClean} from 'next-sanity'
import {BlockStylesWrapper} from '../shared/BlockStylesWrapper'
import {RichTextContent} from './content/RichTextContent'
import {ImageContent} from './content/ImageContent'
import {CallToActionContent} from './content/CallToActionContent'
import {VideoContent} from './content/VideoContent'
import {TabbedContent} from './content/TabbedContent'
import {AccordionContent} from './content/AccordionContent'
import {SpacerDividerContent} from './content/SpacerDividerContent'
import {CountdownTimerContent} from './content/CountdownTimerContent'
import {IconTextContent} from './content/IconTextContent'
import {ButtonGroupContent} from './content/ButtonGroupContent'
import {StatMetricContent} from './content/StatMetricContent'
import {TestimonialQuoteContent} from './content/TestimonialQuoteContent'
import {AlertNoticeContent} from './content/AlertNoticeContent'
import {PricingCardContent} from './content/PricingCardContent'
import {SocialEmbedContent} from './content/SocialEmbedContent'
import {LogoRowContent} from './content/LogoRowContent'
import {MapEmbedContent} from './content/MapEmbedContent'
import {CodeBlockContent} from './content/CodeBlockContent'
import {DataTableContent} from './content/DataTableContent'
import {LottieAnimationContent} from './content/LottieAnimationContent'
import {FormBlockContent} from './content/FormBlockContent'
import {FaqBlockContent} from './content/FaqBlockContent'
import {FeatureCardGridContent} from './content/FeatureCardGridContent'
import {TestimonialCarouselContent} from './content/TestimonialCarouselContent'
import {ImageGalleryContent} from './content/ImageGalleryContent'
import {TocBlockContent} from './content/TocBlockContent'
import type {ContentBlock} from '@/types/sanity'

/* eslint-disable @typescript-eslint/no-explicit-any -- component map requires flexible typing */
const CONTENT_MAP: Record<string, React.ComponentType<{data: any}>> = {
  richTextBlock: RichTextContent,
  imageBlock: ImageContent,
  callToAction: CallToActionContent,
  externalVideo: VideoContent,
  youtubeVideo: VideoContent,
  tabbedContent: TabbedContent,
  accordion: AccordionContent,
  spacerDivider: SpacerDividerContent,
  countdownTimer: CountdownTimerContent,
  iconText: IconTextContent,
  buttonGroup: ButtonGroupContent,
  statMetric: StatMetricContent,
  testimonialQuote: TestimonialQuoteContent,
  alertNotice: AlertNoticeContent,
  pricingCard: PricingCardContent,
  socialEmbed: SocialEmbedContent,
  logoRow: LogoRowContent,
  mapEmbed: MapEmbedContent,
  codeBlock: CodeBlockContent,
  dataTable: DataTableContent,
  lottieAnimation: LottieAnimationContent,
  formBlock: FormBlockContent,
  faqBlock: FaqBlockContent,
  featureCardGrid: FeatureCardGridContent,
  testimonialCarousel: TestimonialCarouselContent,
  imageGallery: ImageGalleryContent,
  tocBlock: TocBlockContent,
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function ContentRenderer({block}: {block: ContentBlock}) {
  const Component = CONTENT_MAP[stegaClean(block._type)]

  if (!Component) {
    return (
      <div className="my-2 rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted">
        Unsupported: <code>{block._type}</code>
      </div>
    )
  }

  return (
    <BlockStylesWrapper blockStyles={block.blockStyles}>
      <Component data={block} />
    </BlockStylesWrapper>
  )
}
