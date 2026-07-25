"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { submitReview } from "@/actions/review";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { Review, User } from "@prisma/client";

type ReviewWithUser = Review & { user: Pick<User, "name"> };

type Props = {
  productId: string;
  reviews: ReviewWithUser[];
  existingReview: Review | null;
};

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="p-0.5"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              n <= (hover || value) ? "fill-amber-400 text-amber-400" : "text-muted"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId, reviews, existingReview }: Props) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [title, setTitle] = useState(existingReview?.title ?? "");
  const [body, setBody] = useState(existingReview?.body ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingReview);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmitting(true);
    const result = await submitReview(productId, rating, title, body);
    setSubmitting(false);
    if (result.success) {
      toast.success(existingReview || submitted ? "Review updated" : "Thanks for your review!");
      setSubmitted(true);
    } else {
      toast.error(result.error ?? "Failed to submit review");
    }
  }

  return (
    <div className="space-y-8">
      {/* Write a review */}
      {session?.user ? (
        <form onSubmit={handleSubmit} className="space-y-3 p-4 border border-border rounded-xl">
          <p className="text-sm font-medium">
            {submitted ? "Update your review" : "Write a review"}
          </p>
          <StarPicker value={rating} onChange={setRating} />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review title (optional)"
          />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={3}
          />
          <Button type="submit" disabled={submitting} size="sm">
            {submitting ? "Submitting..." : submitted ? "Update Review" : "Submit Review"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link href="/login" className="underline hover:text-foreground">
            Sign in
          </Link>{" "}
          to write a review.
        </p>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this product.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="pb-5 border-b border-border last:border-0"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{review.user.name ?? "Anonymous"}</span>
                  {review.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                      <ShieldCheck className="h-3 w-3" /> Verified Purchase
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
              </div>
              <div className="flex items-center gap-0.5 mb-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"
                    }`}
                  />
                ))}
              </div>
              {review.title && <p className="text-sm font-medium mb-1">{review.title}</p>}
              {review.body && <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
