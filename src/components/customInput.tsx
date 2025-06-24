import React from 'react';

type CustomInputProps = {
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  value?: string;
  required?: boolean;
}

export default function CustomInput({placeholder, className, onChange, value, required}: CustomInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      onChange(e.target.value);
    }
  }

  return (
    <input
      className={"w-full text-2xl rounded-lg border-2 border-nord-dark-2 px-4 py-3 focus:outline-none focus:border-nord-aurora-0 transition " + (className || '')}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      required={required}
    />
  )
}