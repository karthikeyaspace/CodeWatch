import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import Toast from '../components/Toast'
import QuestionInput from '../components/QuestionInput'
import { set } from 'react-hook-form'

const AddQuestions: React.FC = () => {
  const { username } = useParams<{ username: string }>()
  const { testId } = useParams<{ testId: string }>()
  const teacher = JSON.parse(localStorage.getItem('payload') || '{}')
  const [codingQuestions, setCodingQuestions] = React.useState<any>([])
  const [mcqs, setMcqs] = React.useState<any>([])
  const [codingPane, setCodingPane] = React.useState<boolean>(false)
  const [mcqPane, setMcqPane] = React.useState<boolean>(false)

  const [test, setTest] = React.useState<any>({})

  React.useEffect(() => {
    axios.get(`http://localhost:3001/teacher/${username}/create-test/${testId}/add-questions`)
      .then((res) => {
        if (res.data.message === "Test found") {
          setTest(res.data.payload)
          setCodingQuestions(res.data.payload.codingQuestions)
          setMcqs(res.data.payload.mcqs)
        }
        else {
          console.log("Test not found")
          Toast.Error("Error Occured")
        }
      })
      .catch((err) => {
        console.log(err)

      })
  }, [])


  const handleAddCoding = () => {
    setMcqPane(false)
    setCodingPane(!codingPane)
    // setCodingQuestions([...codingQuestions, {
    //   question: '',
    //   testCases: '',
    //   input: '',
    //   output: '',
    //   constraints: '',
    //   difficulty: ''
    // }])
  }

  const handleAddMcq = () => {
    setCodingPane(false)
    setMcqPane(!mcqPane)
    // setMcqs([...mcqs, {
    //   question: '',
    //   options: [4],
    //   correctOption: '',
    //   difficulty: ''
    // }])
  }

  const handleCreateTest = async () => {
    const questions = {
      codingQuestions,
      mcqs
    }

    await axios.post(`http://localhost:3001/teacher/${username}/create-test/${testId}/add-questions`, {questions})
      .then((res) => {
        if (res.data.message === 'Questions added') {
          Toast.Success("Questions added successfully")
        }
        else if (res.data.message === 'Questions not added') {
          Toast.Error("Error adding questions")
        }
        else{
          Toast.Error("Some error occured, Try again later")
        }
      })
      .catch((err) => {
        console.log(err)
        Toast.Error('Error adding questions, please login again')
      });
  }

  return (
    <div className='p-4'>
      <div>
        <h1>Add Questions</h1>
        <h1>{test.testName}</h1>
        <h1>{test.duration}</h1>
        <h1>{test.examTime}</h1>
        <h1>{test.language}</h1>
        <h1>{test.numCodingQues}</h1>
        <h1>{test.numMcqs}</h1>
        <h1>{test.teacher}</h1>
      </div>
      <div>
        <h1>Coding Questions</h1>
        {codingQuestions.map((question: any, index: number) => {
          return (
            <div key={index}>
              <h1>{question.question}</h1>
              <h1>{question.difficulty}</h1>
              <h1>{question.testCases}</h1>
              <h1>{question.constraints}</h1>
              <h1>{question.input}</h1>
              <h1>{question.output}</h1>
            </div>
          )
        })}
        <button onClick={handleAddCoding}>Add Question</button>
      </div>

      <div>
        <h1>MCQs</h1>
        {mcqs.map((question: any, index: number) => {
          return (
            <div key={index}>
              <h1>{question.question}</h1>
              <h1>{question.difficulty}</h1>
              <h1>{question.options}</h1>
              <h1>{question.correctOption}</h1>
            </div>
          )
        })}
        <button onClick={handleAddMcq}>Add Question</button>
      </div>

      {
        (codingPane || mcqPane) && <QuestionInput qtype={codingPane} setCodingQuestions={setCodingQuestions} setMcqs={setMcqs} 
        setCodingPane={setCodingPane} setMcqPane={setMcqPane}/>
      }

      <button onClick={handleCreateTest}>Create Test</button>

    </div>
  )
}

export default AddQuestions