'use client';

import React from 'react';
import { X } from 'lucide-react';
import { InlineEditable, ItemControls, AvatarBlock, CustomSectionRenderer } from '@/components/canvas';
import TechLinkIcon from '@/components/TechLinkIcon';
import CVQRCodeBlock from '@/components/CVQRCodeBlock';
import { getActiveTechLinks } from '@/lib/customTechLinks';
import { formatPeriod } from '@/lib/cvFormatters';
import type { CVTemplateProps } from './types';

export function BubblesTemplate({
  cv,
  setCv,
  lang,
  t,
  activeColor,
  sectionOrder,
  sectionVisibility,
  isCompact = false,
  template = 'bubbles',
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
  removeSkill,
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
    <div className="p-8 space-y-5 bg-[#fafafa]">
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs flex justify-between items-center">
        <div className="space-y-1">
          <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="text-3xl font-bold uppercase tracking-tight text-neutral-900 block" />
          <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-semibold tracking-wider uppercase text-cyan-600 block" />
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 pt-1">
            <span><InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></span>
            <span>•</span>
            <span><InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></span>
            <span>•</span>
            <span><InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></span>
            {getActiveTechLinks(cv).map((link) => (
              <span key={link.id} className="inline-flex items-center space-x-1 text-cyan-700">
                <span>•</span>
                <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5 shrink-0 ml-1" />
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
        <div className="flex items-center space-x-3 shrink-0">
          {activeQrConfig?.enabled && activeQrConfig.position === 'header' && (
            <CVQRCodeBlock
              qrDataUrl={qrDataUrl}
              config={activeQrConfig}
              lang={lang}
              isDarkHeader={false}
              accentColorHex={activeColor.primary}
            />
          )}
          <AvatarBlock
            avatar={cv.avatar}
            name={cv.name}
            showAvatar={cv.showAvatar}
            shape="rounded-2xl"
            size="w-20 h-20"
            className="border-neutral-200"
            onTriggerUpload={triggerAvatarUpload || (() => {})}
          />
        </div>
      </div>

      {sectionOrder.map((secKey) => {
        if (!sectionVisibility[secKey]) return null;
        if (secKey === 'summary') {
          return (
            <div key="summary" className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.summaryShort}</h2>
              <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 leading-relaxed text-justify block" />
            </div>
          );
        }
        if (secKey === 'experience') {
          return (
            <div key="experience" className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.experience}</h2>
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
                    <InlineEditable tag="span" value={formatPeriod(item.period, lang)} onChange={(v) => updateTimelineItem(item.id, 'period', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                  </div>
                  <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-600 block" />
                </div>
              ))}
            </div>
          );
        }
        if (secKey === 'projects') {
          return (
            <div key="projects" className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.projects}</h2>
              <div className="grid grid-cols-2 gap-3">
                {cv.projects.map((proj, idx) => (
                  <div key={proj.id} className="relative group p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                    <ItemControls
                      index={idx}
                      total={cv.projects.length}
                      onMoveUp={() => moveProjectItem(idx, 'up')}
                      onMoveDown={() => moveProjectItem(idx, 'down')}
                      onAddBelow={() => addProjectItem(idx)}
                      onDelete={() => deleteProjectItem(proj.id)}
                    />
                    <InlineEditable tag="span" value={proj.title} onChange={(v) => updateProjectItem(proj.id, 'title', v)} singleLine className="font-bold text-xs block text-neutral-900" />
                    <InlineEditable tag="p" value={proj.desc} onChange={(v) => updateProjectItem(proj.id, 'desc', v)} className="text-[11px] text-neutral-600 pt-0.5 block" />
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if (secKey === 'skills') {
          return (
            <div key="skills" className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.skillsShort}</h2>
              <div className="flex flex-wrap gap-1.5">
                {cv.skills.map((s, idx) => (
                  <span key={idx} className="group/skill text-[10px] px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 font-medium inline-flex items-center space-x-1">
                    <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                    <button onClick={() => removeSkill(idx)} className="no-print opacity-0 group-hover/skill:opacity-100 text-rose-500 ml-1 cursor-pointer">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          );
        }
        if (secKey === 'education') {
          return (
            <div key="education" className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.educationShort}</h2>
              {cv.education.map((edu, idx) => (
                <div key={edu.id} className="relative group text-xs space-y-0.5">
                  <ItemControls
                    index={idx}
                    total={cv.education.length}
                    onMoveUp={() => moveEducationItem(idx, 'up')}
                    onMoveDown={() => moveEducationItem(idx, 'down')}
                    onAddBelow={() => addEducationItem(idx)}
                    onDelete={() => deleteEducationItem(edu.id)}
                  />
                  <InlineEditable tag="span" value={edu.school} onChange={(v) => updateEducationItem(edu.id, 'school', v)} singleLine className="font-bold block text-neutral-900" />
                  <InlineEditable tag="span" value={edu.degree} onChange={(v) => updateEducationItem(edu.id, 'degree', v)} singleLine className="text-neutral-600 block" />
                </div>
              ))}
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
  );
}
export default BubblesTemplate;
