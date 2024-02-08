import React from 'react'
import './assets/App.css'
import PianoKey from './components/PianoKey'
import {
  configuration
} from './vite-env'
import VolumeButton from './components/VolumeButton'

const defaultconfig = {
  viewBinds: true,
  viewNotes: true,
  volume: 0.25,
  keyBinds: {}
}

export default function App() {
  const [octaves, setOctaves] = React.useState<number>(2)
  const [configuration, setConfiguration] = React.useState<configuration>(defaultconfig)
  const BoardRef = React.useRef<HTMLDivElement | null>(null)

  const GenerateBoard = () => {
    let array: JSX.Element[] = []
    for (let i = 1; i <= octaves; i++) {
      for (let j = 0; j < 12; j++) {
        array.push(
          <PianoKey
            key={Math.random()}
            octave={i}
            index={j}
            configuration={configuration}
          />)
      }
    }

    return <section
      className='board'
      ref={BoardRef}
    >{array}</section>
  }

  const TopBar = () => {
    return <nav className='top-bar'>
      <select defaultValue={octaves} onChange={(e) => { setOctaves(Number(e.currentTarget.value)) }}>
        <option value={1}>1 Octave</option>
        <option value={2}>2 Octave</option>
        <option value={3}>3 Octave</option>
      </select>
      <button style={{ opacity: configuration.viewNotes ? 1 : 0.5 }} onClick={() => { setConfiguration({ ...configuration, viewNotes: !configuration.viewNotes }) }}>
        Notes
      </button>
      <VolumeButton volume={configuration.volume} changeVolume={(vol: number) => { setConfiguration({ ...configuration, volume: vol }) }} />
    </nav>
  }

  return <div className='main'>
    <TopBar />
    <GenerateBoard />
  </div>
}