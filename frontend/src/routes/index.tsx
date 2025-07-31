import { createFileRoute } from '@tanstack/react-router'
import PlayList from '../components/PlayList'
import React from 'react';

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
