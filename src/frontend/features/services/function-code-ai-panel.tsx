import { AiBrain01Icon, AlertCircleIcon, MagicWand01Icon } from "@hugeicons/core-free-icons";
import { type FormEvent, useEffect, useState } from "react";
import { api, type AiSettingsStatus, type FunctionCodeGeneration } from "../../api";
import type { AiProviderId } from "../../../core/ai-providers";
import { AppIcon, FieldLabel, btn } from "../../components/ui/primitives";
import type { FunctionRuntime } from "../../../core/service-functions";
import { connectedAiProviders, initialAiProvider, modelForAiProvider } from "./ai-provider-selection";
import { DeploymentFailureModelPicker } from "./deployment-failure-model-picker";

export function FunctionCodeAiPanel({
  serviceId,
  runtime,
  sourceCode,
  disabled = false,
  className = "",
  onApply
}: {
  serviceId: string;
  runtime: FunctionRuntime;
  sourceCode: string;
  disabled?: boolean;
  className?: string;
  onApply: (sourceCode: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [error, setError] = useState("");
  const [generation, setGeneration] = useState<FunctionCodeGeneration | null>(null);
  const [aiSettings, setAiSettings] = useState<AiSettingsStatus | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<AiProviderId | "">("");
  const [selectedModel, setSelectedModel] = useState("");
  const aiProviders = connectedAiProviders(aiSettings);
  const selectedProvider = aiProviders.find((provider) => provider.id === selectedProviderId) ?? null;

  useEffect(() => {
    let cancelled = false;
    setLoadingProviders(true);

    void api.aiSettings()
      .then((response) => {
        if (cancelled) return;
        const provider = initialAiProvider(response.ai);
        setAiSettings(response.ai);
        setSelectedProviderId(provider?.id ?? "");
        setSelectedModel(modelForAiProvider(provider, response.ai));
        setError(provider ? "" : "Save an AI provider API key in Settings before generating code.");
      })
      .catch((issue) => {
        if (!cancelled) setError(issue instanceof Error ? issue.message : "Could not load AI providers.");
      })
      .finally(() => {
        if (!cancelled) setLoadingProviders(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function changeProviderModel(providerId: AiProviderId, modelId: string) {
    setSelectedProviderId(providerId);
    setSelectedModel(modelId);
    setGeneration(null);
  }

  async function generateCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setError("Describe what the function should do.");
      return;
    }
    if (!selectedProviderId || !selectedModel) {
      setError("Save an AI provider API key in Settings before generating code.");
      return;
    }

    setGenerating(true);
    setError("");
    try {
      const response = await api.generateFunctionSource(serviceId, {
        prompt: trimmedPrompt,
        runtime,
        sourceCode,
        providerId: selectedProviderId,
        model: selectedModel
      });
      setGeneration(response.generation);
      onApply(response.generation.sourceCode);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not generate function code");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <form onSubmit={generateCode} className={`flex h-full min-h-0 flex-col overflow-hidden border border-fg/20 bg-bg ${className}`}>
      <div className="space-y-3 border-b border-fg/10 p-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-7 w-7 place-items-center border border-accent text-accent">
            <AppIcon icon={AiBrain01Icon} size={15} />
          </span>
          <div className="min-w-0 font-mono text-[9px] uppercase tracking-wider text-fg/40">AI code generation</div>
        </div>

        {aiProviders.length > 0 ? (
          <DeploymentFailureModelPicker
            providers={aiProviders}
            selectedProviderId={selectedProviderId}
            selectedModel={selectedModel}
            disabled={disabled || generating || loadingProviders || !selectedProvider}
            menuAlign="right"
            onSelect={changeProviderModel}
          />
        ) : (
          <div className="font-mono text-[9px] uppercase tracking-wider text-fg/40">
            {loadingProviders ? "Loading AI providers" : "No AI provider connected"}
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <div className="flex min-h-0 flex-1 flex-col">
          <FieldLabel>Prompt</FieldLabel>
          <textarea
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              if (generation) setGeneration(null);
            }}
            disabled={disabled || generating}
            placeholder="Create a JSON API that validates input and returns a response"
            className="min-h-[160px] flex-1 resize-none border border-fg/20 bg-transparent p-3 text-sm leading-6 text-fg outline-none transition placeholder:text-fg/30 focus:border-accent disabled:opacity-40"
          />
        </div>
        <button
          type="submit"
          className={`${btn("primary")} w-full`}
          disabled={disabled || generating || loadingProviders || !prompt.trim() || !selectedProviderId || !selectedModel}
        >
          <AppIcon icon={generating ? AiBrain01Icon : MagicWand01Icon} size={15} />
          {generating ? "Generating…" : "Generate Code"}
        </button>
      </div>

      {generation ? (
        <div className="mx-4 mb-4 border border-accent/40 bg-accent/10 px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-accent">
          ✓ Generated with {generation.providerName} / {generation.model}
        </div>
      ) : null}
      {error ? (
        <div className="mx-4 mb-4 border-l-2 border-fg bg-fg/5 px-3 py-2 text-xs font-mono text-fg">
          ✕ {error}
        </div>
      ) : null}
    </form>
  );
}
