'use client';

import React from 'react';
import { ArrowUp, ArrowDown, Plus, Trash2 } from 'lucide-react';
import { CVReadOnlyContext } from './CVReadOnlyContext';

export interface ItemControlsProps {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddBelow: () => void;
  onDelete: () => void;
}

export function ItemControls({
  index,
  total,
  onMoveUp,
  onMoveDown,
  onAddBelow,
  onDelete,
}: ItemControlsProps) {
  const isReadOnly = React.useContext(CVReadOnlyContext);
  if (isReadOnly) return null;

  return (
    <div className="no-print opacity-0 group-hover:opacity-100 transition-opacity absolute -right-1 -top-2 bg-[#1e1e24] border border-neutral-700 text-white rounded-lg p-0.5 flex items-center space-x-1 shadow-xl z-20 scale-90">
      <button
        onClick={onMoveUp}
        disabled={index === 0}
        className="p-1 hover:text-cyan-400 disabled:opacity-25"
        title="Di chuyển lên"
      >
        <ArrowUp className="w-3 h-3" />
      </button>
      <button
        onClick={onMoveDown}
        disabled={index === total - 1}
        className="p-1 hover:text-cyan-400 disabled:opacity-25"
        title="Di chuyển xuống"
      >
        <ArrowDown className="w-3 h-3" />
      </button>
      <button
        onClick={onAddBelow}
        className="p-1 hover:text-emerald-400"
        title="Thêm mục bên dưới"
      >
        <Plus className="w-3 h-3" />
      </button>
      <button
        onClick={onDelete}
        className="p-1 hover:text-rose-400"
        title="Xóa mục này"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

export default ItemControls;
