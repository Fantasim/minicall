export default class TaskQueue {

    _queue: Function[] = []
    _isRunning: boolean = false

    run = () => this._isRunning = true
    stop = () => this._isRunning = false
    isRunning = () => this._isRunning
    
    count = () => this._queue.length

    stack = (action: Function) => {
        this._queue.push(action)
        this.execute()
    }

    private _runTopStackAction = async () => await this._queue[0]()
    private _clearTopStackAction = () => this._queue.shift()

    execute = async () => {
        if (!this.isRunning() && this.count() > 0){
            this.run()
            await this._runTopStackAction()
            this._clearTopStackAction()
            this.stop()
            this.count() > 0 && this.execute()
        }
    }
}