
import { cn } from "@/lib/utils";
import type { Message } from "@/types/message";
import { Check, CheckCheck } from 'lucide-react';
import Image from "next/image";
import AudioPlayer from "./audio-player";

interface ChatMessageProps {
  message: Message;
  isAutoPlaying?: boolean;
}

const MessageStatus = ({ status }: { status: Message['status'] }) => {
  if (status === 'sent') {
    return <Check className="h-4 w-4 ml-1 text-muted-foreground" aria-label="Sent" />;
  }
  if (status === 'delivered') {
    return <CheckCheck className="h-4 w-4 ml-1 text-muted-foreground" aria-label="Delivered" />;
  }
  if (status === 'read') {
    return <CheckCheck className="h-4 w-4 ml-1 text-sky-500" aria-label="Read" />;
  }
  return null;
}

export default function ChatMessage({ message, isAutoPlaying = false }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  const TimeAndStatus = () => (
    <div className="flex justify-end items-center">
      <span className="text-xs text-muted-foreground mr-1">{message.timestamp}</span>
      {isUser && <MessageStatus status={message.status} />}
    </div>
  )

  const OverlayTimeAndStatus = () => (
     <div className="absolute bottom-1.5 right-1.5 bg-black/50 rounded-md px-1 py-0.5 flex items-center z-10">
        <span className="text-xs text-white/90 mr-1">{message.timestamp}</span>
        {isUser && <MessageStatus status={message.status} />}
      </div>
  )

  const renderContent = () => {
    switch (message.type) {
      case 'audio':
        return (
          <>
            <div className="flex items-center gap-2.5">
              <Image
                  src="https://imperiumfragrance.shop/wp-content/uploads/2025/06/perfil.jpg"
                  data-ai-hint="woman profile"
                  alt="Valesca Carvalho"
                  width={40}
                  height={40}
                  className="shrink-0 rounded-full"
              />
              <div className="w-[240px] sm:w-[270px]">
                <AudioPlayer src={message.url!} autoplay={isAutoPlaying} onEnded={message.onEnded} />
              </div>
            </div>
            <div className="mt-1 pr-1"><TimeAndStatus /></div>
          </>
        );
      case 'image':
        return (
          <div className="relative">
            <Image
              src={message.url!}
              alt="Imagem enviada"
              width={300}
              height={300}
              className="rounded-md object-cover"
              data-ai-hint="sent image"
            />
            <OverlayTimeAndStatus />
          </div>
        );
      case 'video':
        return (
          <div className="relative">
            <video
              src={message.url!}
              controls
              className="rounded-md object-cover w-full max-w-[300px]"
              data-ai-hint="story video"
            />
            <OverlayTimeAndStatus />
          </div>
        );
      case 'text':
      default:
        return (
          <>
            <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
            <div className="mt-1"><TimeAndStatus /></div>
          </>
        )
    }
  };

  return (
    <div className={cn("flex mb-2", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "rounded-lg shadow",
        isUser ? "bg-whatsapp-user-message" : "bg-white",
        (message.type === 'image' || message.type === 'video') ? 'p-1' :
        message.type === 'audio' ? 'py-2 px-2.5' :
        'p-2',
        "max-w-[85%] md:max-w-[75%]"
      )}>
        {renderContent()}
      </div>
    </div>
  );
}
