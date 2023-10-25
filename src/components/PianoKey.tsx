type Props = {
    octave: number
    index: number
    record: Function
    newBind: Function
    bind: string
    editing: boolean
}

const MelodicalScale = ["Do", "Do#", "Re", "Re#", "Mi", "Fa","Fa#", "Sol", "Sol#", "La", "La#", "Si"]

export default function PianoKey({octave, index, record, editing, bind, newBind}: Props) {

    const PlaySound = (e: React.MouseEvent | React.KeyboardEvent)=>{
        console.log("played " + octave + ", " + MelodicalScale[index], e.timeStamp)
        record(e.timeStamp)
    }

    const EditKey = (e: React.MouseEvent)=>{
        const detectKey = (e2: KeyboardEvent)=>{
            if(e2.key === undefined) return
            let compiledIndex = octave +"."+index
            newBind(e2.key.toLowerCase(), compiledIndex)
        }
        e.currentTarget.addEventListener("keydown", (e)=>{detectKey(e as KeyboardEvent)}, {once: true})
    }

    const checkBlack = (value: number)=>{
        let result = ""  
        result = MelodicalScale[value].slice(-1) === "#" ? "key-black" : "key-white"
        result += editing ? " disabled" : ""
        return result
    }

    return <button
        className={checkBlack(index)}
        onClick={editing ? EditKey : PlaySound }
    ><div>{MelodicalScale[index]}<br/>{bind}</div></button>
}