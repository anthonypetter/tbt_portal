const hostParams =
  "&video=on&audio=on&people=on&background=off&logo=off&leaveButton=off&timer=on&personality=off&roomIntegrations=on";
const studentParams =
  "?video=on&audio=on&people=off&background=off&logo=off&leaveButton=off&timer=on&personality=off&roomIntegrations=on";

  export function getRoomUrl(orignal: string) {
  return {
    backDoor: orignal,
    host: origin + hostParams,
    student: orignal + studentParams,
  };
}
