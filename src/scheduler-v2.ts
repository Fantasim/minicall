import { convertTimeToSeconds, nextGreaterValue, secondsPassedToday, smallestValue, secondsToTimeString } from "./utils"

interface IOption {
    time: string[] | number
    execute: () => any
    callback?: () => any
    filter?: () => boolean
}

export default class TaskScheduler {

  static Utils = {
    secondsToTimeString
  } 

  private __interval: any = null
  private __options: IOption
  private _timeout: any = null
  private _lastExecutionMS: number = 0
  private _running = false

  constructor(options: IOption){
    this.__options = options
  }

  private _isInterval = (): boolean => typeof this.__options.time === 'number'

  //returns the time scheduled in seconds of the day
  private _time = (): number[] => {
    if (!this._isInterval()){
        if ((this.__options.time as string[]).length === 0){
            throw new Error("time parameters should not be empty")
        }
        return (this.__options.time as string[]).map((time: string) => {
            return convertTimeToSeconds(time)
        })
    }
    return []
  }

  //returns the number in seconds to wait before executing the next task
  private _nextWait = (): number => {
    if (this._isInterval())
        return -1

    const now = secondsPassedToday()
    let next = nextGreaterValue(this._time(), now)
    
    if (next == undefined){
        const beforeMidnight = 86_400 - now
        next = beforeMidnight + (smallestValue(this._time()) as number)
    }
    return next - now
 }

 //returns the number of milliseconds to wait before executing the next task
 nextExecution = (): number => {
    if (!this._running){
        return -1
    }
    if (this._isInterval()){
        const now = new Date().getTime()
        const diff = now - this._lastExecutionMS
        return (this.__options.time as number - diff)
    } else {
        return this._nextWait() * 1000
    }
 }

 /* 
    starts the scheduler :
    - if it's an interval, it will execute the task every interval seconds
    - if it's a time list, it will execute the task at the time specified through setTimeout.
    Once the task is executed, it will check if there is a callback function to execute.
 */
start = () => { 
    this._running = true
    this._lastExecutionMS = new Date().getTime()

    const execute = async () => {
        this._lastExecutionMS = new Date().getTime()
        if (!this.__options.filter || (this.__options.filter && this.__options.filter())){
            await this.__options.execute()
            if (this.__options.callback){
                this.__options.callback()
            }
            setNextCallIfRequired()
        }
    }

    const setNextCallIfRequired = () => {
        if (!this._isInterval()){
            this._timeout = setTimeout(execute, this._nextWait() * 1000)
        }
    }

    if (this._isInterval()){
        this.__interval = setInterval(execute, this.__options.time as number)
    } else {
        setNextCallIfRequired()
    }
 }

 //pause the scheduler
  stop = () => {
    if (this._isInterval()){
        clearInterval(this.__interval)
    } else {
        clearTimeout(this._timeout)
    }
    this._running = false
  }
}