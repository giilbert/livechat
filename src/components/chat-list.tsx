"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { createChatSchema } from "../lib/schemas";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "./field";
import { Input } from "./input";
import { cn } from "../lib/utils";
import { useTRPC } from "@/lib/trpc-client";
import { Link, useRouter } from "@tanstack/react-router";

export const ChatList: React.FC<{
  selectedChatId?: string;
}> = ({ selectedChatId }) => {
  const trpc = useTRPC();
  const query = useQuery(trpc.chat.list.queryOptions());

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <h2 className="font-semibold">Your Chats</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="icon-sm"
              variant={
                query.data && query.data.length > 0 ? "ghost" : "default"
              }
              className="ml-auto"
            >
              <PlusIcon size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Chat</DialogTitle>
              <DialogDescription>
                Create a new chat to start messaging.
              </DialogDescription>
            </DialogHeader>

            <CreateChatForm />
          </DialogContent>
        </Dialog>
      </div>

      {query.status === "pending" && <p className="pt-1.5">Loading chats...</p>}
      {query.status === "error" && (
        <p className="text-destructive pt-1.5">Error loading chats</p>
      )}

      {query.status === "success" && query.data.length === 0 && (
        <p className="text-muted-foreground pt-1.5">
          No chats yet. Start a chat or get invited to one!
        </p>
      )}

      {query.status === "success" && query.data.length > 0 && (
        <ul className="flex flex-col gap-0.5">
          {query.data.map((chat) => (
            <li key={chat.id}>
              <Link
                to="/chat/$chatId"
                params={{ chatId: chat.id }}
                className={cn(
                  "block -mx-3 px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors",
                  chat.id === selectedChatId
                    ? "bg-accent dark:bg-accent/40 text-accent-foreground"
                    : ""
                )}
              >
                {chat.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CreateChatForm: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(createChatSchema),
    defaultValues: { name: "" },
  });
  const qc = useQueryClient();
  const trpc = useTRPC();
  const createChat = useMutation(trpc.chat.create.mutationOptions());
  const router = useRouter();

  const errors = form.formState.errors;
  const isLoading =
    form.formState.isSubmitting || form.formState.isSubmitSuccessful;

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const newChat = await createChat.mutateAsync(values);
        await qc.refetchQueries({ queryKey: trpc.chat.list.queryKey() });
        router.navigate({
          to: "/chat/$chatId",
          params: { chatId: newChat },
        });
      })}
    >
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              autoComplete="off"
              autoCorrect="off"
              {...form.register("name")}
              disabled={isLoading}
            />
            <FieldDescription>
              A name for your new chat (max 100 characters)
            </FieldDescription>
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create
      </Button>
    </form>
  );
};
