import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import PlayList from '../components/PlayList'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div>
      <PlayList />
    </div>
  )
}
