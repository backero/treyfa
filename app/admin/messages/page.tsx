import { getContactMessages } from "@/actions/admin";
import { AdminMessageItem } from "@/components/admin/AdminMessageItem";
import { MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Messages" };

export default async function AdminMessagesPage() {
  const result = await getContactMessages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {result.total} total {result.unreadCount > 0 && `· ${result.unreadCount} unread`}
        </p>
      </div>

      <div className="space-y-2">
        {result.items.map((message) => (
          <AdminMessageItem key={message.id} message={message} />
        ))}
      </div>

      {result.items.length === 0 && (
        <div className="bg-background border border-border rounded-xl py-20 flex flex-col items-center gap-3 text-center">
          <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">No messages yet</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Messages submitted through the Contact Us form will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
