type PointChatAvatarProps = {
  size?: number;
};

export function PointChatAvatar({ size = 64 }: PointChatAvatarProps) {
  return (
    <div
      className="rounded-full border border-gold/50 bg-gradient-to-b from-zinc-900 to-zinc-800 p-1 shadow-[0_0_24px_rgba(200,162,77,0.2)]"
      style={{ width: size, height: size }}
      aria-label="point-chat.ai avatar"
      role="img"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 56C12 31 30 10 50 10C70 10 88 31 88 56V87H12V56Z"
          fill="#1A1A1A"
          stroke="#C8A24D"
          strokeWidth="3"
        />
        <path
          d="M26 54C26 37 37 24 50 24C63 24 74 37 74 54C74 58 72 62 68 65C62 70 57 74 50 74C43 74 38 70 32 65C28 62 26 58 26 54Z"
          fill="#0F0F0F"
          stroke="#2F2F2F"
          strokeWidth="2"
        />
        <circle cx="42" cy="54" r="3" fill="#F4DEB0" />
        <circle cx="58" cy="54" r="3" fill="#F4DEB0" />
        <path d="M41 63C45 66 55 66 59 63" stroke="#F4DEB0" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 86H80" stroke="#C8A24D" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
