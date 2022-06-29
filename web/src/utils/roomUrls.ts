const hostParams =
  "&video=on&audio=on&people=on&background=off&logo=off&leaveButton=off&timer=on&personality=off&roomIntegrations=on";
const studentParams =
  "?video=on&audio=on&people=off&background=off&logo=off&leaveButton=off&timer=on&personality=off&roomIntegrations=on&lowData=on&widescreen=off";
type GetRoomUrlResult = {
  [backDoor: string]: string;
  host: string;
  student: string;
};
export function getRoomUrl(original: string): GetRoomUrlResult {
  return {
    backDoor: original,
    host: original + hostParams,
    student: original + studentParams,
  };
}
