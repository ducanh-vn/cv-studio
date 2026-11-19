'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { InlineEditable, ItemControls, AvatarBlock, CustomSectionRenderer } from '@/components/canvas';
import TechLinkIcon from '@/components/TechLinkIcon';
import CVQRCodeBlock from '@/components/CVQRCodeBlock';
import { getActiveTechLinks } from '@/lib/customTechLinks';
import { formatPeriod } from '@/lib/cvFormatters';
import type { CVTemplateProps } from './types';

export function BasicTemplate({
  cv,
  setCv,
  lang,
  t,
  activeColor,
  sectionOrder,
  sectionVisibility,
  isCompact = false,
  template = 'basic',
  qrDataUrl = '',
  activeQrConfig,
  triggerAvatarUpload,
  addTimelineItem,
  updateTimelineItem,
  moveTimelineItem,
  deleteTimelineItem,
  addProjectItem,
  updateProjectItem,
  moveProjectItem,
  deleteProjectItem,
  updateSkill,
  addEducationItem,
  updateEducationItem,
  moveEducationItem,
  deleteEducationItem,
  handleUpdateCustomLink,
  updateCustomSectionTitle = () => {},
  updateCustomSectionContent = () => {},
  addCustomSectionItem = () => {},
  updateCustomSectionItem = () => {},
  deleteCustomSectionItem = () => {},
  moveCustomSectionItem = () => {},
  removeCustomSection = () => {},
}: CVTemplateProps) {
  return (
    <div className="p-10 space-y-6">
      <div className="text-center space-y-1.5 pb-4 border-b border-neutral-300">
        <div className="flex items-center justify-center space-x-4 pb-2">
          {cv.showAvatar && cv.avatar && (
            <AvatarBlock
              avatar={cv.avatar}
              name={cv.name}
              showAvatar={cv.showAvatar}
              shape="rounded-full"
              size="w-20 h-20"
              className="border border-neutral-300 shadow-xs"
              onTriggerUpload={triggerAvatarUpload || (() => {})}
            />
          )}
          {activeQrConfig?.enabled && activeQrConfig.position === 'header' && (
            <CVQRCodeBlock
              qrDataUrl={qrDataUrl}
              config={activeQrConfig}
              lang={lang}
              isDarkHeader={false}
              accentColorHex={activeColor.primary}
            />
          )}
        </div>
        <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="text-2xl font-bold uppercase tracking-tight text-neutral-900 block" />
        <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-semibold tracking-wider text-neutral-600 uppercase block" />
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-neutral-600 pt-1">
          <span><InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></span>
          <span>|</span>
          <span><InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></span>
          <span>|</span>
          <span><InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></span>
          {getActiveTechLinks(cv).map((link) => (
            <span key={link.id} className="inline-flex items-center space-x-1 text-neutral-700">
              <span>|</span>
              <TechLinkIcon platform={link.platform} className="w-3 h-3 shrink-0 ml-1" />
              <InlineEditable
                tag="span"
                value={link.label || ''}
                onChange={(val) => handleUpdateCustomLink(link.id, { label: val })}
                singleLine
              />
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {sectionOrder.map((secKey) => {
          if (!sectionVisibility[secKey]) return null;
          if (secKey === 'summary') {
            return (
              <div key="summary" className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5">
                  {t.summary}
                </h2>
                <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 leading-relaxed text-justify block" />
              </div>
            );
          }
          if (secKey === 'experience') {
            return (
              <div key="experience" className="space-y-2">
                <div className="flex justify-between items-center border-b border-neutral-300 pb-0.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    {t.experience}
                  </h2>
                  <button
                    onClick={() => addTimelineItem()}
                    className="no-print text-[10px] text-neutral-600 hover:text-black font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t.addItem}</span>
                  </button>
                </div>
                <div className="space-y-3 pt-1">
                  {cv.timeline.map((item, idx) => (
                    <div key={item.id} className="relative group space-y-0.5">
                      <ItemControls
                        index={idx}
                        total={cv.timeline.length}
                        onMoveUp={() => moveTimelineItem(idx, 'up')}
                        onMoveDown={() => moveTimelineItem(idx, 'down')}
                        onAddBelow={() => addTimelineItem(idx)}
                        onDelete={() => deleteTimelineItem(item.id)}
                      />
                      <div className="flex justify-between items-baseline text-xs">
                        <InlineEditable tag="span" value={item.role} onChange={(v) => updateTimelineItem(item.id, 'role', v)} singleLine className="font-bold text-neutral-900" />
                        <InlineEditable tag="span" value={formatPeriod(item.period, lang)} onChange={(v) => updateTimelineItem(item.id, 'period', v)} singleLine className="font-mono text-[11px] text-neutral-500" />
                      </div>
                      <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-700 leading-relaxed block" />
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (secKey === 'projects') {
            return (
              <div key="projects" className="space-y-2">
                <div className="flex justify-between items-center border-b border-neutral-300 pb-0.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    {t.projects}
                  </h2>
                  <button
                    onClick={() => addProjectItem()}
                    className="no-print text-[10px] text-neutral-600 hover:text-black font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t.addProject}</span>
                  </button>
                </div>
                <div className="space-y-3 pt-1">
                  {cv.projects.map((proj, idx) => (
                    <div key={proj.id} className="relative group space-y-0.5">
                      <ItemControls
                        index={idx}
                        total={cv.projects.length}
                        onMoveUp={() => moveProjectItem(idx, 'up')}
                        onMoveDown={() => moveProjectItem(idx, 'down')}
                        onAddBelow={() => addProjectItem(idx)}
                        onDelete={() => deleteProjectItem(proj.id)}
                      />
                      <div className="flex justify-between items-baseline text-xs">
                        <InlineEditable tag="span" value={proj.title} onChange={(v) => updateProjectItem(proj.id, 'title', v)} singleLine className="font-bold text-neutral-900" />
                        <InlineEditable tag="span" value={proj.year} onChange={(v) => updateProjectItem(proj.id, 'year', v)} singleLine className="font-mono text-[11px] text-neutral-500" />
                      </div>
                      <InlineEditable tag="p" value={proj.desc} onChange={(v) => updateProjectItem(proj.id, 'desc', v)} className="text-xs text-neutral-700 block" />
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (secKey === 'skills') {
            return (
              <div key="skills" className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5">
                  {t.skillsShort}
                </h2>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cv.skills.map((s, idx) => (
                    <span key={idx} className="group/skill text-xs text-neutral-800 inline-flex items-center space-x-1">
                      <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                      {idx < cv.skills.length - 1 && <span className="text-neutral-400">•</span>}
                    </span>
                  ))}
                </div>
              </div>
            );
          }
          if (secKey === 'education') {
            return (
              <div key="education" className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5">
                  {t.educationShort}
                </h2>
                <div className="space-y-2 pt-1">
                  {cv.education.map((edu, idx) => (
                    <div key={edu.id} className="relative group flex justify-between text-xs">
                      <ItemControls
                        index={idx}
                        total={cv.education.length}
                        onMoveUp={() => moveEducationItem(idx, 'up')}
                        onMoveDown={() => moveEducationItem(idx, 'down')}
                        onAddBelow={() => addEducationItem(idx)}
                        onDelete={() => deleteEducationItem(edu.id)}
                      />
                      <div>
                        <InlineEditable tag="span" value={edu.school} onChange={(v) => updateEducationItem(edu.id, 'school', v)} singleLine className="font-bold text-neutral-900 block" />
                        <InlineEditable tag="span" value={edu.degree} onChange={(v) => updateEducationItem(edu.id, 'degree', v)} singleLine className="text-neutral-600 block" />
                      </div>
                      <InlineEditable tag="span" value={edu.year} onChange={(v) => updateEducationItem(edu.id, 'year', v)} singleLine className="font-mono text-[11px] text-neutral-500" />
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          const customSec = cv.customSections?.find((c) => c.id === secKey);
          if (customSec) {
            return (
              <CustomSectionRenderer
                key={customSec.id}
                section={customSec}
                template={template}
                activeColor={activeColor}
                lang={lang}
                isCompact={isCompact}
                onUpdateTitle={(val) => updateCustomSectionTitle(customSec.id, val)}
                onUpdateContent={(val) => updateCustomSectionContent(customSec.id, val)}
                onAddItem={(afterIdx) => addCustomSectionItem(customSec.id, afterIdx)}
                onUpdateItem={(itemId, field, val) => updateCustomSectionItem(customSec.id, itemId, field, val)}
                onDeleteItem={(itemId) => deleteCustomSectionItem(customSec.id, itemId)}
                onMoveItem={(idx, dir) => moveCustomSectionItem(customSec.id, idx, dir)}
                onDeleteSection={() => removeCustomSection(customSec.id)}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
export default BasicTemplate;
