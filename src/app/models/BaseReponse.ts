import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { NextApiResponse } from "next";

export interface BaseResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export function handleResponse<T>(
  res: NextApiResponse<BaseResponse<T>>,
  response: PostgrestSingleResponse<any>
) {
  const { data, error } = response;
  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(200).json({ data, message: "Success"});
  }
}
