import { expect } from 'chai';
import minicall from '../index'
import { countTodaySecond } from '../src/utils'

const main = () => {

    describe('Test Task Scheduler with slots', async () => {

        it('3 slots', async () => {
            let i = 0;
            const task = new minicall({
                timeSlot: [countTodaySecond() + 2, countTodaySecond() + 3, countTodaySecond() + 3],
                onReached: () => i++
            })
            task.start()

            await new Promise(r => setTimeout(r, 3200))
            expect(i).to.eq(3)
            task.stop()
        })

        it('NO slots', async () => {
            let i = 0;
            const task = new minicall({
                timeSlot: 1000,
                onReached: () => i++
            })
            task.start()
            await new Promise(r => setTimeout(r, 3200))
            expect(i).to.eq(3)
            task.stop()
            await new Promise(r => setTimeout(r, 1100))
            expect(i).to.eq(3)
        })
    })
}

main()