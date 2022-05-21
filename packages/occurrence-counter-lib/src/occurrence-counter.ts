import { validate } from './validate'
import { IData } from './types'
import { deepCopy } from "deep-copy-ts";

export function occurrenceCounter(data: unknown, text: string): IData {

  // schema validation
  try {
    validate(data)
  } catch (error) {
    throw error
  }

  // locale vars & consts
  const myData: IData = deepCopy(data) as IData 
  const keys = Object.keys(myData)
  const totalKeys = keys.length
  let lastKey: string | null = null
  let matchedKey: string | null = null
  let matchedArrIndex: number | null = null
  let counter: number = 0

  // helper functions
  const reset = () => {
    matchedKey = null
    matchedArrIndex = null
    counter = 0
  }

  const setWordCounter = () => {
    if (counter && matchedKey !== null && matchedArrIndex !== null) {
      myData[matchedKey][matchedArrIndex] = `${text}${counter}`
    }
  }

  const setMachedIndexes = (key: string, arrIndex: number) => {
    matchedKey = key
    matchedArrIndex = arrIndex
  }

  const deleteMachedData = (key: string, arrIndex: number) => {
    if (myData[key].length === 1) {
      delete myData[key]
    } else {
      myData[key].splice(arrIndex, 1)
    }
  }

  // iterate data
  keys.forEach((key: string, i: number) => {

    const isConsecutive = lastKey !== null ? (parseInt(key) === parseInt(lastKey) + 1) : true
    const matchedIndex = myData[key].findIndex(s => s === text)

    if (!isConsecutive || matchedIndex < 0) {
      setWordCounter()
      reset()
    }

    if (matchedIndex >= 0) {
      counter++
      if (counter > 1) {
        deleteMachedData(key, matchedIndex)
      } else {
        setMachedIndexes(key, matchedIndex)
      }
    }

    if (totalKeys === i + 1) {
      setWordCounter()
      reset()
    }

    lastKey = key
  })

  return myData
}

export default occurrenceCounter;