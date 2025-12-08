"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useAddTaskMutation, useUpdateTaskMutation } from "@/features/tasks/tasksApi";
import { closeTaskForm } from "@/features/ui/uiSlice";
import { MdCheck, MdAdd } from "react-icons/md";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Button,
  VStack,
  HStack,
  Icon,
  useToast,
} from "@chakra-ui/react";

export default function TaskForm() {
  const dispatch = useDispatch();
  const editingTask = useSelector((state) => state.ui.editingTask);
  const showTaskForm = useSelector((state) => state.ui.showTaskForm);
  const toast = useToast();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: editingTask || { title: "", description: "", completed: false },
  });

  // Suporte a teclado: Escape para fechar modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showTaskForm) {
        dispatch(closeTaskForm());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, showTaskForm]);

  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const onSubmit = async (data) => {
    try {
      if (editingTask) {
        await updateTask({ ...editingTask, ...data }).unwrap();
        toast({
          title: "Tarefa atualizada",
          description: "A tarefa foi atualizada com sucesso.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addTask(data).unwrap();
        toast({
          title: "Tarefa criada",
          description: "A tarefa foi criada com sucesso.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      reset();
      dispatch(closeTaskForm());
    } catch (err) {
      console.error("Erro ao salvar tarefa:", err);
      toast({
        title: "Erro ao salvar tarefa",
        description: "Ocorreu um erro ao salvar a tarefa. Tente novamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal
      isOpen={showTaskForm}
      onClose={() => dispatch(closeTaskForm())}
      size="md"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader id="taskform-title" color="brand.400">
          {editingTask ? "Editar Tarefa" : "Criar Tarefa"}
        </ModalHeader>
        <ModalCloseButton color="brand.400" _hover={{ color: "brand.300" }} />

        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="brand.400">Título</FormLabel>
                <Input
                  id="task-title"
                  type="text"
                  placeholder="Título da tarefa"
                  {...register("title", { required: true })}
                  aria-label="Título da tarefa"
                />
              </FormControl>

              <FormControl>
                <FormLabel color="brand.400">Descrição</FormLabel>
                <Textarea
                  id="task-description"
                  placeholder="Descreva a tarefa..."
                  {...register("description")}
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <Checkbox
                  {...register("completed")}
                  id="task-completed"
                  colorScheme="green"
                  size="lg"
                >
                  Concluída
                </Checkbox>
              </FormControl>

              <HStack w="full" spacing={3} pt={2} flexDirection={{ base: "column", sm: "row" }}>
                <Button
                  type="submit"
                  aria-label={editingTask ? "Atualizar tarefa" : "Criar nova tarefa"}
                  colorScheme="green"
                  flex={1}
                  leftIcon={<Icon as={editingTask ? MdCheck : MdAdd} />}
                >
                  {editingTask ? "Atualizar" : "Criar"}
                </Button>
                <Button
                  type="button"
                  onClick={() => dispatch(closeTaskForm())}
                  aria-label="Cancelar"
                  colorScheme="gray"
                  flex={1}
                >
                  Cancelar
                </Button>
              </HStack>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
