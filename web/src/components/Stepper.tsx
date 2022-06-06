import { CheckIcon } from "@heroicons/react/solid";
import { assertUnreachable } from "@utils/types";
import clsx from "clsx";
import { ReactNode } from "react";

export enum StepStatus {
  Complete = "complete",
  Current = "current",
  Upcoming = "upcoming",
}

export type Step = {
  name: string;
  body: ReactNode;
  status: StepStatus;
};

type Props = {
  steps: Step[];
};

export function Stepper({ steps }: Props) {
  return (
    <nav>
      <ol role="list" className="overflow-hidden">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={clsx(
              stepIdx !== steps.length - 1 ? "pb-10" : "",
              "relative"
            )}
          >
            <>
              <StepConnectingLine
                status={step.status}
                steps={steps}
                stepIdx={stepIdx}
              />
              <StepBody
                name={step.name}
                body={step.body}
                status={step.status}
              />
            </>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function StepConnectingLine({
  status,
  steps,
  stepIdx,
}: {
  status: StepStatus;
  steps: Step[];
  stepIdx: number;
}) {
  switch (status) {
    case StepStatus.Complete:
      return stepIdx !== steps.length - 1 ? (
        <div
          className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-blue-600"
          aria-hidden="true"
        />
      ) : null;

    case StepStatus.Current:
      return stepIdx !== steps.length - 1 ? (
        <div
          className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
          aria-hidden="true"
        />
      ) : null;

    case StepStatus.Upcoming:
      return stepIdx !== steps.length - 1 ? (
        <div
          className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
          aria-hidden="true"
        />
      ) : null;

    default:
      assertUnreachable(status);
  }
}

function StepBody({
  name,
  body,
  status,
}: {
  name: string;
  body: ReactNode;
  status: StepStatus;
}) {
  return (
    <div>
      <div className="relative flex items-center">
        <span className="h-9 flex items-center" aria-hidden="true">
          <StepIcon status={status} />
        </span>
        <span className="ml-4 min-w-0 flex flex-col">
          <StepName name={name} status={status} />
        </span>
      </div>
      <div className="flex ml-12">{body}</div>
    </div>
  );
}

function StepIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case StepStatus.Complete:
      return (
        <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full">
          <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
        </span>
      );

    case StepStatus.Current:
      return (
        <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-blue-600 rounded-full">
          <span className="h-2.5 w-2.5 bg-blue-600 rounded-full" />
        </span>
      );

    case StepStatus.Upcoming:
      return (
        <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full">
          <span className="h-2.5 w-2.5 bg-transparent rounded-full" />
        </span>
      );

    default:
      assertUnreachable(status);
  }
}

function StepName({ name, status }: { name: string; status: StepStatus }) {
  switch (status) {
    case StepStatus.Complete:
      return (
        <span className="text-xs font-semibold tracking-wide uppercase">
          {name}
        </span>
      );

    case StepStatus.Current:
      return (
        <span className="text-xs font-semibold tracking-wide uppercase text-blue-600">
          {name}
        </span>
      );

    case StepStatus.Upcoming:
      return (
        <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">
          {name}
        </span>
      );

    default:
      assertUnreachable(status);
  }
}
