import React from "react";
import { cn } from "@/lib/utils";


interface Props {
  message: string;
  isUser: boolean;
  className?: string;
}

export function ChatMessage({ message, isUser }: Props) {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {message}
      </div>
    </div>
  );
}
