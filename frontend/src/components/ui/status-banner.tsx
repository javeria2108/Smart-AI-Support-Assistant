type StatusBannerProps = {
  type: "success" | "error";
  message: string;
};

export default function StatusBanner({ type, message }: StatusBannerProps) {
  const className =
    type === "success"
      ? "mt-6 rounded-lg border border-green-700/50 bg-green-950/30 px-4 py-3 text-sm text-green-300"
      : "mt-6 rounded-lg border border-red-700/50 bg-red-950/30 px-4 py-3 text-sm text-red-300";

  return (
    <p role="status" aria-live="polite" className={className}>
      {message}
    </p>
  );
}