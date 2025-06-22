import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState('')


  function toggleShowFilters() {
    setShowFilters(!showFilters)
  }

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const searchTrimmed = search.trim()
    if (searchTrimmed === '') {
      return
    }
    navigate({ to: '/search', search: { q: searchTrimmed  } })
  }

  return (
    <div className='max-w-4xl m-auto px-8'>
      <div className='text-center'>
        <h1 className='font-[Audiowide] text-6xl mt-20'>THREAD WEAVER</h1>
      </div>
      <form className='flex gap-x-6 w-full mt-14' onSubmit={onSearch}>
        <input 
          className='block rounded border border-nord-aurora-0 p-2 text-lg w-2/3'
          placeholder='Search threads...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button 
          className='block w-1/3 bg-nord-dark-2 rounded disabled:bg-nord-dark-1 disabled:text-nord-dark-3'
          type='submit'
          disabled={search == ""}>Search</button>
      </form>
      <div className='mt-5 flex justify-end w-full'>
        <div className="line-with-arrow">
          <div className={showFilters ? "circle-arrow rotated" : "circle-arrow"} onClick={toggleShowFilters}><span className={showFilters ? "chevron rotated" : "chevron"} /></div>
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
