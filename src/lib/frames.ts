import type { Frame } from './geometry'

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
    wheelBase: 1042,
  },
  color: 'gray',
  name: 'Jamis Renegade Exploit',
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
    wheelBase: 1043,
  },
  color: 'lightblue',
  name: 'Raleigh Tamland 2',
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
    wheelBase: 1037,
  },
  color: 'black',
  name: 'Cinelli Zydeco',
}

export const frames = [renegadeExploit, raleighTamland2, cinelli]
