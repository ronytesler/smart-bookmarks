interface ErrorBannerProps {
  message: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
      {message}
    </div>
  );
}