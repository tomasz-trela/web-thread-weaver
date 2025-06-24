import type {Speaker} from "./apiTypes.ts";
import {apiUrl} from "../environment.tsx";


export type AddSpeakerPayload = {
  name: string;
  surname: string;
}

export async function addSpeaker(data: AddSpeakerPayload): Promise<Speaker> {
  const response = await fetch(`${apiUrl}/speakers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`Error adding speaker: ${response.statusText}`);
  }

  return await response.json();
}