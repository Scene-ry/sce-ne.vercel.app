import { Translations } from './en'

export const zh: Translations = {
  // Navigation
  nav: {
    home: '首页',
    allArticles: '所有文章',
    techBlog: "Scene's居酒屋",
    tagline: '做人最紧要就係開心',
  },
  // Sections
  sections: {
    navigation: '导航',
    tools: '工具',
    categories: '分类',
  },
  // Tools
  tools: {
    jsonFormatter: 'JSON 格式化',
    base64Encoder: 'Base64 编码/解码',
    urlEncoder: 'URL 编码/解码',
    binFileAnalyzer: 'music_data.bin 解析',
    classCourseReader: '段位解析',
    bililive: 'bilibili 直播助手',
    obsConfig: 'OBS配置',
  },
  // Home page
  home: {
    welcome: '你点知今日会好天噶？',
    description: '唔知噶，希望在明天啦嘛！',
    latestArticles: '最新文章',
    viewAll: '查看全部',
    stayUpdated: '保持更新',
    stayUpdatedDesc: '浏览我们所有的文章，了解更多信息。',
    browseAll: '浏览所有文章',
  },
  // Articles page
  articles: {
    title: '所有文章',
    description: '浏览我们的技术文章和教程集合。',
    readMore: '阅读更多',
    articlesAvailable: '篇文章可用',
    articleAvailable: '篇文章可用',
    topIndicator: '置顶',
  },
  // Article page
  article: {
    backToArticles: '返回文章列表',
    viewAllArticles: '查看所有文章',
  },
  // Tools pages
  toolPages: {
    binFileAnalyzer: {
      title: 'IIDX music_data.bin 歌单解析',
      description: '上传和分析二进制（.bin）文件',
      uploadPrompt: '点击上传 .bin 文件',
      fileTypeHint: '仅支持 .bin 文件',
      dropFileHere: '将文件拖放到此处',
      releaseToUpload: '释放以上传',
      invalidFileType: '请选择 .bin 文件',
      currentFile: '当前文件',
      replaceFile: '替换文件',
      saveFile: '保存文件',
      itemsList: '项目列表',
      itemDetails: '项目详情',
      itemName: '名称',
      value: '值',
      genre: '流派',
      artist: '艺术家',
      updateItem: '更新项目',
      editableFields: '可编辑字段',
      readOnly: '此项目为只读，无法编辑。',
      addItem: '添加项目',
      selectItem: '从列表中选择一个项目以查看详情',
      deleteItem: '删除',
      updateSuccess: '项目更新成功！',
      saveSuccess: '文件保存成功！',
    },
    classCourseReader: {
      title: 'IIDX class_course_data.bin 段位解析',
      description: '查看和编辑二进制文件中的课程数据',
      searchLabel: '搜索乐曲',
      searchPlaceholder: '按音乐 ID、音乐名称或艺术家搜索...',
      uploadLabel: '上传 .bin 文件',
      chooseFile: '选择文件',
      dropFileHere: '将文件拖放到此处',
      saveFile: '保存',
      invalidFileType: '请选择 .bin 文件',
      showingResults: '显示',
      of: '共',
      courses: '个课程',
      noFileLoaded: '未加载文件。请上传 .bin 文件以开始。',
      clickOrDrag: '点击或拖放文件到此处上传',
      course: '课程',
      taskNumber: '任务 #',
      taskId: '任务 ID',
      taskName: '任务名称',
      difficulty: '难度',
      saveSuccess: '文件保存成功！',
      searchResults: '搜索结果',
    },
  },
  // Footer
  footer: {
    builtWith: '使用 Next.js 和 Tailwind CSS 构建',
  },
  // Language
  language: {
    switchTo: '切换到',
    english: '英文',
    chinese: '中文',
  },
}
