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
  private _isSlotValue = () => typeof this._timeSlot() === 'number'

  private _onRunned = () => {
    const { onRunned } = this._options()
    onRunned && onRunned()
  }

  private _run = () => {

    const withSlots = async () => {
      await this._onReached(countTodaySecond())
      this._onRunned()
    }

    const withValue = () => {
      Queue.stack(async () => {
        await this._onReached(countTodaySecond())
        this._onRunned()
      })
    }
  
    return { withSlots, withValue }
  }

  private _start = () => {

    const withSlots = () => {

      const pushScheduledDailyReset = () => {
        const delay = ((24 * 3600) - countTodaySecond()) * 1000
        this._timeouts.push(setTimeout(this.start, delay))
      }

      if (!this._isSlotValue()){
      
        this._clearAllTimeoutSlots()
        const slots = this._timeSlot() as number[]
  
        slots.filter((value: number) => value >= countTodaySecond()).map((value: number) => {
          
          const delay = (value - countTodaySecond()) * 1000
          this._timeouts.push(setTimeout(this._onReached, delay))
  
        })
        
        pushScheduledDailyReset()
      }
    }

    const withValue = () => this.__interval = setInterval(this._run().withValue, this._timeSlot() as number)

    return { withSlots, withValue }
  } 

  private _clearAllTimeoutSlots = () => this._timeouts.map((v: any) => clearTimeout(v))

  //public actions
  public start = () => this._isSlotValue() ? this._start().withValue() : this._start().withSlots()

  public stop = () => this._isSlotValue() ? clearInterval(this.__interval) : this._clearAllTimeoutSlots()
}
