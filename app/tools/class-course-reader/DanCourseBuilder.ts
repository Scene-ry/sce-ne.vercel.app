import { Course, CourseInfo, difficultyToIndex } from './DanCourse'

function modifyCourseInBuffer(
  gameVersion: number,
  buffer: ArrayBuffer,
  danIndex: number,
  courseInfo: CourseInfo,
  course: Course
): void {
  const offset = 0x188 * danIndex + 0x0000009c
  const view = new DataView(buffer)

  for (let i = 0; i < courseInfo.taskCount; i++) {
    view.setUint32(offset + i * 4, course.tasks[i].id, true)
    view.setUint8(offset + 128 + i * 4, difficultyToIndex(gameVersion, course.tasks[i].difficulty))
  }
}

export default function buildBinFileContent(
  gameVersion: number,
  originalBuffer: ArrayBuffer,
  coursesInfo: CourseInfo[],
  courses: Course[]
): ArrayBuffer {
  const modifiedBuffer = originalBuffer.slice(0) // Create a copy to modify
  for (let i = 0; i < courses.length; i++) {
    modifyCourseInBuffer(gameVersion, modifiedBuffer, i, coursesInfo[i], courses[i])
  }
  return modifiedBuffer
}
