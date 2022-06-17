import {
  autoUpdate, offset, Placement, shift, useClick, useDismiss, useFloating,
  useInteractions,
  useRole
} from "@floating-ui/react-dom-interactions";
import { cloneElement, ReactNode, useState } from "react";

interface Props {
  render: (data: {
    close: () => void;
  }) => ReactNode;
  placement?: Placement;
  children: JSX.Element;
}

/**
 * This is an adaptation of Floating-UI's own example Popover UI solution.
 * With some work this could be adapated to support a wider range of situations,
 * but given the desire for a specific offset to make the EventPopover component
 * flush with the Event components this should be considered a special component
 * to be used with WeekCalendar, thus its location in the file directory.
 * See: https://codesandbox.io/s/quizzical-water-b3dedw?file=/src/Popover.tsx
 */
export const Popover = ({ children, render, placement }: Props) => {
  const [open, setOpen] = useState(false);
  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(({ rects }) => ({
      // Place the Popover flush to the top-left corner.
      mainAxis: -rects.floating.height,
    })), shift()],
    placement,
    whileElementsMounted: autoUpdate,
    strategy: "absolute",
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context)
  ]);

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({ ref: reference, ...children.props })
      )}
      {open && (
        <div
          {...getFloatingProps({
            className: "Popover",
            ref: floating,
            style: {
              position: strategy,
              top: y ?? 0,
              left: x ?? 0
            },
          })}
        >
          {render({
            close: () => {
              setOpen(false);
            }
          })}
        </div>
      )}
    </>
  );
};
