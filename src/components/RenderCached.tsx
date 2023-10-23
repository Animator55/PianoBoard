import { RecordedKey } from "../vite-env"

type Props = {
    CachedRecords: Array<RecordedKey[]>
}

export default function RenderCached({CachedRecords}: Props) {
  return <ul>
    {CachedRecords.map((li, i)=>{
        let hold : number = li[li.length-1].hold === undefined ? 0 : li[li.length-1].hold!
        let duration = li[li.length-1].timestamp - li[0].timestamp + hold
        return <li key={Math.random()} onClick={()=>{
            console.log(li)
        }}>
            <p>Audio {i} - {Math.round(duration/1000)}s</p>
        </li>
    })}
  </ul>
}