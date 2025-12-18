'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2 } from 'lucide-react';

interface RateRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review?: string) => Promise<void>;
  driverName?: string;
}

export function RateRideModal({ isOpen, onClose, onSubmit, driverName }: RateRideModalProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    await onSubmit(rating, review);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Rate Your Trip</DialogTitle>
          <DialogDescription className="text-center">
            How was your ride with {driverName || 'the driver'}?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 space-y-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <Textarea
            placeholder="Write a review (optional)..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full"
          />
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="w-full bg-student-primary hover:bg-student-hover"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Submit Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
