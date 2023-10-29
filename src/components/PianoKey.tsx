import PlaySoundMp3 from "../logic/playSound"
import { configuration } from "../vite-env"

type Props = {
    octave: number
    index: number
    record: Function
    newBind: Function
    configuration: configuration
    editing: boolean
}

const MelodicalScale = ["Do", "Do#", "Re", "Re#", "Mi", "Fa","Fa#", "Sol", "Sol#", "La", "La#", "Si"]

let preventConstant = false


export default function PianoKey({octave, index, record, editing, configuration, newBind}: Props) {

    const PlaySound = (e: React.MouseEvent | React.KeyboardEvent)=>{
        if(preventConstant) return
        console.log("played " + octave + ", " + MelodicalScale[index], e.timeStamp)
        PlaySoundMp3(octave, index, configuration.volume)
        record(e.timeStamp)
    }

    const EditKey = (e: React.MouseEvent)=>{
        const detectKey = (e2: KeyboardEvent)=>{
            if(e2.key === undefined) return
            let compiledIndex = octave +"."+index
            newBind(e2.key.toLowerCase(), compiledIndex)
        }
        e.currentTarget.classList.add("editing")
        e.currentTarget.addEventListener("keydown", (e)=>{detectKey(e as KeyboardEvent)}, {once: true})
    }

    const checkBlack = (value: number)=>{
        let result = ""  
        result = MelodicalScale[value].slice(-1) === "#" ? "key-black" : "key-white"
        result += editing ? " disabled-key" : ""
        return result
    }

    let key = octave + "." + index
    let bind = configuration.keyBinds[key] === undefined ? "" : configuration.keyBinds[key]

    let Notes = configuration.viewNotes
    let Binds = configuration.viewBinds

    return <button
        className={checkBlack(index)}
        onClick={editing ? EditKey : PlaySound }
        onBlur={(e)=>{if(editing) e.currentTarget.classList.remove("editing")}}
    ><div>{Notes && MelodicalScale[index]}<br/>{Binds && bind}</div></button>
}