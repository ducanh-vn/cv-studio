'use client';

import React from 'react';
import { Camera } from 'lucide-react';
import { CVReadOnlyContext } from './CVReadOnlyContext';

export interface AvatarBlockProps {
  avatar: string;
  name: string;
  showAvatar: boolean;
  shape?: string;
  size?: string;
  className?: string;
  onTriggerUpload: () => void;
}

export function AvatarBlock({
  avatar,
  name,
  showAvatar,
  shape = 'rounded-2xl',
  size = 'w-24 h-24',
  className = '',
  onTriggerUpload,
}: AvatarBlockProps) {
  const isReadOnly = React.useContext(CVReadOnlyContext);
  if (!showAvatar) return null;

  return (
    <div
      onClick={isReadOnly ? undefined : onTriggerUpload}
      className={`relative group/avatar ${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:ring-2 hover:ring-cyan-400 hover:scale-105'} flex-shrink-0 overflow-hidden border-2 transition-all shadow-md ${size} ${shape} ${className}`}
      title={isReadOnly ? name : 'Nhấp chuột để tải ảnh thẻ mới từ máy tính'}
    >
      {avatar ? (
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-neutral-100 text-neutral-400 flex flex-col items-center justify-center p-2 text-center">
          <Camera className="w-5 h-5 mb-0.5 text-neutral-400" />
          <span className="text-[8px] font-semibold text-neutral-500 uppercase tracking-tighter">Avatar</span>
        </div>
      )}

      {/* Hover Overlay with Camera Icon */}
      {!isReadOnly && (
        <div className="no-print absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center backdrop-blur-[1px]">
          <Camera className="w-4 h-4 mb-0.5 text-cyan-300 animate-bounce" />
          <span className="text-[9px] font-semibold tracking-wide">Đổi ảnh</span>
        </div>
      )}
    </div>
  );
}

export default AvatarBlock;
