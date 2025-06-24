import { apiUrl } from '../environment.tsx';
import type { Conversation, Speaker, UtteranceDTO } from './apiTypes.ts';

export type AddConversationPayload = {
  title: string;
  description: string;
  threadDate: string;
  youtubeLink: string;
}

type GetThreadUterancesPayload = {
  threadId: string;
  speakerId?: string;
}

export type UpdateThreadUtterancesSpeakerPayload = {
  speakerId: string;
  conversationId: string;
  speakerChangedId: string;
}

export async function getThreadUtterancesUnknownSpeakers(threadId: string): Promise<UtteranceDTO[]> {
  const response = await fetch(`${apiUrl}/conversations/${threadId}/unknown-speakers/utterances`);
  if (!response.ok) {
    throw new Error(`Error fetching unknown speakers: ${response.statusText}`);
  }

  return await response.json();
}

export async function updateThreadUtterancesSpeaker(data: UpdateThreadUtterancesSpeakerPayload) {
  const urlParams = new URLSearchParams();
  urlParams.append('speaker_changed_id', data.speakerChangedId);
  urlParams.append('conversation_id', data.conversationId);

  const response = await fetch(`${apiUrl}/utterances/speaker/${data.speakerId}?${urlParams.toString()}`, {
    method: 'PUT'
  });

  if (!response.ok) {
    throw new Error(`Error updating utterances speaker: ${response.statusText}`);
  }
}

export async function getThreadUtterances(data: GetThreadUterancesPayload): Promise<UtteranceDTO[]> {
  const urlParams = new URLSearchParams();
  if (data.speakerId) {
    urlParams.append('speaker_id', data.speakerId);
  }

  const response = await fetch(`${apiUrl}/conversations/${data.threadId}/utterances?${urlParams.toString()}`);
  if (!response.ok) {
    throw new Error(`Error fetching utterances: ${response.statusText}`);
  }

  return await response.json();
}

export async function getThreadSpeakers(threadId: string): Promise<Speaker[]> {
  const response = await fetch(`${apiUrl}/conversations/${threadId}/speakers`);
  if (!response.ok) {
    throw new Error(`Error fetching speakers: ${response.statusText}`);
  }

  return await response.json();
}

export async function getThread(threadId: string): Promise<Conversation> {
  const response = await fetch(`${apiUrl}/conversations/${threadId}`);

  if (!response.ok) {
    throw new Error(`Error fetching thread: ${response.statusText}`);
  }

  return await response.json();
}

export async function getThreads(): Promise<Conversation[]> {
  const response = await fetch(`${apiUrl}/conversations`);

  if (!response.ok) {
    throw new Error(`Error fetching threads: ${response.statusText}`);
  }

  return await response.json();
}

export async function addConversation(data: AddConversationPayload): Promise<Conversation> {
  const { title, description, youtubeLink, threadDate } = data;

  const url = new URL(youtubeLink);
  const youtubeId = url.searchParams.get('v') || '';

  const response = await fetch(`${apiUrl}/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      description: description,
      youtube_id: youtubeId,
      conversation_date: threadDate,
      youtube_url: youtubeLink,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return await response.json();
}