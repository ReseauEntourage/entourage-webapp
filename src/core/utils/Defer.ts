import { Subject } from 'rxjs'
import { AnyCantFix } from 'src/utils/types'

export class Defer<T> {
  promise: Promise<T>;

  private resolveSubject = new Subject<T>()

  private rejectSubject = new Subject<T>()

  constructor(resolveData: () => T) {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolveSubject.subscribe(() => {
        resolve(resolveData())
      })
      this.rejectSubject.subscribe((rejectData?: AnyCantFix) => {
        reject(rejectData)
      })
    })
  }

  public resolve() {
    this.resolveSubject.next()
  }

  public reject(rejectData?: AnyCantFix) {
    this.rejectSubject.next(rejectData)
  }
}
