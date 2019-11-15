import Raphael from 'raphael'

type Mm = number;
type Px = number;
type Dg = number;

class FrameGeometry {
    public chainstayLength: Mm
    public seatTubeLength: Mm
    public seatTubeAngle: Dg
    public bbDrop: Mm
    public topTubeLength: Mm
    public headTubeLength: Mm
    public headTubeAngle: Dg

    public stack: Mm
    public reach: Mm

    public seatStayOffset: Mm
    public topTubeSeatOffset: Mm
    public topTubeHeadOffset: Mm
    public downTubeHeadOffset: Mm
}

class Line {
    constructor(public start: Point, public end: Point) { }
}

class Point {
    constructor(public x: Px, public y: Px) { }
}

function throwIfAnyNaN(frameGeometry: FrameGeometry): void {
    for (const fieldName of Object.getOwnPropertyNames(frameGeometry)) {
        if (isNaN((frameGeometry as any)[fieldName])) {
            throw new Error(`Field ${fieldName} is NaN`)
        }
    }
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

function moveAlongLine(line: Line, alpha: Dg, distance: Mm): Point {
    return new Point(0, 0)
}

function computeChainstay(frameGeometry: FrameGeometry, origin: Point): Line {
    const y = scale(frameGeometry.bbDrop)
    const x = Math.sqrt(square(scale(frameGeometry.chainstayLength)) - square(scale(frameGeometry.bbDrop)))
    return new Line(new Point(origin.x, origin.y), new Point(origin.x + x, origin.y + y))
}

function computeSeatTube(frameGeometry: FrameGeometry, bbCenter: Point): Line {
    const a = scale(frameGeometry.seatTubeLength) * Math.sin(rad(frameGeometry.seatTubeAngle))
    const b = scale(frameGeometry.seatTubeLength) * Math.cos(rad(frameGeometry.seatTubeAngle))
    return new Line(new Point(bbCenter.x, bbCenter.y), new Point(bbCenter.x - b, bbCenter.y - a))
}

// TODO sort out scaling
function computeHeadTube(frameGeometry: FrameGeometry, bbCenter: Point): Line {
    const headTubeStart = new Point(bbCenter.x + scale(frameGeometry.reach), bbCenter.y - scale(frameGeometry.stack))
    const a = scale(frameGeometry.headTubeLength) * Math.sin(rad(frameGeometry.headTubeAngle))
    const b = scale(frameGeometry.headTubeLength) * Math.cos(rad(frameGeometry.headTubeAngle))
    const headTubeEnd = new Point(headTubeStart.x + b, headTubeStart.y + a)
    return new Line(headTubeStart, headTubeEnd)
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
const origin = new Point(10, 290)
const paper = Raphael('frame-geo-viz', 800, 400)

const renegadeExploit = new FrameGeometry()
renegadeExploit.chainstayLength = 430
renegadeExploit.bbDrop = 72
renegadeExploit.seatTubeLength = 560
renegadeExploit.seatTubeAngle = 73
renegadeExploit.headTubeAngle = 71.5
renegadeExploit.headTubeLength = 163
renegadeExploit.stack = 595
renegadeExploit.reach = 387

throwIfAnyNaN(renegadeExploit)

const chainstay = computeChainstay(renegadeExploit, origin)
const seatTube = computeSeatTube(renegadeExploit, chainstay.end)
const headTube = computeHeadTube(renegadeExploit, chainstay.end)

drawLine(paper, chainstay)
drawLine(paper, seatTube)
drawLine(paper, headTube)