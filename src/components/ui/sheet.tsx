"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;
export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;

export function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof Dialog.Content> & { side?: "right" | "bottom" }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <Dialog.Content
        className={cn(
          "border-border bg-bg fixed z-50 flex flex-col shadow-2xl focus:outline-none",
          side === "right" && "inset-y-0 right-0 h-full w-full border-l sm:max-w-lg",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[85vh] rounded-t-[var(--radius-card)] border-t",
          className,
        )}
        {...props}
      >
        {children}
        <Dialog.Close
          className="text-muted hover:bg-surface-2 hover:text-fg absolute top-4 right-4 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="size-4" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
