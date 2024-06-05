import supabase from "@/db/supabase";
import { HTTPMethod } from "@/app/constants/HTTPMethod";
import { NextApiRequest, NextApiResponse } from "next";
import { TodoDto, TodoTable } from "@/app/models/TodoDto";
import { handleResponse } from "@/app/models/BaseReponse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case HTTPMethod.GET:
      return handleGetRequest(req, res)();
    case HTTPMethod.POST:
      return handlePostRequest(req, res)();
    default:
      res.setHeader("Allow", [HTTPMethod.GET, HTTPMethod.POST]);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
      break;
  }
}

function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  return async () => {
    const response = await supabase.from(TodoTable).select("*");

    handleResponse<TodoDto[]>(res, response);
  };
}

function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  return async () => {
    const { todo } = req.body as TodoDto;
    const response = await supabase
      .from(TodoTable)
      .insert({ todo })
      .select()
      .single();

    handleResponse<TodoDto>(res, response);
  };
}
