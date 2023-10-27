import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CachedRecords } from "../vite-env"
import { faPlay } from "@fortawesome/free-solid-svg-icons"
import { faPause } from "@fortawesome/free-solid-svg-icons/faPause"

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

      JSX.push(<li key={Math.random()} className="record" id={id} onClick={(e)=>{
        if(editing)return
        let boolean = e.currentTarget.classList.contains("playing")
        playRecord(id, !boolean)
        let progress = e.currentTarget.firstChild! as HTMLDivElement
        progress.style.transition = boolean ? "none" : `all ${duration}ms linear`
        e.currentTarget.classList.toggle("playing")
      }}>
          <div className="progress"></div>
          <FontAwesomeIcon icon={faPlay} size="xs"/>
          <FontAwesomeIcon icon={faPause} size="xs"/>
          <p>Audio {id} - {Math.round(duration/1000)}s</p>
      </li>)
    }

    return JSX
  }

  return <ul className="record-list">
    <List/>
  </ul>
}