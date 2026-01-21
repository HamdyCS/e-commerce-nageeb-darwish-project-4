import { atom } from "jotai";

export const windowSizeAtom = atom<number>(window.innerWidth);
