import { motion } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";
import { BrandIcon } from "@/components/common/BrandIcon";
import { Switch } from "@/components/ui/switch";
import { useToggleAutomation } from "../hooks";
import type { Automation } from "../types";
import { cn } from "@/lib/utils";

interface AutomationCardProps {
  automation: Automation;
  index: number;
}

export function AutomationCard({ automation, index }: AutomationCardProps) {
  const toggle = useToggleAutomation();

  function handleToggle(checked: boolean) {
    toggle.mutate({ id: automation.id, enabled: checked });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -3 }}
      className={cn(
        "glass flex flex-col gap-4 rounded-2xl p-5 transition-colors hover:border-white/20",
        !automation.enabled && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <BrandIcon brand={automation.brand} size={44} glow className="h-11 w-11 shrink-0" />
          <div>
            <h3 className="font-display text-[15px] font-semibold text-white">{automation.name}</h3>
            <p className="text-[11px] font-medium text-slate-500">
              {automation.enabled ? "Active" : "Paused"}
            </p>
          </div>
        </div>
        <Switch checked={automation.enabled} onCheckedChange={handleToggle} disabled={toggle.isPending} />
      </div>

      <p className="text-[13px] leading-relaxed text-slate-400">{automation.description}</p>

      <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          {automation.frequency}
        </span>
        {automation.lastRun && <span>Last run: {automation.lastRun}</span>}
      </div>

      {toggle.isError && (
        <p className="flex items-center gap-1.5 text-[11px] text-red-400">
          <AlertTriangle className="h-3 w-3" />
          Couldn't update this automation. Try again.
        </p>
      )}
    </motion.div>
  );
}
