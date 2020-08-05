# Minimalistic JS callback scheduler

Pure JS, no dependencies.

## Installation
```sh
yarn add minicall
```

## Quick start
```ts
import { ScheduledTask } from 'minicall'

const task = new ScheduledTask({
    id: `send-message`,
    timeSlots: [12 * 3600, 20 * 3600], //trigger the onReachedCallback every day, at 12 noon and 20pm 
    onReached: async () => await someSendingFunction('Hey this message has been sent from a scheduled task!'),
    onRunned: () => console.log('onReached has been called 🎉'),
    refreshDelayMS: 1000 * 10, //10 seconds
    logger: false
})
```

## ScheduledTask

- **Options**:

    | Name | Type | Description | Default | Required
    | -- | -- | -- | -- | -- |
    | id |`string` | task id | `undefined` | YES
    | timeSlots |`number[]` | `Array of seconds` of a day where the `onReached` callback is going to be called at. If empty the callback is going to be called at every `refreshDelayMS` value | `[]` | NO
    | onReached |`(daySecond: number) => any` | Callback called when the seconds of the day reach reach one of the targets set in `timeSlots` | `undefined` | YES 
    | onRunned |`() => any` | Callback called when onReached has been called | `() => null` | NO 
    | refreshDelayMS |`number` | delay in milliseconds where your `timeSlots` are checked | `10,000` | NO 
    | logger |`boolean` | Print logs when the `onReached` has been called  | `false` | NO 
