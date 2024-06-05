export interface TodoDto {
  id: string;
  todo: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface TodoRequest {
  todo: string;
  isCompleted: boolean;
}

export const TodoTable = "todos";