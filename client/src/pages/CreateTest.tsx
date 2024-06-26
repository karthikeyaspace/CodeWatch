import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useForm } from 'react-hook-form';


const CreateTest: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const payload = JSON.parse(localStorage.getItem('payload') || '{}');
  const username = payload.email?.split('@')[0];

  const handleCreateTest = async (data: any) => {
    const { testName, examTime, duration, language, numCodingQues, numMcqs } = data;
    const testDetails = {
      testName,
      examTime,
      duration,
      language,
      numCodingQues,
      numMcqs,
      codingQuestions: [],
      mcqs: [],
      status: "upcoming" 
    };

    await axios.post(`/api/teacher/${username}/create-test`, testDetails)
      .then((res) => {
        console.log(res.data)
        if (res.data.message === 'Test created') {
          Toast.Success("Test created successfully")
          console.log(res.data.payload)

          //adding test to user's testsCreated array in localStorage
          let payload = localStorage.getItem('payload');
          let user = JSON.parse(payload || '{}');
          user.testsCreated.push(res.data.payload.testId);
          payload = JSON.stringify(user);
          localStorage.setItem('payload', payload);
          
          navigate(`/teacher/${username}/create-test/${res.data.payload.testId}/add-questions`)
        }
        else if (res.data.message === 'Test not created') {
          Toast.Error("Error creating test")
        }
      })
      .catch((err) => {
        console.log(err);
        Toast.Error('Internal Server Error, login again')
      });
  };

  return (
    <form onSubmit={handleSubmit(handleCreateTest)} className='h-full w-full flex flex-col gap-8'>
      <h1 className='text-4xl'>Create Test</h1>
      <p className='text-lg italic text-gray-700'>Host Your Own Lab Session on CodeWatch!
        Enhance the learning experience with interactive coding labs tailored to your curriculum. Faculty members can now organize engaging lab sessions for their students. </p>
      <div className='flex flex-row gap-16 justify-start items-center'>
        <h1 className='min-w-60 font-semibold'>Test name :</h1>
        <input
          type="text"
          required
          {...register('testName')}
          className='border border-black rounded-sm px-2 py-1 w-1/4'
        />
      </div>

      <div className='flex flex-row gap-16 items-center justify-start'>
        <h1 className='min-w-60 font-semibold'>Time of Examination :</h1>
        <input
          type="time"
          required
          {...register('examTime')}
          className='border border-black rounded-sm px-2 py-1'
        />
      </div>

      <div className='flex flex-row gap-16'>
        <h1 className='min-w-60 font-semibold'>Duration of Test in minutes :</h1>
        <input
          type="number"
          required
          {...register('duration')}
          className='border border-black rounded-sm px-2 py-1 w-1/4'
        />
      </div>

      <div className='flex flex-row gap-16'>
        <h1 className='min-w-60 font-semibold'>Date of Test : </h1>
        <input
          type="date"
          required
          {...register('date')}
          className='border border-black rounded-sm px-2 py-1 w-1/4'
        />
      </div>



      <div className='flex flex-row gap-16 items-center justify-start'>
        <h1 className='min-w-60 font-semibold'>Specific language :</h1>
        <select
          required
          {...register('language')}
          className='border border-black rounded-sm px-2 py-1 w-1/4'
        >
          <option value="any">Any</option>
          <option value="C++">C++</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
        </select>
      </div>

      <div className='flex flex-row gap-16 items-center justify-start'>
        <h1 className='min-w-60  font-semibold'>Number of Coding Questions :</h1>
        <input
          type="number"
          required
          {...register('numCodingQues')}
          className='border border-black rounded-sm px-2 py-1 w-1/4'
        />
      </div>

      <div className='flex flex-row gap-16 items-center justify-start'>
        <h1 className='min-w-60  font-semibold'>Number of MCQ's :</h1>
        <input
          type="number"
          required
          {...register('numMcqs')}
          className='border border-black rounded-sm px-2 py-1 w-1/4'
        />
      </div>

      <button type='submit' className='w-1/4 mt-4 bg-black px-6 py-2 border rounded-lg text-[#f8b739] active:bg-white active:border-black active:text-black'>
        Create Test
      </button>
    </form>
  );
};

export default CreateTest;
