import React from "react";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  text: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ text }: ButtonProps) {
  return (
    <button className="w-max shadow-xl py-3 px-6 min-w-32 text-sm text-white font-medium rounded-md bg-purple-500 hover:bg-purple-500 focus:outline-none cursor-pointer hover:scale-105 transition duration-200">
      {text}
    </button>
  );
}
