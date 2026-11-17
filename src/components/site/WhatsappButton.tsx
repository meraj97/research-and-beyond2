import { IconChat } from '@/components/icons';

export default function WhatsappButton({ url, label }: { url: string; label: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="ping fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-[#25d366] shadow-[0_8px_24px_-6px_rgb(0_0_0/0.45)] transition-transform duration-300 hover:scale-110"
    >
      <IconChat size={27} className="relative text-white" />
    </a>
  );
}
