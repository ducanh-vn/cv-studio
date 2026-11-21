'use client';

import React from 'react';
import { X } from 'lucide-react';
import { InlineEditable, ItemControls, AvatarBlock, CustomSectionRenderer } from '@/components/canvas';
import TechLinkIcon from '@/components/TechLinkIcon';
import CVQRCodeBlock from '@/components/CVQRCodeBlock';
import { getActiveTechLinks } from '@/lib/customTechLinks';
import { formatPeriod } from '@/lib/cvFormatters';
import type { CVTemplateProps } from './types';

export function CrispTemplate({
  cv,
  setCv,
  lang,
  t,
  activeColor,
  pad,
  sectionOrder,
  sectionVisibility,
  isCompact = false,
  template = 'crisp',
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
    <div className={isCompact ? 'p-6 space-y-4' : 'p-8 sm:p-10 space-y-5 sm:space-y-6'}>
                <div className="flex items-center justify-between pb-6 border-b-2" style={{ borderColor: activeColor.border }}>
                  <div className="space-y-1.5 max-w-[70%]">
                    <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="text-3xl font-bold uppercase tracking-tight text-neutral-900 block" />
                    <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-semibold tracking-wider uppercase block" style={{ color: activeColor.primary }} />
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs text-neutral-600">
                      <span><InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></span>
                      <span><InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></span>
                      <span><InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></span>
                      {getActiveTechLinks(cv).map((link) => (
                        <span key={link.id} className="inline-flex items-center space-x-1" style={{ color: activeColor.primary }}>
                          <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5 shrink-0" />
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
                      size="w-24 h-24"
                      className="border-neutral-200 shadow-md"
                      onTriggerUpload={triggerAvatarUpload || (() => {})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Column: Summary, Experience, Projects */}
                  <div className="md:col-span-7 space-y-6">
                    {sectionOrder
                      .filter((id) => ['summary', 'experience', 'projects'].includes(id) || id.startsWith('custom_'))
                      .map((secKey) => {
                        if (!sectionVisibility[secKey]) return null;
                        if (secKey === 'summary') {
                          return (
                            <div key="summary" className="space-y-1">
                              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: activeColor.primary, borderColor: activeColor.border }}>
                                {t.summary}
                              </h2>
                              <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 leading-relaxed text-justify block" />
                            </div>
                          );
                        }
                        if (secKey === 'experience') {
                          return (
                            <div key="experience" className="space-y-3">
                              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: activeColor.primary, borderColor: activeColor.border }}>
                                {t.experience}
                              </h2>
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
                                  <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-600 leading-relaxed block" />
                                </div>
                              ))}
                            </div>
                          );
                        }
                        if (secKey === 'projects') {
                          return (
                            <div key="projects" className="space-y-3">
                              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: activeColor.primary, borderColor: activeColor.border }}>
                                {t.projects}
                              </h2>
                              {cv.projects.map((proj, idx) => (
                                <div key={proj.id} className="relative group space-y-1 p-2 rounded bg-neutral-50">
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

                  {/* Right Column: Skills, Education */}
                  <div className="md:col-span-5 space-y-6">
                    {sectionOrder
                      .filter((id) => ['skills', 'education'].includes(id))
                      .map((secKey) => {
                        if (!sectionVisibility[secKey]) return null;
                        if (secKey === 'skills') {
                          return (
                            <div key="skills" className="space-y-2">
                              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: activeColor.primary, borderColor: activeColor.border }}>
                                {t.skillsTech}
                              </h2>
                              <div className="flex flex-wrap gap-1.5">
                                {cv.skills.map((s, idx) => (
                                  <span key={idx} className="group/skill text-[10px] px-2 py-0.5 rounded font-medium border inline-flex items-center space-x-1" style={{ backgroundColor: activeColor.lightBg, color: activeColor.primary, borderColor: activeColor.border }}>
                                    <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                                    <button onClick={() => removeSkill(idx)} className="no-print opacity-0 group-hover/skill:opacity-100 text-rose-500 ml-1">
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
                            <div key="education" className="space-y-3">
                              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: activeColor.primary, borderColor: activeColor.border }}>
                                {t.education}
                              </h2>
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
                </div>
              </div>
  );
}

export default CrispTemplate;
