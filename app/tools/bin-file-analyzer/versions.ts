export function getRelativePosAndLen(version: number) {
  if (version == 20 || version == 21) {
    return {
      SINGLE_SONG_LENGTH: 0x320,
      TITLE_MAX_LENGTH: 0x40,
      TITLE_POS: 0,
      ASCII_TITLE_MAX_LENGTH: 0x40,
      ASCII_TITLE_POS: 0x40,
      GENRE_MAX_LENGTH: 0x40,
      GENRE_POS: 0x80,
      ARTIST_MAX_LENGTH: 0x40,
      ARTIST_POS: 0xc0,
      LICENSE_MAX_LENGTH: -1,
      LICENSE_POS: -1,

      ENTRY_TEXTURE_FLAGS_TITLE_POS: 0x100,
      ENTRY_TEXTURE_FLAGS_ARTIST_POS: 0x104,
      ENTRY_TEXTURE_FLAGS_GENRE_POS: 0x108,
      ENTRY_TEXTURE_FLAGS_LOAD_POS: 0x10c,
      ENTRY_TEXTURE_FLAGS_LIST_POS: 0x110,
      UNKNOWN_01_POS: -1,
      ENTRY_FONT_POS: 0x114,
      VERSION_POS: 0x118,
      OTHER_FOLDER_POS: 0x11a,
      BEMANI_FOLDER_POS: 0x11c,
      BEGINNER_RECOMMEND_POS: -1,
      IIDX_RECOMMEND_POS: -1,
      BEMANI_SERIES_RECOMMEND_POS: -1,
      SPLITTABLE_DIFF_POS: 0x11e,
      DIFFICULTIES_POS: 0x120,
      ENTRY_ID_POS: 0x1c8,

      VOLUME_POS: 0x1cc,
      FILE_IDENTIFIER_POS: 0x1d0,
      BGA_DELAY_POS: 0x1d8,
      BGA_FILENAME_POS: 0x1dc,
      BGA_FILENAME_MAX_LENGTH: 0x13, //
      AFP_FLAG_POS: 0x1fc, //
    }
  }
  if (version >= 22 && version <= 25) {
    return {
      SINGLE_SONG_LENGTH: 0x340,
      TITLE_MAX_LENGTH: 0x40,
      TITLE_POS: 0,
      ASCII_TITLE_MAX_LENGTH: 0x40,
      ASCII_TITLE_POS: 0x40,
      GENRE_MAX_LENGTH: 0x40,
      GENRE_POS: 0x80,
      ARTIST_MAX_LENGTH: 0x40,
      ARTIST_POS: 0xc0,
      LICENSE_MAX_LENGTH: -1,
      LICENSE_POS: -1,

      ENTRY_TEXTURE_FLAGS_TITLE_POS: 0x100,
      ENTRY_TEXTURE_FLAGS_ARTIST_POS: 0x104,
      ENTRY_TEXTURE_FLAGS_GENRE_POS: 0x108,
      ENTRY_TEXTURE_FLAGS_LOAD_POS: 0x10c,
      ENTRY_TEXTURE_FLAGS_LIST_POS: 0x110,
      UNKNOWN_01_POS: -1,
      ENTRY_FONT_POS: 0x114,
      VERSION_POS: 0x118,
      OTHER_FOLDER_POS: 0x11a,
      BEMANI_FOLDER_POS: 0x11c,
      BEGINNER_RECOMMEND_POS: -1,
      IIDX_RECOMMEND_POS: -1,
      BEMANI_SERIES_RECOMMEND_POS: -1,
      SPLITTABLE_DIFF_POS: 0x11e,
      DIFFICULTIES_POS: 0x120,
      ENTRY_ID_POS: 0x1c8,

      VOLUME_POS: 0x1cc,
      FILE_IDENTIFIER_POS: 0x1d0,
      BGA_DELAY_POS: 0x1d8,
      BGA_FILENAME_POS: 0x1dc,
      BGA_FILENAME_MAX_LENGTH: 0x13, //
      AFP_FLAG_POS: 0x1fc, //
    }
  }
  if (version == 26) {
    return {
      SINGLE_SONG_LENGTH: 0x344,
      TITLE_MAX_LENGTH: 0x40,
      TITLE_POS: 0,
      ASCII_TITLE_MAX_LENGTH: 0x40,
      ASCII_TITLE_POS: 0x40,
      GENRE_MAX_LENGTH: 0x40,
      GENRE_POS: 0x80,
      ARTIST_MAX_LENGTH: 0x40,
      ARTIST_POS: 0xc0,
      LICENSE_MAX_LENGTH: -1,
      LICENSE_POS: -1,

      ENTRY_TEXTURE_FLAGS_TITLE_POS: 0x100,
      ENTRY_TEXTURE_FLAGS_ARTIST_POS: 0x104,
      ENTRY_TEXTURE_FLAGS_GENRE_POS: 0x108,
      ENTRY_TEXTURE_FLAGS_LOAD_POS: 0x10c,
      ENTRY_TEXTURE_FLAGS_LIST_POS: 0x110,
      UNKNOWN_01_POS: -1,
      ENTRY_FONT_POS: 0x114,
      VERSION_POS: 0x118,
      OTHER_FOLDER_POS: 0x11a,
      BEMANI_FOLDER_POS: 0x11c,
      BEGINNER_RECOMMEND_POS: -1,
      IIDX_RECOMMEND_POS: -1,
      BEMANI_SERIES_RECOMMEND_POS: -1,
      SPLITTABLE_DIFF_POS: 0x11e,
      DIFFICULTIES_POS: 0x120,
      ENTRY_ID_POS: 0x1c8,

      VOLUME_POS: 0x1cc,
      FILE_IDENTIFIER_POS: 0x1d0,
      BGA_DELAY_POS: 0x1d8,
      BGA_FILENAME_POS: 0x1dc,
      BGA_FILENAME_MAX_LENGTH: 0x13, //
      AFP_FLAG_POS: 0x1fc, //
    }
  }
  if (version == 80) {
    return {
      SINGLE_SONG_LENGTH: 0x3f0,
      TITLE_MAX_LENGTH: 0x40,
      TITLE_POS: 0,
      ASCII_TITLE_MAX_LENGTH: 0x40,
      ASCII_TITLE_POS: 0x40,
      GENRE_MAX_LENGTH: 0x40,
      GENRE_POS: 0x80,
      ARTIST_MAX_LENGTH: 0x40,
      ARTIST_POS: 0xc0,
      LICENSE_MAX_LENGTH: -1,
      LICENSE_POS: -1,

      ENTRY_TEXTURE_FLAGS_TITLE_POS: 0x100,
      ENTRY_TEXTURE_FLAGS_ARTIST_POS: 0x104,
      ENTRY_TEXTURE_FLAGS_GENRE_POS: 0x108,
      ENTRY_TEXTURE_FLAGS_LOAD_POS: 0x10c,
      ENTRY_TEXTURE_FLAGS_LIST_POS: 0x110,
      UNKNOWN_01_POS: -1,
      ENTRY_FONT_POS: 0x114,
      VERSION_POS: 0x118,
      OTHER_FOLDER_POS: 0x11a,
      BEMANI_FOLDER_POS: 0x11c,
      BEGINNER_RECOMMEND_POS: -1,
      IIDX_RECOMMEND_POS: -1,
      BEMANI_SERIES_RECOMMEND_POS: -1,
      SPLITTABLE_DIFF_POS: 0x11e,
      DIFFICULTIES_POS: 0x120,

      // unknown buffers

      ENTRY_ID_POS: 0x270,
      VOLUME_POS: 0x274,
      FILE_IDENTIFIER_POS: 0x278,
      BGA_DELAY_POS: 0x282,
      BGA_FILENAME_POS: 0x286,
      BGA_FILENAME_MAX_LENGTH: 0x13, //
      AFP_FLAG_POS: 0x2a6, //
    }
  }
  if (version >= 27 && version <= 31) {
    return {
      SINGLE_SONG_LENGTH: 0x52c,
      TITLE_MAX_LENGTH: 0x40,
      TITLE_POS: 0,
      ASCII_TITLE_MAX_LENGTH: 0x40,
      ASCII_TITLE_POS: 0x40,
      GENRE_MAX_LENGTH: 0x40,
      GENRE_POS: 0x80,
      ARTIST_MAX_LENGTH: 0x40,
      ARTIST_POS: 0xc0,
      LICENSE_MAX_LENGTH: -1,
      LICENSE_POS: -1,
      ENTRY_TEXTURE_FLAGS_TITLE_POS: 0x100,
      ENTRY_TEXTURE_FLAGS_ARTIST_POS: 0x104,
      ENTRY_TEXTURE_FLAGS_GENRE_POS: 0x108,
      ENTRY_TEXTURE_FLAGS_LOAD_POS: 0x10c,
      ENTRY_TEXTURE_FLAGS_LIST_POS: 0x110,
      UNKNOWN_01_POS: -1,
      ENTRY_FONT_POS: 0x114,
      VERSION_POS: 0x118,
      OTHER_FOLDER_POS: 0x11a,
      BEMANI_FOLDER_POS: 0x11c,
      BEGINNER_RECOMMEND_POS: -1,
      IIDX_RECOMMEND_POS: -1,
      BEMANI_SERIES_RECOMMEND_POS: -1,
      SPLITTABLE_DIFF_POS: 0x11e,
      DIFFICULTIES_POS: 0x120,
      ENTRY_ID_POS: 0x3b0,
      VOLUME_POS: 0x3b4,
      FILE_IDENTIFIER_POS: 0x3b8,
      BGA_DELAY_POS: 0x3c2,
      BGA_FILENAME_POS: 0x3c4,
      BGA_FILENAME_MAX_LENGTH: 0x13,
      AFP_FLAG_POS: 0x3e4,
    }
  }
  if (version >= 32) {
    return {
      SINGLE_SONG_LENGTH: 0x7f8,
      TITLE_MAX_LENGTH: 0x100,
      TITLE_POS: 0,
      ASCII_TITLE_MAX_LENGTH: 0x40,
      ASCII_TITLE_POS: 0x100,
      GENRE_MAX_LENGTH: 0x80,
      GENRE_POS: 0x140,
      ARTIST_MAX_LENGTH: 0x100,
      ARTIST_POS: 0x1c0,
      LICENSE_MAX_LENGTH: 0x100,
      LICENSE_POS: 0x2c0,
      ENTRY_TEXTURE_FLAGS_TITLE_POS: 0x3c0,
      ENTRY_TEXTURE_FLAGS_ARTIST_POS: 0x3c4,
      ENTRY_TEXTURE_FLAGS_GENRE_POS: 0x3c8,
      ENTRY_TEXTURE_FLAGS_LOAD_POS: 0x3cc,
      ENTRY_TEXTURE_FLAGS_LIST_POS: 0x3d0,
      UNKNOWN_01_POS: 0x3d4, // ENTRY_TEXTURE_FLAGS_LICENSE_POS?
      ENTRY_FONT_POS: 0x3d8,
      VERSION_POS: 0x3dc,
      OTHER_FOLDER_POS: 0x3de,
      BEMANI_FOLDER_POS: 0x3e0, // Deprecated?
      BEGINNER_RECOMMEND_POS: 0x3e2,
      IIDX_RECOMMEND_POS: 0x3e4,
      BEMANI_SERIES_RECOMMEND_POS: 0x3e6,
      SPLITTABLE_DIFF_POS: 0x3e8,
      DIFFICULTIES_POS: 0x3ec,
      ENTRY_ID_POS: 0x67c,
      VOLUME_POS: 0x680,
      FILE_IDENTIFIER_POS: 0x684,
      BGA_DELAY_POS: 0x68e,
      BGA_FILENAME_POS: 0x690,
      BGA_FILENAME_MAX_LENGTH: 0x13,
      AFP_FLAG_POS: 0x6b0,
    }
  }
  throw new Error('Version not supported!')
}

