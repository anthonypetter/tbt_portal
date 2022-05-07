import { useRef, useState, useEffect } from "react";
import { Spinner } from "../Spinner";
import { Modal } from "../Modal";
import { ErrorBox } from "components/ErrorBox";
import { gql } from "@apollo/client";
import {
  useAddOrganizationMutation,
  AddOrganizationMutation,
} from "@generated/graphql";
import { fromJust } from "@utils/types";
import { FaRegBuilding } from "react-icons/fa";
import { Input } from "components/Input";
import { triggerSuccessToast } from "components/Toast";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ADD_ORGANIZATION = gql`
  mutation AddOrganization($input: AddOrganizationInput!) {
    addOrganization(input: $input) {
      id
      name
      district
      subDistrict
    }
  }
`;

export function AddOrgModal({
  show,
  onCancel,
  onSuccess,
}: {
  show: boolean;
  onCancel: () => void;
  onSuccess: (
    org: NonNullable<AddOrganizationMutation["addOrganization"]>
  ) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelButtonRef = useRef(null);

  // Form state
  const [name, setName] = useState<string | null | undefined>(undefined);
  const [district, setDistrict] = useState<string | null | undefined>(
    undefined
  );
  const [subDistrict, setSubDistrict] = useState<string | null | undefined>(
    undefined
  );

  const [addOrg] = useAddOrganizationMutation();

  useEffect(() => {
    const resetForm = () => {
      setLoading(false);
      setError(null);
      setName(undefined);
      setDistrict(undefined);
      setSubDistrict(undefined);
    };

    if (show) {
      resetForm();
    }
  }, [show]);

  const onAddOrg = async () => {
    setLoading(true);

    try {
      const { data } = await addOrg({
        variables: {
          input: { name: fromJust(name, "name"), district, subDistrict },
        },
      });

      if (!data?.addOrganization) {
        setLoading(false);
        throw new Error("Something went wrong with the invite.");
      }

      setLoading(false);
      triggerSuccessToast({ message: "Organization successfully created!" });
      onSuccess(data.addOrganization);
    } catch (error: unknown) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong with the invite.";

      setLoading(false);
      setError(message);
    }
  };

  return (
    <Modal
      show={show}
      onClose={onCancel}
      icon={
        <div className="flex flex-shrink-0 items-center justify-center mx-auto w-12 h-12 bg-green-100 rounded-full sm:mx-0 sm:w-10 sm:h-10">
          <FaRegBuilding
            className="w-6 h-6 text-green-600"
            aria-hidden="true"
          />
        </div>
      }
      title="Add an organization"
    >
      <div className="py-3">
        <div className="mb-4">
          <div className="space-y-4">
            <Input
              id="org-name"
              label="Name"
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              id="org-district-name"
              label="District"
              value={district ?? ""}
              onChange={(e) => setDistrict(e.target.value)}
            />

            <Input
              id="org-sub-district-name"
              label="SubDistrict"
              value={subDistrict ?? ""}
              onChange={(e) => setSubDistrict(e.target.value)}
            />
          </div>
        </div>
        {error && <ErrorBox />}
        <Modal.Buttons>
          <Modal.Button type="confirm" onClick={onAddOrg} disabled={!name}>
            {loading ? <Spinner /> : "Add"}
          </Modal.Button>
          <Modal.Button type="cancel" onClick={onCancel} ref={cancelButtonRef}>
            Cancel
          </Modal.Button>
        </Modal.Buttons>
      </div>
    </Modal>
  );
}
