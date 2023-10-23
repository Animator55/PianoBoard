import React from 'react'
import './assets/App.css'
import PianoKey from './components/PianoKey'
import { RecordedKey } from './vite-env'
import RenderCached from './components/RenderCached'


export default function App() {
  const [octaves, serOctaves] = React.useState<number>(2)
  const [recording, startRecording] = React.useState<boolean>(false)
  const [Record, setRecord] = React.useState<RecordedKey[]>([])
  const [CachedRecords, setCachedRecords] = React.useState<Array<RecordedKey[]>>([])

  const recordKey = (octave:number | undefined, index:number| undefined, timeHold:number)=>{
    if(!recording) return 
    let Recorded: RecordedKey = {octave: octave, key: index, timestamp: timeHold}
    if(Record.length === 0) setRecord([...Record, Recorded])
    else {
      let SilenceGap: RecordedKey = {octave: -1, key: -1, timestamp: Record[Record.length-1].timestamp, hold: timeHold - Record[Record.length-1].timestamp}
      setRecord([...Record, SilenceGap, Recorded])
    }
  }

  const GenerateBoard = () =>{
    let array : JSX.Element[] = []
    for(let i=1; i<=octaves;i++){
      for(let j=0;j<12;j++){
        array.push(<PianoKey record={(timeHold:number)=>{recordKey(i, j, timeHold)}} key={Math.random()} octave={i} index={j}/>)
      }
    }
    return <section className='board'>{array}</section>
  }

  const TopBar = ()=>{
    return <nav>
      <RenderCached CachedRecords={CachedRecords}/>
      <button onClick={(e:React.MouseEvent)=>{
          if(recording && Record.length !== 0) {
            let SilenceGap: RecordedKey = {octave: -1, key: -1, timestamp: Record[Record.length-1].timestamp, hold: e.timeStamp - Record[Record.length-1].timestamp}
            setRecord([...Record, SilenceGap])
          }
          startRecording(!recording)
      }}>{recording ? "Stop Recording":"Record"}</button>

      <select defaultValue={octaves} onChange={(e)=>{serOctaves(Number(e.currentTarget.value))}}>
        <option value={1}>1 Octave</option>
        <option value={2}>2 Octave</option>
        <option value={3}>3 Octave</option>
      </select>
    </nav>
  }

  React.useEffect(()=>{
    if(!recording && Record.length !== 0) {
      setCachedRecords([...CachedRecords, Record])
      setRecord([])
    }
  }, [Record, recording])

  return <div>
    <TopBar/>
    <GenerateBoard/>
  </div>
}