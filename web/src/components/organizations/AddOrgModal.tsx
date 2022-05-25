import { useRef, useState } from "react";
import { Spinner } from "../Spinner";
import { Modal } from "../Modal";
import { ErrorBox } from "components/ErrorBox";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { AddOrganizationMutation } from "@generated/graphql";
import { fromJust } from "@utils/types";
import { FaRegBuilding } from "react-icons/fa";
import { Input } from "components/Input";

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

type Props = {
  show: boolean;
  closeModal: () => void;
};

export function AddOrgModal({ show, closeModal }: Props) {
  return (
    <Modal
      show={show}
      onClose={closeModal}
      icon={
        <Modal.Icon className="bg-green-100">
          <FaRegBuilding
            className="w-6 h-6 text-green-600"
            aria-hidden="true"
          />
        </Modal.Icon>
      }
      title="Add an organization"
    >
      <AddOrgModaBody onCancel={closeModal} onSuccess={closeModal} />
    </Modal>
  );
}

type AddOrgModaBodyProps = {
  onCancel: () => void;
  onSuccess: () => void;
};

export function AddOrgModaBody({ onCancel, onSuccess }: AddOrgModaBodyProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const cancelButtonRef = useRef(null);
  const [name, setName] = useState<string | null | undefined>();
  const [description, setDescription] = useState<string | null | undefined>();
  const [district, setDistrict] = useState<string | null | undefined>();
  const [subDistrict, setSubDistrict] = useState<string | null | undefined>();

  const [addOrg, { loading }] = useMutation<AddOrganizationMutation>(
    ADD_ORGANIZATION,
    {
      onError: (err: ApolloError) => setErrorMsg(err.message),
      onCompleted: onSuccess,

      update(cache, { data }) {
        if (!data?.addOrganization) {
          return;
        }

        cache.modify({
          fields: {
            organizations(existingOrgs = []) {
              const newOrgRef = cache.writeFragment({
                data: data.addOrganization,
                fragment: gql`
                  fragment NewOrg on Organization {
                    id
                    name
                    district
                    subDistrict
                    __typename
                  }
                `,
              });
              return [...existingOrgs, newOrgRef];
            },
          },
        });
      },
    }
  );

  const onAddOrg = async () => {
    await addOrg({
      variables: {
        input: {
          name: fromJust(name, "name"),
          description,
          district,
          subDistrict,
        },
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
        <Modal.Button type="confirm" onClick={onAddOrg} disabled={!name}>
          {loading ? <Spinner /> : "Add"}
        </Modal.Button>
        <Modal.Button type="cancel" onClick={onCancel} ref={cancelButtonRef}>
          Cancel
        </Modal.Button>
      </Modal.Buttons>
    </div>
  );
}
