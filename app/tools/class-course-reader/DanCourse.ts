const DAN_LIST = [
  'SP七级',
  'SP六级',
  'SP五级',
  'SP四级',
  'SP三级',
  'SP二级',
  'SP一级',
  'SP初段',
  'SP二段',
  'SP三段',
  'SP四段',
  'SP五段',
  'SP六段',
  'SP七段',
  'SP八段',
  'SP九段',
  'SP十段',
  'SP中伝',
  'SP皆伝',
  'DP七级',
  'DP六级',
  'DP五级',
  'DP四级',
  'DP三级',
  'DP二级',
  'DP一级',
  'DP初段',
  'DP二段',
  'DP三段',
  'DP四段',
  'DP五段',
  'DP六段',
  'DP七段',
  'DP八段',
  'DP九段',
  'DP十段',
  'DP中伝',
  'DP皆伝',
]

const DIFFICULTY_LIST: ('BEGINNER' | 'NORMAL' | 'HYPER' | 'ANOTHER' | 'LEGGENDARIA')[] = [
  'BEGINNER',
  'NORMAL',
  'HYPER',
  'ANOTHER',
  'LEGGENDARIA',
]

interface Task {
  id: number
  difficulty: 'BEGINNER' | 'NORMAL' | 'HYPER' | 'ANOTHER' | 'LEGGENDARIA'
}

export interface Course {
  name: string
  tasks: Task[]
}

export interface CourseInfo {
  name: string
  taskCount: number
}

export function getDanCoursesInfo(gameVersion: number): CourseInfo[] {
  const courses: CourseInfo[] = []
  for (const dan of DAN_LIST) {
    if (dan.startsWith('SP')) {
      // SP Course
      if (gameVersion <= 22 && dan.endsWith('中伝')) continue
      courses.push({
        name: dan,
        taskCount: 4,
      })
    } else {
      // DP Course
      if (gameVersion <= 22 && (dan.endsWith('中伝') || dan.endsWith('七级') || dan.endsWith('六级'))) continue
      const taskCount = gameVersion <= 22 ? 3 : 4
      courses.push({
        name: dan,
        taskCount: taskCount,
      })
    }
  }
  return courses
}

export function difficultyToIndex(
  gameVersion: number,
  difficulty: 'BEGINNER' | 'NORMAL' | 'HYPER' | 'ANOTHER' | 'LEGGENDARIA'
): number {
  return gameVersion <= 26 ? DIFFICULTY_LIST.indexOf(difficulty) - 1 : DIFFICULTY_LIST.indexOf(difficulty)
}

export function indexToDifficulty(
  gameVersion: number,
  index: number
): 'BEGINNER' | 'NORMAL' | 'HYPER' | 'ANOTHER' | 'LEGGENDARIA' {
  return gameVersion <= 26 ? DIFFICULTY_LIST[index + 1] : DIFFICULTY_LIST[index]
}
