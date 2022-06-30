import { Container } from "components/Container";
import { ReactNode } from "react";

export type Props = {
  title: string;
  children: ReactNode;
};

export function SidePanel({ title, children }: Props) {
  return (
    <section aria-labelledby={`${title}-title`}>
      <Container>
        <h2
          className="text-base font-medium text-gray-900"
          id="announcements-title"
        >
          {title}
        </h2>
        <div className="flow-root mt-6">
          <ul role="list" className="-my-5 divide-y divide-gray-200">
            {children}
          </ul>
        </div>
      </Container>
    </section>
  );
}
function SidePanelItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <li className="py-5">
      <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
        <h3 className="text-sm font-semibold text-gray-800">
          <span className="focus:outline-none">
            {/* Extend touch target to entire panel */}
            <span className="absolute inset-0" aria-hidden="true" />
            {title}
          </span>
        </h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
    </li>
  );
}

SidePanel.Item = SidePanelItem;
