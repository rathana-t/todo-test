import { HTTPMethod } from "@/app/constants/HTTPMethod";
import { handleResponse } from "@/app/models/BaseReponse";
import { TodoDto, TodoTable } from "@/app/models/TodoDto";
import supabase from "@/db/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case HTTPMethod.PUT:
      return handlePutRequest(req, res)();
    case HTTPMethod.DELETE:
      return handleDeleteRequest(req, res)();
    default:
      res.setHeader("Allow", [HTTPMethod.PUT, HTTPMethod.DELETE]);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
      break;
  }
}

function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  return async () => {
    const { todo, isCompleted } = req.body;
    const { id } = req.query;
    const response = await supabase
      .from(TodoTable)
      .update({ todo, isCompleted })
      .match({ id });

    handleResponse<TodoDto>(res, response);
  };
}

function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  return async () => {
    const { id } = req.query;
    const response = await supabase.from(TodoTable).delete().match({ id });
    handleResponse<TodoDto>(res, response);
  };
}
