type Props = {
  roomUrl?: string | null;
};

export function WherebyRoom({ roomUrl }: Props) {
  return (
    <div>
      {roomUrl && (
        <iframe
          className="w-full h-screen"
          src={roomUrl}
          allow="camera; microphone; fullscreen; speaker; display-capture"
        ></iframe>
      )}
    </div>
  );
}
