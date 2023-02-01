import { expect } from 'chai';
import minicall from '../index'
import { secondsPassedToday, secondsToTimeString } from '../src/utils'

const main = () => {

    describe('Test Task Scheduler with slots', async () => {

        it('0 slot error', () => {
            let i = 0;
            const task = new minicall({
                time: [],
                execute: () => i++,
            })
            expect(() => task.start()).to.throw(Error)
        })

        it('wrong time error 1', () => {
            let i = 0;
            const task = new minicall({
                time: ['24:00:00'],
                execute: () => i++,
            })
            expect(() => task.start()).to.throw(Error)
        })

        it('wrong time error 2', () => {
            let i = 0;
            const task = new minicall({
                time: ['23:59:59', '-1:00:00'],
                execute: () => i++,
            })
            expect(() => task.start()).to.throw(Error)
        })

        it('wrong time error 3', () => {
            let i = 0;
            const task = new minicall({
                time: ['23:59:59', '10:00:00am'],
                execute: () => i++,
            })
            expect(() => task.start()).to.throw(Error)
        })

        it('4 slots', async () => {
            let i = 0;
            let j = 0;
            const task = new minicall({
                time: [secondsToTimeString(secondsPassedToday() + 2), secondsToTimeString(secondsPassedToday() + 3), secondsToTimeString(secondsPassedToday() + 4), secondsToTimeString(secondsPassedToday() + 5), secondsToTimeString(secondsPassedToday() + 10)],
                execute: () => i++,
                callback: () => j++,
            })
            expect(task.nextExecution()).to.eq(-1)
            task.start()
            await new Promise(r => setTimeout(r, 2000))
            expect(task.nextExecution() / 1000).to.eq(1)
            expect(i).to.eq(1)
            expect(j).to.eq(1)
            await new Promise(r => setTimeout(r, 2000))
            expect(i).to.eq(3)
            expect(j).to.eq(3)
            expect(task.nextExecution() / 1000).to.eq(1)
            task.stop()
            await new Promise(r => setTimeout(r, 1700))
            expect(i).to.eq(3)
            expect(j).to.eq(3)
            expect(task.nextExecution()).to.eq(-1)
            task.start()
            expect(task.nextExecution() / 1000).to.eq(4)
            task.stop()
        })

        it('NO slots', async () => {
            let i = 0;
            let j = 0
            const task = new minicall({
                time: 1000,
                execute: () => i++,
                callback: () => j++
            })
            task.start()
            await new Promise(r => setTimeout(r, 3200))
            expect(i).to.eq(3)
            expect(j).to.eq(3)
            expect(task.nextExecution()).to.lessThan(1000)
            expect(task.nextExecution()).to.greaterThan(200)
            task.stop()
            await new Promise(r => setTimeout(r, 1100))
            expect(i).to.eq(3)
            expect(j).to.eq(3)
        })
    })
}

main()