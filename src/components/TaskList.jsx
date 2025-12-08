"use client";
import { useDispatch, useSelector } from "react-redux";
import TaskForm from "./TaskForm";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { useGetTasksQuery, useDeleteTaskMutation } from "@/features/tasks/tasksApi";
import { useSession } from "next-auth/react";
import { openTaskForm } from "@/features/ui/uiSlice";
import {
  Box,
  VStack,
  Button,
  Text,
  HStack,
  Heading,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

export default function TaskList() {
  const { data: session } = useSession();
  const { data: tasks, isLoading } = useGetTasksQuery(undefined, { skip: !session });
  const [deleteTask] = useDeleteTaskMutation();
  const dispatch = useDispatch();
  const showTaskForm = useSelector((state) => state.ui.showTaskForm);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete._id).unwrap();
        toast({
          title: "Tarefa deletada",
          description: `A tarefa "${taskToDelete.title}" foi deletada.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: "Erro ao deletar tarefa",
          description: "Ocorreu um erro ao deletar a tarefa. Tente novamente.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setTaskToDelete(null);
      onClose();
    }
  };

  if (!session) {
    return (
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        Faça login para ver suas tarefas.
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <Spinner size="xl" color="brand.400" thickness="4px" />
      </Box>
    );
  }

  const taskList = Array.isArray(tasks) ? tasks : [];

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <Button
          onClick={() => dispatch(openTaskForm(null))}
          aria-label="Criar nova tarefa"
          colorScheme="green"
          leftIcon={<Icon as={MdAdd} />}
          w={{ base: "full", sm: "auto" }}
        >
          Criar Nova Tarefa
        </Button>
      </Box>

      {showTaskForm && <TaskForm />}

      {taskList.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Text color="gray.400" fontSize="lg">
            Nenhuma tarefa encontrada
          </Text>
        </Box>
      ) : (
        <VStack spacing={2} align="stretch">
          {taskList.map((task) => (
            <Box
              key={task._id}
              bg="gray.800"
              borderWidth="1px"
              borderColor="gray.700"
              borderRadius="md"
              p={4}
            >
              <HStack justify="space-between" align="start" spacing={4}>
                <Box flex={1}>
                  <Heading
                    as="h3"
                    size="md"
                    textDecoration={task.completed ? "line-through" : "none"}
                    color={task.completed ? "gray.500" : "brand.400"}
                    mb={task.description ? 2 : 0}
                  >
                    {task.title}
                  </Heading>
                  {task.description && (
                    <Text color="gray.300" fontSize="sm">
                      {task.description}
                    </Text>
                  )}
                </Box>
                <HStack spacing={2}>
                  <Button
                    onClick={() => dispatch(openTaskForm(task))}
                    aria-label={`Editar ${task.title}`}
                    colorScheme="blue"
                    size="sm"
                    leftIcon={<Icon as={MdEdit} />}
                    display={{ base: "none", sm: "flex" }}
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => dispatch(openTaskForm(task))}
                    aria-label={`Editar ${task.title}`}
                    colorScheme="blue"
                    size="sm"
                    iconSpacing={0}
                    display={{ base: "flex", sm: "none" }}
                  >
                    <Icon as={MdEdit} />
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(task)}
                    aria-label={`Deletar ${task.title}`}
                    colorScheme="red"
                    size="sm"
                    leftIcon={<Icon as={MdDelete} />}
                    display={{ base: "none", sm: "flex" }}
                  >
                    Deletar
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(task)}
                    aria-label={`Deletar ${task.title}`}
                    colorScheme="red"
                    size="sm"
                    iconSpacing={0}
                    display={{ base: "flex", sm: "none" }}
                  >
                    <Icon as={MdDelete} />
                  </Button>
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar Tarefa
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja deletar a tarefa "{taskToDelete?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
}
