'use client';

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
      <label
        htmlFor={name}
        className="block mb-1 text-sm text-gray-700 font-medium"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="
          w-full 
          rounded-md 
          border border-gray-300 
          bg-white 
          px-3 py-2 
          text-sm 
          text-gray-800 
          placeholder-gray-400 
          focus:border-indigo-500 
          focus:ring-1 focus:ring-indigo-500 
          transition
        "
        {...props}
      />
    </div>
  );
}
