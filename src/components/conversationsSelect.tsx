import {useQuery} from "@tanstack/react-query";
import {getConversations} from "../api/searchApi.ts";
import React from "react";

type SpeakerSelectProp = {
  onChange?: (speakerId: string) => void;
  value?: string;
}

export default function ConversationsSelect({onChange, value}: SpeakerSelectProp) {
  const {isPending, error, data} = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      return await getConversations();
    }
  })

  function handleSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedValue = event.target.value;
    if (onChange) {
      onChange(selectedValue);
    }
  }

  if (isPending) {
    return <div>Loading conversations...</div>
  }

  if (error) {
    return <div>Error loading conversations: {error.message}</div>
  }

  return (
    <select
      onChange={handleSelect}
      value={value}
      className="w-full px-4 py-2 bg-nord-dark-2 text-white rounded-lg">
      <option value="">Select a conversation</option>
      {data.map(conversation => (
        <option key={conversation.id} value={conversation.id}>
          {conversation.title}
        </option>
      ))}
    </select>
  )
}