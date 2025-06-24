import {useQuery} from "@tanstack/react-query";
import {getSpeakers} from "../api/searchApi.ts";
import React from "react";

type SpeakerSelectProp = {
  onChange?: (speakerId: string) => void;
  value?: string;
}

export default function SpeakersSelect({onChange, value}: SpeakerSelectProp) {
  const {isPending, error, data} = useQuery({
    queryKey: ['speakers'],
    queryFn: async () => {
      return await getSpeakers();
    }
  })

  function handleSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedValue = event.target.value;
    if (onChange) {
      onChange(selectedValue);
    }
  }

  if (isPending) {
    return <div>Loading speakers...</div>
  }

  if (error) {
    return <div>Error loading speakers: {error.message}</div>
  }

  return (
    <select
      onChange={handleSelect}
      value={value}
      className="w-full px-4 py-2 bg-nord-dark-2 text-white rounded-lg">
      <option value="">Select a speaker</option>
      {data.map(speaker => (
        <option key={speaker.id} value={speaker.id}>
          {speaker.name} {speaker.surname}
        </option>
      ))}
    </select>
  )
}