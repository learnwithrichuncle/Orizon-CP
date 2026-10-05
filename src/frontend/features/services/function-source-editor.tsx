import { javascript } from "@codemirror/lang-javascript";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import CodeMirror from "@uiw/react-codemirror";
import { useMemo } from "react";
import type { FunctionRuntime } from "../../../core/service-functions";

const functionSourceHighlightStyle = HighlightStyle.define([
  { tag: tags.comment, color: "rgba(233, 237, 240, 0.4)" },
  { tag: tags.string, color: "var(--color-accent)" },
  { tag: [tags.number, tags.bool, tags.null], color: "var(--color-accent)" },
  { tag: tags.propertyName, color: "var(--color-fg)" },
  { tag: tags.keyword, color: "rgba(233, 237, 240, 0.7)" },
  { tag: tags.function(tags.variableName), color: "var(--color-fg)" },
  { tag: tags.punctuation, color: "rgba(233, 237, 240, 0.4)" }
]);

const functionSourceEditorTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "var(--color-bg)",
      color: "var(--color-fg)",
      fontSize: "13px"
    },
    "&.cm-focused": {
      outline: "none"
    },
    ".cm-scroller": {
      backgroundColor: "var(--color-bg)",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    },
    ".cm-content": {
      padding: "14px",
      caretColor: "var(--color-fg)",
      minHeight: "100%"
    },
    ".cm-line": {
      padding: "0"
    },
    ".cm-cursor": {
      borderLeftColor: "var(--color-fg)"
    },
    ".cm-placeholder": {
      color: "rgba(233, 237, 240, 0.4)"
    },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      backgroundColor: "rgba(233, 237, 240, 0.1)"
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(233, 237, 240, 0.05)"
    },
    ".cm-gutters": {
      borderRight: "1px solid rgba(233, 237, 240, 0.1)",
      backgroundColor: "var(--color-bg)",
      color: "rgba(233, 237, 240, 0.4)"
    }
  },
  { dark: true }
);

const functionSourceBasicSetup = {
  foldGutter: true,
  highlightActiveLine: true,
  highlightActiveLineGutter: false,
  autocompletion: false,
  searchKeymap: true,
  foldKeymap: true,
  completionKeymap: false
};

export function FunctionSourceEditor({
  runtime,
  value,
  onChange,
  disabled = false,
  height = "460px"
}: {
  runtime: FunctionRuntime;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  height?: string;
}) {
  const extensions = useMemo(() => {
    return [
      ...(runtime === "python" ? [] : [javascript()]),
      syntaxHighlighting(functionSourceHighlightStyle),
      EditorView.editable.of(!disabled),
      EditorView.contentAttributes.of({
        autocapitalize: "off",
        autocomplete: "off",
        autocorrect: "off",
        spellcheck: "false"
      }),
      functionSourceEditorTheme
    ];
  }, [disabled, runtime]);

  return (
    <div className="overflow-hidden border border-fg/15 bg-bg" style={{ height }}>
      <CodeMirror
        value={value}
        height="100%"
        basicSetup={functionSourceBasicSetup}
        extensions={extensions}
        onChange={onChange}
        theme="dark"
        className="bg-bg [&_.cm-content]:bg-bg [&_.cm-editor]:bg-bg [&_.cm-scroller]:bg-bg"
      />
    </div>
  );
}
