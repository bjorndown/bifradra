import React, { ReactElement, useEffect } from 'react'
import { point, Frame, Point, projectFrame, Line } from '../lib/geometry'
import { frames } from '../lib/frames'

const origin = point(30, 580)

const drawLine = (line: Line, color: string): ReactElement => {
  const pathString = `M${line.start.x} ${line.start.y}L${line.end.x} ${line.end.y}`
  return (
    <path
      d={pathString}
      strokeWidth={5}
      strokeLinecap="round"
      strokeOpacity={0.5}
      stroke={color}
    />
  )
}

const drawFrame = (frame: Frame, origin: Point): ReactElement => {
  const projection = projectFrame(frame, origin)

  return (
    <g key={frame.name}>
      {drawLine(projection.chainstay, frame.color)}
      {drawLine(projection.seatTube, frame.color)}
      {drawLine(projection.headTube, frame.color)}
      {drawLine(projection.topTube, frame.color)}
      {drawLine(projection.downTube, frame.color)}
      {drawLine(projection.seatStay, frame.color)}
      {drawLine(projection.fork, frame.color)}
    </g>
  )
}

export const Geometry = () => {
  return (
    <div>
      <h2>Geo</h2>
      <svg
        version="1.1"
        width="1200"
        height="700"
        xmlns="http://www.w3.org/2000/svg"
      >
        {frames.map((frame) => drawFrame(frame, origin))}
      </svg>
    </div>
  )
}
