import iconv from 'iconv-lite'

import { IIDX_VERSION_32 } from '../shared/constants'

export function bufferToString(gameVersion: number, buffer: Uint8Array, isAscii = false): string {
  if (isAscii) {
    const asciiSlice = buffer.slice(0, buffer.indexOf(0) < 0 ? undefined : buffer.indexOf(0))
    return String.fromCharCode(...asciiSlice)
  }
  if (gameVersion >= IIDX_VERSION_32) {
    return bufferToUnicodeString(buffer)
  }
  return iconv.decode(buffer, 'shift_jis').replace(/\0.*$/g, '')
}

export function stringToFixedLengthBuffer(gameVersion: number, str: string, length: number, isAscii = false): number[] {
  const buffer = isAscii
    ? str.split('').map((i) => i.charCodeAt(0))
    : gameVersion >= IIDX_VERSION_32
    ? unicodeToLittleEndianBuffer(str)
    : Array.from(iconv.encode(str, 'shift_jis'))
  if (buffer.length > length) {
    return buffer.slice(0, length)
  }
  while (buffer.length < length) {
    buffer.push(0)
  }
  return buffer
}

export function decodeHtmlEntity(entity: string) {
  const txt = document.createElement('textarea')
  txt.innerHTML = entity
  return txt.value
}

function unicodeToLittleEndianBuffer(unicodeStr: string) {
  const buffer = []

  for (let i = 0; i < unicodeStr.length; i++) {
    const codePoint = unicodeStr.charCodeAt(i)
    const lowByte = codePoint & 0xff
    const highByte = (codePoint >> 8) & 0xff

    buffer.push(lowByte, highByte)
  }

  return buffer
}

function bufferToUnicodeString(buffer: Uint8Array) {
  let unicodeStr = ''

  for (let i = 0; i < buffer.length; i += 2) {
    const lowByte = buffer[i]
    const highByte = buffer[i + 1]

    // Break if both bytes are zero
    if (lowByte === 0 && highByte === 0) {
      break
    }

    const codePoint = (highByte << 8) | lowByte
    unicodeStr += String.fromCharCode(codePoint)
  }

  return unicodeStr
}
