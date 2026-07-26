import { AdminHeader } from "@/components/admin/AdminUI";
import { MessagesManager } from "@/components/admin/MessagesManager";
import { getContactMessages } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  return (
    <div>
      <AdminHeader
        title="Messages"
        description="Enquiries submitted through the public contact form."
      />
      <MessagesManager initial={messages} />
    </div>
  );
}
