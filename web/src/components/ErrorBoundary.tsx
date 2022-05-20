import React from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
  ErrorBoundaryProps,
} from "react-error-boundary";
import { ErrorBox } from "./ErrorBox";

type Props = {
  children: React.ReactNode;
  msg?: string;
  subMsg?: string;
  fallbackRender?: ErrorBoundaryProps["fallbackRender"];
};

export function ErrorBoundary({
  children,
  msg,
  subMsg,
  fallbackRender: fallbackRenderProp,
}: Props) {
  const onError = (error: unknown, info: { componentStack: string }) => {
    console.log("TODO: log to bugsnag:", error, info);
  };

  const defaultFallbackRender = () => <ErrorBox msg={msg} subMsg={subMsg} />;

  const fallbackRender = fallbackRenderProp ?? defaultFallbackRender;

  return (
    <ReactErrorBoundary onError={onError} fallbackRender={fallbackRender}>
      {children}
    </ReactErrorBoundary>
  );
}
