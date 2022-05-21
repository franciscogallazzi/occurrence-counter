import { IData } from './types'
import Ajv, { JSONSchemaType } from "ajv"
const ajv = new Ajv()

const schema: JSONSchemaType<IData> = {
  type: "object",
  patternProperties: {
    "^[0-9]+[0-9]*$": {
      type: "array",
      items: {
        type: "string"
      },
    }
  },
  propertyNames: {
    pattern: "^[0-9]+[0-9]*$"
  },
  required: [],
  additionalProperties: true
}

export function validate(data: unknown) : boolean {
  const validateSchema = ajv.compile(schema)
  if (validateSchema(data)) {
    return true
  } else {
    throw validateSchema.errors
  }
}