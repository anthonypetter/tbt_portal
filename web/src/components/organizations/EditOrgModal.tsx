import { useRef, useState } from "react";
import { Spinner } from "../Spinner";
import { Modal } from "../Modal";
import { ErrorBox } from "components/ErrorBox";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { EditOrganizationMutation } from "@generated/graphql";
import { fromJust } from "@utils/types";
import { FaRegBuilding } from "react-icons/fa";
import { Input } from "components/Input";
import { OrgTableData } from "./OrganizationsTable";
import { GET_ORGANIZATIONS_QUERY_NAME } from "./constants";

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

type Props = {
  show: boolean;
  closeModal: () => void;
  afterLeave: () => void;
  organization: OrgTableData | null;
};

export function EditOrgModal({
  show,
  closeModal,
  organization,
  afterLeave,
}: Props) {
  return (
    <Modal
      show={show}
      onClose={closeModal}
      icon={
        <Modal.Icon className="bg-blue-100">
          <FaRegBuilding className="w-6 h-6 text-blue-600" aria-hidden="true" />
        </Modal.Icon>
      }
      title="Edit an organization"
      afterLeave={afterLeave}
    >
      {organization && (
        <EditOrgModalBody
          organization={organization}
          onCancel={closeModal}
          onSuccess={closeModal}
        />
      )}
    </Modal>
  );
}

export function EditOrgModalBody({
  onCancel,
  onSuccess,
  organization,
}: {
  onCancel: () => void;
  onSuccess: () => void;
  organization: OrgTableData;
}) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
    organization.name
  );
  const [description, setDescription] = useState<string | null | undefined>(
    organization.description ?? undefined
  );
  const [district, setDistrict] = useState<string | null | undefined>(
    organization.district ?? undefined
  );
  const [subDistrict, setSubDistrict] = useState<string | null | undefined>(
    organization.subDistrict ?? undefined
  );

  const [editOrg, { loading }] = useMutation<EditOrganizationMutation>(
    EDIT_ORGANIZATION,
    {
      onCompleted: onSuccess,
      onError: (err: ApolloError) => setErrorMsg(err.message),
    }
  );

  const onEditOrg = async () => {
    await editOrg({
      variables: {
        input: {
          id: organization.id,
          name: fromJust(name, "name"),
          district,
          subDistrict,
          description,
        },
      },
      refetchQueries: [GET_ORGANIZATIONS_QUERY_NAME],
      onQueryUpdated(observableQuery) {
        if (observableQuery.queryName === GET_ORGANIZATIONS_QUERY_NAME) {
          observableQuery.refetch();
        }
      },
    });
  };

  return (
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
            id="org-description"
            label="Description"
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
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
      {errorMsg && <ErrorBox msg={errorMsg} />}
      <Modal.Buttons>
        <Modal.Button type="confirm" onClick={onEditOrg} disabled={!name}>
          {loading ? <Spinner /> : "Save"}
        </Modal.Button>
        <Modal.Button type="cancel" onClick={onCancel} ref={cancelButtonRef}>
          Cancel
        </Modal.Button>
      </Modal.Buttons>
    </div>
  );
}
