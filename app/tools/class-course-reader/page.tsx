'use client'

import { useEffect, useState } from 'react'

import { useLanguage } from '@/contexts/LanguageContext'

import BinFileItem from '../bin-file-analyzer/BinFileItem'
import { decodeHtmlEntity } from '../bin-file-analyzer/StringUtil'
import { downloadFile } from '../shared/fileUtils'
import { FileUploadButton } from '../shared/FileUpload'
import { useDragAndDrop } from '../shared/useDragAndDrop'
import { INPUT_CLASSES, BUTTON_PRIMARY } from '../shared/commonStyles'
import { Course, CourseInfo, getDanCoursesInfo } from './DanCourse'
import buildBinFileContent from './DanCourseBuilder'
import parseBinFile from './DanCourseParser'
import allInfoJson from './music_data.json'

const allInfo = allInfoJson as Record<string, BinFileItem>

export default function ClassCourseReader() {
  const { t } = useLanguage()

  // State
  const [fileName, setFileName] = useState<string>('')
  const [fileContent, setFileContent] = useState<ArrayBuffer | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [gameVersion, setGameVersion] = useState<number>(0)
  const [coursesInfo, setCoursesInfo] = useState<CourseInfo[]>([])
  const [filteredBinEntries, setFilteredBinEntries] = useState<BinFileItem[]>([])

  useEffect(() => {
    document.title = 'class_course_data.bin Analyzer - Scene\'s House'
  }, [])

  // Event Handlers
  function processFile(file: File) {
    if (!file.name.endsWith('.bin')) {
      alert(t.toolPages?.classCourseReader?.invalidFileType || 'Please select a .bin file')
      return
    }

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer
      setFileContent(buffer)

      const GAME_VERSION_OFFSET = 8
      const gv = new DataView(buffer).getUint8(GAME_VERSION_OFFSET)
      const cInfo = getDanCoursesInfo(gv)

      const parsedCourses = parseBinFile(gv, buffer, cInfo)
      setGameVersion(gv)
      setCoursesInfo(cInfo)
      setCourses(parsedCourses)
    }
    reader.readAsArrayBuffer(file)
  }

  // Drag and drop
  const { isDragging, dragHandlers } = useDragAndDrop(processFile)

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredBinEntries([])
      return
    }
    if (/^:[0-9]+$/g.test(query.trim())) {
      setFilteredBinEntries(
        Object.values(allInfo).filter(
          (song) => song.entryId.toString().substring(0, song.entryId.toString().length - 3) === query.substring(1)
        )
      )
      return
    }
    setFilteredBinEntries(
      Object.values(allInfo).filter((entry) => {
        const lowerQuery = query.toLowerCase()
        return (
          entry.entryId.toString() === lowerQuery ||
          entry.title.toLowerCase().includes(lowerQuery) ||
          entry.asciiTitle.toLowerCase().includes(lowerQuery) ||
          entry.genre.toLowerCase().includes(lowerQuery) ||
          entry.artist.toLowerCase().includes(lowerQuery)
        )
      })
    )
  }

  const handleTaskIdChange = (courseIndex: number, taskIndex: number, newId: number) => {
    const updatedCourses = [...courses]
    updatedCourses[courseIndex].tasks[taskIndex].id = newId
    setCourses(updatedCourses)
  }

  const handleDifficultyChange = (
    courseIndex: number,
    taskIndex: number,
    difficulty: 'BEGINNER' | 'NORMAL' | 'HYPER' | 'ANOTHER' | 'LEGGENDARIA'
  ) => {
    const updatedCourses = [...courses]
    updatedCourses[courseIndex].tasks[taskIndex].difficulty = difficulty
    setCourses(updatedCourses)
  }

  const handleSaveFile = () => {
    if (!fileContent) return

    const modifiedBuffer = buildBinFileContent(gameVersion, fileContent, coursesInfo, courses)
    downloadFile(modifiedBuffer, `modified_${fileName}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          {t.toolPages?.classCourseReader?.title || 'Class Course Reader'}
        </h1>
        <p className="text-muted mb-6">
          {t.toolPages?.classCourseReader?.description || 'View and edit class course data from binary files'}
        </p>

        {/* File Upload and Search Section */}
        <div className="rounded-xl border border-border bg-surface p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Box */}
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">
                {t.toolPages?.classCourseReader?.searchLabel || 'Search Courses'}
              </label>
              <input
                type="text"
                onBlur={(e) => handleSearch(e.target.value)}
                placeholder={
                  t.toolPages?.classCourseReader?.searchPlaceholder ||
                  'Search by course number, task name, or difficulty...'
                }
                className={INPUT_CLASSES}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">
                {t.toolPages?.classCourseReader?.uploadLabel || 'Upload .bin File'}
              </label>
              <div className="flex gap-2">
                <FileUploadButton
                  onFileSelect={processFile}
                  accept=".bin"
                  isDragging={isDragging}
                  dragHandlers={dragHandlers}
                  buttonText={fileName || t.toolPages?.classCourseReader?.chooseFile || 'Choose File'}
                  dropFileHere={t.toolPages?.classCourseReader?.dropFileHere || 'Drop file here'}
                  inputId="course-file-upload"
                />
                {fileName && (
                  <button onClick={handleSaveFile} className={BUTTON_PRIMARY}>
                    {t.toolPages?.classCourseReader?.saveFile || 'Save'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {courses.length > 0 && (
          <p className="text-sm text-muted mb-4">
            {'Version'}
            {': '}
            {gameVersion}
            {'. '}
            {t.toolPages?.classCourseReader?.showingResults || 'Showing'} {courses.length}{' '}
            {t.toolPages?.classCourseReader?.courses || 'courses'}
          </p>
        )}
      </div>

      {filteredBinEntries.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {t.toolPages?.classCourseReader?.searchResults || 'Search Results'}
          </h2>
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="overflow-x-auto">
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-max md:min-w-0 md:table-fixed md:w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="w-32 text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted whitespace-normal break-words">
                        {t.toolPages?.classCourseReader?.taskId || 'Task ID'}
                      </th>
                      <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted whitespace-normal break-words">
                        {'Title'}
                      </th>
                      <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted whitespace-normal break-words">
                        {'Genre'}
                      </th>
                      <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted whitespace-normal break-words">
                        {'Artist'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBinEntries.map((entry) => (
                      <tr
                        key={entry.entryId}
                        className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors"
                      >
                        <td className="w-32 py-2.5 px-4 text-foreground font-medium text-sm whitespace-normal break-words">{entry.entryId}</td>
                        <td className="py-2.5 px-4 text-foreground text-sm whitespace-normal break-words">{decodeHtmlEntity(entry.title)}</td>
                        <td className="py-2.5 px-4 text-muted text-sm whitespace-normal break-words">{entry.genre}</td>
                        <td className="py-2.5 px-4 text-muted text-sm whitespace-normal break-words">{entry.artist}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Table/Form */}
      <div className="space-y-4">
        {courses.map((course, courseIndex) => (
          <div
            key={courseIndex}
            className="rounded-xl border border-border bg-surface overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary to-accent px-5 py-3">
              <h3 className="text-base font-semibold text-white">{course.name}</h3>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted">
                        {t.toolPages?.classCourseReader?.taskNumber || 'Task #'}
                      </th>
                      <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted">
                        {t.toolPages?.classCourseReader?.taskId || 'Task ID'}
                      </th>
                      <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted">
                        {t.toolPages?.classCourseReader?.taskName || 'Task Name'}
                      </th>
                      <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted">
                        {t.toolPages?.classCourseReader?.difficulty || 'Difficulty'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.tasks.map((task, taskIdx) => (
                      <tr
                        key={taskIdx}
                        className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors"
                      >
                        <td className="py-2.5 px-4 text-foreground font-medium text-sm">{taskIdx + 1}</td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={task.id}
                            onChange={(e) => handleTaskIdChange(courseIndex, taskIdx, parseInt(e.target.value) || 1)}
                            className="w-20 p-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-foreground text-sm">
                          {allInfo[task.id.toString()].title}
                        </td>
                        <td className="py-2.5 px-4">
                          <select
                            value={task.difficulty}
                            onChange={(e) =>
                              handleDifficultyChange(
                                courseIndex,
                                taskIdx,
                                e.target.value as 'BEGINNER' | 'NORMAL' | 'HYPER' | 'ANOTHER' | 'LEGGENDARIA'
                              )
                            }
                            className="p-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm"
                          >
                            {Object.entries(
                              allInfo[task.id.toString()].difficulties[
                              course.name.substring(0, 2).toLowerCase() as 'sp' | 'dp'
                              ]
                            )
                              .filter(([, diffValue]) => (diffValue as number) > 0)
                              .map(([diffKey, diffValue]) => (
                                <option key={diffKey.toUpperCase()} value={diffKey.toUpperCase()}>
                                  {diffKey.toUpperCase()} Lv.{diffValue as number}
                                </option>
                              ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
