import React from "react";

const Input = ({value,label, placeholder, type, onChange }) => {
  return (
    <div className="p-3 flex flex-col gap-y-1">
      <label for="input" className="font-semibold text-base">
        {label}
      </label>
      <input
        value={value}
        id="input"
        placeholder={placeholder}
        type={type}
        onChange={onChange}
        className="w-full rounded-md font-medium text-base border-2 border-slate-400 p-2"
      ></input>
    </div>
  );
};

export default Input;
