import { Course, CourseInfo, indexToDifficulty } from './DanCourse'

function createCourse(gameVersion: number, danIndex: number, courseInfo: CourseInfo, buffer: ArrayBuffer): Course {
  const offset = 0x188 * danIndex + 0x0000009c
  const view = new DataView(buffer)

  const tasks = []
  for (let i = 0; i < courseInfo.taskCount; i++) {
    const taskId = view.getUint32(offset + i * 4, true)
    const difficulty = view.getUint8(offset + 128 + i * 4)

    tasks.push({
      id: taskId,
      difficulty: indexToDifficulty(gameVersion, difficulty),
    })
  }

  return {
    name: courseInfo.name,
    tasks,
  }
}

export default function parseBinFile(gameVersion: number, buffer: ArrayBuffer, coursesInfo: CourseInfo[]): Course[] {
  const prefix = new Uint8Array(buffer, 0, 8)
  if (String.fromCharCode(...prefix) !== 'IIDXDANE') {
    alert('Not valid DAN file!')
    return []
  }

  const courses: Course[] = []
  for (let i = 0; i < coursesInfo.length; i++) {
    const course = createCourse(gameVersion, i, coursesInfo[i], buffer)
    courses.push(course)
  }

  return courses
}
