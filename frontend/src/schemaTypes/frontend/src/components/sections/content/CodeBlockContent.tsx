import type {CodeBlockData} from '@/types/sanity'

function TrafficLights() {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      <span className="h-3 w-3 rounded-full bg-red-500/80" />
      <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
      <span className="h-3 w-3 rounded-full bg-green-500/80" />
    </div>
  )
}

export function CodeBlockContent({data}: {data: CodeBlockData}) {
  if (!data.code) return null

  const lines = data.code.split('\n')
  const lineNumberWidth = String(lines.length).length

  return (
    <figure className="my-4">
      <div className="overflow-hidden rounded-xl border border-border">
        {/* Title bar */}
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2.5">
          <div className="flex items-center gap-4">
            <TrafficLights />
            {data.filename && (
              <span className="text-xs font-medium text-gray-400">
                {data.filename}
              </span>
            )}
          </div>
          {data.language && (
            <span className="rounded bg-gray-700 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-400">
              {data.language}
            </span>
          )}
        </div>

        {/* Code area */}
        <div className="overflow-x-auto bg-gray-900 p-4">
          <pre className="text-sm leading-relaxed">
            <code className="font-mono text-gray-100">
              {lines.map((line, index) => (
                <span key={index} className="block">
                  {data.showLineNumbers && (
                    <span
                      className="mr-6 inline-block text-right text-gray-500 select-none"
                      style={{minWidth: `${lineNumberWidth}ch`}}
                    >
                      {index + 1}
                    </span>
                  )}
                  {line || '\n'}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>

      {data.caption && (
        <figcaption className="mt-2 text-center text-sm text-muted">
          {data.caption}
        </figcaption>
      )}
    </figure>
  )
}
