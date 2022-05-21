import { occurrenceCounter } from './main'

const data = {
  "1": ["windows", "server"],
  "2": ["crystalzoom"],
  "3": ["python", "crystalzoom", "linux"],
  "4": ["crystalzoom"],
  "7": ["java", "crystalzoom", "cpp", "js"],
  "9": ["crystalzoom"],
  "10": ["ruby", "rails"]
}

try {
  console.log("ORIGINAL", data)
  console.log("occurrenceCounter",occurrenceCounter(data, "windows"))
} catch (err) {
  console.log(err)
}
