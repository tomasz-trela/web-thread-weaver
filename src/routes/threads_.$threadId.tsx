import {createFileRoute, Link} from '@tanstack/react-router'
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {getThread, getThreadSpeakers} from "../api/conversationApi.ts";
import {useState} from "react";
import {EditConversationSpeaker} from "../components/editConversationSpeaker.tsx";

export const Route = createFileRoute('/threads_/$threadId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { threadId } = Route.useParams();

  const queryClient = useQueryClient()

  const threadQuery = useQuery({
    queryKey: ['thread', threadId],
    queryFn: async () => {
      return getThread(threadId);
    }
  });

  const speakersQuery = useQuery({
    queryKey: ['speaker', threadId],
    queryFn: async () => {
      return getThreadSpeakers(threadId);
    }
  })

  async function onSpeakerChange(newSpeakerId: string) {
    await queryClient.invalidateQueries({queryKey: ['speaker', threadId]});
    const newSpeakerIdNumber = parseInt(newSpeakerId, 10);
    setChosenSpeakerId(newSpeakerIdNumber)
  }

  const [chosenSpeakerId, setChosenSpeakerId] = useState<number | null>(null);

  if (!threadQuery.isSuccess || !speakersQuery.isSuccess) {
    return <div>Loading...</div>
  }

  const chooseSpeaker = speakersQuery.data.find(e => e.id === chosenSpeakerId);

  return (
    <div className="m-auto w-3/4">
      <div>
        <h1 className="text-center mt-10 text-4xl">{threadQuery.data.title}</h1>
        { threadQuery.data.status === 'completed' && <Link to='/threads/$threadId/unknown' params={{threadId: threadId}}>
            <button className="mt-10 p-4 bg-nord-dark-2 rounded transition-all duration-200 ease-in-out hover:bg-nord-dark-3 hover:cursor-pointer hover:shadow-xl disabled:bg-nord-dark-1 disabled:text-nord-dark-3">Label unknown speakers</button>
        </Link>}
      </div>
      {threadQuery.data.status === 'pending' &&
        <div className="mt-20 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-7 mt-4 rounded-lg">
          <p className="text-center text-lg">This thread is still being processed. Please check back later.</p>
        </div>}

      {threadQuery.data.status === 'completed' &&
        <div className="flex mt-10">
          <div>
            <h2 className="text-2xl">Speakers</h2>
            {speakersQuery.data.length === 0 && <p className="text-center text-lg mt-10">No speakers found in this thread.</p>}

            {speakersQuery.data.map((speaker) => (
              <div
                onClick={() => setChosenSpeakerId(speaker.id)} key={speaker.id}
                className={"mt-2 bg-nord-dark-1 p-4 rounded-lg text-nord-light-5 hover:bg-nord-dark-2 hover:cursor-pointer transition-all duration-200 ease-in-out border" + (chooseSpeaker == speaker ? " bg-nord-dark-2 border-nord-aurora-0 border" : " border-nord-dark-1")}
              >
                {speaker.name} {speaker.surname}
              </div>
            ))}
          </div>

          {chooseSpeaker === undefined &&
              <div className="text-center m-auto">
                <p className="text-center text-4xl">Select a speaker to edit their utterances.</p>
              </div>}

          {chooseSpeaker !== undefined &&
              <EditConversationSpeaker
                  thread={threadQuery.data}
                  updateSpeakerCallback={onSpeakerChange}
                  speaker={chooseSpeaker}
              />
          }

        </div>
      }
    </div>
  )
}
