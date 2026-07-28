import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { StudentPortal } from '@/components/student/student-portal'

export const metadata: Metadata = {
  title: 'Student Portal · FeeFlow',
  description:
    'View an itemized fee breakdown in ₹, pick a payment method, and check out securely with an instant confirmation.',
}

export default function StudentPage() {
  return (
    <PageShell
      eyebrow="Student & parent portal"
      title="Clear dues. Pay in seconds."
      description="Every charge is itemized to the rupee. Select what to pay, choose a method, and settle securely — with an instant, ledger-backed receipt."
    >
      <StudentPortal />
    </PageShell>
  )
}
