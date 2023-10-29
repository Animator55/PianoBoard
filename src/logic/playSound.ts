import S10 from '../assets/sounds/1-0.mp3'
import S11 from '../assets/sounds/1-1.mp3'
import S12 from '../assets/sounds/1-2.mp3'
import S13 from '../assets/sounds/1-3.mp3'
import S14 from '../assets/sounds/1-4.mp3'
import S15 from '../assets/sounds/1-5.mp3'
import S16 from '../assets/sounds/1-6.mp3'
import S17 from '../assets/sounds/1-7.mp3'
import S18 from '../assets/sounds/1-8.mp3'
import S19 from '../assets/sounds/1-9.mp3'
import S110 from '../assets/sounds/1-10.mp3'
import S111 from '../assets/sounds/1-11.mp3'
import S20 from '../assets/sounds/2-0.mp3'
import S21 from '../assets/sounds/2-1.mp3'
import S22 from '../assets/sounds/2-2.mp3'
import S23 from '../assets/sounds/2-3.mp3'
import S24 from '../assets/sounds/2-4.mp3'
import S25 from '../assets/sounds/2-5.mp3'
import S26 from '../assets/sounds/2-6.mp3'
import S27 from '../assets/sounds/2-7.mp3'
import S28 from '../assets/sounds/2-8.mp3'
import S29 from '../assets/sounds/2-9.mp3'
import S210 from '../assets/sounds/2-10.mp3'
import S211 from '../assets/sounds/2-11.mp3'
import S30 from '../assets/sounds/3-0.mp3'
import S31 from '../assets/sounds/3-1.mp3'
import S32 from '../assets/sounds/3-2.mp3'
import S33 from '../assets/sounds/3-3.mp3'
import S34 from '../assets/sounds/3-4.mp3'
import S35 from '../assets/sounds/3-5.mp3'
import S36 from '../assets/sounds/3-6.mp3'
import S37 from '../assets/sounds/3-7.mp3'
import S38 from '../assets/sounds/3-8.mp3'
import S39 from '../assets/sounds/3-9.mp3'
// import S310 from '../assets/sounds/3-10.mp3'
// import S311 from '../assets/sounds/3-11.mp3'

type Sounds = {
    [key: string] : string
}

export default function PlaySoundMp3 (octave: number, index: number, volume: number){
    let sounds: Sounds = {
        "S10": S10,
        "S11": S11,
        "S12": S12,
        "S13": S13,
        "S14": S14,
        "S15": S15,
        "S16": S16,
        "S17": S17,
        "S18": S18,
        "S19": S19,
        "S110": S110,
        "S111": S111,
        "S20": S20,
        "S21": S21,
        "S22": S22,
        "S23": S23,
        "S24": S24,
        "S25": S25,
        "S26": S26,
        "S27": S27,
        "S28": S28,
        "S29": S29,
        "S210": S210,
        "S211": S211,
        "S30": S30,
        "S31": S31,
        "S32": S32,
        "S33": S33,
        "S34": S34,
        "S35": S35,
        "S36": S36,
        "S37": S37,
        "S38": S38,
        "S39": S39,
    }
    // let rand = Math.floor(Math.random() * sounds.length)

    let key = "S" + octave + index
    let audio = new Audio(sounds[key])
    audio.volume = volume
    audio.play()
}