import { useState } from "react"

type SearchBarProps = {
  onSearch: (searchTerm: string) => void,
  defaultValue?: string
}

export default function SearchBar({ onSearch, defaultValue }: SearchBarProps) {    
  const [search, setSearch] = useState(defaultValue || '')
  const [showFilters, setShowFilters] = useState(false)
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue)

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

      <div className={showFilters ? 'slide-panel open' : 'slide-panel'}>
        Here add filters for threads, like tags, date, etc.

        <input className='block' type='date' />
        <input className='block' type='date' />
        <input className='block' type='text' placeholder='Tag' />
      </div>
    </div>
  )
}