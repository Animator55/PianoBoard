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
  const BoardRef = React.useRef<HTMLDivElement | null>(null)

  const recordKey = (octave:number | undefined, index:number| undefined, timestamp:number)=>{
    if(!recording) return 
    if(Record.length === 0) {
      let Recorded: RecordedKey = {octave: octave, key: index, timestamp: 0, initialstamp: timestamp}
      setRecord([...Record, Recorded])
    }
    else {
      let Recorded: RecordedKey = {octave: octave, key: index, timestamp: timestamp - Record[0].initialstamp!}
      let SilenceGap: RecordedKey = {octave: -1, key: -1, timestamp: Record[Record.length-1].timestamp, hold: timestamp - Record[0].initialstamp! - Record[Record.length-1].timestamp}
      setRecord([...Record, SilenceGap, Recorded])
    }
  }

  const playRecord = (index: number)=>{
    console.log(index)
    const currentRecord = CachedRecords[index]
    for(let i = 0;i<currentRecord.length;i++) {
      let key: RecordedKey = currentRecord[i]
      setTimeout(()=>{
        if(!BoardRef.current || key.key === undefined) return
        if(key.key !== -1) {
          let keyIndex = key.key + 12 * (key.octave!-1)
          const KeyElement = BoardRef.current.children[keyIndex] as HTMLButtonElement
          KeyElement.classList.add("active")
          setTimeout(()=>{
            KeyElement.click()
            KeyElement.classList.remove("active")
          },100)
        }
      }, key.timestamp)
    }
  }

  const GenerateBoard = () =>{
    let array : JSX.Element[] = []
    for(let i=1; i<=octaves;i++){
      for(let j=0;j<12;j++){
        array.push(<PianoKey record={(timestamp:number)=>{recordKey(i, j, timestamp)}} key={Math.random()} octave={i} index={j}/>)
      }
    }
    return <section className='board' ref={BoardRef}>{array}</section>
  }

  const TopBar = ()=>{
    return <nav>
      <RenderCached CachedRecords={CachedRecords} playRecord={playRecord}/>
      <button onClick={(e:React.MouseEvent)=>{
          if(recording && Record.length !== 0) {
            let SilenceGap: RecordedKey = {octave: -1, key: -1, timestamp: Record[Record.length-1].timestamp, hold: e.timeStamp - Record[0].initialstamp! - Record[Record.length-1].timestamp}
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