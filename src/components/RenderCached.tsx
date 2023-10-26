import { CachedRecords } from "../vite-env"

type Props = {
    CachedRecords: CachedRecords
    playRecord: Function
    editing: boolean
}

export default function RenderCached({CachedRecords, playRecord, editing}: Props) {
  const List = ()=>{
    let JSX = []
    for(const id in CachedRecords) {
      const li = CachedRecords[id]
      let hold : number = li[li.length-1].hold === undefined ? 0 : li[li.length-1].hold!
      let duration = li[li.length-1].timestamp + hold

      JSX.push(<li key={Math.random()} onClick={(e)=>{
        if(editing)return
        playRecord(id, !e.currentTarget.classList.contains("playing"))
        e.currentTarget.classList.toggle("playing")
      }}>
          <p>Audio {id} - {Math.round(duration/1000)}s</p>
      </li>)
    }

    return JSX
  }

  return <ul>
    <List/>
  </ul>
}