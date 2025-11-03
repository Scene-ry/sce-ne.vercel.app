import { IIDX_VERSION_20, IIDX_VERSION_26, IIDX_VERSION_32, IIDX_VERSION_INF } from '../shared/constants'
import BinFileItem from './BinFileItem'
import { stringToFixedLengthBuffer } from './StringUtil'

function numberToArrayBufferLE(value: number, byteLength: number): number[] {
  if (byteLength === 2) {
    const buffer = new ArrayBuffer(2)
    const view = new DataView(buffer)
    view.setUint16(0, value, true) // true = little-endian
    return Array.from(new Uint8Array(buffer))
  }
  if (byteLength === 4) {
    const buffer = new ArrayBuffer(4) // 4 bytes for a 32-bit integer
    const view = new DataView(buffer)
    view.setUint32(0, value, true) // true = little-endian
    return Array.from(new Uint8Array(buffer))
  }
  throw new Error(`Unsupported byteLength: ${byteLength}`)
}

function buildHeadBuffer(gameVersion: number, allocatedEntryCount: number, songCount: number): number[] {
  const result = [0x49, 0x49, 0x44, 0x58, gameVersion, 0, 0, 0]
  return gameVersion >= 32
    ? [...result, ...numberToArrayBufferLE(songCount, 4), ...numberToArrayBufferLE(allocatedEntryCount, 4)]
    : [...result, ...numberToArrayBufferLE(songCount, 2), ...numberToArrayBufferLE(allocatedEntryCount, 4), 0, 0]
}

function buildNewSongBuffer(
  gameVersion: number,
  positionAndLengths: Record<string, number>,
  item: BinFileItem
): number[] {
  const buffer: number[] = []

  // Title
  const titleBuffer = stringToFixedLengthBuffer(gameVersion, item.title, positionAndLengths['TITLE_MAX_LENGTH'])
  buffer.push(...titleBuffer)

  // ASCII Title
  const asciiTitleBuffer = stringToFixedLengthBuffer(
    gameVersion,
    item.asciiTitle,
    positionAndLengths['ASCII_TITLE_MAX_LENGTH'],
    true
  )
  buffer.push(...asciiTitleBuffer)

  // Genre
  const genreBuffer = stringToFixedLengthBuffer(gameVersion, item.genre, positionAndLengths['GENRE_MAX_LENGTH'])
  buffer.push(...genreBuffer)

  // Artist
  const artistBuffer = stringToFixedLengthBuffer(gameVersion, item.artist, positionAndLengths['ARTIST_MAX_LENGTH'])
  buffer.push(...artistBuffer)

  // License
  if (positionAndLengths['LICENSE_POS'] !== -1) {
    const licenseBuffer = stringToFixedLengthBuffer(
      gameVersion,
      item.license || '',
      positionAndLengths['LICENSE_MAX_LENGTH']
    )
    buffer.push(...licenseBuffer)
  }

  // Entry Texture Flags
  buffer.push(item.entryTextureFlags.title ? 1 : 0, 0, 0, 0)
  buffer.push(item.entryTextureFlags.artist ? 1 : 0, 0, 0, 0)
  buffer.push(item.entryTextureFlags.genre ? 1 : 0, 0, 0, 0)
  buffer.push(item.entryTextureFlags.load ? 1 : 0, 0, 0, 0)
  buffer.push(item.entryTextureFlags.list ? 1 : 0, 0, 0, 0)

  // TODO: Unknown01
  if (positionAndLengths['UNKNOWN_01_POS'] !== -1) {
    buffer.push(item.unknown01 || 0, 0, 0, 0)
  }

  // Entry Font
  buffer.push(item.entryFont, 0, 0, 0)

  // Version
  buffer.push(item.version, 0)

  // Other Folder, Bemani Folder, Splittable Diff
  buffer.push(item.otherFolder ? 1 : 0, 0)
  buffer.push(item.bemaniFolder ? 1 : 0, 0)
  if (
    positionAndLengths['BEGINNER_RECOMMEND_POS'] !== -1 &&
    positionAndLengths['IIDX_RECOMMEND_POS'] !== -1 &&
    positionAndLengths['BEMANI_SERIES_RECOMMEND_POS'] !== -1
  ) {
    buffer.push(item.beginnerRecommend ? 1 : 0, 0)
    buffer.push(item.iidxRecommend ? 1 : 0, 0)
    buffer.push(item.bemaniSeriesRecommend ? 1 : 0, 0)
  }
  buffer.push(item.splittableDiff ? 1 : 0, 0)
  if (gameVersion >= IIDX_VERSION_32) {
    buffer.push(0, 0)
  }

  // Difficulties
  if (gameVersion >= IIDX_VERSION_20 && gameVersion <= IIDX_VERSION_26) {
    buffer.push(item.difficulties.sp.normal)
    buffer.push(item.difficulties.sp.hyper)
    buffer.push(item.difficulties.sp.another)
    buffer.push(item.difficulties.dp.normal)
    buffer.push(item.difficulties.dp.hyper)
    buffer.push(item.difficulties.dp.another)
    buffer.push(item.difficulties.sp.beginner)
    buffer.push(item.difficulties.dp.beginner)
  } else {
    buffer.push(item.difficulties.sp.beginner)
    buffer.push(item.difficulties.sp.normal)
    buffer.push(item.difficulties.sp.hyper)
    buffer.push(item.difficulties.sp.another)
    buffer.push(item.difficulties.sp.leggendaria)
    buffer.push(item.difficulties.dp.beginner)
    buffer.push(item.difficulties.dp.normal)
    buffer.push(item.difficulties.dp.hyper)
    buffer.push(item.difficulties.dp.another)
    buffer.push(item.difficulties.dp.leggendaria)
  }

  // Unknown
  if (gameVersion >= IIDX_VERSION_32) {
    for (let i = buffer.length; i < positionAndLengths['ENTRY_ID_POS']; i++) {
      buffer.push(0)
    }
  } else {
    for (let i = buffer.length; i < positionAndLengths['ENTRY_ID_POS']; i++) {
      if (gameVersion >= IIDX_VERSION_20 && gameVersion <= IIDX_VERSION_26) buffer.push(0)
      else if (i === 0x130) buffer.push(1)
      else if (i === 0x134) buffer.push(2)
      else if (i === 0x1b0) buffer.push(3)
      else if (i === 0x1b4) buffer.push(4)
      else if (gameVersion == 80 && i === 0x1f0) buffer.push(3)
      else if (gameVersion == 80 && i === 0x1f4) buffer.push(4)
      else buffer.push(0)
    }
  }

  // Entry ID
  buffer.push(...numberToArrayBufferLE(item.entryId, 4))

  // Volume
  buffer.push(...numberToArrayBufferLE(item.volume, 2), 0, 0)

  // File Identifier
  if (gameVersion >= IIDX_VERSION_20 && gameVersion <= IIDX_VERSION_26) {
    buffer.push(item.fileIdentifiers.sp.normal.charCodeAt(0))
    buffer.push(item.fileIdentifiers.sp.hyper.charCodeAt(0))
    buffer.push(item.fileIdentifiers.sp.another.charCodeAt(0))
    buffer.push(item.fileIdentifiers.dp.normal.charCodeAt(0))
    buffer.push(item.fileIdentifiers.dp.hyper.charCodeAt(0))
    buffer.push(item.fileIdentifiers.dp.another.charCodeAt(0))
    buffer.push(item.fileIdentifiers.sp.beginner.charCodeAt(0))
    buffer.push(item.fileIdentifiers.dp.beginner.charCodeAt(0))
  } else {
    buffer.push(item.fileIdentifiers.sp.beginner.charCodeAt(0))
    buffer.push(item.fileIdentifiers.sp.normal.charCodeAt(0))
    buffer.push(item.fileIdentifiers.sp.hyper.charCodeAt(0))
    buffer.push(item.fileIdentifiers.sp.another.charCodeAt(0))
    buffer.push(item.fileIdentifiers.sp.leggendaria.charCodeAt(0))
    buffer.push(item.fileIdentifiers.dp.beginner.charCodeAt(0))
    buffer.push(item.fileIdentifiers.dp.normal.charCodeAt(0))
    buffer.push(item.fileIdentifiers.dp.hyper.charCodeAt(0))
    buffer.push(item.fileIdentifiers.dp.another.charCodeAt(0))
    buffer.push(item.fileIdentifiers.dp.leggendaria.charCodeAt(0))
  }

  // BGA Delay
  const bgaDelayAsBin = item.bgaDelay < 0 ? item.bgaDelay + 0x10000 : item.bgaDelay
  const bgaDelayBuffer =
    gameVersion == IIDX_VERSION_INF ? numberToArrayBufferLE(bgaDelayAsBin, 4) : numberToArrayBufferLE(bgaDelayAsBin, 2)
  buffer.push(...bgaDelayBuffer)
  if (gameVersion <= IIDX_VERSION_26) {
    buffer.push(0, 0)
  }

  // BGA Filename
  const bgaFilenameBuffer = stringToFixedLengthBuffer(
    gameVersion,
    item.bgaFileName,
    positionAndLengths['BGA_FILENAME_MAX_LENGTH'],
    true
  )
  buffer.push(...bgaFilenameBuffer)

  // The rest
  for (let i = buffer.length; i < positionAndLengths['SINGLE_SONG_LENGTH']; i++) {
    if (i === positionAndLengths['AFP_FLAG_POS']) buffer.push(item.afpFlag)
    else if (item.restValidBuffer[i.toString()]) buffer.push(item.restValidBuffer[i.toString()])
    else buffer.push(0)
  }

  return buffer
}