export function getDifficulties(
  version: number,
  view: DataView<ArrayBuffer>,
  cursor: number,
  DIFFICULTIES_POS: number
) {
  if (version <= 26) {
    return {
      sp: {
        beginner: view.getUint8(cursor + DIFFICULTIES_POS + 6),
        normal: view.getUint8(cursor + DIFFICULTIES_POS + 0),
        hyper: view.getUint8(cursor + DIFFICULTIES_POS + 1),
        another: view.getUint8(cursor + DIFFICULTIES_POS + 2),
        leggendaria: 0,
      },
      dp: {
        beginner: 0,
        normal: view.getUint8(cursor + DIFFICULTIES_POS + 3),
        hyper: view.getUint8(cursor + DIFFICULTIES_POS + 4),
        another: view.getUint8(cursor + DIFFICULTIES_POS + 5),
        leggendaria: 0,
      },
    }
  }
  return {
    sp: {
      beginner: view.getUint8(cursor + DIFFICULTIES_POS),
      normal: view.getUint8(cursor + DIFFICULTIES_POS + 1),
      hyper: view.getUint8(cursor + DIFFICULTIES_POS + 2),
      another: view.getUint8(cursor + DIFFICULTIES_POS + 3),
      leggendaria: view.getUint8(cursor + DIFFICULTIES_POS + 4),
    },
    dp: {
      beginner: view.getUint8(cursor + DIFFICULTIES_POS + 5),
      normal: view.getUint8(cursor + DIFFICULTIES_POS + 6),
      hyper: view.getUint8(cursor + DIFFICULTIES_POS + 7),
      another: view.getUint8(cursor + DIFFICULTIES_POS + 8),
      leggendaria: view.getUint8(cursor + DIFFICULTIES_POS + 9),
    },
  }
}

export function getFileIdentifiers(
  version: number,
  view: DataView<ArrayBuffer>,
  cursor: number,
  FILE_IDENTIFIER_POS: number
) {
  if (version <= 26) {
    return {
      sp: {
        beginner: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 6)),
        normal: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 0)),
        hyper: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 1)),
        another: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 2)),
        leggendaria: '0',
      },
      dp: {
        beginner: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 7)),
        normal: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 3)),
        hyper: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 4)),
        another: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 5)),
        leggendaria: '0',
      },
    }
  }
  return {
    sp: {
      beginner: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS)),
      normal: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 1)),
      hyper: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 2)),
      another: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 3)),
      leggendaria: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 4)),
    },
    dp: {
      beginner: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 5)),
      normal: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 6)),
      hyper: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 7)),
      another: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 8)),
      leggendaria: String.fromCharCode(view.getUint8(cursor + FILE_IDENTIFIER_POS + 9)),
    },
  }
}
