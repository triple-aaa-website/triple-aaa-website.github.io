import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface ConfirmationMessageProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function ConfirmationMessage({ message, duration = 3000, onClose }: ConfirmationMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <Check className="w-5 h-5" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}