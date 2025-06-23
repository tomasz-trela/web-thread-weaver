import { apiUrl } from "../environment";

type Conversation = {
    created_at: string
    description: string | null
    video_filename: string | null
    title: string
    id: number
    youtube_id: string | null
    conversation_date: string | null
}

type Speaker = {
    id: number
    name: string
    surname: string
}

type UtteranceDTO = {
    id: number
    start_time: number
    end_time: number
    text: string
    speaker_id: number
    conversation_id: number
    conversation: Conversation
    speaker_surname: string | null
    speaker: Speaker | null
}


export async function fullTextSearch(query: string): Promise<UtteranceDTO[]> {
    const urlParams = new URLSearchParams({ query });

    const response = await fetch(`${apiUrl}/conversations/full-text?${urlParams.toString()}`);
    
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    
    return response.json();
}