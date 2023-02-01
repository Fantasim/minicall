# Minimalistic JS task scheduler 🛵

*Extremely **minimalistic** and **simple** task scheduler built in just 2 hours due to frustration with the bugs, dependencies, and heavy bundle weight of the current popular task scheduler libraries in JavaScript.* 😤

This library is very humble and doesn't compete in terms of features, but it is simple 🎈:

- Supports both **browser** and **node** environments.
- Only requires **two** simple **parameters**, with no useless ones.
- Has **no dependencies** and is lightweight, with a size of only **1.6kB**. 🕊️
- No unexpected schedule, no bugs, no nonsense.


<br />

## Installation
```sh
yarn add minicall
```

## Quick start

```ts
import minicall from 'minicall'

const task = new minicall({
    time: ["12:34:56", "22:22:22"], //Based on UTC time 
    execute: () => console.log('task to execute'),
})

task.start()
```

### With a filter

```ts
import minicall from 'minicall'

const task = new minicall({
    time: ["03:00:00"],
    execute: () => console.log('task to execute'),
    filter: (): boolean => new Date().getDay() === 1 //only on Monday.
})

task.start()
```
