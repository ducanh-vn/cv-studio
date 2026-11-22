'use client';

import React from 'react';
import { Mail, Phone, MapPin, X } from 'lucide-react';
import { InlineEditable, ItemControls, AvatarBlock, CustomSectionRenderer } from '@/components/canvas';
import TechLinkIcon from '@/components/TechLinkIcon';
import CVQRCodeBlock from '@/components/CVQRCodeBlock';
import { getActiveTechLinks } from '@/lib/customTechLinks';
import { formatPeriod } from '@/lib/cvFormatters';
import type { CVTemplateProps } from './types';

export function CascadeTemplate({
  cv,
  setCv,
  lang,
  t,
  activeColor,
  sectionOrder,
  sectionVisibility,
  isCompact = false,
  template = 'cascade',
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
    <div className="flex">
      {/* Left Colored Sidebar (32% width) */}
      <div
        className="w-[32%] text-white p-7 space-y-6 flex-shrink-0"
        style={{ backgroundColor: activeColor.sidebarBg }}
      >
        <AvatarBlock
          avatar={cv.avatar}
          name={cv.name}
          showAvatar={cv.showAvatar}
          shape="rounded-xl"
          size="w-32 h-36"
          className="mx-auto border-white/20 shadow-lg"
          onTriggerUpload={triggerAvatarUpload || (() => {})}
        />

        {activeQrConfig?.enabled && activeQrConfig.position === 'header' && (
          <div className="flex justify-center pt-1">
            <CVQRCodeBlock
              qrDataUrl={qrDataUrl}
              config={activeQrConfig}
              lang={lang}
              isDarkHeader={true}
              accentColorHex={activeColor.primary}
            />
          </div>
        )}

        {/* Sidebar Contact Info */}
        <div className="space-y-2 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-white/20 pb-1">
            {t.contactInfo}
          </h3>
          <div className="space-y-1.5 text-neutral-300">
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine className="break-all" />
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine />
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine />
            </div>
            {getActiveTechLinks(cv).map((link) => (
              <div key={link.id} className="flex items-center space-x-2">
                <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <InlineEditable
                  tag="span"
                  value={link.label || ''}
                  onChange={(val) => handleUpdateCustomLink(link.id, { label: val })}
                  singleLine
                  className="break-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Sections */}
        {sectionOrder
          .filter((id) => ['skills', 'education'].includes(id))
          .map((secKey) => {
            if (!sectionVisibility[secKey]) return null;
            if (secKey === 'skills') {
              return (
                <div key="skills" className="space-y-2 text-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-white/20 pb-1">
                    {t.skillsCore}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {cv.skills.map((s, idx) => (
                      <span key={idx} className="group/skill text-[10px] px-2 py-0.5 rounded bg-white/10 text-white font-mono inline-flex items-center space-x-1">
                        <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                        <button onClick={() => removeSkill(idx)} className="no-print opacity-0 group-hover/skill:opacity-100 text-rose-300 ml-1 cursor-pointer">
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
                <div key="education" className="space-y-3 text-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-white/20 pb-1">
                    {t.educationShort}
                  </h3>
                  {cv.education.map((edu, idx) => (
                    <div key={edu.id} className="relative group space-y-0.5">
                      <ItemControls
                        index={idx}
                        total={cv.education.length}
                        onMoveUp={() => moveEducationItem(idx, 'up')}
                        onMoveDown={() => moveEducationItem(idx, 'down')}
                        onAddBelow={() => addEducationItem(idx)}
                        onDelete={() => deleteEducationItem(edu.id)}
                      />
                      <InlineEditable tag="span" value={edu.school} onChange={(v) => updateEducationItem(edu.id, 'school', v)} singleLine className="font-bold text-white block" />
                      <InlineEditable tag="span" value={edu.degree} onChange={(v) => updateEducationItem(edu.id, 'degree', v)} singleLine className="text-neutral-300 block text-[11px]" />
                      <InlineEditable tag="span" value={edu.year} onChange={(v) => updateEducationItem(edu.id, 'year', v)} singleLine className="text-cyan-300 font-mono text-[10px] block" />
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          })}
      </div>

      {/* Right Column (68% width) */}
      <div className="flex-1 p-8 space-y-6">
        <div className="pb-4 border-b-2" style={{ borderColor: activeColor.border }}>
          <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="text-3xl font-bold uppercase tracking-tight text-neutral-900 block" />
          <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-semibold tracking-wider uppercase text-cyan-700 mt-1 block" />
        </div>

        {sectionOrder
          .filter((id) => ['summary', 'experience', 'projects'].includes(id) || id.startsWith('custom_'))
          .map((secKey) => {
            if (!sectionVisibility[secKey]) return null;
            if (secKey === 'summary') {
              return (
                <div key="summary" className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">
                    {t.summary}
                  </h2>
                  <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 leading-relaxed text-justify block" />
                </div>
              );
            }
            if (secKey === 'experience') {
              return (
                <div key="experience" className="space-y-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">
                    {t.experience}
                  </h2>
                  {cv.timeline.map((item, idx) => (
                    <div key={item.id} className="relative group space-y-1">
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
                      <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-600 leading-relaxed block" />
                    </div>
                  ))}
                </div>
              );
            }
            if (secKey === 'projects') {
              return (
                <div key="projects" className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">
                    {t.projects}
                  </h2>
                  {cv.projects.map((proj, idx) => (
                    <div key={proj.id} className="relative group space-y-1 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
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
                        <InlineEditable tag="span" value={proj.year} onChange={(v) => updateProjectItem(proj.id, 'year', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                      </div>
                      <InlineEditable tag="p" value={proj.desc} onChange={(v) => updateProjectItem(proj.id, 'desc', v)} className="text-xs text-neutral-600 block" />
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
    </div>
  );
}
export default CascadeTemplate;
