import Raphael from 'raphael'

type Mm = number;
type Px = number;
type Dg = number;

interface Frame {
    readonly geometry: FrameGeometry
    readonly color: string
    readonly name: string
}

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
    readonly forkRake: Mm
    readonly wheelBase: Mm
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

export function point(x: Px, y: Px) {
    return { x, y }
}

function square(x: number): number {
    return Math.pow(x, 2)
}

function scale(value: Mm): Px {
    return value * 1.3
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
    const headTubeEnd = moveAlongLine(headTubeStart, frameGeometry.headTubeAngle, -frameGeometry.headTubeLength)
    return line(headTubeStart, headTubeEnd)
}

function computeTopTube(frameGeometry: FrameGeometry, headTubeStart: Point, seatTubeTop: Point): Line {
    const topTubeStart = moveAlongLine(seatTubeTop, frameGeometry.seatTubeAngle, -frameGeometry.topTubeSeatOffset)
    const topTubeEnd = moveAlongLine(headTubeStart, frameGeometry.headTubeAngle, -frameGeometry.topTubeHeadOffset)
    return line(topTubeStart, topTubeEnd)
}

function computeDownTube(frameGeometry: FrameGeometry, headTubeEnd: Point, bbCenter: Point): Line {
    const downTubeStart = moveAlongLine(headTubeEnd, frameGeometry.headTubeAngle, frameGeometry.downTubeHeadOffset)
    return line(downTubeStart, point(bbCenter.x, bbCenter.y))
}

function computeSeatStay(frameGeometry: FrameGeometry, seatTubeEnd: Point, chainstayStart: Point): Line {
    const seatStayStart = moveAlongLine(seatTubeEnd, frameGeometry.seatTubeAngle, -frameGeometry.seatStayOffset)
    return line(point(chainstayStart.x, chainstayStart.y), seatStayStart)
}

function computeFork(frameGeometry: FrameGeometry, headTubeEnd: Point, chainstayStart: Point): Line {
    const forkEnd = point(chainstayStart.x + scale(frameGeometry.wheelBase), chainstayStart.y)
    return line(point(headTubeEnd.x, headTubeEnd.y), forkEnd)
}

function drawLine(paper: RaphaelPaper, line: Line, color: string): RaphaelElement {
    const pathString = `M${line.start.x} ${line.start.y}L${line.end.x} ${line.end.y}`
    const lineElement = paper.path(pathString)
    lineElement.attr('stroke-width', 5)
    lineElement.attr('stroke-linecap', 'round')
    lineElement.attr('stroke-opacity', 0.5)
    lineElement.attr('stroke', color)
    return lineElement
}

export function drawFrame(paper: RaphaelPaper, frame: Frame, origin: Point, scale: number): void {
    const chainstay = computeChainstay(frame.geometry, origin)
    const seatTube = computeSeatTube(frame.geometry, chainstay.end)
    const headTube = computeHeadTube(frame.geometry, chainstay.end)
    const topTube = computeTopTube(frame.geometry, headTube.start, seatTube.end)
    const downTube = computeDownTube(frame.geometry, headTube.end, chainstay.end)
    const seatStay = computeSeatStay(frame.geometry, seatTube.end, chainstay.start)
    const fork = computeFork(frame.geometry, headTube.end, chainstay.start)

    paper.setStart()
    drawLine(paper, chainstay, frame.color)
    drawLine(paper, seatTube, frame.color)
    drawLine(paper, headTube, frame.color)
    drawLine(paper, topTube, frame.color)
    drawLine(paper, downTube, frame.color)
    drawLine(paper, seatStay, frame.color)
    drawLine(paper, fork, frame.color)
    paper.setFinish()
}

const renegadeExploit: Frame = {
    geometry: {
        chainstayLength: 430,
        bbDrop: 72,
        seatTubeLength: 560,
        seatTubeAngle: 73,
        headTubeAngle: 71.5,
        headTubeLength: 163,
        stack: 595,
        reach: 387,
        topTubeLength: 570,
        seatStayOffset: 20,
        topTubeHeadOffset: 20,
        topTubeSeatOffset: 20,
        downTubeHeadOffset: 20,
        forkRake: 53,
        wheelBase: 1042
    },
    color: 'gray',
    name: 'Jamis Renegade Exploit'
}

const raleighTamland2: Frame = {
    geometry: {
        chainstayLength: 440,
        bbDrop: 75,
        seatTubeLength: 560,
        seatTubeAngle: 73,
        headTubeAngle: 71.5,
        headTubeLength: 160,
        stack: 590,
        reach: 380,
        topTubeLength: 560,
        seatStayOffset: 20,
        topTubeHeadOffset: 20,
        topTubeSeatOffset: 20,
        downTubeHeadOffset: 20,
        forkRake: 52,
        wheelBase: 1043
    },
    color: 'lightblue',
    name: 'Raleigh Tamland 2'
}

const cinelli: Frame = {
    geometry: {
        chainstayLength: 440,
        bbDrop: 70,
        seatTubeLength: 560,
        seatTubeAngle: 73.5,
        headTubeAngle: 72,
        headTubeLength: 160,
        stack: 572,
        reach: 390,
        topTubeLength: 560,
        seatStayOffset: 20,
        topTubeHeadOffset: 20,
        topTubeSeatOffset: 20,
        downTubeHeadOffset: 20,
        forkRake: 47,
        wheelBase: 1037
    },
    color: 'black',
    name: 'Cinelli Zydeco'
}

export const frames = [renegadeExploit, raleighTamland2, cinelli]