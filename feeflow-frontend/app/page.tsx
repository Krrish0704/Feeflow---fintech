import { AmbientBackground } from '@/components/ambient-background'
import { AppHeader } from '@/components/app-header'
import { AppFooter } from '@/components/app-footer'
import { Hero } from '@/components/landing/hero'
import { TelemetryTicker } from '@/components/landing/telemetry-ticker'
import { PinnedFeatures } from '@/components/landing/pinned-features'
import { RolePicker } from '@/components/landing/role-picker'

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <AmbientBackground />
      <AppHeader />
      <Hero />
      <TelemetryTicker />
      <PinnedFeatures />
      <RolePicker />
      <AppFooter />
    </main>
  )
}
