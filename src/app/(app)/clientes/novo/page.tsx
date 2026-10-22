import type { Metadata } from "next";
import { ClientForm } from "@/components/client-form";
import { Card, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Novo cliente" };

export default async function NewClientPage() {
  await requireUser();
  return (
    <>
      <PageHeader title="Novo cliente" />
      <Card className="max-w-3xl">
        <ClientForm />
      </Card>
    </>
  );
}
