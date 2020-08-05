# Minimalistic JS callback scheduler 🛵

Pure JS, no dependencies.

## Installation
```sh
yarn add minicall
```

## Quick start
```ts
import { ScheduledTask } from 'minicall'

const task = new ScheduledTask({
    timeSlot: [12 * 3600, 20 * 3600], //trigger the onReachedCallback every day, at 12 noon and 20pm 
    onReached: async () => await someSendingFunction('Hey this message has been sent from a scheduled task!'),
    onRunned: () => console.log('onReached has been called 🎉'),
})


task.start()

/* task.stop() */
```

## ScheduledTask

- **Options**:

    | Name | Type | Description | Default | Required
    | -- | -- | -- | -- | -- |
    | timeSlot |`number[] or number` | If an array, it has to be an `Array of seconds` of a day where the `onReached` callback is going to be called at. If it's a number the callback is going to be called at every `timeSlot` value | `10,000` (10 seconds) | NO
    | onReached |`(daySecond: number) => any` | Callback called when the seconds of the day reach reach one of the targets set in `timeSlot` | `undefined` | YES 
    | onRunned |`() => any` | Callback called when onReached has been called | `() => null` | NO 
