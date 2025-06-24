import {createFileRoute} from '@tanstack/react-router'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getThread, getThreadUtterancesUnknownSpeakers} from "../api/conversationApi.ts";
import type {UtteranceDTO} from "../api/apiTypes.ts";
import SpeakersSelect from "../components/speakersSelect.tsx";
import AddSpeakerModal from "../components/addSpeakerModal.tsx";
import {updateUtterance, type UpdateUtterancePayload} from "../api/utteranceApi.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faYoutube} from "@fortawesome/free-brands-svg-icons";

export const Route = createFileRoute('/threads_/$threadId_/unknown')({
  component: RouteComponent,
})

function UnknownUtteranceElement({utterance}: {utterance: UtteranceDTO}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateUtterancePayload) => {
      return updateUtterance(data);
    },
    onSuccess: async () => {

      await queryClient.invalidateQueries({queryKey: ['unknown-utterances', utterance.conversation_id.toString()]});
    }
  })

  function onSpeakerChange(speakerId: string) {
      mutation.mutate({
        id: utterance.id,
        startTime: utterance.start_time,
        endTime: utterance.end_time,
        text: utterance.text,
        speakerId: speakerId
      })
  }

  return (
      <div key={utterance.id} className="mt-2 bg-nord-dark-1 p-4 rounded-lg text-nord-light-5">
        {utterance.start_time.toFixed(2)} - {utterance.end_time.toFixed(2)} <br />
        {utterance.text}

        <div className='flex justify-between items-center mt-2 gap-5'>
          <SpeakersSelect onChange={onSpeakerChange} />
          <div className="text-right">
            <a href={`https://youtu.be/${utterance.conversation.youtube_id}?t=${Math.round(utterance.start_time)}`}
              target="_blank"><FontAwesomeIcon icon={faYoutube} /></a>
          </div>
        </div>
      </div>
    // <div className="bg-nord-dark-3 p-4 rounded-lg mb-4">
    //   <p>{utterance.text}</p>
    // </div>
  );
}

function RouteComponent() {
  const { threadId } = Route.useParams();

  const queryClient = useQueryClient();

  const threadQuery = useQuery({
    queryKey: ['thread', threadId],
    queryFn: async () => {
      return getThread(threadId);
    }
  });

  const utterancesQuery = useQuery({
    queryKey: ['unknown-utterances', threadId],
    queryFn: () => {
      return getThreadUtterancesUnknownSpeakers(threadId);
    }
  });

  async function onNewSpeakerAdd() {
    await queryClient.invalidateQueries({queryKey: ['speakers']});
  }

  if (!threadQuery.isSuccess || !utterancesQuery.isSuccess) {
    return <div>Loading...</div>
  }

  return (
    <div className="m-auto w-3/4">
      <div>
        <h1 className="text-center mt-10 text-4xl">{threadQuery.data.title}</h1>
        <AddSpeakerModal onAdd={onNewSpeakerAdd} className='mt-4'/>
      </div>

      {threadQuery.data.status === 'pending' &&
          <div className="mt-20 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-7 mt-4 rounded-lg">
              <p className="text-center text-lg">This thread is still being processed. Please check back later.</p>
          </div>}

      {threadQuery.data.status === 'completed' && utterancesQuery.data.length === 0  && <div>
        <p className="text-center text-lg mt-10">No unknown speakers found in this thread.</p>
      </div>}

      {threadQuery.data.status === 'completed' && <div className="mt-5">
        {utterancesQuery.data.map(utterance => <UnknownUtteranceElement key={utterance.id} utterance={utterance} />)}
      </div>}
    </div>
  )
}
