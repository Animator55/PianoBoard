type Props = {
    octave: number
    index: number
    record: Function
}

const MelodicalScale = ["Do", "Do#", "Re", "Re#", "Mi", "Fa","Fa#", "Sol", "Sol#", "La", "La#", "Si"]

export default function PianoKey({octave, index, record}: Props) {

    const PlaySound = (e: React.MouseEvent)=>{
        console.log("played " + octave + ", " + MelodicalScale[index], e.timeStamp)
        record(e.timeStamp)
    }

    const checkBlack = (value: number)=>{
        return MelodicalScale[value].slice(-1) === "#" ? "key-black" : "key-white"
    }

    return <button
        className={checkBlack(index)}
        onClick={PlaySound}
    ><div>{MelodicalScale[index]}</div></button>
}