import React from 'react'
import { Geometry } from '../components/Geometry'
import { Legend } from '../components/Legend'

const Index = () => {
  return (
    <div>
      <h1>Frame Geometry</h1>
      <div id="app">
        <Legend />
        <Geometry />
      </div>
      <style jsx>{`
        body {
          font-family: sans-serif;
        }
      `}</style>
    </div>
  )
}

export default Index
