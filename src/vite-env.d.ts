/// <reference types="vite/client" />

export type RecordedKey = {
    octave: number | undefined
    key: number| undefined
    timestamp: number
    hold?: number
  }