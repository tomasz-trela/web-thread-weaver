import {useState} from "react";
import CustomInput from "./customInput.tsx";
import {addSpeaker, type AddSpeakerPayload} from "../api/apiSpeaker";
import {useMutation} from "@tanstack/react-query";

type AddSpeakerModalProps = {
  onClose?: () => void;
  onAdd?: (speaker: AddSpeakerPayload) => void;
  className?: string;
}

function Modal({ onClose, onAdd }: AddSpeakerModalProps) {
  const mutation = useMutation({
    mutationFn: (data: AddSpeakerPayload) => {
      return addSpeaker(data)
    },
    onSettled: (_data, _error, variables) => {
      if (onAdd) {
        onAdd(variables);
      }
    }
  });

  const [speaker, setSpeaker] = useState({
    name: '',
    surname: ''
  })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate(speaker)
  }

  if (mutation.isPending) {
    return <div className="fixed inset-0 bg-nord-dark-0/75 flex items-center justify-center">
      <div className="text-center text-2xl">Adding speaker...</div>
    </div>
  }

  return (
    <div className="fixed inset-0 bg-nord-dark-0/75 flex items-center justify-center">
      <form onSubmit={onSubmit} className="flex flex-col justify-between p-4 bg-nord-dark-1 min-w-[450px] w-3/10 h-[50vh]">
        <div>
          <h1 className="text-center text-2xl mt-4">Add Speaker</h1>

          <CustomInput
            value={speaker.name}
            onChange={(value) => setSpeaker({...speaker, name: value})}
            placeholder="Name"
            className="mt-12"
            required={true}
          />

          <CustomInput
            value={speaker.surname}
            onChange={(value) => setSpeaker({...speaker, surname: value})}
            placeholder="Surname"
            className="mt-4"
            required={true}
          />
        </div>

        <div className="text-right">
          <button type="submit" className='p-4 w-1/4 bg-nord-aurora-3 text-nord-light-3 rounded transition-all duration-200 ease-in-out hover:bg-nord-dark-3 hover:cursor-pointer hover:shadow-xl disabled:bg-nord-dark-1 disabled:text-nord-dark-3'>Add</button>
          <button onClick={onClose} className='p-4 ml-5 w-1/4 bg-nord-aurora-0 rounded transition-all duration-200 ease-in-out hover:bg-nord-dark-3 hover:cursor-pointer hover:shadow-xl disabled:bg-nord-dark-1 disabled:text-nord-dark-3'>Cancel</button>
        </div>
      </form>
    </div>
  )
}


export default function AddSpeakerModal({onAdd, onClose, className}: AddSpeakerModalProps) {
  const [isOpened, setIsOpened] = useState(false)

  function handleOpen(value: boolean) {
    setIsOpened(value);
    if (value) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  function handleClose() {
    setIsOpened(false);
    if (onClose) {
      onClose();
    }
  }

  function handleOnAdd(speaker: AddSpeakerPayload) {
    handleOpen(false)
    if (onAdd) {
      onAdd(speaker);
    }
  }

  return (<>
    <button
      onClick={() => handleOpen(true)}
      className={"p-4 bg-nord-aurora-3 text-nord-light-3 rounded transition-all duration-200 ease-in-out hover:bg-nord-dark-3 hover:cursor-pointer hover:shadow-xl disabled:bg-nord-dark-1 disabled:text-nord-dark-3 " + (className || '')}
    >
      Add speaker
    </button>
    {isOpened && <Modal onAdd={handleOnAdd} onClose={handleClose} />}
  </>)
}