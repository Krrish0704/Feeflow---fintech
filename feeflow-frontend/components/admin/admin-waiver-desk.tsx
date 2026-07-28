'use client'

import { useState } from 'react'

export function AdminWaiverDesk() {
  const [studentId, setStudentId] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [requestedBy, setRequestedBy] = useState('Admin_User')
  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState<{ status: 'success' | 'pending' | 'error'; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponseMessage(null)

    try {
      const res = await fetch('http://localhost:8000/waivers/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          requested_amount: parseFloat(amount),
          requested_by: requestedBy, // Required by backend WaiverCreate schema
          reason: reason,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Safely parse FastAPI / Pydantic 422 validation error arrays
        let errorMessage = 'Failed to submit waiver request.'
        if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ')
        } else if (typeof data.detail === 'string') {
          errorMessage = data.detail
        } else if (data.message) {
          errorMessage = data.message
        }
        
        setResponseMessage({ status: 'error', message: errorMessage })
        return
      }

      // Success response mapping
      setResponseMessage({
        status: data.status === 'success' ? 'success' : 'pending',
        message: data.message || (data.status === 'success' ? 'Waiver auto-approved & committed to ledger!' : 'Staged for Principal governance review.'),
      })
    } catch (err) {
      setResponseMessage({ status: 'error', message: 'Network error connecting to FastAPI backend.' })
    } finally {
      setLoading(false)
    }
  }

  const numericAmount = parseFloat(amount) || 0
  const isOverLimit = numericAmount > 500

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Request Fee Waiver / Concession</h3>
        <p className="text-sm text-muted-foreground">
          Waivers up to ₹500 (&#8804; ₹500) auto-execute into the ledger. Amounts exceeding ₹500 trigger Principal governance.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-1">Student UUID</label>
            <input
              type="text"
              required
              placeholder="e.g. c87a740f-..."
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Waiver Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Requested By (Admin)</label>
            <input
              type="text"
              required
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Reason / Concession Note</label>
          <input
            type="text"
            placeholder="e.g., Financial hardship concession"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        {/* Dynamic Threshold Alert Indicator */}
        {amount !== '' && (
          <div
            className={`rounded-lg p-3 text-xs font-medium border ${
              isOverLimit
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {isOverLimit
              ? '⚠️ Amount is greater than ₹500. This will stage a Maker-Checker request pending Principal approval.'
              : '✓ Amount is within the ₹500 auto-approval limit. This will auto-execute directly into the immutable ledger.'}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Submit Waiver Request'}
        </button>
      </form>

      {/* Safe string rendering — never renders raw objects */}
      {responseMessage && (
        <div
          className={`mt-4 rounded-lg p-4 text-sm ${
            responseMessage.status === 'success'
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : responseMessage.status === 'pending'
              ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          <strong>{responseMessage.status.toUpperCase()}:</strong> {responseMessage.message}
        </div>
      )}
    </div>
  )
}