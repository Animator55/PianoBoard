import React from 'react'
import './assets/App.css'
import PianoKey from './components/PianoKey'
import { RecordedKey } from './vite-env'
import RenderCached from './components/RenderCached'

type configuration = {
  keyBinds: {
    [key: string]: string
  }
}

let Record : RecordedKey[] = []
const setRecord = (val: RecordedKey[]) =>{
  Record = val
}

const defaultKeyBinds = {
  "1.0": "a",
  "1.1": "w",
  "1.2": "s",
  "1.3": "e",
  "1.4": "d",
  "1.5": "f",
  "1.6": "t",
  "1.7": "g",
  "1.8": "y",
  "1.9": "h",
  "1.10": "u",
  "1.11": "j",
}

export default function App() {
  const [octaves, serOctaves] = React.useState<number>(2)
  const [recording, startRecording] = React.useState<boolean>(false)
  const [editing, startEditing] = React.useState<boolean>(false)
  const [configuration, setConfiguration] = React.useState<configuration>({keyBinds: defaultKeyBinds})
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

  const newBind = (bind: string, key: string)=>{
    setConfiguration({...configuration, keyBinds: {...configuration.keyBinds, [key]: bind}})
  }

  const GenerateBoard = () =>{
    let array : JSX.Element[] = []
    for(let i=1; i<=octaves;i++){
      for(let j=0;j<12;j++){
        let key = i + "." + j
        let bind = configuration.keyBinds[key] === undefined ? "" : configuration.keyBinds[key]
        array.push(
          <PianoKey
            record={(timestamp:number)=>{recordKey(i, j, timestamp)}} 
            key={Math.random()} 
            octave={i} 
            index={j}
            bind={bind}
            newBind={newBind}
            editing={editing}
          />)
      }
    }
    return <section 
        className='board' 
        ref={BoardRef}
        onKeyDown={(e)=>{
          let index = Object.values(configuration.keyBinds).indexOf(e.key.toLowerCase())
          if(index === -1 || !BoardRef.current || editing) return
          let [octave, key] = Object.keys(configuration.keyBinds)[index].split(".")
          let keyIndex: number = Number(key) + 12 * (Number(octave)-1)
          const KeyElement = BoardRef.current.children[keyIndex] as HTMLButtonElement
          KeyElement.classList.add("active")
          setTimeout(()=>{
            KeyElement.click()
            KeyElement.classList.remove("active")
          },100)
        }}
    >{array}</section>
  }

  const TopBar = ()=>{
    return <nav>
      <RenderCached CachedRecords={CachedRecords} playRecord={playRecord}/>
      <button onClick={()=>{startEditing(!editing)}}>{editing ? "Confirm KeyBinds":"Configurate KeyBinds"}</button>
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
  }, [recording])

  React.useEffect(()=>{
    if(BoardRef.current) {
      let button = BoardRef.current.children[0] as HTMLButtonElement
      button.focus()
    }
  })

  return <div>
    <TopBar/>
    <GenerateBoard/>
  </div>
}