import { useState } from "react"

type SearchBarProps = {
  onSearch: (searchTerm: string) => void,
  defaultValue?: string
}

function CustomRadio({name, label, value, checkedValue, onClick}: {name: string, label: string, value: string, checkedValue?: string, onClick?: (value: string) => void}) {
  const id = name + '-' + value;
  return (
    <label htmlFor={id}>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        className="sr-only peer"
        checked={checkedValue !== undefined ? (checkedValue === value) : undefined}
        onClick={onClick ? () => onClick(value) : undefined}
      />
      <span className="px-6 py-3 text-lg font-medium text-white bg-nord-dark-2 rounded-lg peer-checked:bg-nord-dark-3 peer-checked:ring-2 peer-checked:ring-nord-aurora-0 hover:bg-nord-dark-3 hover:cursor-pointer transition-all">
        {label}
      </span>
    </label> 
  )
}

export default function SearchBar({ onSearch, defaultValue }: SearchBarProps) {    
  const [search, setSearch] = useState(defaultValue || '')
  const [showFilters, setShowFilters] = useState(false)
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue)
  const [filters, setFilters] = useState({
    searchType: 'hybrid-search',
    startDate: '',
    endDate: '',
    tag: ''
  })

  if (defaultValue !== prevDefaultValue) {
    setSearch(defaultValue || '')
    setPrevDefaultValue(defaultValue)
  }


  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const searchTrimmed = search.trim()
    if (searchTrimmed === '') {
      return
    }
    onSearch(searchTrimmed)
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button 
          className='block w-1/3 bg-nord-dark-2 rounded transition-all duration-200 ease-in-out hover:bg-nord-dark-3 hover:text-lg hover:cursor-pointer hover:shadow-xl disabled:bg-nord-dark-1 disabled:text-nord-dark-3'
          type='submit'
          disabled={search == ""}>Search</button>
      </form>
      <div className='mt-5 flex justify-end w-full'>
        <div className="line-with-arrow">
          <div className={showFilters ? "circle-arrow rotated" : "circle-arrow"} onClick={toggleShowFilters}>
            <span className={showFilters ? "chevron rotated" : "chevron"} />
          </div>
        </div>
      </div>

      <div className={'p-4'+ (showFilters ? ' slide-panel open' : ' slide-panel')}>
        <div className="flex gap-4 my-4">
          <CustomRadio name="search-type" label="Hybrid search" value="hybrid-search" checkedValue={filters.searchType} onClick={(value) => setFilters({...filters, searchType: value})} />
          <CustomRadio name="search-type" label="Full-text search" value="full-text-search" checkedValue={filters.searchType} onClick={(value) => setFilters({...filters, searchType: value})} />
          <CustomRadio name="search-type" label="Semantic search" value="semantic-search" checkedValue={filters.searchType} onClick={(value) => setFilters({...filters, searchType: value})} />
        </div>

        <input className='block' type='date' />
        <input className='block' type='date' />
        <input className='block' type='text' placeholder='Tag' />
      </div>
    </div>
  )
}