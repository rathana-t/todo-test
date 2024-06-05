import { useEffect } from "react";
import { TodoDto } from "@/app/models/TodoDto";
import TodoItem from "./TodoItem";
import { useTodo } from "@/app/hooks/useTodo";

export default function TodoList() {
  const {
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
    subscribeToTodo,
    handleKeyDown,
  } = useTodo();

  subscribeToTodo();

  useEffect(() => {
    getTodoList();
  }, []);

  const _renderSearchInput = () => {
    return (
      <div className="mt-5">
        <input
          className="border p-1 w-96 border-gray-400 h-10 rounded-md"
          type="text"
          placeholder="Search todo"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            filterTodo(e.target.value);
          }}
        />
      </div>
    );
  };

  const _renderTodoList = () => {
    const list = (
      <>
        {todoList?.map((todo: TodoDto) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            markAsComplete={() => handleMarkAsComplete(todo)}
            handleEdit={() => handleEdit(todo)}
            handleDelete={() => handleDelete(todo)}
          />
        ))}
      </>
    );

    return (
      <div>
        <h1 className="text-4xl flex justify-center">Todo List</h1>
        <div className="bg-slate-50 flex flex-col divide-y-2 h-[500px] border p-5 overflow-auto">
          {isEmptyResult ? (
            <div className="flex justify-center items-center h-full text-xl text-slate-400">
              No result. Create a new one instead!
            </div>
          ) : (
            list
          )}
        </div>
      </div>
    );
  };

  const _renderInput = () => {
    return (
      <div className="mt-5">
        <p className="text-slate-400">
          <span className="text-slate-600 font-semibold">
            &apos;Enter&apos;
          </span>{" "}
          to submit
        </p>
        <input
          ref={newItemInputRef}
          className="border p-1 w-96 border-gray-400 h-10 rounded-md"
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
        />
      </div>
    );
  };

  return (
    <>
      {_renderSearchInput()}
      {_renderTodoList()}
      {_renderInput()}
    </>
  );
}
