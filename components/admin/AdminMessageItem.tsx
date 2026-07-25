"use client";

import { useState } from "react";
import { ContactMessage } from "@prisma/client";
import { markMessageRead } from "@/actions/admin";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const subjectLabels: Record<string, string> = {
  order: "Order Query",
  product: "Product Information",
  return: "Return / Refund",
  shipping: "Shipping Query",
  other: "Other",
};

export function AdminMessageItem({ message }: { message: ContactMessage }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && !message.isRead) {
      await markMessageRead(message.id);
      router.refresh();
    }
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-secondary/10 transition-colors"
      >
        <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <Mail className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{message.name}</p>
            {!message.isRead && (
              <span className="h-1.5 w-1.5 rounded-full bg-foreground flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{message.email}</p>
        </div>
        <Badge variant="secondary" className="hidden sm:inline-flex flex-shrink-0">
          {subjectLabels[message.subject] ?? message.subject}
        </Badge>
        <span className="text-xs text-muted-foreground flex-shrink-0">
          {formatDate(message.createdAt)}
        </span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-border">
          <p className="text-sm whitespace-pre-wrap leading-relaxed mb-3">{message.message}</p>
          <a
            href={`mailto:${message.email}?subject=Re: ${subjectLabels[message.subject] ?? message.subject}`}
            className="text-xs font-medium underline hover:text-foreground/70"
          >
            Reply via email
          </a>
        </div>
      )}
    </div>
  );
}
