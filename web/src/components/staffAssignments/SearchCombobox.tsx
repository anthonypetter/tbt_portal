import { CheckIcon, SelectorIcon, XIcon } from "@heroicons/react/solid";
import { SearchIcon } from "@heroicons/react/outline";
import { Combobox } from "@headlessui/react";
import clsx from "clsx";
import { Spinner } from "components/Spinner";

type Props<R> = {
  id: string;
  query: string;
  onChange: (searchString: string) => void;
  results: R[];
  loading: boolean;
  selection: R | null;
  onSelect: (selection: R | null) => void;
  label?: string;
};

export type SearchItem = { id: string; value: string; subValue?: string };

export function SearchCombobox<R extends SearchItem>({
  id,
  query,
  onChange,
  loading,
  results,
  selection,
  onSelect,
  label,
}: Props<R>) {
  return (
    <Combobox as="div" value={selection} onChange={onSelect}>
      {label && (
        <Combobox.Label className="block text-sm font-medium text-gray-700">
          {label}
        </Combobox.Label>
      )}

      <div className="mt-1 relative w-full">
        <Combobox.Input
          id={id}
          className={clsx(
            "rounded-md",
            "w-full border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm sm:text-sm",
            "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          )}
          onChange={(event) => onChange(event.target.value)}
          displayValue={(item: R) => item?.value ?? ""}
          value={query}
        />

        {selection !== null ? (
          <button
            className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
            onClick={() => onSelect(null)}
          >
            <XIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>
        ) : (
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            {loading ? (
              <div className="mr-1">
                <Spinner color="border-blue-500" />
              </div>
            ) : results.length === 0 ? (
              <SearchIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            ) : (
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
          </Combobox.Button>
        )}

        {results.length > 0 && (
          <Combobox.Options
            className={clsx(
              "mt-1 absolute z-10",
              "py-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg",
              "text-base sm:text-sm",
              "ring-1 ring-black ring-opacity-5 focus:outline-none "
            )}
          >
            {results.map((item) => (
              <Combobox.Option
                key={item.id}
                value={item}
                className={({ active }) =>
                  clsx(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-blue-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex">
                      <span
                        className={clsx(
                          "truncate",
                          selected && "font-semibold"
                        )}
                      >
                        {item.value}
                      </span>
                      {item.subValue && (
                        <span
                          className={clsx(
                            "ml-2 truncate text-gray-500",
                            active ? "text-blue-200" : "text-gray-500"
                          )}
                        >
                          {item.subValue}
                        </span>
                      )}
                    </div>

                    {selected && (
                      <span
                        className={clsx(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-blue-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
