/// <reference types="vite/client" />

export type RecordedKey = {
    octave: number | undefined
    key: number| undefined
    timestamp: number
    hold?: Array
    initialstamp?: number
  }


export type CachedRecords = {
  [key: string]: RecordedKey[]
}

export type configuration = {
  keyBinds: {
    [key: string]: string
  }
  volume: number
  viewBinds: boolean
  viewNotes: boolean
}