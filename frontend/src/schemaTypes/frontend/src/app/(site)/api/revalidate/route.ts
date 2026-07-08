import {revalidatePath} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

const REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET

export async function POST(req: NextRequest) {
  try {
    if (!REVALIDATE_SECRET) {
      return NextResponse.json({message: 'Missing SANITY_REVALIDATE_SECRET'}, {status: 500})
    }

    const {isValidSignature, body} = await parseBody<{
      _type: string
      slug?: {current?: string}
    }>(req, REVALIDATE_SECRET)

    if (!isValidSignature) {
      return NextResponse.json({message: 'Invalid signature'}, {status: 401})
    }

    if (!body?._type) {
      return NextResponse.json({message: 'Bad request'}, {status: 400})
    }

    switch (body._type) {
      case 'homePage':
        revalidatePath('/')
        break
      case 'page':
        if (body.slug?.current) {
          revalidatePath(`/${body.slug.current}`)
        }
        revalidatePath('/') // nav/footer might reference pages
        break
      case 'blogPost':
        if (body.slug?.current) {
          revalidatePath(`/blog/${body.slug.current}`)
        }
        revalidatePath('/blog')
        break
      case 'siteSettings':
        // settings affect all pages (header, footer, nav)
        revalidatePath('/', 'layout')
        break
      default:
        // unknown type, revalidate everything
        revalidatePath('/', 'layout')
    }

    return NextResponse.json({revalidated: true, type: body._type})
  } catch (err) {
    return NextResponse.json(
      {message: err instanceof Error ? err.message : 'Unknown error'},
      {status: 500},
    )
  }
}
