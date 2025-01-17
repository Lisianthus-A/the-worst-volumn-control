import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import type { TypedUseSelectorHook } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
