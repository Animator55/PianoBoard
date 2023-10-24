import { RecordedKey } from "../vite-env"

type Props = {
    CachedRecords: Array<RecordedKey[]>
    playRecord: Function
}

export default function RenderCached({CachedRecords, playRecord}: Props) {
  return <ul>
    {CachedRecords.map((li, i)=>{
        let hold : number = li[li.length-1].hold === undefined ? 0 : li[li.length-1].hold!
        let duration = li[li.length-1].timestamp + hold
        return <li key={Math.random()} onClick={()=>{
            console.log(li)
            console.log(duration)
            playRecord(i)
        }}>
            <p>Audio {i} - {Math.round(duration/1000)}s</p>
        </li>
    })}
  </ul>
}