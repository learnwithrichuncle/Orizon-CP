import { AiBrain01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { api, type AiSettingsStatus, type Deployment, type DeploymentFailureExplanation } from "../../api";
import type { AiProviderId } from "../../../core/ai-providers";
import { ModalShell } from "../../components/modals/modal-shell";
import { AppIcon, StatusPill } from "../../components/ui/primitives";
import { shortSha } from "../../lib/format";
import { connectedAiProviders, initialAiProvider, modelForAiProvider } from "./ai-provider-selection";
import { DeploymentFailureCommand } from "./deployment-failure-command";
import { DeploymentFailureModelPicker } from "./deployment-failure-model-picker";

const loadingMessages = [
  "Reading deployment output...",
  "Finding the first failing step...",
  "Checking build commands and service settings...",
  "Pulling out the relevant log lines...",
  "Preparing the likely cause...",
  "Drafting the suggested fix..."
];

export function DeploymentFailureExplanationModal({
  deployment,
  open,
  onClose
}: {
  deployment: Deployment | null;
  open: boolean;
  onClose: () => void;
}) {
  const [explanation, setExplanation] = useState<DeploymentFailureExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [aiSettings, setAiSettings] = useState<AiSettingsStatus | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<AiProviderId | "">("");
  const [selectedModel, setSelectedModel] = useState("");
  const deploymentId = open && deployment ? deployment.id : null;
  const aiProviders = connectedAiProviders(aiSettings);
  const selectedProvider = aiProviders.find((provider) => provider.id === selectedProviderId) ?? null;

  useEffect(() => {
    if (!open) {
      setAiSettings(null);
      setSelectedProviderId("");
      setSelectedModel("");
      return;
    }

    let cancelled = false;

    void api.aiSettings()
      .then((response) => {
        if (cancelled) return;
        const provider = initialAiProvider(response.ai);
        setAiSettings(response.ai);
        setSelectedProviderId(provider?.id ?? "");
        setSelectedModel(modelForAiProvider(provider, response.ai));
        setError(provider ? "" : "Save an AI provider API key in Settings before explaining deployment failures.");
      })
      .catch((issue) => {
        if (!cancelled) setError(issue instanceof Error ? issue.message : "Could not load AI providers.");
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!deploymentId || !selectedProviderId || !selectedModel) {
      if (!deploymentId) {
        setExplanation(null);
        setError("");
      }
      setExplanation(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");
    setExplanation(null);
    setLoadingMessageIndex(0);

    void api.explainDeploymentFailure(deploymentId, { providerId: selectedProviderId, model: selectedModel })
      .then((response) => {
        if (!cancelled) setExplanation(response.explanation);
      })
      .catch((issue) => {
        if (!cancelled) setError(issue instanceof Error ? issue.message : "Could not explain this deployment failure.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [deploymentId, selectedProviderId, selectedModel]);

  useEffect(() => {
    if (!loading) return;

    const interval = window.setInterval(() => {
      setLoadingMessageIndex((index) => (index + 1) % loadingMessages.length);
    }, 1800);

    return () => {
      window.clearInterval(interval);
    };
  }, [loading]);

  function changeProviderModel(providerId: AiProviderId, modelId: string) {
    setSelectedProviderId(providerId);
    setSelectedModel(modelId);
  }

  return (
    <ModalShell
      open={open}
      title="What happened?"
      meta={deployment ? `Deployment ${shortSha(deployment.commitSha)}` : undefined}
      icon={AiBrain01Icon}
      onClose={onClose}
      width="max-w-3xl"
      minHeight="min-h-0"
    >
      <div className="space-y-4">
        {aiProviders.length > 0 ? (
          <DeploymentFailureModelPicker
            providers={aiProviders}
            selectedProviderId={selectedProviderId}
            selectedModel={selectedModel}
            disabled={loading || !selectedProvider}
            onSelect={changeProviderModel}
          />
        ) : null}

        {loading ? (
          <div
            role="status"
            aria-live="polite"
            className="border border-fg/10 bg-fg/[0.02] p-4 font-mono text-[10px] uppercase tracking-wider text-fg/50"
          >
            {loadingMessages[loadingMessageIndex]}
          </div>
        ) : null}

        {error ? (
          <div className="border-l-2 border-fg bg-fg/5 px-4 py-3 text-xs font-mono text-fg">
            ✕ {error}
          </div>
        ) : null}

        {explanation ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border border-fg/10 bg-fg/[0.02] px-4 py-2.5">
              <div className="font-mono text-[9px] uppercase tracking-wider text-fg/40">
                {explanation.providerName} / {explanation.model}
              </div>
              <StatusPill status={`${explanation.confidence} confidence`} />
            </div>

            <section className="border border-fg/10 bg-fg/[0.03] p-5">
              <div className="font-mono text-[9px] uppercase tracking-wider text-fg/40">Summary</div>
              <p className="mt-2 text-sm leading-6 text-fg">{explanation.summary}</p>
            </section>

            <section className="border border-fg/10 bg-fg/[0.03] p-5">
              <div className="font-mono text-[9px] uppercase tracking-wider text-fg/40">Likely cause</div>
              <p className="mt-2 text-sm leading-6 text-fg">{explanation.cause}</p>
            </section>

            <section className="border-l-2 border-accent bg-accent/5 p-5">
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-accent font-semibold">
                <AppIcon icon={CheckmarkCircle02Icon} size={14} />
                Suggested fix
              </div>
              <p className="mt-2 text-sm leading-6 text-fg">{explanation.suggestedFix}</p>
            </section>

            {explanation.commands.length > 0 ? (
              <section className="border border-fg/10 bg-fg/[0.03] p-5">
                <div className="font-mono text-[9px] uppercase tracking-wider text-fg/40">Commands / changes</div>
                <div className="mt-3 space-y-2">
                  {explanation.commands.map((command, index) => (
                    <DeploymentFailureCommand key={`${command}-${index}`} command={command} />
                  ))}
                </div>
              </section>
            ) : null}

            {explanation.relatedLogLines.length > 0 ? (
              <section className="border border-fg/10 bg-fg/[0.03] p-5">
                <div className="font-mono text-[9px] uppercase tracking-wider text-fg/40">Relevant logs</div>
                <pre className="mt-3 max-h-44 overflow-y-auto whitespace-pre-wrap break-all border border-fg/10 bg-bg/30 p-3 font-mono text-xs leading-5 text-fg/70">
                  {explanation.relatedLogLines.join("\n")}
                </pre>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
}
