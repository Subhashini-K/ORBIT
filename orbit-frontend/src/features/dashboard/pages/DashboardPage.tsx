import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { OrbitUniverse, StatsBar, AIAssistantPanel, RecentActivityPanel } from "../components";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left / center column — Universe + Stats */}
        <div className="space-y-6 xl:col-span-2">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="p-6 sm:p-8">
              <div className="mb-2">
                <h2 className="font-display text-lg font-semibold text-white">Your Universe</h2>
                <p className="text-sm text-muted-foreground">All your connected sources orbiting around you.</p>
              </div>
              <OrbitUniverse />
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <StatsBar />
          </motion.div>
        </div>

        {/* Right column — AI Assistant + Recent Activity */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
            <AIAssistantPanel />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
            <RecentActivityPanel />
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
