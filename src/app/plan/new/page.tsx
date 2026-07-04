import { WizardShell } from "@/components/WizardShell";
import { GeneralForm } from "@/components/steps/GeneralForm";

export default function NewPlanPage() {
  return (
    <WizardShell planId={null} current="general">
      <GeneralForm planId={null} />
    </WizardShell>
  );
}
