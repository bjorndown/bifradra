type Mm = number
type Px = number
type Dg = number

export type Frame = {
  readonly geometry: FrameGeometry
  readonly color: string
  readonly name: string
}

export type FrameGeometry = {
  readonly chainstayLength: Mm
  readonly seatTubeLength: Mm
  readonly seatTubeAngle: Dg
  readonly bbDrop: Mm
  readonly topTubeLength: Mm
  readonly headTubeLength: Mm
  readonly headTubeAngle: Dg
  readonly stack: Mm
  readonly reach: Mm

  readonly seatStayOffset: Mm
  readonly topTubeSeatOffset: Mm
  readonly topTubeHeadOffset: Mm
  readonly downTubeHeadOffset: Mm
  readonly forkRake: Mm
  readonly wheelBase: Mm
}

export type Line = {
  readonly start: Point
  readonly end: Point
}

function line(start: Point, end: Point): Line {
  return { start, end }
}

export type Point = {
  readonly x: Px
  readonly y: Px
}

export function point(x: Px, y: Px) {
  return { x, y }
}

function square(x: number): number {
  return Math.pow(x, 2)
}

function scale(value: Mm): Px {
  return value * 1
}

function rad(angleInDegrees: Dg): number {
  return angleInDegrees * (Math.PI / 180)
}

function moveAlongLine(start: Point, alpha: Dg, distance: Mm): Point {
  const a = scale(distance) * Math.sin(rad(alpha))
  const b = scale(distance) * Math.cos(rad(alpha))
  return point(start.x - b, start.y - a)
}

function computeChainstay(frameGeometry: FrameGeometry, origin: Point): Line {
  const y = scale(frameGeometry.bbDrop)
  const x = Math.sqrt(
    square(scale(frameGeometry.chainstayLength)) -
      square(scale(frameGeometry.bbDrop))
  )
  return line(point(origin.x, origin.y), point(origin.x + x, origin.y + y))
}

function computeSeatTube(frameGeometry: FrameGeometry, bbCenter: Point): Line {
  const seatTubeTop = moveAlongLine(
    bbCenter,
    frameGeometry.seatTubeAngle,
    frameGeometry.seatTubeLength
  )
  return line(point(bbCenter.x, bbCenter.y), seatTubeTop)
}

function computeHeadTube(frameGeometry: FrameGeometry, bbCenter: Point): Line {
  const headTubeStart = point(
    bbCenter.x + scale(frameGeometry.reach),
    bbCenter.y - scale(frameGeometry.stack)
  )
  const headTubeEnd = moveAlongLine(
    headTubeStart,
    frameGeometry.headTubeAngle,
    -frameGeometry.headTubeLength
  )
  return line(headTubeStart, headTubeEnd)
}

function computeTopTube(
  frameGeometry: FrameGeometry,
  headTubeStart: Point,
  seatTubeTop: Point
): Line {
  const topTubeStart = moveAlongLine(
    seatTubeTop,
    frameGeometry.seatTubeAngle,
    -frameGeometry.topTubeSeatOffset
  )
  const topTubeEnd = moveAlongLine(
    headTubeStart,
    frameGeometry.headTubeAngle,
    -frameGeometry.topTubeHeadOffset
  )
  return line(topTubeStart, topTubeEnd)
}

function computeDownTube(
  frameGeometry: FrameGeometry,
  headTubeEnd: Point,
  bbCenter: Point
): Line {
  const downTubeStart = moveAlongLine(
    headTubeEnd,
    frameGeometry.headTubeAngle,
    frameGeometry.downTubeHeadOffset
  )
  return line(downTubeStart, point(bbCenter.x, bbCenter.y))
}

function computeSeatStay(
  frameGeometry: FrameGeometry,
  seatTubeEnd: Point,
  chainstayStart: Point
): Line {
  const seatStayStart = moveAlongLine(
    seatTubeEnd,
    frameGeometry.seatTubeAngle,
    -frameGeometry.seatStayOffset
  )
  return line(point(chainstayStart.x, chainstayStart.y), seatStayStart)
}

function computeFork(
  frameGeometry: FrameGeometry,
  headTubeEnd: Point,
  chainstayStart: Point
): Line {
  const forkEnd = point(
    chainstayStart.x + scale(frameGeometry.wheelBase),
    chainstayStart.y
  )
  return line(point(headTubeEnd.x, headTubeEnd.y), forkEnd)
}

export const projectFrame = (frame: Frame, origin: Point) => {
  const chainstay = computeChainstay(frame.geometry, origin)
  const seatTube = computeSeatTube(frame.geometry, chainstay.end)
  const headTube = computeHeadTube(frame.geometry, chainstay.end)
  const topTube = computeTopTube(frame.geometry, headTube.start, seatTube.end)
  const downTube = computeDownTube(frame.geometry, headTube.end, chainstay.end)
  const seatStay = computeSeatStay(
    frame.geometry,
    seatTube.end,
    chainstay.start
  )
  const fork = computeFork(frame.geometry, headTube.end, chainstay.start)
  return { chainstay, seatTube, headTube, topTube, downTube, seatStay, fork }
}


