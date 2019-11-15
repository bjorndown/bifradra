import Raphael from 'raphael'

type Mm = number;
type Px = number;
type Dg = number;

interface FrameGeometry {
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
}

interface Line {
    readonly start: Point
    readonly end: Point
}

function line(start: Point, end: Point): Line {
    return { start, end }
}

interface Point {
    readonly x: Px
    readonly y: Px
}

function point(x: Px, y: Px) {
    return { x, y }
}

function square(x: number): number {
    return Math.pow(x, 2)
}

function scale(value: Mm): Px {
    return value * SCALE
}

function rad(angleInDegrees: Dg): number {
    return Raphael.rad(angleInDegrees)
}

function moveAlongLine(start: Point, alpha: Dg, distance: Mm): Point {
    const a = scale(distance) * Math.sin(rad(alpha))
    const b = scale(distance) * Math.cos(rad(alpha))
    return point(start.x - b, start.y - a)
}

function computeChainstay(frameGeometry: FrameGeometry, origin: Point): Line {
    const y = scale(frameGeometry.bbDrop)
    const x = Math.sqrt(square(scale(frameGeometry.chainstayLength)) - square(scale(frameGeometry.bbDrop)))
    return line(point(origin.x, origin.y), point(origin.x + x, origin.y + y))
}

function computeSeatTube(frameGeometry: FrameGeometry, bbCenter: Point): Line {
    const seatTubeTop = moveAlongLine(bbCenter, frameGeometry.seatTubeAngle, frameGeometry.seatTubeLength)
    return line(point(bbCenter.x, bbCenter.y), seatTubeTop)
}

function computeHeadTube(frameGeometry: FrameGeometry, bbCenter: Point): Line {
    const headTubeStart = point(bbCenter.x + scale(frameGeometry.reach), bbCenter.y - scale(frameGeometry.stack))
    const headTubeEnd = moveAlongLine(headTubeStart, frameGeometry.headTubeAngle, frameGeometry.headTubeLength)
    return line(headTubeStart, headTubeEnd)
}

function drawLine(paper: RaphaelPaper, line: Line): RaphaelElement {
    const pathString = `M${line.start.x} ${line.start.y}L${line.end.x} ${line.end.y}`
    const lineElement = paper.path(pathString)
    lineElement.attr('stroke-width', 5)
    lineElement.attr('stroke-linecap', 'round')
    lineElement.attr('fill-opacity', 0.5)
    return lineElement
}

const SCALE = 1 / 5
const origin = point(10, 290)
const paper = Raphael('frame-geo-viz', 800, 400)

const renegadeExploit: FrameGeometry = {
    chainstayLength: 430,
    bbDrop: 72,
    seatTubeLength: 560,
    seatTubeAngle: 73,
    headTubeAngle: 71.5,
    headTubeLength: 163,
    stack: 595,
    reach: 387,
    topTubeLength: 570,
    seatStayOffset: 0,
    topTubeHeadOffset: 0,
    topTubeSeatOffset: 0,
    downTubeHeadOffset: 0
}

const chainstay = computeChainstay(renegadeExploit, origin)
const seatTube = computeSeatTube(renegadeExploit, chainstay.end)
const headTube = computeHeadTube(renegadeExploit, chainstay.end)

drawLine(paper, chainstay)
drawLine(paper, seatTube)
drawLine(paper, headTube)