'use client';

import { Input } from "./input";
import { Label } from "./label";

export default function FloatingInput({
  label,
  type = 'text',
  name = '',
  value,
  onChange,
  ...props
}) {
  return (
    <div className="relative w-full">
      <Label
        htmlFor={name}
        className="block mb-1 text-sm font-medium"
      >
        {label}
      </Label>
      <Input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}
