import type {DataTableData} from '@/types/sanity'

type TableHeader = NonNullable<DataTableData['headers']>[number]
type TableRow = NonNullable<DataTableData['rows']>[number]

export function DataTableContent({data}: {data: DataTableData}) {
  if (!data.headers || data.headers.length === 0) return null

  const cellPadding = data.compact ? 'px-3 py-1.5' : 'px-4 py-3'

  return (
    <figure className="my-4">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          {data.caption && (
            <caption className="bg-card px-4 py-3 text-left text-sm font-medium text-foreground">
              {data.caption}
            </caption>
          )}

          <thead>
            <tr className="border-b border-border bg-foreground/5">
              {data.headers.map((header: TableHeader) => (
                <th
                  key={header._key}
                  scope="col"
                  className={`${cellPadding} text-xs font-semibold uppercase tracking-wider text-muted`}
                >
                  {header.text}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {data.rows?.map((row: TableRow, rowIndex: number) => (
              <tr
                key={row._key}
                className={
                  data.striped && rowIndex % 2 === 1
                    ? 'bg-foreground/[0.02]'
                    : 'bg-card'
                }
              >
                {(data.headers ?? []).map((_: unknown, cellIndex: number) => {
                  const cell = row.cells?.[cellIndex]
                  return (
                    <td
                      key={cellIndex}
                      className={`${cellPadding} text-card-foreground`}
                    >
                      {cell?.text ?? ''}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
