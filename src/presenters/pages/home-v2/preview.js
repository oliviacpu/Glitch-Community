import React from 'react'
import { Home } from './index'
import data from './example-data'

export default function HomePreview () {
  return <Home isPreview data={data} />
}
