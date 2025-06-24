import { useState } from "react"
import SpeakersSelect from "./speakersSelect.tsx";
import ConversationsSelect from "./conversationsSelect.tsx";

export type SearchFilters = {
  query: string
  searchType: 'hybrid-search' | 'full-text-search' | 'semantic-search'
  startDate: string
  endDate: string
  speakerId: string
  conversationId: string
}

export type SearchFiltersDefault = {
  query?: string
  searchType?: 'hybrid-search' | 'full-text-search' | 'semantic-search'
  startDate?: string
  endDate?: string
  speakerId?: string
  conversationId?: string
}

type SearchBarProps = {
  onSearch: (filters: SearchFilters) => void,
  defaultValue?: SearchFiltersDefault,
}

function CustomRadio({name, label, value, checkedValue, onChange}: {name: string, label: string, value: string, checkedValue?: string, onChange?: (value: string) => void}) {
  const id = name + '-' + value;
  function handleChange() {
    if (onChange) {
      onChange(value);
    }
  }

  return (
    <label className='block' htmlFor={id}>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        className="sr-only peer"
        checked={checkedValue !== undefined ? (checkedValue === value) : undefined}
        onChange={handleChange}
      />
      <span className="block whitespace-nowrap px-6 py-3 text-lg font-medium text-white bg-nord-dark-2 rounded-lg peer-checked:bg-nord-dark-3 peer-checked:ring-2 peer-checked:ring-nord-aurora-0 hover:bg-nord-dark-3 hover:cursor-pointer transition-all">
        {label}
      </span>
    </label> 
  )
}

export default function SearchBar({ onSearch, defaultValue }: SearchBarProps) {
  const defaultFilters = {
    query: '',
    searchType: 'hybrid-search',
    startDate: '',
    endDate: '',
    speakerId: '',
    conversationId: '',
    ...defaultValue,
  }

  const [filters, setFilters] = useState(defaultFilters)
  const [showFilters, setShowFilters] = useState(false)
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue)


  if (JSON.stringify(defaultValue) !== JSON.stringify(prevDefaultValue)) {
    setFilters(defaultFilters)
    setPrevDefaultValue(defaultValue)
  }


  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const searchTrimmed = filters.query.trim()
    if (searchTrimmed === '') {
      return
    }

    const searchType = filters.searchType
    if (searchType !== 'hybrid-search' && searchType !== 'full-text-search' && searchType !== 'semantic-search') {
      console.error('Invalid search type:', searchType)
      return
    }

    onSearch({
      ...filters,
      query: searchTrimmed,
      searchType
    })
  }

  function toggleShowFilters() {
    setShowFilters(!showFilters)
  }

  return (
    <div>
      <form className='flex gap-x-6 w-full' onSubmit={onFormSubmit}>
        <input 
          className='block rounded border border-nord-aurora-0 p-2 text-lg w-2/3'
          placeholder='Search threads...'
          value={filters.query}
          onChange={(e) => setFilters({...filters, query: e.target.value}) }
        />
        <button 
          className='block w-1/3 bg-nord-dark-2 rounded transition-all duration-200 ease-in-out hover:bg-nord-dark-3 hover:text-lg hover:cursor-pointer hover:shadow-xl disabled:bg-nord-dark-1 disabled:text-nord-dark-3'
          type='submit'
          disabled={filters.query == ""}>Search</button>
      </form>
      <div className='mt-5 flex justify-end w-full'>
        <div className="line-with-arrow">
          <div className={showFilters ? "circle-arrow rotated" : "circle-arrow"} onClick={toggleShowFilters}>
            <span className={showFilters ? "chevron rotated" : "chevron"} />
          </div>
        </div>
      </div>

      <div className={'mt-4 px-4'+ (showFilters ? ' slide-panel open' : ' slide-panel')}>
        <div className="flex gap-6 my-4 flex-wrap">
          <CustomRadio name="search-type" label="Hybrid search" value="hybrid-search" checkedValue={filters.searchType} onChange={(value) => setFilters({...filters, searchType: value})} />
          <CustomRadio name="search-type" label="Full-text search" value="full-text-search" checkedValue={filters.searchType} onChange={(value) => setFilters({...filters, searchType: value})} />
          <CustomRadio name="search-type" label="Semantic search" value="semantic-search" checkedValue={filters.searchType} onChange={(value) => setFilters({...filters, searchType: value})} />
        </div>

        <div className="flex gap-6 items-end my-4">
          <div className="flex flex-col">
            <label htmlFor="start_date_filter" className="mb-1 text-sm font-medium text-nord-polar-night-0">Start date:</label>
            <input
              id="start_date_filter"
              type="date"
              className="rounded border  px-3 py-2 bg-nord-dark-1 text-white focus:outline-none focus:ring-2 focus:ring-nord-aurora-0 transition"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="end_date_filter" className="mb-1 text-sm font-medium text-nord-polar-night-0">End date:</label>
            <input
              id="end_date_filter"
              type="date"
              className="rounded border px-3 py-2 bg-nord-dark-1 text-white focus:outline-none focus:ring-2 focus:ring-nord-aurora-0 transition"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 justify-end w-full">
          <SpeakersSelect
            value={filters.speakerId}
            onChange={(speakerId) => setFilters({...filters, speakerId})} />

          <ConversationsSelect
            value={filters.conversationId}
            onChange={(conversationId) => setFilters({...filters, conversationId})} />
        </div>

      </div>
    </div>
  )
}