export default function buildBinFileContent(
  gameVersion: number,
  allocatedEntryCount: number,
  positionAndLengths: Record<string, number>,
  items: BinFileItem[]
): ArrayBuffer {
  const headBuffer = buildHeadBuffer(gameVersion, allocatedEntryCount, items.length)

  const entryAllocationBuffer = []
  const entryDetailsBuffer = []

  const itemMap = Object.fromEntries(items.map((item) => [item.entryId.toString(), item]))
  const songIdList = Object.keys(itemMap)
    .map(Number)
    .sort(function (a, b) {
      return a - b
    })
  for (let i = 0, allocateIndex = 0; i < allocatedEntryCount; i++) {
    if (songIdList.indexOf(i) >= 0) {
      entryAllocationBuffer.push(...numberToArrayBufferLE(allocateIndex, gameVersion >= IIDX_VERSION_32 ? 4 : 2))
      entryDetailsBuffer.push(...buildNewSongBuffer(gameVersion, positionAndLengths, itemMap[i.toString()]))
      allocateIndex++
    } else {
      if (i >= allocatedEntryCount - 1000)
        entryAllocationBuffer.push(...numberToArrayBufferLE(0, gameVersion >= 32 ? 4 : 2))
      else
        entryAllocationBuffer.push(
          ...(gameVersion >= IIDX_VERSION_32 ? numberToArrayBufferLE(0xffffffff, 4) : numberToArrayBufferLE(0xffff, 2))
        )
    }
  }

  return new Uint8Array([...headBuffer, ...entryAllocationBuffer, ...entryDetailsBuffer]).buffer
}
