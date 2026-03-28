'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { approveProperty, rejectProperty, requestPropertyReview } from '@/actions/admin';

interface AdminVerificationActionsProps {
  propertyId: string;
  currentStatus: string;
  verificationNotes?: string | null;
}

export function AdminVerificationActions({ 
  propertyId, 
  currentStatus,
  verificationNotes 
}: AdminVerificationActionsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | 'review' | null>(null);

  const handleApprove = async () => {
    setIsSubmitting(true);
    setAction('approve');
    
    try {
      const result = await approveProperty(propertyId, notes || undefined);
      
      if (result.success) {
        toast.success('Property approved successfully!');
        router.push('/dashboard/admin');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to approve property');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
      setAction(null);
    }
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsSubmitting(true);
    setAction('reject');
    
    try {
      const result = await rejectProperty(propertyId, notes);
      
      if (result.success) {
        toast.success('Property rejected');
        router.push('/dashboard/admin');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to reject property');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
      setAction(null);
    }
  };

  const handleRequestReview = async () => {
    if (!notes.trim()) {
      toast.error('Please provide feedback for the owner');
      return;
    }

    setIsSubmitting(true);
    setAction('review');
    
    try {
      const result = await requestPropertyReview(propertyId, notes);
      
      if (result.success) {
        toast.success('Review request sent to owner');
        router.push('/dashboard/admin');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to send review request');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
      setAction(null);
    }
  };

  const isAlreadyProcessed = currentStatus === 'APPROVED' || currentStatus === 'REJECTED';

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Verification Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {verificationNotes && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-1">Previous Notes:</p>
            <p className="text-sm text-blue-700">{verificationNotes}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Admin Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this property (optional for approval, required for rejection)"
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        {isAlreadyProcessed ? (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              This property has already been {currentStatus.toLowerCase()}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting && action === 'approve' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Property
                </>
              )}
            </Button>

            <Button
              onClick={handleRequestReview}
              disabled={isSubmitting}
              variant="outline"
              className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              {isSubmitting && action === 'review' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Request Changes
                </>
              )}
            </Button>

            <Button
              onClick={handleReject}
              disabled={isSubmitting}
              variant="destructive"
              className="w-full"
            >
              {isSubmitting && action === 'reject' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Property
                </>
              )}
            </Button>
          </div>
        )}

        <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
          <p>• Approval makes property publicly searchable</p>
          <p>• Rejection archives property with reason</p>
          <p>• Request changes notifies owner for updates</p>
        </div>
      </CardContent>
    </Card>
  );
}
