import { forwardRef } from "react";

type Props = {
  id: string;
  name?: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  description?: string;
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
  }: Props,
  ref: React.Ref<HTMLInputElement>
) {
  const value = valueProp != null ? { value: valueProp } : {};
  const onChange = onChangeProp ? { onChange: onChangeProp } : {};
  const name = nameProp ? { name: nameProp } : {};

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}{" "}
        {required && (
          <span className="text-gray-500 text-sm font-light">*</span>
        )}
      </label>
      <div className="mt-1">
        <input
          id={id}
          type={type}
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          aria-describedby={`${id}-input-description`}
          required={required}
          ref={ref}
          {...name}
          {...value}
          {...onChange}
        />
      </div>
      {description && (
        <p
          className="mt-2 text-sm text-gray-500"
          id={`${id}-input-description`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

InputForwardRef.displayName = "Input";

export const Input = forwardRef<HTMLInputElement, Props>(InputForwardRef);
