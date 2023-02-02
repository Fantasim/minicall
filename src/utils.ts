//wrapper used for testing purposes
export const dateNow = () => {
  return new Date()
}

// convert the number of seconds passed today to a string of the form HH:MM:SS
export function secondsToTimeString(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

//thanks gpt
export function smallestValue(arr: number[]): number | undefined {
    let smallest = undefined;
    for (let i = 0; i < arr.length; i++) {
      if (smallest === undefined || arr[i] < smallest) {
        smallest = arr[i];
      }
    }
    return smallest;
}
 
//thanks gpt
export function nextGreaterValue(arr: number[], num: number): number | undefined {
    let nextGreater = undefined;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > num) {
        if (nextGreater === undefined || arr[i] < nextGreater) {
          nextGreater = arr[i];
        }
      }
    }
    return nextGreater;
  }

//thanks gpt
export function secondsPassedToday() {
    let now = dateNow()
    let hours = now.getUTCHours();
    let minutes = now.getUTCMinutes();
    let seconds = now.getUTCSeconds();
    return hours * 3600 + minutes * 60 + seconds;
}

//thanks gpt
function isValidTimeString(time: string): boolean {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return false;
  }
  const [hours, minutes, seconds] = time.split(":").map(val => parseInt(val, 10));
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60 && seconds >= 0 && seconds < 60;
}

//thanks gpt
function isValidTimeFormat(time: string): boolean {
  if (!isValidTimeString(time)){
    return false
  }

  let timeArray = time.split(":");
  if (timeArray.length !== 3) {
      return false;
  }
  for (let i = 0; i < 3; i++) {
      if (isNaN(parseInt(timeArray[i]))) {
          return false;
      }
  }
  return true;
}

//thanks gpt
export function convertTimeToSeconds(time: string): number {
    if (!isValidTimeFormat(time)){
        throw new Error("time slot should be in format hh:mm:ss under or equal to 23:59:59")
    }

    let timeArray = time.split(":");
    let hours = parseInt(timeArray[0]);
    let minutes = parseInt(timeArray[1]);
    let seconds = parseInt(timeArray[2]);
  
    return (hours * 3600) + (minutes * 60) + seconds;
}