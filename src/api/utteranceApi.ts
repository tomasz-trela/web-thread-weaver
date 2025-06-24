import {apiUrl} from "../environment.tsx";


export type UpdateUtterancePayload = {
  id: number;
  startTime: number,
  endTime: number,
  text: string;
  speakerId: string;
}

export async function updateUtterance(data: UpdateUtterancePayload) {
  const response = await fetch(`${apiUrl}/utterances/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      start_time: data.startTime,
      end_time: data.endTime,
      text: data.text,
      speaker_id: data.speakerId
    })
  })

  if (!response.ok) {
    throw new Error(`Error updating utterance: ${response.statusText}`);
  }
}