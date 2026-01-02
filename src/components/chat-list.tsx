"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "./providers";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { createChatSchema } from "@/lib/schemas";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "./field";
import { Input } from "./input";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const ChatList: React.FC = () => {
  const trpc = useTRPC();
  const query = useQuery(trpc.chat.list.queryOptions());
  const params = useParams();

  return (
    <div>
      <div className="flex gap-2">
        {query.status === "pending" && <p>Loading chats...</p>}
        {query.status === "success" && query.data.length === 0 ? (
          <p className="text-muted-foreground">
            No chats yet. Start a chat or get invited to one!
          </p>
        ) : (
          <h2 className="font-semibold">Your Chats</h2>
        )}

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

      {query.status === "success" && query.data.length > 0 && (
        <ul className="mt-4 flex flex-col gap-0.5">
          {query.data.map((chat) => (
            <li key={chat.id}>
              <Link
                href={`/chat/${chat.id}`}
                className={cn(
                  "block -mx-3 px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors",
                  chat.id === params.chatId
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
  const createChat = useMutation(
    trpc.chat.create.mutationOptions({
      onSuccess() {},
    })
  );
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
        router.push(`/chat/${newChat.id}`);
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
