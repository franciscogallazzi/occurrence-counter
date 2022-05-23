import React, { useEffect, useState } from 'react';
import './App.css';
import { occurrenceCounter } from 'occurrence-counter-lib'
import { IData, ErrorObject } from 'occurrence-counter-lib/dist/tsc/types';
import { Col, Container, Row, Form, Button, Alert } from 'react-bootstrap';

import { CodeEditorEditable } from 'react-code-editor-editable'
import 'highlight.js/styles/a11y-dark.css';

const defaultData = {
  "1": ["windows", "server"],
  "2": ["crystalzoom"],
  "3": ["python", "crystalzoom", "linux"],
  "4": ["crystalzoom"],
  "7": ["java", "crystalzoom", "cpp", "js"],
  "9": ["crystalzoom"],
  "10": ["ruby", "rails"]
}

const defaultText = "crystalzoom"

function App() {

  const stringify = (value: unknown): string => {
    try {
      return JSON.stringify(value as object, null, ' ')
    } catch (error) {
      return JSON.stringify({}, null, ' ')
    }
  }

  const [data, setData] = useState<object>(defaultData)

  const [occurrenceCounterData, setOccurrenceCounterData] = useState<IData>()

  const [text, setText] = useState<string>(defaultText)

  const [error, setError] = useState<ErrorObject[] | Error | null>(null)

  const [formData, setFormData] = useState<{ text: string, data: string }>({
    text,
    data: stringify(data)
  })

  useEffect(() => {
    setError(null)
    try {
      setOccurrenceCounterData(
        occurrenceCounter(data, text)
      )
    } catch (error) {
      setOccurrenceCounterData({})
      setError(error as ErrorObject[])
    }
  }, [data, text])

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      setText(formData.text)
      setData(JSON.parse(formData.data))
    } catch (error) {
      setError(error as Error)
    }

  }

  const clearForm = () => {
    setFormData({
      text: "",
      data: "{}"
    })
    setText("")
    setData({})
  }

  const defaultForm = () => {
    setFormData({
      text: defaultText,
      data: stringify(defaultData)
    })
    setText(defaultText)
    setData(defaultData)
  }


  const updateFormDataValue = (name: string, data: unknown) => {
    setFormData({
      ...formData,
      [name]: data
    })
  }

  return (
    <div className='App'>
      <Container className='container'>
        <Row>
          <Col xs={12} md={6}>
            <h2 className='titles'>Input</h2>
            <Form onSubmit={submit} className="form">
              <Form.Group className="mb-3" controlId="text">
                <Form.Control
                  value={formData.text}
                  onChange={(e) => updateFormDataValue("text", e.target.value)}
                  type="text"
                  placeholder="Search Text" />
              </Form.Group>
              <div aria-label="buttons" className='form-buttons'>
                <Button variant="primary" type="submit">
                  Run
                </Button>
                <Button variant="secondary" onClick={clearForm}>
                  Clear
                </Button>
                <Button variant="light" onClick={defaultForm}>
                  Default
                </Button>
              </div>
            </Form>
          </Col>
          <Col md={6} className="d-none d-md-block">
            <h2 className='titles'>Result</h2>
          </Col>
        </Row>
        <Row className='json'>
          <Col xs={12} md={6} style={{ position: 'relative' }}>
            <CodeEditorEditable
              value={formData.data}
              setValue={(value: string) => updateFormDataValue("data", value)}
              width='100%'
              height='100%'
              language='JSON'
              inlineNumbers
            />
          </Col>
          <Col xs={12} md={6} style={{ position: 'relative' }}>
            <h2 className='titles d-block d-md-none'>Result</h2>
            {error === null ?
              <CodeEditorEditable
                value={stringify(occurrenceCounterData)}
                setValue={(value: string) => { }}
                width='100%'
                height='100%'
                language='JSON'
                inlineNumbers
              />

              : <Alert variant="danger">
                {
                  (Array.isArray(error)) ?
                    (error as ErrorObject[]).map((e, i) => <span key={i}>{`${e.instancePath} ${e.message}`}</span>)
                    : (error as Error).message
                }
              </Alert>}
          </Col>
        </Row>
      </Container>

    </div>
  );
}

export default App;
