import { faVolumeHigh, faVolumeLow, faVolumeOff } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

type Props = {
    volume: number
    changeVolume: Function
}

export default function VolumeButton({volume,changeVolume}: Props) {
    const DragVolume = React.useRef<HTMLDivElement | null>(null)
    const drag= ()=>{
        if(DragVolume.current === null)return

        const Move = (e2: Event)=>{
            if(DragVolume.current === null)return
            let event = e2 as MouseEvent
            let result = parseInt(DragVolume.current.style.top) + event.movementY
            DragVolume.current.style.top = (result < 0 ? 0 : result > 90 ? 90 : result) + "%"
        }

        const Leave = ()=>{
            document.removeEventListener("mousemove", Move)
            if(DragVolume.current === null)return
            changeVolume(parseInt(DragVolume.current.style.top)/100)
        }
        document.addEventListener("mousemove", Move)
        document.addEventListener("mouseup", Leave, {once: true})
    }   
  
    const selectIcon = ()=>{
        let icon = faVolumeOff
        if(volume < 0.2) icon = faVolumeOff
        else if(volume < 0.5) icon = faVolumeLow
        else if(volume > 0.5) icon = faVolumeHigh

        return icon
    }
  
    return <div className='volume'>
        <button >
        <FontAwesomeIcon icon={selectIcon()}/>
        </button>
        <section className='volume-pop'>
            <div className='bar'>
            <div className='drag' ref={DragVolume} style={{top: volume*100 + "%"}} onMouseDown={drag}></div>
            </div>
        </section>
    </div>
}