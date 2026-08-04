"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createFaq, updateFaq } from "@/actions/faq";
import { toast } from "sonner";
import type { Faq } from "@prisma/client";

type Props = {
  faq?: Faq;
  categories: string[];
};

export function FaqForm({ faq, categories }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [isPublished, setIsPublished] = useState(faq?.isPublished ?? true);
  const [category, setCategory] = useState(faq?.category ?? categories[0] ?? "General");
  const [useNewCategory, setUseNewCategory] = useState(
    !!faq && !categories.includes(faq.category)
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const formData = new FormData(e.currentTarget);
    formData.set("category", category);
    formData.set("isPublished", String(isPublished));

    const result = faq
      ? await updateFaq(faq.id, formData)
      : await createFaq(formData);

    if (result.success) {
      toast.success(faq ? "FAQ updated" : "FAQ created");
      router.push("/admin/faqs");
    } else {
      toast.error(result.error ?? "Something went wrong");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category */}
      <div className="space-y-1.5">
        <Label htmlFor="category">Category</Label>
        {useNewCategory || categories.length === 0 ? (
          <Input
            id="category"
            name="categoryInput"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Products, Orders & Shipping"
          />
        ) : (
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
        <button
          type="button"
          className="text-[11px] text-muted-foreground hover:text-foreground underline"
          onClick={() => setUseNewCategory((v) => !v)}
        >
          {useNewCategory ? "Choose existing category" : "+ New category"}
        </button>
      </div>

      {/* Question */}
      <div className="space-y-1.5">
        <Label htmlFor="question">Question *</Label>
        <Input
          id="question"
          name="question"
          required
          defaultValue={faq?.question}
          placeholder="What is your return policy?"
        />
      </div>

      {/* Answer */}
      <div className="space-y-1.5">
        <Label htmlFor="answer">Answer *</Label>
        <Textarea
          id="answer"
          name="answer"
          required
          defaultValue={faq?.answer}
          rows={5}
          placeholder="We offer a hassle-free refund policy…"
        />
      </div>

      {/* Order */}
      <div className="space-y-1.5">
        <Label htmlFor="order">Display Order</Label>
        <Input
          id="order"
          name="order"
          type="number"
          defaultValue={faq?.order ?? 0}
          className="max-w-[140px]"
        />
        <p className="text-[11px] text-muted-foreground">
          Lower numbers show first within the category.
        </p>
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3 pt-2">
        <Switch
          id="isPublished"
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
        <Label htmlFor="isPublished" className="cursor-pointer">
          {isPublished ? "Published" : "Hidden"}
        </Label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : faq ? "Update FAQ" : "Create FAQ"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/faqs")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
