import { createFileRoute } from '@tanstack/react-router'
import PlayList from '../components/PlayList'
import React from 'react';

export const Route = createFileRoute('/plays')({
    component: PlaysRoute,
})

function PlaysRoute() {
    return (
        <div>
            <PlayList />
        </div>
    )
}
