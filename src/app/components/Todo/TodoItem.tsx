import { TodoDto } from "@/app/models/TodoDto";
import { useState } from "react";

type TodoItemProps = {
  todo: TodoDto;
  markAsComplete: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
};

export default function TodoItem(props: TodoItemProps) {
  const { todo, markAsComplete, handleEdit, handleDelete } = props;
  const [isHovered, setIsHovered] = useState(false);

  const mouseEnter = () => setIsHovered(true);
  const mouseLeave = () => setIsHovered(false);
  const getClassName = () => {
    let defaultClass = "  py-1 px-4 rounded w-52 ";
    if (todo.isCompleted) {
      defaultClass += "text-green-500 ";
    } else {
      defaultClass += "bg-slate-500 hover:bg-slate-700 text-white ";
    }

    return defaultClass;
  };

  return (
    <div
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      className="flex items-center gap-5 w-full justify-between py-1 min-h-[50px] max-h-min"
    >
      <div key={todo.id}>
        {todo.isCompleted ? <s>{todo.todo}</s> : todo.todo}
      </div>
      {isHovered && (
        <div className="flex items-center gap-5">
          {!todo.isCompleted && (
            <button
              disabled={todo.isCompleted}
              className={getClassName()}
              onClick={markAsComplete}
            >
              Mark as Complete
            </button>
          )}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white  py-1 px-4 rounded"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white  py-1 px-4 rounded"
            onClick={handleDelete}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
