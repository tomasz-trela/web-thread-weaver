import { createFileRoute, useNavigate } from '@tanstack/react-router'
import SearchBar from '../components/searchBar'
import type { SearchResultRowData } from '../components/searchResultRow'
import {SearchResultRow} from '../components/searchResultRow'
import { useQuery } from '@tanstack/react-query'
import { fullTextSearch } from '../api/api'
import { secondsToTimeString } from '../utils/time'

type SearchParams = {
  q: string | null
  isUtteranceOpened?: boolean
  openedUtteranceId?: number
}

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      q: typeof search.q === 'string' && search.q != "" ? search.q : null,
      isUtteranceOpened: typeof search.isUtteranceOpened === 'boolean' ? search.isUtteranceOpened : undefined,
      openedUtteranceId: typeof search.openedUtteranceId === 'number' ? search.openedUtteranceId : undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const { q, openedUtteranceId } = Route.useSearch()
  const isUtteranceOpened = Route.useSearch().isUtteranceOpened ?? false

  const {isPending, error, data} = useQuery({
    queryKey: ['search', q],
    queryFn: async () => {
      if (q === null) {
        return []
      }
      const response = await fullTextSearch(q)
      return response
    },
  })

  console.log("Search results:", data)


  if (q === null) {
    navigate({ to: '/' })
    return null
  }

  function onClickSearchResult(utteranceId: number) {
    console.log("Navigate")
    navigate({ 
      to: '/search',
      search: {
        q: q,
        isUtteranceOpened: true,
        openedUtteranceId: utteranceId
      }
    })
  }

  let results: SearchResultRowData[] = []
  if (data) {
    results = data.map(result => ({
      utteranceId: result.id,
      title: result.conversation.title,
      description: result.conversation.description || '',
      utteranceText: result.text,
      startTime: result.start_time,
      endTime: result.end_time,
      youtubeId: result.conversation.youtube_id || '',
      speaker: result.speaker ? `${result.speaker.name} ${result.speaker.surname}` : undefined,
    }))
  }

  const opendedSearchResult = results.find(result => result.utteranceId === openedUtteranceId)

  return (
    <div className='flex justify-center gap-4 h-screen p-4'>
      <div className={"flex gap-10 transition-all duration-200 ease-in-out shrink-0 grow-0" + (isUtteranceOpened ? " w-3/10" : " w-2/3")}>
        <div className={(openedUtteranceId !== undefined ? ' flex flex-col' : '')}>
          <SearchBar 
            onSearch={(search) => navigate({ to: '/search', search: { q: search } })} 
            defaultValue={q}
          />
          { isPending && <div className='text-center mt-4'>Loading...</div>}
          <div className={openedUtteranceId !== undefined ? "overflow-y-auto custom-scrollbar pr-2" : ""}>
            {results.map(result => <SearchResultRow 
              searchResult={result} 
              key={result.utteranceId}
              isActive={result.utteranceId === openedUtteranceId}
              onClick={onClickSearchResult}  
            />)}
          </div>
        </div>

        <div className={'h-full w-[1px] bg-[#ccc] relative' + (openedUtteranceId !== undefined ? ' opacity-100' : ' opacity-0')}>
          <div className='w-[40px] h-[40px] absolute top-1/2 bg-nord-dark-0 flex justify-center items-center -translate-y-1/2 left-[-20px] rounded-full hover:cursor-pointer hover:scale-150 transition-all duration-200 ease-in-out' onClick={() => navigate({ to: '/search', search: { q, isUtteranceOpened: !isUtteranceOpened, openedUtteranceId } })}>
            <div className={'w-[10px] h-[10px] border-r-[2px] border-t-[2px] border-nord-aurora-0 transition-all duration-200 ease-in-out' + (isUtteranceOpened ? ' rotate-45' : ' rotate-[225deg]')}></div>
          </div>
        </div>
      </div>

      <div className={"transition-all duration-200 ease-in-out shrink-0 grow-0" + (openedUtteranceId !== undefined ? (" opacity-100" + (isUtteranceOpened ? " w-7/10" : " w-1/3")) : " w-0 overflow-hidden opacity-0")}>
        <div className=' flex justify-center'>
          <iframe className={'transition-all duration-200 ease-in-out' + (isUtteranceOpened ? ' w-3/4 h-[66vh]' : ' w-full h-[50vh] m-0')} src={`https://www.youtube.com/embed/${opendedSearchResult?.youtubeId}?si=Ci2WGZriE2BVXy6E&amp;start=${Math.round(opendedSearchResult?.startTime)}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        <div>
          <h2 className='text-2xl font-bold mt-4'>{opendedSearchResult?.title}</h2>
          <p className='font-bold'>Speaker: {opendedSearchResult?.speaker || 'Unknown Speaker'}</p>
          <p className='italic'>{opendedSearchResult?.utteranceText}</p>
          <p className='text-lg mt-2'>{opendedSearchResult?.description}</p>
          <p className='text-sm mt-2 text-gray-500'>Time: {opendedSearchResult !== undefined && secondsToTimeString(opendedSearchResult?.startTime)} - {opendedSearchResult !== undefined && secondsToTimeString(opendedSearchResult?.endTime)}</p>
        </div>
      </div>
    </div>
  )
}
