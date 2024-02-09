import { faVolumeHigh, faVolumeLow, faVolumeOff } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

type Props = {
    volume: number
    changeVolume: Function
}

export default function VolumeButton({volume,changeVolume}: Props) {
    const DragVolume = React.useRef<HTMLDivElement | null>(null)
    const drag= (e: React.TouchEvent)=>{
        if(DragVolume.current === null)return

        let initialY = e.touches[0].clientY

        const Move = (e2: TouchEvent)=>{
            if(DragVolume.current === null)return
            let actualY = e2.touches[0].clientY
            let bool = actualY - initialY 

            initialY = actualY
            let result = parseInt(DragVolume.current.style.top) + bool
            DragVolume.current.style.top = (result < 0 ? 0 : result > 90 ? 90 : result) + "%"
        }

        const Leave = ()=>{
            document.removeEventListener("touchmove", Move)
            if(DragVolume.current === null)return
            changeVolume(parseInt(DragVolume.current.style.top)/100)
        }
        document.addEventListener("touchmove", Move)
        document.addEventListener("touchend", Leave, {once: true})
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
            <div className='drag' ref={DragVolume} style={{top: volume*100 + "%"}} onTouchStart={drag}></div>
            </div>
        </section>
    </div>
}