import {createFileRoute, useNavigate} from '@tanstack/react-router'
import SearchBar from '../components/searchBar'
import type {SearchResultRowData} from '../components/searchResultRow'
import {SearchResultRow} from '../components/searchResultRow'
import {useQuery} from '@tanstack/react-query'
import {fullTextSearch} from '../api/searchApi.ts'
import {secondsToTimeString} from '../utils/time'

type SearchParams = {
  query: string | null
  searchType?: 'hybrid-search' | 'full-text-search' | 'semantic-search'
  startDate?: string
  endDate?: string
  speakerId?: string
  conversationId?: string
  isUtteranceOpened?: boolean
  openedUtteranceId?: number
}

function isSearchType(value: unknown): value is SearchParams['searchType'] {
  return typeof value === 'string' && ['hybrid-search', 'full-text-search', 'semantic-search'].includes(value)
}

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    console.log("Validating search params:", search)
    return {
      query: typeof search.query === 'string' && search.query != "" ? search.query : null,
      searchType: isSearchType(search.searchType) ? search.searchType : 'hybrid-search',
      startDate: typeof search.startDate === 'string' ? search.startDate : '',
      endDate: typeof search.endDate === 'string' ? search.endDate : '',
      speakerId: typeof search.speakerId === 'string' ? search.speakerId : '',
      conversationId: typeof search.conversationId === 'string' ? search.conversationId : '',
      isUtteranceOpened: typeof search.isUtteranceOpened === 'boolean' ? search.isUtteranceOpened : undefined,
      openedUtteranceId: typeof search.openedUtteranceId === 'number' ? search.openedUtteranceId : undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const searchParams = Route.useSearch()
  // const { query, openedUtteranceId } = Route.useSearch()
  const isUtteranceOpened = Route.useSearch().isUtteranceOpened ?? false

  const {isPending, data} = useQuery({
    queryKey: ['search', searchParams],
    queryFn: async () => {
      if (searchParams.query === null) {
        return []
      }
      return await fullTextSearch({
        query: searchParams.query,
        startDate: searchParams.startDate || '',
        endDate: searchParams.endDate || '',
        speakerId: searchParams.speakerId || '',
        conversationId: searchParams.conversationId || '',
        searchType: searchParams.searchType || 'hybrid-search',
      })
    },
  })

  console.log("Search results:", data)


  if (searchParams.query === null) {
    console.log("Gówno", searchParams)
    navigate({ to: '/' })
    return null
  }

  async function onSearch(search: SearchParams) {
    await navigate({
      to: '/search',
      search: {
        query: search.query,
        searchType: search.searchType,
        startDate: search.startDate,
        endDate: search.endDate,
        speakerId: search.speakerId,
        conversationId: search.conversationId,
        isUtteranceOpened: false, // Reset the opened utterance state on new search
        openedUtteranceId: undefined // Reset the opened utterance ID on new search
      }
    })
  }

  async function onClickSearchResult(utteranceId: number) {
    await navigate({
      to: '/search',
      search: {
        ...searchParams,
        isUtteranceOpened: true,
        openedUtteranceId: utteranceId
      }
    })
  }

  async function expandShrinkSearchResults() {
    await navigate({
      to: '/search',
      search: {
        ...searchParams,
        isUtteranceOpened: !isUtteranceOpened,
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
      date: result.conversation.conversation_date == null ? undefined : new Date(result.conversation.conversation_date).toLocaleDateString(),
    }))
  }

  const opendedSearchResult = results.find(result => result.utteranceId === searchParams.openedUtteranceId)

  return (
    <div className='flex justify-center gap-4 h-screen p-4'>
      <div className={"flex gap-10 transition-all duration-200 ease-in-out shrink-0 grow-0" + (isUtteranceOpened ? " w-3/10" : " w-2/3")}>
        <div className={"w-full" + (searchParams.openedUtteranceId !== undefined ? ' flex flex-col' : '')}>
          <SearchBar 
            onSearch={onSearch}
            defaultValue={{
              query: searchParams.query,
              searchType: searchParams.searchType,
              startDate: searchParams.startDate,
              endDate: searchParams.endDate,
              speakerId: searchParams.speakerId,
              conversationId: searchParams.conversationId
            }}
          />
          { isPending && <div className='text-center mt-4'>Loading...</div>}
          { (!isPending && results.length == 0) && <div className='text-center mt-4'>No results found for "{searchParams.query}"</div> }
          <div className={searchParams.openedUtteranceId !== undefined ? "overflow-y-auto custom-scrollbar pr-2" : ""}>
            {results.map(result => <SearchResultRow 
              searchResult={result} 
              key={result.utteranceId}
              isActive={result.utteranceId === searchParams.openedUtteranceId}
              onClick={onClickSearchResult}  
            />)}
          </div>
        </div>

        <div className={'mr-4 h-full w-[1px] bg-[#ccc] relative' + (searchParams.openedUtteranceId !== undefined ? ' opacity-100' : ' opacity-0')}>
          <div className='w-[40px] h-[40px] absolute top-1/2 bg-nord-dark-0 flex justify-center items-center -translate-y-1/2 left-[-20px] rounded-full hover:cursor-pointer hover:scale-150 transition-all duration-200 ease-in-out' onClick={expandShrinkSearchResults}>
            <div className={'w-[10px] h-[10px] border-r-[2px] border-t-[2px] border-nord-aurora-0 transition-all duration-200 ease-in-out' + (isUtteranceOpened ? ' rotate-45' : ' rotate-[225deg]')}></div>
          </div>
        </div>
      </div>

      <div className={"transition-all duration-200 ease-in-out shrink-0 grow-0" + (searchParams.openedUtteranceId !== undefined ? (" opacity-100" + (isUtteranceOpened ? " w-7/10" : " w-1/3")) : " w-0 overflow-hidden opacity-0")}>
        <div className=' flex justify-center'>
          <iframe className={'transition-all duration-200 ease-in-out' + (isUtteranceOpened ? ' w-3/4 h-[66vh]' : ' w-full h-[50vh] m-0')} src={`https://www.youtube.com/embed/${opendedSearchResult?.youtubeId}?si=Ci2WGZriE2BVXy6E&amp;start=${Math.round(opendedSearchResult?.startTime ?? 0)}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
        <div>
          <h2 className='text-2xl font-bold mt-4'>{opendedSearchResult?.title}</h2>
          <p className='font-bold'>Speaker: {opendedSearchResult?.speaker || 'Unknown Speaker'}</p>
          <p className='italic'>{opendedSearchResult?.utteranceText}</p>
          <p className='text-lg mt-2'>{opendedSearchResult?.description}</p>
          <p className='text-sm mt-2 text-gray-500'>Time: {secondsToTimeString(opendedSearchResult?.startTime ?? 0)} - {secondsToTimeString(opendedSearchResult?.endTime ?? 0)}</p>
        </div>
      </div>
    </div>
  )
}
