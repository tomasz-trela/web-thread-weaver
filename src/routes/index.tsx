import type { SearchFilters} from "../components/searchBar";
import {createFileRoute, Link, useNavigate} from '@tanstack/react-router'
import SearchBar from '../components/searchBar'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  async function onSearch(filters: SearchFilters) {
    await navigate({
      to: '/search',
      search: filters
    })
  }

  return (
    <div className='max-w-4xl m-auto px-8'>
      <div className='text-center mb-14'>
        <h1 className='font-[Audiowide] text-6xl mt-20'>THREAD WEAVER</h1>
      </div>
      <SearchBar onSearch={onSearch} />

      <div className="mt-40 m-auto">
        <Link to="/add">
          <button className='p-4 bg-nord-dark-2 rounded transition-all duration-200 ease-in-out hover:bg-nord-dark-3 hover:text-lg hover:cursor-pointer hover:shadow-xl disabled:bg-nord-dark-1 disabled:text-nord-dark-3'>
            Add a new thread
          </button>
        </Link>

        <Link className="ml-10" to="/threads">
          <button className='p-4 bg-nord-dark-2 rounded transition-all duration-200 ease-in-out hover:bg-nord-dark-3 hover:text-lg hover:cursor-pointer hover:shadow-xl disabled:bg-nord-dark-1 disabled:text-nord-dark-3'>
            View threads
          </button>
        </Link>
      </div>
    </div>
  )
}
