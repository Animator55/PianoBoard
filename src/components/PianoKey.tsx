import PlaySoundMp3 from "../logic/playSound"
import { configuration } from "../vite-env"

type Props = {
    octave: number
    index: number
    configuration: configuration
}

const MelodicalScale = ["Do", "Do#", "Re", "Re#", "Mi", "Fa","Fa#", "Sol", "Sol#", "La", "La#", "Si"]

let preventConstant = false


export default function PianoKey({octave, index, 
    configuration, 
}: Props) {

    const PlaySound = ()=>{
        if(preventConstant) return
        PlaySoundMp3(octave, index, configuration.volume)
    }

    const checkBlack = (value: number)=>{
        let result = ""  
        result = MelodicalScale[value].slice(-1) === "#" ? "key-black" : "key-white"
        return result
    }

    // let key = octave + "." + index
    // let bind = configuration.keyBinds[key] === undefined ? "" : configuration.keyBinds[key]

    let Notes = configuration.viewNotes
    // let Binds = ""

    return <button
        className={checkBlack(index)}
        onTouchStart={PlaySound}
    ><div>{Notes && MelodicalScale[index]}<br/>{/*Binds && bind*/}</div></button>
}