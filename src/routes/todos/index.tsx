import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { createTodo, deleteTodo, getTodos, updateTodo } from "@/functions/todos";
import { todoSchema } from "@/lib/db/zod-schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { addDays, format } from "date-fns";
import { CalendarIcon, CheckCheck, Loader2, Trash2, X } from "lucide-react";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/todos/")({
  component: RouteComponent,
  beforeLoad({ context: { session } }) {
    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  const form = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      date: undefined,
    },
  });

  const queryClient = useQueryClient();

  async function onSubmit(values: z.infer<typeof todoSchema>) {
    mutate({ data: values });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createTodo,
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <Container className="mt-10 flex gap-x-10">
      <Card className="h-fit max-w-[400px]">
        <CardContent>
          <CardTitle className="font-bold">Add Todos</CardTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 flex flex-col space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input readOnly={isPending} placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                    <div className="flex flex-wrap gap-2 !pt-4">
                      {[
                        { label: "Today", value: 0 },
                        { label: "Tomorrow", value: 1 },
                        { label: "In 3 days", value: 3 },
                        { label: "In a week", value: 7 },
                        { label: "In 2 weeks", value: 14 },
                      ].map((preset) => (
                        <Button
                          key={preset.value}
                          variant="outline"
                          size="sm"
                          type="button"
                          className="flex-1 bg-transparent"
                          onClick={() => {
                            const newDate = addDays(new Date(), preset.value);
                            form.setValue("date", newDate);
                          }}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? <Loader2 className="animate-spin" /> : null} Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent>
          <CardTitle className="text-xl font-bold">Pending Todos</CardTitle>
          <Suspense fallback={<Loading />}>
            <Todos />
          </Suspense>
        </CardContent>
      </Card>
    </Container>
  );
}

function Todos() {
  const { data } = useSuspenseQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const queryClient = useQueryClient();

  const { mutate: updateCompleteStatus } = useMutation({
    mutationFn: updateTodo,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteTodo,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  function handleIncomplete(id: string) {
    updateCompleteStatus({
      data: {
        id,
        completed: false,
      },
    });
  }

  function handleComplete(id: string) {
    updateCompleteStatus({
      data: {
        id,
        completed: true,
      },
    });
  }

  function handleDelete(id: string) {
    deleteMutation({ data: { id } });
  }

  return (
    <div className="mt-5 flex flex-col gap-4">
      {data.data?.length == 0 && <div className="">No Todos</div>}
      {data.data?.map((todo) => (
        <Card key={todo.id}>
          <CardContent>
            <CardTitle>{todo.title}</CardTitle>
            <div className="flex items-center justify-between">
              <h5>
                {todo.date.toLocaleDateString("en-US", {
                  dateStyle: "medium",
                  timeZone: "Asia/Kolkata",
                })}
              </h5>
              <div className="flex gap-x-3">
                {todo.completed ? (
                  <Button size={"icon"} onClick={() => handleIncomplete(todo.id)}>
                    <CheckCheck />
                  </Button>
                ) : (
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    onClick={() => handleComplete(todo.id)}
                  >
                    <X />
                  </Button>
                )}
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => handleDelete(todo.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Loading() {
  return (
    <div className="mt-3 flex flex-col space-y-3">
      <Skeleton className="h-[150px] w-full rounded-lg" />
      <Skeleton className="h-[150px] w-full rounded-lg" />
      <Skeleton className="h-[150px] w-full rounded-lg" />
    </div>
  );
}
