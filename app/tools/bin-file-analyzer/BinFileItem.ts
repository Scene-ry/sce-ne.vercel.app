export default interface BinFileItem {
  title: string
  asciiTitle: string
  genre: string
  artist: string
  license: string | null
  entryTextureFlags: {
    title: boolean
    artist: boolean
    genre: boolean
    load: boolean
    list: boolean
  }
  unknown01: number | null
  entryFont: number
  version: number
  otherFolder: boolean
  beginnerRecommend: boolean | null
  iidxRecommend: boolean | null
  bemaniSeriesRecommend: boolean | null
  bemaniFolder: boolean
  splittableDiff: boolean
  difficulties: {
    sp: {
      beginner: number
      normal: number
      hyper: number
      another: number
      leggendaria: number
    }
    dp: {
      beginner: number
      normal: number
      hyper: number
      another: number
      leggendaria: number
    }
  }
  entryId: number
  volume: number
  fileIdentifiers: {
    sp: {
      beginner: string
      normal: string
      hyper: string
      another: string
      leggendaria: string
    }
    dp: {
      beginner: string
      normal: string
      hyper: string
      another: string
      leggendaria: string
    }
  }
  bgaDelay: number
  bgaFileName: string
  afpFlag: number
  restValidBuffer: Record<string, number>
}

export function createEmptyBinFileItem(): BinFileItem {
  return {
    title: '',
    asciiTitle: '',
    genre: '',
    artist: '',
    license: null,
    entryTextureFlags: {
      title: false,
      artist: false,
      genre: false,
      load: false,
      list: false,
    },
    unknown01: null,
    entryFont: 0,
    version: 0,
    otherFolder: false,
    beginnerRecommend: null,
    iidxRecommend: null,
    bemaniSeriesRecommend: null,
    bemaniFolder: false,
    splittableDiff: false,
    difficulties: {
      sp: {
        beginner: 0,
        normal: 0,
        hyper: 0,
        another: 0,
        leggendaria: 0,
      },
      dp: {
        beginner: 0,
        normal: 0,
        hyper: 0,
        another: 0,
        leggendaria: 0,
      },
    },
    entryId: 0,
    volume: 0,
    fileIdentifiers: {
      sp: {
        beginner: '0',
        normal: '0',
        hyper: '0',
        another: '0',
        leggendaria: '0',
      },
      dp: {
        beginner: '0',
        normal: '0',
        hyper: '0',
        another: '0',
        leggendaria: '0',
      },
    },
    bgaDelay: 0,
    bgaFileName: '',
    afpFlag: 0,
    restValidBuffer: {},
  }
}
