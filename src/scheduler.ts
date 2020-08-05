import TaskQueue from './queue'
import { countTodaySecond } from './utils'

const Queue = new TaskQueue()

export interface IOption {
    id: string
    timeSlots?: number[],
    onReached: (daySecond: number) => any 
    onRunned?: () => any,
    checkDelayMS?: number,
    logger?: boolean
}

const DEFAULT_OPTIONS: any = {
    timeSlots: [],
    onRunned: () => null,
    checkDelayMS: 60 * 1000,
    logger: true
}

export default class ScheduledTask {

  private __doneSlot: number[] = []
  private __interval: any = null
  private __lastRunningTime: Date | null = null
  private __options = DEFAULT_OPTIONS

  constructor(options: IOption){
    this.__options = Object.assign({}, this._options(), options)
    this._init()
  }

  //initialization
  private _init = () => {
    for (let i = 0; this._timeSlots()[i] < countTodaySecond(); i++)
      this._doneSlot().push(this._timeSlots()[i])
  }

  //setters
  private _setLastRunningDate = () => this.__lastRunningTime = new Date()
  private _resetDoneSlotIfRequired = () => {
      if (this._lastRunningTime()){
          if (new Date().getDate() != this._lastRunningTime()?.getDate()){
            this._resetDoneSlot()
          }
      }
  }
  private _resetDoneSlot = () => this._doneSlot().splice(0, this._doneSlot().length)

  //getters
  private _lastRunningTime = () => this.__lastRunningTime
  private _ID = () => this._options().id
  private _options = (): IOption => this.__options
  private _doneSlot = (): number[] => this.__doneSlot
  private _timeSlots = (): number[] => this._options().timeSlots || []
  private _onReached = (daySecond: number) => this._options().onReached(daySecond)
  private _checkDelay = () => this._options().checkDelayMS
  private _isLoggerEnabled = () => this._options().logger
  private _isNoSlot = () => this._timeSlots().length === 0

  //private actions
  private _onRunned = () => {
    const { onRunned } = this._options()
    onRunned && onRunned()
   }

  private _checkout = async () => {
    const todaySeconds = countTodaySecond()
    const max = this._timeSlots()[this._doneSlot().length] || ((3600 * 24) + 1)

    this._isLoggerEnabled() && console.log(`[CHECKOUT] ${this._ID()} - current: ${todaySeconds}; next: ${max}`)
    if (todaySeconds > max){
      this._doneSlot().push(max)
      Queue.stack(async () => {
        await this._onReached(max)
        this._isLoggerEnabled() && console.log(`[RUNNED] ${this._ID()} has just been executing a task scheduled.`)        
      })
    }
  }

  private run = async () => {
    this._resetDoneSlotIfRequired()
    this._setLastRunningDate()

    Queue.stack(async () => {
      this._isNoSlot() ? await this._onReached(countTodaySecond()) : await this._checkout()
      this._onRunned()
    })
  }

  //public actions
  public start = () => this.__interval = setInterval(this.run, this._checkDelay())
  public stop = () => clearInterval(this.__interval)
}
