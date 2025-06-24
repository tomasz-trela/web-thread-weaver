import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  getThreadUtterances,
  updateThreadUtterancesSpeaker,
  type UpdateThreadUtterancesSpeakerPayload
} from "../api/conversationApi.ts";
import type {Conversation, Speaker} from "../api/apiTypes.ts";
import SpeakersSelect from "./speakersSelect.tsx";
import AddSpeakerModal from "./addSpeakerModal.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faYoutube} from "@fortawesome/free-brands-svg-icons";



type EditConversationSpeakerProps = {
  thread: Conversation;
  speaker: Speaker;
  updateSpeakerCallback?: (newSpeakerId: string) => void;
}

export function EditConversationSpeaker({ thread, speaker, updateSpeakerCallback }: EditConversationSpeakerProps) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['uterances', thread.id, speaker.id],
    queryFn: () => {
      return getThreadUtterances({
        threadId: thread.id.toString(),
        speakerId: speaker.id.toString()
      })
    }
  })

  const mutation = useMutation({
    mutationFn: (data: UpdateThreadUtterancesSpeakerPayload) => {
      return updateThreadUtterancesSpeaker(data)
    },
    onSuccess: (_data, variables) => {
      if (updateSpeakerCallback) {
        updateSpeakerCallback(variables.speakerChangedId);
      }
    }
  })

  function updateSpeaker(speakerId: string) {
    mutation.mutate({
      speakerId: speaker.id.toString(),
      conversationId: thread.id.toString(),
      speakerChangedId: speakerId
    })
  }

  async function handleNewSpeakerAdded() {
    await queryClient.invalidateQueries({
      queryKey: ['speakers']
    });
  }

  if (!query.isSuccess) {
    return <div className="text-center">Loading...</div>;
  }

  if (mutation.isPending) {
    return <div className="text-center">Updating speaker...</div>;
  }
  const sortedUtterances = query.data.sort((a, b) => a.start_time - b.start_time);

  return (
    <div className="m-auto w-3/4">
      <div className="flex">
        <SpeakersSelect value={speaker.id.toString()} onChange={updateSpeaker} />
        <AddSpeakerModal className="ml-4 w-1/4" onAdd={handleNewSpeakerAdded} />
      </div>
      <p className="mt-4 text-center">Editing speaker: {speaker.name} {speaker.surname} in thread {thread.title}</p>

      <div className="mt-4">
        {sortedUtterances.map((utterance) =>
          <div key={utterance.id} className="mt-2 bg-nord-dark-1 p-4 rounded-lg text-nord-light-5">
            {utterance.start_time.toFixed(2)} - {utterance.end_time.toFixed(2)} <br />
            {utterance.text}
            <div className="text-right">
              <a href={`https://youtu.be/${utterance.conversation.youtube_id}?t=${Math.round(utterance.start_time)}`}
                 target="_blank"><FontAwesomeIcon icon={faYoutube} /></a>
            </div>
          </div>)
        }
      </div>
    </div>
  );

}