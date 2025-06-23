import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import SearchBar from '../components/searchBar'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className='max-w-4xl m-auto px-8'>
      <div className='text-center mb-14'>
        <h1 className='font-[Audiowide] text-6xl mt-20'>THREAD WEAVER</h1>
      </div>
      <SearchBar onSearch={(search) => navigate({ to: '/search', search: { q: search }})} />
    </div>
  )
}
