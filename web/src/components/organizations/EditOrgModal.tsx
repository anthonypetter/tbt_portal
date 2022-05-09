import { useRef, useState } from "react";
import { Spinner } from "../Spinner";
import { Modal } from "../Modal";
import { ErrorBox } from "components/ErrorBox";
import { gql, useMutation } from "@apollo/client";
import { EditOrganizationMutation } from "@generated/graphql";
import { fromJust } from "@utils/types";
import { FaRegBuilding } from "react-icons/fa";
import { Input } from "components/Input";
import { triggerSuccessToast } from "components/Toast";
import { OrgTableData } from "./OrganizationsTable";
import { useResetOnShow } from "@utils/useResetOnShow";
import { GET_ORGANIZATIONS_QUERY_NAME } from "pages/organizations";

const EDIT_ORGANIZATION = gql`
  mutation EditOrganization($input: EditOrganizationInput!) {
    editOrganization(input: $input) {
      id
      name
      district
      subDistrict
    }
  }
`;

export function EditOrgModal({
  show,
  onCancel,
  onSuccess,
  organization,
}: {
  show: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  organization: OrgTableData | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelButtonRef = useRef(null);

  /**
   * Form state
   *
   * The idea is:
   *  - undefined means the field has not been set. (it's already null in the DB)
   *  - null means the user has explicitly cleared the field in this editing session.
   *
   *  - If a field is set to null, it means we should tell the backend that a field has been cleared.
   *  - If a field is undefined, we don't have to send that value to the DB.
   */

  const [name, setName] = useState<string | null | undefined>(
    organization?.name ?? undefined
  );
  const [district, setDistrict] = useState<string | null | undefined>(
    organization?.district ?? undefined
  );
  const [subDistrict, setSubDistrict] = useState<string | null | undefined>(
    organization?.subDistrict ?? undefined
  );

  const [editOrg] = useMutation<EditOrganizationMutation>(EDIT_ORGANIZATION, {
    update(cache, { data }) {
      if (!data?.editOrganization) {
        return;
      }
    },
  });

  useResetOnShow(show, () => {
    const org = fromJust(organization, "organization");
    setLoading(false);
    setError(null);
    setName(org.name);
    setDistrict(org.district ?? undefined);
    setSubDistrict(org.subDistrict ?? undefined);
  });

  const onEditOrg = async () => {
    setLoading(true);

    try {
      const org = fromJust(organization, "organization");
      const { data } = await editOrg({
        variables: {
          input: {
            id: org.id,
            name: fromJust(name, "name"),
            district,
            subDistrict,
          },
        },
        refetchQueries: [GET_ORGANIZATIONS_QUERY_NAME],
        onQueryUpdated(observableQuery) {
          if (observableQuery.queryName === GET_ORGANIZATIONS_QUERY_NAME) {
            observableQuery.refetch();
          }
        },
      });

      if (!data?.editOrganization) {
        setLoading(false);
        throw new Error("Something went wrong with the invite.");
      }

      setLoading(false);
      triggerSuccessToast({ message: "Organization successfully edited!" });
      onSuccess();
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
        <div className="flex flex-shrink-0 items-center justify-center mx-auto w-12 h-12 bg-blue-100 rounded-full sm:mx-0 sm:w-10 sm:h-10">
          <FaRegBuilding className="w-6 h-6 text-blue-600" aria-hidden="true" />
        </div>
      }
      title="Edit an organization"
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
          <Modal.Button type="confirm" onClick={onEditOrg} disabled={!name}>
            {loading ? <Spinner /> : "Edit"}
          </Modal.Button>
          <Modal.Button type="cancel" onClick={onCancel} ref={cancelButtonRef}>
            Cancel
          </Modal.Button>
        </Modal.Buttons>
      </div>
    </Modal>
  );
}
