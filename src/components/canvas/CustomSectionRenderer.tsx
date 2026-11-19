'use client';

import React from 'react';
import { Award, Trash2, Plus, X } from 'lucide-react';
import type { CustomSection, CustomSectionItem, TemplateId } from '@/types/cvBuilder';
import { InlineEditable } from './InlineEditable';
import { ItemControls } from './ItemControls';
import { CVReadOnlyContext } from './CVReadOnlyContext';

export interface CustomSectionRendererProps {
  section: CustomSection;
  template: TemplateId;
  activeColor: any;
  lang: 'vi' | 'en';
  isCompact?: boolean;
  onUpdateTitle: (title: string) => void;
  onUpdateContent: (content: string) => void;
  onAddItem: (afterIndex?: number) => void;
  onUpdateItem: (itemId: string, field: keyof CustomSectionItem, value: string) => void;
  onDeleteItem: (itemId: string) => void;
  onMoveItem: (index: number, direction: 'up' | 'down') => void;
  onDeleteSection: () => void;
}

export function CustomSectionRenderer({
  section,
  template,
  activeColor,
  lang,
  isCompact,
  onUpdateTitle,
  onUpdateContent,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onMoveItem,
  onDeleteSection,
}: CustomSectionRendererProps) {
  const isDecker = template === 'decker';
  const isBubbles = template === 'bubbles';
  const isEditorial = template === 'editorial';
  const isRabbit = template === 'rabbit';
  const isReadOnly = React.useContext(CVReadOnlyContext);

  // 1. Bubbles style: wrapped in a rounded-2xl white card bubble
  if (isBubbles) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3 group/custom">
        <div className="flex justify-between items-center pb-1">
          <InlineEditable
            tag="h2"
            value={section.title}
            onChange={onUpdateTitle}
            singleLine
            className="text-xs font-bold uppercase tracking-wider text-neutral-900"
          />
          {!isReadOnly && (
            <div className="no-print flex items-center space-x-1 opacity-0 group-hover/custom:opacity-100 transition-opacity">
              {section.type === 'list' && (
                <button
                  onClick={() => onAddItem()}
                  className="text-[10px] text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-cyan-50"
                  title={lang === 'en' ? 'Add item' : 'Thêm dòng'}
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>{lang === 'en' ? 'Add' : 'Thêm'}</span>
                </button>
              )}
              <button
                onClick={onDeleteSection}
                className="text-neutral-400 hover:text-rose-500 p-1 rounded hover:bg-rose-50"
                title={lang === 'en' ? 'Delete section' : 'Xóa mục này'}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {section.type === 'text' ? (
          <InlineEditable
            tag="p"
            value={section.content || ''}
            onChange={onUpdateContent}
            className="text-xs text-neutral-700 leading-relaxed text-justify block"
          />
        ) : (
          <div className="space-y-2.5">
            {section.items?.map((item, idx) => (
              <div key={item.id} className="relative group space-y-0.5">
                <ItemControls
                  index={idx}
                  total={section.items?.length || 0}
                  onMoveUp={() => onMoveItem(idx, 'up')}
                  onMoveDown={() => onMoveItem(idx, 'down')}
                  onAddBelow={() => onAddItem(idx)}
                  onDelete={() => onDeleteItem(item.id)}
                />
                <div className="flex justify-between items-baseline text-xs">
                  <InlineEditable
                    tag="span"
                    value={item.title}
                    onChange={(v) => onUpdateItem(item.id, 'title', v)}
                    singleLine
                    className="font-bold text-neutral-900"
                  />
                  <InlineEditable
                    tag="span"
                    value={item.date || ''}
                    onChange={(v) => onUpdateItem(item.id, 'date', v)}
                    singleLine
                    className="font-mono text-[10px] text-neutral-500"
                  />
                </div>
                {item.subtitle && (
                  <InlineEditable
                    tag="p"
                    value={item.subtitle}
                    onChange={(v) => onUpdateItem(item.id, 'subtitle', v)}
                    singleLine
                    className="text-[11px] text-neutral-600"
                  />
                )}
                {item.desc && (
                  <InlineEditable
                    tag="p"
                    value={item.desc}
                    onChange={(v) => onUpdateItem(item.id, 'desc', v)}
                    className="text-xs text-neutral-600 block text-justify"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. Decker style: rounded pill badge header
  if (isDecker) {
    return (
      <div className="space-y-3 group/custom">
        <div className="flex justify-between items-center">
          <div
            className="inline-flex items-center px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm"
            style={{ backgroundColor: activeColor.primary }}
          >
            <InlineEditable tag="span" value={section.title} onChange={onUpdateTitle} singleLine />
          </div>
          {!isReadOnly && (
            <div className="no-print flex items-center space-x-1 opacity-0 group-hover/custom:opacity-100 transition-opacity">
              {section.type === 'list' && (
                <button
                  onClick={() => onAddItem()}
                  className="text-[10px] text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-0.5 px-2 py-0.5 rounded bg-neutral-100"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>{lang === 'en' ? 'Add' : 'Thêm'}</span>
                </button>
              )}
              <button onClick={onDeleteSection} className="text-neutral-400 hover:text-rose-500 p-1">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {section.type === 'text' ? (
          <InlineEditable
            tag="p"
            value={section.content || ''}
            onChange={onUpdateContent}
            className="text-xs text-neutral-700 leading-relaxed text-justify block"
          />
        ) : (
          <div className="space-y-2.5">
            {section.items?.map((item, idx) => (
              <div key={item.id} className="relative group space-y-0.5">
                <ItemControls
                  index={idx}
                  total={section.items?.length || 0}
                  onMoveUp={() => onMoveItem(idx, 'up')}
                  onMoveDown={() => onMoveItem(idx, 'down')}
                  onAddBelow={() => onAddItem(idx)}
                  onDelete={() => onDeleteItem(item.id)}
                />
                <div className="flex justify-between items-baseline text-xs">
                  <InlineEditable
                    tag="span"
                    value={item.title}
                    onChange={(v) => onUpdateItem(item.id, 'title', v)}
                    singleLine
                    className="font-bold text-neutral-900"
                  />
                  <InlineEditable
                    tag="span"
                    value={item.date || ''}
                    onChange={(v) => onUpdateItem(item.id, 'date', v)}
                    singleLine
                    className="font-mono text-[10px] text-neutral-500"
                  />
                </div>
                {item.subtitle && (
                  <InlineEditable
                    tag="p"
                    value={item.subtitle}
                    onChange={(v) => onUpdateItem(item.id, 'subtitle', v)}
                    singleLine
                    className="text-[11px] text-neutral-600"
                  />
                )}
                {item.desc && (
                  <InlineEditable
                    tag="p"
                    value={item.desc}
                    onChange={(v) => onUpdateItem(item.id, 'desc', v)}
                    className="text-xs text-neutral-600 block text-justify"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 3. Editorial style: serif luxury header
  if (isEditorial) {
    return (
      <div className="space-y-3 group/custom">
        <div className="flex justify-between items-center border-b border-neutral-300 pb-1">
          <InlineEditable
            tag="h2"
            value={section.title}
            onChange={onUpdateTitle}
            singleLine
            className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold"
          />
          {!isReadOnly && (
            <div className="no-print flex items-center space-x-1 opacity-0 group-hover/custom:opacity-100 transition-opacity">
              {section.type === 'list' && (
                <button
                  onClick={() => onAddItem()}
                  className="text-[10px] text-neutral-700 hover:text-black font-semibold flex items-center space-x-0.5"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>{lang === 'en' ? 'Add' : 'Thêm'}</span>
                </button>
              )}
              <button onClick={onDeleteSection} className="text-neutral-400 hover:text-rose-500 p-0.5">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {section.type === 'text' ? (
          <InlineEditable
            tag="p"
            value={section.content || ''}
            onChange={onUpdateContent}
            className="text-xs text-neutral-700 italic border-l-2 pl-4 border-neutral-300 block text-justify"
          />
        ) : (
          <div className="space-y-2.5">
            {section.items?.map((item, idx) => (
              <div key={item.id} className="relative group border-l-2 border-neutral-400 pl-3 space-y-0.5">
                <ItemControls
                  index={idx}
                  total={section.items?.length || 0}
                  onMoveUp={() => onMoveItem(idx, 'up')}
                  onMoveDown={() => onMoveItem(idx, 'down')}
                  onAddBelow={() => onAddItem(idx)}
                  onDelete={() => onDeleteItem(item.id)}
                />
                <div className="flex justify-between text-xs">
                  <InlineEditable
                    tag="span"
                    value={item.title}
                    onChange={(v) => onUpdateItem(item.id, 'title', v)}
                    singleLine
                    className="font-bold uppercase text-neutral-900"
                  />
                  <InlineEditable
                    tag="span"
                    value={item.date || ''}
                    onChange={(v) => onUpdateItem(item.id, 'date', v)}
                    singleLine
                    className="font-mono text-[10px] text-neutral-500"
                  />
                </div>
                {item.subtitle && (
                  <InlineEditable
                    tag="p"
                    value={item.subtitle}
                    onChange={(v) => onUpdateItem(item.id, 'subtitle', v)}
                    singleLine
                    className="text-[11px] text-neutral-600 font-mono"
                  />
                )}
                {item.desc && (
                  <InlineEditable
                    tag="p"
                    value={item.desc}
                    onChange={(v) => onUpdateItem(item.id, 'desc', v)}
                    className="text-xs text-neutral-600 block text-justify"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 4. Default / Rabbit / Basic / Iconic / Crisp / Cascade / Chicken style:
  return (
    <div className={`space-y-2 group/custom ${isRabbit ? 'rounded-xl bg-neutral-50 border border-neutral-200/80 p-3.5 shadow-xs' : ''}`}>
      <div
        className="flex justify-between items-center pb-1 border-b"
        style={{ borderColor: activeColor.border || '#e5e7eb' }}
      >
        <div className="flex items-center space-x-1.5">
          <Award className="w-3.5 h-3.5" style={{ color: activeColor.primary }} />
          <InlineEditable
            tag="h2"
            value={section.title}
            onChange={onUpdateTitle}
            singleLine
            className="text-xs font-bold uppercase tracking-wider text-neutral-900"
          />
        </div>
        {!isReadOnly && (
          <div className="no-print flex items-center space-x-1 opacity-0 group-hover/custom:opacity-100 transition-opacity">
            {section.type === 'list' && (
              <button
                onClick={() => onAddItem()}
                className="text-[10px] text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-cyan-50"
                title={lang === 'en' ? 'Add item' : 'Thêm dòng'}
              >
                <Plus className="w-2.5 h-2.5" />
                <span>{lang === 'en' ? 'Add' : 'Thêm'}</span>
              </button>
            )}
            <button
              onClick={onDeleteSection}
              className="text-neutral-400 hover:text-rose-500 p-0.5 rounded hover:bg-rose-50"
              title={lang === 'en' ? 'Delete section' : 'Xóa mục này'}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {section.type === 'text' ? (
        <InlineEditable
          tag="p"
          value={section.content || ''}
          onChange={onUpdateContent}
          className="text-xs text-neutral-700 leading-relaxed text-justify block"
        />
      ) : (
        <div className="space-y-2 pt-0.5">
          {section.items?.map((item, idx) => (
            <div key={item.id} className="relative group space-y-0.5">
              <ItemControls
                index={idx}
                total={section.items?.length || 0}
                onMoveUp={() => onMoveItem(idx, 'up')}
                onMoveDown={() => onMoveItem(idx, 'down')}
                onAddBelow={() => onAddItem(idx)}
                onDelete={() => onDeleteItem(item.id)}
              />
              <div className="flex justify-between items-baseline text-xs">
                <InlineEditable
                  tag="span"
                  value={item.title}
                  onChange={(v) => onUpdateItem(item.id, 'title', v)}
                  singleLine
                  className="font-bold text-neutral-900"
                />
                <InlineEditable
                  tag="span"
                  value={item.date || ''}
                  onChange={(v) => onUpdateItem(item.id, 'date', v)}
                  singleLine
                  className="font-mono text-[10px] text-neutral-500"
                />
              </div>
              {item.subtitle && (
                <InlineEditable
                  tag="p"
                  value={item.subtitle}
                  onChange={(v) => onUpdateItem(item.id, 'subtitle', v)}
                  singleLine
                  className="text-[11px] font-medium text-neutral-600"
                  style={{ color: activeColor.primary }}
                />
              )}
              {item.desc && (
                <InlineEditable
                  tag="p"
                  value={item.desc}
                  onChange={(v) => onUpdateItem(item.id, 'desc', v)}
                  className="text-xs text-neutral-600 block text-justify leading-relaxed"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSectionRenderer;
