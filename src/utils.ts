export const countTodaySecond = () => {
    const beginningOfDay = new Date()

    beginningOfDay.setHours(0)
    beginningOfDay.setMinutes(0)
    beginningOfDay.setSeconds(0)
    beginningOfDay.setMilliseconds(0)

    const beginningDayTime = beginningOfDay.getTime()
    const now = new Date().getTime()
    return Math.round((now - beginningDayTime) / 1000)
}