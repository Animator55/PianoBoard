import React from 'react'
import './assets/App.css'
import PianoKey from './components/PianoKey'
import { CachedRecords, RecordedKey, configuration } from './vite-env'
import RenderCached from './components/RenderCached'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard'

let Record : RecordedKey[] = []
const setRecord = (val: RecordedKey[]) =>{
  Record = val
}

const defaultconfig = {
  viewBinds: true,
  viewNotes: true,
  keyBinds:{
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
}

let PlayingRecords: string[] = []

const detectRecordsIndex = (id: string): number=>{
  let index: number = -1
  for(let i=0;i<PlayingRecords.length; i++){
    let entry: string = PlayingRecords[i]
    let EntryId = entry.split("-")[0]
    if(id === EntryId) {
      index = i
      break
    }
  }

  return index
}

export default function App() {
  const [octaves, setOctaves] = React.useState<number>(2)
  const [recording, startRecording] = React.useState<boolean>(false)
  const [editing, startEditing] = React.useState<boolean>(false)
  const [configuration, setConfiguration] = React.useState<configuration>(defaultconfig)
  const [CachedRecords, setCachedRecords] = React.useState<CachedRecords>({})
  const BoardRef = React.useRef<HTMLDivElement | null>(null)

  //functions

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

  const StopRecord = (timeStamp:number, index: string, verifiyer: number)=>{
    setTimeout(()=>{
      if(!PlayingRecords.includes(index+"-"+verifiyer)||!BoardRef.current) return
      PlayingRecords.splice(detectRecordsIndex(index), 1)
      let recordButton: HTMLElement | null = document.getElementById(index)
      if(recordButton !== null) {
        let record = recordButton.firstChild as HTMLDivElement
        record.style.transition = "none"
        recordButton.classList.remove("playing")
      }
    }, timeStamp)
  }

  const playRecord = (index: string, playStop: boolean)=>{
    const currentRecord = CachedRecords[index]
    const verifiyer = Math.random()
    if(playStop) PlayingRecords.push(index+"-"+verifiyer)
    else PlayingRecords.splice(detectRecordsIndex(index), 1)

    for(let i = 0;i<currentRecord.length;i++) {
      let key: RecordedKey = currentRecord[i]
      setTimeout(()=>{
        if(!PlayingRecords.includes(index+"-"+verifiyer)||!BoardRef.current || key.key === undefined) return
        if(currentRecord.length-1 === i) StopRecord(key.hold, index, verifiyer)
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

  const createID = () : string=>{
    let id:string = `${Math.round(Math.random()*1000)}`
    let idArray = Object.keys(CachedRecords)
    while(idArray.includes(id)){
      id = `${Math.round(Math.random()*1000)}`
    }
    return id
  }

  //components

  const GenerateBoard = () =>{
    let array : JSX.Element[] = []
    for(let i=1; i<=octaves;i++){
      for(let j=0;j<12;j++){
        array.push(
          <PianoKey
            record={(timestamp:number)=>{recordKey(i, j, timestamp)}} 
            key={Math.random()} 
            octave={i} 
            index={j}
            configuration={configuration}
            newBind={newBind}
            editing={editing}
          />)
      }
    }

    const keyDown = (e: React.KeyboardEvent)=>{
      let index = Object.values(configuration.keyBinds).indexOf(e.key.toLowerCase())
      if(index === -1 || !BoardRef.current || editing) return
      let [octave, key] = Object.keys(configuration.keyBinds)[index].split(".")
      if(Number(octave) > octaves) return
      let keyIndex: number = Number(key) + 12 * (Number(octave)-1)
      const KeyElement = BoardRef.current.children[keyIndex] as HTMLButtonElement
      KeyElement.classList.add("active")
      setTimeout(()=>{
        KeyElement.click()
        KeyElement.classList.remove("active")
      },100)
    }

    return <section 
        className='board' 
        data-editing={editing ? "editing" : ""}
        ref={BoardRef}
        onKeyDown={keyDown}
    >{array}</section>
  }

  const TopBar = ()=>{
    return <nav className='top-bar'>
      <button onClick={()=>{startEditing(!editing)}}>
        <FontAwesomeIcon icon={editing ? faCheck : faKeyboard}/>
        {editing ? "Confirm KeyBinds":"Configurate KeyBinds"}
      </button>
      <button className={editing ? "disabled":""} onClick={(e:React.MouseEvent)=>{
        if(editing) return
        if(recording && Record.length !== 0) {
          let SilenceGap: RecordedKey = {octave: -1, key: -1, timestamp: Record[Record.length-1].timestamp, hold: e.timeStamp - Record[0].initialstamp! - Record[Record.length-1].timestamp}
          setRecord([...Record, SilenceGap])
        }
        startRecording(!recording)
      }}>{recording ? "Stop Recording":"Record"}</button>

      <select defaultValue={octaves} onChange={(e)=>{setOctaves(Number(e.currentTarget.value))}}>
        <option value={1}>1 Octave</option>
        <option value={2}>2 Octave</option>
        <option value={3}>3 Octave</option>
      </select>
      <button onClick={()=>{setConfiguration({...configuration, viewBinds: !configuration.viewBinds})}}>
        {configuration.viewBinds ? "Binds":"Binds X"}
      </button>
      <button onClick={()=>{setConfiguration({...configuration, viewNotes: !configuration.viewNotes})}}>
        {configuration.viewNotes ? "Notes":"Notes X"}
      </button>
    </nav>
  }

  //useEffect

  React.useEffect(()=>{
    if(!recording && Record.length !== 0) {
      setCachedRecords({...CachedRecords, [createID()]: Record})
      setRecord([])
    }
  }, [recording])

  React.useEffect(()=>{
    if(BoardRef.current) {
      let button = BoardRef.current.children[0] as HTMLButtonElement
      button.focus()
    }
  })

  React.useEffect(()=>{
    if(editing) {
      setRecord([])
      startRecording(false)
      PlayingRecords = []
    }
  }, [editing])

  return <div className='main'>
    <TopBar/>
    <RenderCached CachedRecords={CachedRecords} playRecord={playRecord} editing={editing}/>
    <GenerateBoard/>
  </div>
}