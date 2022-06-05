import { CheckIcon } from "@heroicons/react/solid";
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
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={clsx(
              stepIdx !== steps.length - 1 ? "pb-10" : "",
              "relative"
            )}
          >
            {step.status === StepStatus.Complete ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-blue-600"
                    aria-hidden="true"
                  />
                ) : null}
                <StepBody name={step.name} body={step.body} />
              </>
            ) : step.status === StepStatus.Current ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <div>
                  <div
                    className="relative flex items-center"
                    aria-current="step"
                  >
                    <span className="h-9 flex items-center" aria-hidden="true">
                      <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-blue-600 rounded-full">
                        <span className="h-2.5 w-2.5 bg-blue-600 rounded-full" />
                      </span>
                    </span>
                    <span className="ml-4 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold tracking-wide uppercase text-blue-600">
                        {step.name}
                      </span>
                    </span>
                  </div>
                  <div className="flex ml-12">{step.body}</div>
                </div>
              </>
            ) : (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <div>
                  <div className="relative flex items-center">
                    <span className="h-9 flex items-center" aria-hidden="true">
                      <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full">
                        <span className="h-2.5 w-2.5 bg-transparent rounded-full" />
                      </span>
                    </span>
                    <span className="ml-4 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">
                        {step.name}
                      </span>
                    </span>
                  </div>
                  <div className="flex ml-12">{step.body}</div>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function StepBody({ name, body }: { name: string; body: ReactNode }) {
  return (
    <div>
      <div className="relative flex items-center">
        <span className="h-9 flex items-center">
          <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full">
            <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
          </span>
        </span>
        <span className="ml-4 min-w-0 flex flex-col">
          <span className="text-xs font-semibold tracking-wide uppercase">
            {name}
          </span>
        </span>
      </div>
      <div className="flex ml-12">{body}</div>
    </div>
  );
}
