"use client";

import { useState } from "react";
import { Mail, MailOpen, Reply } from "lucide-react";
import type { ContactMessage } from "@prisma/client";
import { Card, DeleteButton, useToast } from "@/components/admin/AdminUI";

export function MessagesManager({ initial }: { initial: ContactMessage[] }) {
  const [items, setItems] = useState<ContactMessage[]>(initial);
  const { show, toastNode } = useToast();

  async function setRead(id: string, read: boolean) {
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
    const res = await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    if (!res.ok) show("Could not update.", "error");
  }

  async function remove(id: string) {
    const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((m) => m.id !== id));
      show("Message deleted.");
    } else {
      show("Could not delete.", "error");
    }
  }

  const unread = items.filter((m) => !m.read).length;

  if (items.length === 0) {
    return (
      <Card>
        <p className="text-sm text-ink-body">No messages yet. Submissions from the contact form land here.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {toastNode}
      <p className="mb-1 text-sm text-ink-muted">
        {items.length} message{items.length === 1 ? "" : "s"}
        {unread > 0 && <span className="ml-2 font-medium text-cyan-deep">· {unread} unread</span>}
      </p>
      {items.map((m) => (
        <Card key={m.id} className={m.read ? "" : "border-cyan/40 bg-cyan/[0.03]"}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-cyan" aria-label="Unread" />}
                <p className="font-semibold text-ink">{m.name}</p>
                <a href={`mailto:${m.email}`} className="truncate text-sm text-cyan-deep hover:underline">
                  {m.email}
                </a>
              </div>
              <p className="mt-0.5 text-xs text-ink-muted">
                {new Date(m.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <a
                href={`mailto:${m.email}?subject=Re:%20your%20message%20to%20NBN%20TECH`}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-body hover:bg-canvas hover:text-cyan-deep"
              >
                <Reply className="h-3.5 w-3.5" /> Reply
              </a>
              <button
                onClick={() => setRead(m.id, !m.read)}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-body hover:bg-canvas"
              >
                {m.read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                {m.read ? "Unread" : "Read"}
              </button>
              <DeleteButton onConfirm={() => remove(m.id)} itemName="message" />
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap rounded-lg bg-canvas p-4 text-sm leading-relaxed text-ink-body">
            {m.message}
          </p>
        </Card>
      ))}
    </div>
  );
}
