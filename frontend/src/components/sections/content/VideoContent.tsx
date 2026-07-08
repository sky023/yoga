import {stegaClean} from 'next-sanity'
import type {ExternalVideoData, YoutubeVideoData} from '@/types/sanity'

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}

export function VideoContent({data}: {data: ExternalVideoData | YoutubeVideoData}) {
  if (stegaClean(data._type) === 'youtubeVideo') {
    return <YouTubePlayer data={data as YoutubeVideoData} />
  }

  return <ExternalPlayer data={data as ExternalVideoData} />
}

function YouTubePlayer({data}: {data: YoutubeVideoData}) {
  if (!data.url) return null

  const videoId = extractYouTubeId(data.url)
  if (!videoId) return null

  return (
    <figure>
      <div className="relative w-full overflow-hidden rounded-lg" style={{paddingBottom: '56.25%'}}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {data.caption && (
        <figcaption className="mt-3 text-center text-sm text-muted">
          {data.caption}
        </figcaption>
      )}
    </figure>
  )
}

function ExternalPlayer({data}: {data: ExternalVideoData}) {
  if (!data.url) return null

  return (
    <figure>
      <video
        className="w-full rounded-lg"
        controls
        autoPlay={data.autoplay ?? false}
        loop={data.loop ?? false}
        muted={data.muted ?? false}
        playsInline
      >
        <source src={data.url} />
        Your browser does not support the video tag.
      </video>
      {data.caption && (
        <figcaption className="mt-3 text-center text-sm text-muted">
          {data.caption}
        </figcaption>
      )}
    </figure>
  )
}
