import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '../components/Dashboard'

export const Route = createFileRoute('/')({
  component: Dashboard,
})
