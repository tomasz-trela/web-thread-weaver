export type Conversation = {
  created_at: string
  description: string | null
  video_filename: string | null
  title: string
  id: number
  youtube_id: string | null
  youtube_url: string | null
  conversation_date: string | null
  status: string
}

export type Speaker = {
  id: number
  name: string
  surname: string
}

export type UtteranceDTO = {
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