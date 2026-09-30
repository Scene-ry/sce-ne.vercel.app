export const en = {
  // Navigation
  nav: {
    home: 'Home',
    allArticles: 'All Articles',
    techBlog: "Scene's House",
    tagline: "I'm so happy, that I found you",
  },
  // Sections
  sections: {
    navigation: 'Navigation',
    tools: 'Tools',
    categories: 'Categories',
  },
  // Tools
  tools: {
    jsonFormatter: 'JSON Formatter',
    base64Encoder: 'Base64 Encoder/Decoder',
    urlEncoder: 'URL Encoder/Decoder',
    binFileAnalyzer: 'music_data.bin Analyzer',
    classCourseReader: 'Class Course Analyzer',
    bililive: 'bilibili Live Assistant',
    bililiveDesktop: 'bilibili Live (Desktop)',
    obsConfig: 'OBS Config',
    keySync: 'Key Sync',
  },
  // Home page
  home: {
    welcome: 'Welcome Back!',
    description: 'This is a place for a salaryman & rhythm game player to share his journey.',
    latestArticles: 'Latest Articles',
    viewAll: 'View all',
    stayUpdated: 'Stay Updated',
    stayUpdatedDesc:
      'Explore all our articles to learn more.',
    browseAll: 'Browse All Articles',
  },
  // Articles page
  articles: {
    title: 'All Articles',
    description: 'Browse through our collection of technical articles and tutorials.',
    readMore: 'Read more',
    articlesAvailable: 'articles available',
    articleAvailable: 'article available',
    topIndicator: 'Top',
  },
  // Article page
  article: {
    backToArticles: 'Back to articles',
    viewAllArticles: 'View All Articles',
  },
  // Tools pages
  toolPages: {
    binFileAnalyzer: {
      title: 'IIDX music_data.bin Analyzer',
      description: 'Upload and analyze binary (.bin) files',
      uploadPrompt: 'Click to upload .bin file',
      fileTypeHint: 'Only .bin files are supported',
      dropFileHere: 'Drop file here',
      releaseToUpload: 'Release to upload',
      invalidFileType: 'Please select a .bin file',
      currentFile: 'Current file',
      replaceFile: 'Replace File',
      saveFile: 'Save File',
      itemsList: 'Items List',
      itemDetails: 'Item Details',
      itemName: 'Name',
      value: 'Value',
      genre: 'Genre',
      artist: 'Artist',
      updateItem: 'Update Item',
      editableFields: 'Editable fields',
      readOnly: 'This item is read-only and cannot be edited.',
      addItem: 'Add Item',
      selectItem: 'Select an item from the list to view details',
      deleteItem: 'Delete',
      updateSuccess: 'Item updated successfully!',
      saveSuccess: 'File saved successfully!',
    },
    classCourseReader: {
      title: 'IIDX Class Course Analyzer',
      description: 'View and edit class course data from binary files',
      searchLabel: 'Search Music',
      searchPlaceholder: 'Search by music ID, music name, or artist...',
      uploadLabel: 'Upload .bin File',
      chooseFile: 'Choose File',
      dropFileHere: 'Drop file here',
      saveFile: 'Save',
      invalidFileType: 'Please select a .bin file',
      showingResults: 'Showing',
      of: 'of',
      courses: 'courses',
      noFileLoaded: 'No file loaded. Please upload a .bin file to get started.',
      clickOrDrag: 'Click or drag file here to upload',
      course: 'Course',
      taskNumber: 'Task #',
      taskId: 'Task ID',
      taskName: 'Task Name',
      difficulty: 'Difficulty',
      saveSuccess: 'File saved successfully!',
      searchResults: 'Search Results',
    },
  },
  // Footer
  footer: {
    builtWith: 'Built with Next.js & Tailwind CSS',
  },
  // Language
  language: {
    switchTo: 'Switch to',
    english: 'English',
    chinese: 'Chinese',
  },
}

export type Translations = typeof en
