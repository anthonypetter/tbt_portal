import clsx from "clsx";
import { forwardRef, MouseEventHandler } from "react";

type Props = {
  id: string;
  name?: string;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
  leftIcon?: (props: React.ComponentProps<"svg">) => JSX.Element;
  className?: string;
  onClick?: MouseEventHandler<HTMLInputElement>;
  disabled?: boolean;
};

function InputForwardRef(
  {
    id,
    name: nameProp,
    label,
    value: valueProp,
    onChange: onChangeProp,
    type = "text",
    required = false,
    description,
    placeholder: placeholderProp,
    leftIcon: LeftIcon,
    className: classNameProp,
    onClick: onClickProp,
    disabled = false,
  }: Props,
  ref: React.Ref<HTMLInputElement>
) {
  const value = valueProp != null ? { value: valueProp } : {};
  const onChange = onChangeProp ? { onChange: onChangeProp } : {};
  const name = nameProp ? { name: nameProp } : {};
  const placeholder = placeholderProp ? { placeholder: placeholderProp } : {};
  const className = classNameProp ? { className: classNameProp } : {};
  const onClick = onClickProp ? { onClick: onClickProp } : {};

  return (
    <div {...className}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}{" "}
          {required && (
            <span className="text-gray-500 text-sm font-light">*</span>
          )}
        </label>
      ) : (
        // Screen reader only
        <label htmlFor={id} className="sr-only">
          {placeholderProp ?? "Input"}
        </label>
      )}

      <div className={clsx(label && "mt-1", "relative")}>
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={clsx(
            disabled && "bg-gray-50 text-gray-400 ",
            "shadow-sm block w-full sm:text-sm border-gray-300 rounded-md",
            "focus:ring-blue-500 focus:border-blue-500",
            LeftIcon && "pl-10"
          )}
          aria-describedby={`${id}-input-description`}
          required={required}
          ref={ref}
          disabled={disabled}
          {...name}
          {...value}
          {...onChange}
          {...placeholder}
          {...onClick}
        />
      </div>
      {description && (
        <p className={clsx("mt-2 text-sm ")} id={`${id}-input-description`}>
          {description}
        </p>
      )}
    </div>
  );
}

InputForwardRef.displayName = "Input";

export const Input = forwardRef<HTMLInputElement, Props>(InputForwardRef);
