import { createFileRoute, useNavigate } from '@tanstack/react-router'

type SearchParams = {
  q: string | null
}

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      q: typeof search.q === 'string' && search.q != "" ? search.q : null,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const { q } = Route.useSearch()

  if (q === null) {
    navigate({ to: '/' })
    return null
  }

  return (
    <div>
      Hello "/search"! <br />
      Search query: <strong>{q}</strong>
    </div>
  )
}
