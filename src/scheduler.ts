import TaskQueue from './queue'
import { countTodaySecond } from './utils'

const Queue = new TaskQueue()

export interface IOption {
    timeSlot?: number[] | number,
    onReached: (daySecond: number) => any 
    onRunned?: () => any,
}

const DEFAULT_OPTIONS: any = {
    timeSlot: 10 * 1000,
    onRunned: () => null,
}

export default class ScheduledTask {

  private __interval: any = null
  private __options = DEFAULT_OPTIONS
  private _timeouts: any[] = []

  constructor(options: IOption){
    this.__options = Object.assign({}, this._options(), options)
  }

  private _options = (): IOption => this.__options
  private _timeSlot = () => this._options().timeSlot
  private _onReached = (daySecond: number) => this._options().onReached(daySecond)
  private _isNoSlot = () => typeof this._timeSlot() === 'number'

  //private actions
  private _onRunned = () => {
    const { onRunned } = this._options()
    onRunned && onRunned()
  }

  private _runNoSlot = () => Queue.stack(async () => {
      await this._onReached(countTodaySecond())
      this._onRunned()
  })
  

  private _runWithSlot = async () => {
    await this._onReached(countTodaySecond())
    this._onRunned()
  }

  private _clearAllTimeoutSlots = () => this._timeouts.map((v: any) => clearTimeout(v))

  private _startWithSlot = () => {
    if (!this._isNoSlot()){
      
      this._clearAllTimeoutSlots()
      const slots = this._timeSlot() as number[]

      slots.filter((value: number) => value > (countTodaySecond() + 1)).map((value: number) => {
        
        const delay = (value - countTodaySecond()) * 1000
        this._timeouts.push(setTimeout(this._runWithSlot, delay))

      })

      const delay = ((24 * 3600) - countTodaySecond()) * 1000
      this._timeouts.push(setTimeout(this._startWithSlot, delay))

    }
  }


  private _startNoSlot = () => this.__interval = setInterval(this._runNoSlot, this._timeSlot() as number)

  //public actions
  public start = () => this._isNoSlot() ? this._startNoSlot() : this._startWithSlot()

  public stop = () => this._isNoSlot() ? clearInterval(this.__interval) : this._clearAllTimeoutSlots()
}
