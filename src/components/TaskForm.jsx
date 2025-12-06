"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useAddTaskMutation, useUpdateTaskMutation } from "@/features/tasks/tasksApi";
import { closeTaskForm } from "@/features/ui/uiSlice";
import { MdCheck, MdAdd } from "react-icons/md";
import { FiX } from "react-icons/fi";

export default function TaskForm() {
  const dispatch = useDispatch();
  const editingTask = useSelector((state) => state.ui.editingTask);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: editingTask || { title: "", description: "", completed: false },
  });

  // Suporte a teclado: Escape para fechar modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        dispatch(closeTaskForm());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const onSubmit = async (data) => {
    try {
      if (editingTask) {
        await updateTask({ ...editingTask, ...data }).unwrap();
      } else {
        await addTask(data).unwrap();
      }
      reset();
      dispatch(closeTaskForm());
    } catch (err) {
      console.error("Erro ao salvar tarefa:", err);
      alert("Erro ao salvar tarefa. Verifique o console.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center sm:items-center justify-center z-50 p-3 sm:p-4 modal-enter" role="dialog" aria-modal="true" aria-labelledby="taskform-title">
      <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative border-2 border-green-400 modal-content-enter">
        <button
          onClick={() => dispatch(closeTaskForm())}
          aria-label="Fechar modal de tarefa"
          className="absolute top-2 sm:top-4 right-2 sm:right-4 text-green-400 hover:text-green-300 text-2xl font-bold w-8 h-8 flex items-center justify-center transition-fast"
        >
          <FiX className="w-5 h-5" aria-hidden="true" />
        </button>

        <h2 id="taskform-title" className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 pr-6 text-green-400">{editingTask ? "Editar Tarefa" : "Criar Tarefa"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 sm:space-y-4">
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-green-400 mb-2">Título</label>
            <input
              id="task-title"
              type="text"
              placeholder="Título da tarefa"
              {...register("title", { required: true })}
              aria-label="Título da tarefa"
              aria-required="true"
              className="w-full border-2 border-green-400 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-300 form-input"
              style={{ backgroundColor: '#ffffff', color: '#111827', borderColor: '#16a34a' }}
              required
            />
          </div>

          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-green-400 mb-2">Descrição</label>
            <textarea
              id="task-description"
              placeholder="Descreva a tarefa..."
              {...register("description")}
              rows={4}
              className="w-full border-2 border-green-400 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-300 form-input"
              style={{ backgroundColor: '#ffffff', color: '#111827', borderColor: '#16a34a' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("completed")} id="task-completed" />
            <label htmlFor="task-completed" className="text-sm">Concluída</label>
          </div>

          <div className="flex gap-2 sm:gap-3 pt-2 flex-col sm:flex-row">
            <button
              type="submit"
              aria-label={editingTask ? "Atualizar tarefa" : "Criar nova tarefa"}
              className="flex-1 bg-green-500 text-white px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-green-600 transition font-medium border-2 border-green-400 btn-primary flex items-center justify-center gap-2"
            >
              {editingTask ? <MdCheck className="w-5 h-5" aria-hidden="true" /> : <MdAdd className="w-5 h-5" aria-hidden="true" />}
              <span>{editingTask ? "Atualizar" : "Criar"}</span>
            </button>
            <button
              type="button"
              onClick={() => dispatch(closeTaskForm())}
              aria-label="Cancelar"
              className="flex-1 bg-gray-700 text-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-gray-600 transition font-medium border-2 border-gray-500 btn-primary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
