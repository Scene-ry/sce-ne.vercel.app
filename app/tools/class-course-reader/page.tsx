'use client'

import { useEffect, useState } from 'react'

import { useLanguage } from '@/contexts/LanguageContext'

import BinFileItem from '../bin-file-analyzer/BinFileItem'
import { decodeHtmlEntity } from '../bin-file-analyzer/StringUtil'
import { downloadFile } from '../shared/fileUtils'
import { FileUploadButton } from '../shared/FileUpload'
import { useDragAndDrop } from '../shared/useDragAndDrop'
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
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {t.toolPages?.classCourseReader?.title || 'Class Course Reader'}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {t.toolPages?.classCourseReader?.description || 'View and edit class course data from binary files'}
        </p>

        {/* File Upload and Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Box */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t.toolPages?.classCourseReader?.searchLabel || 'Search Courses'}
              </label>
              <input
                type="text"
                onBlur={(e) => handleSearch(e.target.value)}
                placeholder={
                  t.toolPages?.classCourseReader?.searchPlaceholder ||
                  'Search by course number, task name, or difficulty...'
                }
                className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                  <button
                    onClick={handleSaveFile}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    {t.toolPages?.classCourseReader?.saveFile || 'Save'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {courses.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t.toolPages?.classCourseReader?.searchResults || 'Search Results'}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <table>
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t.toolPages?.classCourseReader?.taskId || 'Task ID'}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {'Title'}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {'Genre'}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {'Artist'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBinEntries.map((entry) => (
                  <tr
                    key={entry.entryId}
                    className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{entry.entryId}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{decodeHtmlEntity(entry.title)}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{entry.genre}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{entry.artist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Courses Table/Form */}
      <div className="space-y-4">
        {courses.map((course, courseIndex) => (
          <div
            key={courseIndex}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3">
              <h3 className="text-lg font-semibold text-white">{course.name}</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t.toolPages?.classCourseReader?.taskNumber || 'Task #'}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t.toolPages?.classCourseReader?.taskId || 'Task ID'}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t.toolPages?.classCourseReader?.taskName || 'Task Name'}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t.toolPages?.classCourseReader?.difficulty || 'Difficulty'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.tasks.map((task, taskIdx) => (
                      <tr
                        key={taskIdx}
                        className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{taskIdx + 1}</td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={task.id}
                            onChange={(e) => handleTaskIdChange(courseIndex, taskIdx, parseInt(e.target.value) || 1)}
                            className="w-20 p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {allInfo[task.id.toString()].title}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={task.difficulty}
                            onChange={(e) =>
                              handleDifficultyChange(
                                courseIndex,
                                taskIdx,
                                e.target.value as 'BEGINNER' | 'NORMAL' | 'HYPER' | 'ANOTHER' | 'LEGGENDARIA'
                              )
                            }
                            className="p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
