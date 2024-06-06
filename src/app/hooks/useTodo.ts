import { useRef, useState } from "react";
import { TodoDto, TodoRequest } from "../models/TodoDto";
import TodoService from "../services/todoService";
import {
  compareIgnoreCase,
  containIgnoreCase,
  handleError,
} from "../libs/utils";
import supabase from "@/db/supabase";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

const todoListOriginalKey = "todoListOriginal";

export function useTodo() {
  const [todoList, setTodoList] = useState<TodoDto[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isEmptyResult, setIsEmpty] = useState<boolean>(false);
  const [newTodo, setNewTodo] = useState<string>("");
  const [editTodo, setEditTodo] = useState<TodoDto>({} as TodoDto);
  const newItemInputRef = useRef<HTMLInputElement>(null);

  const todoService = new TodoService();

  const getTodoList = async () => {
    const { data, error } = await todoService.get<TodoDto>();
    if (error) {
      handleError(error);
    }

    if (data) {
      setOriginalTodoList(data);
      setTodoList(data);
    }
  };

  const setOriginalTodoList = (data: TodoDto[]) => {
    localStorage.setItem(todoListOriginalKey, JSON.stringify(data));
  };

  const subscribeToTodo = () => {
    supabase
      .channel("schema-db-changes")
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL,
          schema: "public",
        },
        (payload: RealtimePostgresChangesPayload<TodoDto>) => {
          handleEvent(payload);
        }
      )
      .subscribe();
  };

  const handleEvent = (payload: RealtimePostgresChangesPayload<TodoDto>) => {
    const { eventType, new: newData, old, table } = payload;
    switch (eventType) {
      case REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT:
        setTodoList([newData, ...todoList]);
        setOriginalTodoList([newData, ...todoList]);
        break;
      case REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE:
        updateTodoList(newData);
        break;
      case REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE:
        if (old?.id) {
          removeTodo(old?.id);
        }
        break;
    }
  };

  const handleAddTodo = async () => {
    const { data, error } = await todoService.post<TodoRequest, TodoDto>({
      todo: newTodo,
      isCompleted: false,
    });

    if (error) {
      handleError(error);
    }

    // if (data?.id) {
    //   setTodoList([data, ...todoList]);
    // }

    setNewTodo("");
  };

  const handleMarkAsComplete = async (todo: TodoDto) => {
    if (todo.isCompleted) {
      return;
    }

    const { error } = await todoService.put<TodoRequest, TodoDto>(todo.id, {
      todo: todo.todo,
      isCompleted: true,
    });

    if (error) {
      handleError(error);
    }

    updateTodoList({ ...todo, isCompleted: true });
  };

  const removeTodo = (id: string) => {
    const updatedTodoList = todoList.filter((item) => item.id !== id);
    setTodoList(updatedTodoList);
    setOriginalTodoList(updatedTodoList);
  };

  const handleUpdateToDo = async () => {
    const { error } = await todoService.put<TodoRequest, TodoDto>(editTodo.id, {
      todo: newTodo,
      isCompleted: editTodo.isCompleted,
    });

    if (error) {
      handleError(error);
    }

    // updateTodoList({ ...editTodo, todo: newTodo });
    setNewTodo("");
    setEditTodo({} as TodoDto);
  };

  const updateTodoList = (todo: TodoDto) => {
    const updatedTodoList = todoList.map((item) => {
      if (item.id === todo.id) {
        return todo;
      }

      return item;
    });

    setTodoList(updatedTodoList);
    setOriginalTodoList(updatedTodoList);
  };

  const handleDelete = async (todo: TodoDto) => {
    const { error } = await todoService.delete(todo.id);

    if (error) {
      handleError(error);
    }

    // getTodoList();
  };

  const handleEdit = (todo: TodoDto) => {
    setNewTodo(todo.todo);
    setEditTodo(todo);

    newItemInputRef.current?.focus();
  };

  const filterTodo = (search: string) => {
    if (!search?.trim()) {
      getTodoList();

      setIsEmpty(false);
      return;
    }

    const originalTodoList = JSON.parse(
      localStorage.getItem(todoListOriginalKey) || "[]"
    ) as TodoDto[];

    const filteredTodo = originalTodoList.filter((todo) =>
      containIgnoreCase(todo.todo, search)
    );
    setTodoList(filteredTodo);

    setIsEmpty(filteredTodo.length === 0);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      if (!newTodo?.trim()) {
        alert("Todo cannot be empty");
        return;
      }

      if (editTodo?.id) {
        handleUpdateToDo();
      } else {
        if (ifDuplicateTodo()) {
          alert(`Todo "${newTodo}" already exists`);
          return;
        }

        handleAddTodo();
      }
    }
  };

  const ifDuplicateTodo = () => {
    return todoList.some((todo) => compareIgnoreCase(todo.todo, newTodo));
  };

  return {
    todoList,
    newTodo,
    search,
    isEmptyResult,
    newItemInputRef,
    filterTodo,
    setSearch,
    getTodoList,
    handleMarkAsComplete,
    setNewTodo,
    handleDelete,
    handleEdit,
    handleKeyDown,
    subscribeToTodo,
  };
}
