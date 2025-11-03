import { IIDX_VERSION_32 } from '../shared/constants'
import BinFileItem from './BinFileItem'
import { bufferToString } from './StringUtil'
import { getDifficulties, getFileIdentifiers } from './versions'

const HEAD_LENGTH = 0x10

// Simulated parsing of bin file - extracts sample items
export default function parseBinFile(
  gameVersion: number,
  buffer: ArrayBuffer,
  allocatedEntryCount: number,
  positionAndLengths: Record<string, number>
): BinFileItem[] {
  const view = new DataView(buffer)
  const parsedItems: BinFileItem[] = []

  const {
    SINGLE_SONG_LENGTH,
    TITLE_MAX_LENGTH,
    TITLE_POS,
    ASCII_TITLE_MAX_LENGTH,
    ASCII_TITLE_POS,
    GENRE_MAX_LENGTH,
    GENRE_POS,
    ARTIST_MAX_LENGTH,
    ARTIST_POS,
    LICENSE_MAX_LENGTH,
    LICENSE_POS,
    ENTRY_TEXTURE_FLAGS_TITLE_POS,
    ENTRY_TEXTURE_FLAGS_ARTIST_POS,
    ENTRY_TEXTURE_FLAGS_GENRE_POS,
    ENTRY_TEXTURE_FLAGS_LOAD_POS,
    ENTRY_TEXTURE_FLAGS_LIST_POS,
    UNKNOWN_01_POS,
    ENTRY_FONT_POS,
    VERSION_POS,
    OTHER_FOLDER_POS,
    BEMANI_FOLDER_POS,
    BEGINNER_RECOMMEND_POS,
    IIDX_RECOMMEND_POS,
    BEMANI_SERIES_RECOMMEND_POS,
    SPLITTABLE_DIFF_POS,
    DIFFICULTIES_POS,
    ENTRY_ID_POS,
    VOLUME_POS,
    FILE_IDENTIFIER_POS,
    BGA_DELAY_POS,
    BGA_FILENAME_POS,
    BGA_FILENAME_MAX_LENGTH,
    AFP_FLAG_POS,
  } = positionAndLengths

  const startOffset = gameVersion >= IIDX_VERSION_32 ? HEAD_LENGTH + allocatedEntryCount * 4 : HEAD_LENGTH + allocatedEntryCount * 2

  for (let cursor = startOffset; cursor < buffer.byteLength; cursor += SINGLE_SONG_LENGTH) {
    const titleBuffer = new Uint8Array(buffer, cursor + TITLE_POS, TITLE_MAX_LENGTH)
    const title = bufferToString(gameVersion, titleBuffer)

    const asciiTitleBuffer = new Uint8Array(buffer, cursor + ASCII_TITLE_POS, ASCII_TITLE_MAX_LENGTH)
    const asciiTitle = bufferToString(gameVersion, asciiTitleBuffer, true)

    const genreBuffer = new Uint8Array(buffer, cursor + GENRE_POS, GENRE_MAX_LENGTH)
    const genre = bufferToString(gameVersion, genreBuffer)

    const artistBuffer = new Uint8Array(buffer, cursor + ARTIST_POS, ARTIST_MAX_LENGTH)
    const artist = bufferToString(gameVersion, artistBuffer)

    let license = null
    if (LICENSE_POS !== -1) {
      const licenseBuffer = new Uint8Array(buffer, cursor + LICENSE_POS, LICENSE_MAX_LENGTH)
      license = bufferToString(gameVersion, licenseBuffer)
    }

    const entryTextureFlags = {
      title: !!view.getUint8(cursor + ENTRY_TEXTURE_FLAGS_TITLE_POS),
      artist: !!view.getUint8(cursor + ENTRY_TEXTURE_FLAGS_ARTIST_POS),
      genre: !!view.getUint8(cursor + ENTRY_TEXTURE_FLAGS_GENRE_POS),
      load: !!view.getUint8(cursor + ENTRY_TEXTURE_FLAGS_LOAD_POS),
      list: !!view.getUint8(cursor + ENTRY_TEXTURE_FLAGS_LIST_POS),
    }

    const unknown01 = UNKNOWN_01_POS !== -1 ? view.getUint8(cursor + UNKNOWN_01_POS) : null
    const entryFont = view.getUint8(cursor + ENTRY_FONT_POS)
    const version = view.getUint8(cursor + VERSION_POS)
    const otherFolder = !!view.getUint8(cursor + OTHER_FOLDER_POS)
    const bemaniFolder = !!view.getUint8(cursor + BEMANI_FOLDER_POS)
    const splittableDiff = !!view.getUint8(cursor + SPLITTABLE_DIFF_POS)

    const beginnerRecommend = BEGINNER_RECOMMEND_POS !== -1 ? !!view.getUint8(cursor + BEGINNER_RECOMMEND_POS) : null
    const iidxRecommend = IIDX_RECOMMEND_POS !== -1 ? !!view.getUint8(cursor + IIDX_RECOMMEND_POS) : null
    const bemaniSeriesRecommend =
      BEMANI_SERIES_RECOMMEND_POS !== -1 ? !!view.getUint8(cursor + BEMANI_SERIES_RECOMMEND_POS) : null

    const difficulties = getDifficulties(gameVersion, view, cursor, DIFFICULTIES_POS)
    const entryId = view.getUint32(cursor + ENTRY_ID_POS, true)
    const volume = view.getUint16(cursor + VOLUME_POS, true)

    const fileIdentifiers = getFileIdentifiers(gameVersion, view, cursor, FILE_IDENTIFIER_POS)

    const bgaDelayRaw = view.getInt16(cursor + BGA_DELAY_POS, true)
    const bgaDelay = bgaDelayRaw < 0x8000 ? bgaDelayRaw : bgaDelayRaw - 0x10000
    const bgaFileNameBuffer = new Uint8Array(buffer, cursor + BGA_FILENAME_POS, BGA_FILENAME_MAX_LENGTH)
    const bgaFileName = bufferToString(gameVersion, bgaFileNameBuffer, true)

    const afpFlag = view.getUint8(cursor + AFP_FLAG_POS)

    // Capture rest of valid buffer as hex values
    const restValidBuffer: Record<string, number> = {}
    for (let i = cursor + AFP_FLAG_POS + 1; i < cursor + SINGLE_SONG_LENGTH; i++) {
      if (view.getUint8(i) === 0x00) continue
      restValidBuffer[(i - cursor).toString()] = view.getUint8(i)
    }

    parsedItems.push({
      title,
      asciiTitle,
      genre,
      artist,
      license,
      entryTextureFlags,
      unknown01,
      entryFont,
      version,
      otherFolder,
      beginnerRecommend,
      iidxRecommend,
      bemaniSeriesRecommend,
      bemaniFolder,
      splittableDiff,
      difficulties,
      entryId,
      volume,
      fileIdentifiers,
      bgaDelay,
      bgaFileName,
      afpFlag,
      restValidBuffer,
    })
  }

  console.log(Object.fromEntries(parsedItems.map((item) => [item.entryId.toString(), item])))
  return parsedItems
}
