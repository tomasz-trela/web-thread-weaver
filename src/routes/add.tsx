import {createFileRoute, useNavigate} from '@tanstack/react-router'
import { useState } from 'react'
import {useMutation} from "@tanstack/react-query";
import {addConversation, type AddConversationPayload} from "../api/conversationApi.ts";
import CustomInput from "../components/customInput.tsx";

export const Route = createFileRoute('/add')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (data: AddConversationPayload) => {
      return addConversation(data);
    },
    onSuccess: (data) => {
      navigate({
        to: "/threads/$threadId",
        params: { threadId: data.id.toString() }
      });
    }
  })

  const [data, setData] = useState({
    title: '',
    description: '',
    youtubeLink: '',
    threadDate: ''
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    mutation.mutate(data)
  }


  return (
    <div className='max-w-4xl m-auto px-8'>
      <div className='text-center mb-14'>
        <h1 className='font-[Audiowide] text-6xl mt-20'>ADD A NEW THREAD</h1>
      </div>
      {mutation.isPending && <div className='text-center text-2xl mt-10'>Adding...</div>}

      {mutation.isIdle && <form className='block mt-4' onSubmit={handleSubmit}>
        <CustomInput
          required={true}
          value={data.title}
          onChange={(value) => setData({...data, title: value})}
          placeholder="Title" />

        <textarea
          required={true}
          value={data.description}
          onChange={(e) => setData({...data, description: e.target.value})}
          className="mt-5 w-full text-2xl rounded-lg border-2 border-nord-dark-2 px-4 py-3 focus:outline-none focus:border-nord-aurora-0 transition"
          placeholder="Description" />

        <CustomInput
          required={true}
          value={data.youtubeLink}
          onChange={(value) => setData({...data, youtubeLink: value})}
          className="mt-5"
          placeholder="YouTube link" />


        <label className="block mt-5"  htmlFor="thread_date">Date of thread</label>
        <input
          value={data.threadDate}
          onChange={(e) => setData({...data, threadDate: e.target.value})}
          id="thread_date"
          type="date"
          className="mt-2 w-full text-2xl rounded-lg border-2 border-nord-dark-2 px-4 py-3 focus:outline-none focus:border-nord-aurora-0 transition"
        />

        <button
          type="submit"
          className='mt-10 p-4 w-full bg-nord-dark-2 rounded transition-all duration-200 ease-in-out hover:bg-nord-dark-3 hover:text-lg hover:cursor-pointer hover:shadow-xl disabled:bg-nord-dark-1 disabled:text-nord-dark-3'>
          Add
        </button>
      </form>}
    </div>
  )
}
