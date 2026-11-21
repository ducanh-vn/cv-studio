'use client';

import React from 'react';
import { X } from 'lucide-react';
import { InlineEditable, ItemControls, AvatarBlock } from '@/components/canvas';
import TechLinkIcon from '@/components/TechLinkIcon';
import CVQRCodeBlock from '@/components/CVQRCodeBlock';
import { getActiveTechLinks } from '@/lib/customTechLinks';
import { formatPeriod } from '@/lib/cvFormatters';
import type { CVTemplateProps } from './types';

export function EditorialTemplate({
  cv,
  setCv,
  lang,
  t,
  activeColor,
  sectionOrder,
  sectionVisibility,
  isCompact = false,
  template = 'editorial',
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
}: CVTemplateProps) {
  return (
    <div className={isCompact ? 'p-6 space-y-4' : 'p-8 sm:p-10 space-y-5 sm:space-y-6'}>
                <div className="border-b-2 border-neutral-900 pb-6 flex items-start justify-between">
                  <div className="space-y-2">
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-neutral-500">Curriculum Vitae</span>
                    <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="font-serif text-4xl uppercase tracking-wider text-neutral-950 font-normal block" />
                    <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-mono tracking-widest uppercase font-semibold text-cyan-800 block" />
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
                      shape="rounded-full"
                      size="w-20 h-20"
                      className="border border-neutral-400 grayscale"
                      onTriggerUpload={triggerAvatarUpload || (() => {})}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-y-1.5 text-xs font-mono border-b border-neutral-200 py-2 text-neutral-600">
                  <div className="flex items-center space-x-4">
                    <span><InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></span>
                    <span>•</span>
                    <span><InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></span>
                    <span>•</span>
                    <span><InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {getActiveTechLinks(cv).map((link) => (
                      <span key={link.id} className="inline-flex items-center space-x-1 text-neutral-800">
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

                <div className="space-y-6">
                  {sectionOrder.map((secKey) => {
                    if (!sectionVisibility[secKey]) return null;
                    if (secKey === 'summary') {
                      return (
                        <div key="summary" className="space-y-2">
                          <h2 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold">{t.editorialSummary}</h2>
                          <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 italic border-l-2 pl-4 border-neutral-300 block" />
                        </div>
                      );
                    }
                    if (secKey === 'experience') {
                      return (
                        <div key="experience" className="space-y-3">
                          <h2 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold">{t.editorialExperience}</h2>
                          {cv.timeline.map((item, idx) => (
                            <div key={item.id} className="relative group border-l-2 border-neutral-900 pl-4 space-y-0.5">
                              <ItemControls
                                index={idx}
                                total={cv.timeline.length}
                                onMoveUp={() => moveTimelineItem(idx, 'up')}
                                onMoveDown={() => moveTimelineItem(idx, 'down')}
                                onAddBelow={() => addTimelineItem(idx)}
                                onDelete={() => deleteTimelineItem(item.id)}
                              />
                              <div className="flex justify-between text-xs">
                                <InlineEditable tag="span" value={item.role} onChange={(v) => updateTimelineItem(item.id, 'role', v)} singleLine className="font-bold uppercase text-neutral-900" />
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
                        <div key="projects" className="space-y-3">
                          <h2 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold">{t.projects}</h2>
                          <div className="grid grid-cols-2 gap-4">
                            {cv.projects.map((proj, idx) => (
                              <div key={proj.id} className="relative group border-l-2 border-neutral-400 pl-3 space-y-1">
                                <ItemControls
                                  index={idx}
                                  total={cv.projects.length}
                                  onMoveUp={() => moveProjectItem(idx, 'up')}
                                  onMoveDown={() => moveProjectItem(idx, 'down')}
                                  onAddBelow={() => addProjectItem(idx)}
                                  onDelete={() => deleteProjectItem(proj.id)}
                                />
                                <div className="flex justify-between items-baseline text-xs">
                                  <InlineEditable tag="span" value={proj.title} onChange={(v) => updateProjectItem(proj.id, 'title', v)} singleLine className="font-bold uppercase text-neutral-900" />
                                  <InlineEditable tag="span" value={proj.year} onChange={(v) => updateProjectItem(proj.id, 'year', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                                </div>
                                <InlineEditable tag="p" value={proj.desc} onChange={(v) => updateProjectItem(proj.id, 'desc', v)} className="text-xs text-neutral-600 block" />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (secKey === 'skills') {
                      return (
                        <div key="skills" className="space-y-2 pt-2 border-t border-neutral-200">
                          <h2 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold">{t.editorialSkills}</h2>
                          <div className="flex flex-wrap gap-1.5">
                            {cv.skills.map((s, idx) => (
                              <span key={idx} className="group/skill text-[10px] font-mono border border-neutral-300 px-2 py-0.5 rounded inline-flex items-center space-x-1">
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
                        <div key="education" className="space-y-2 pt-2 border-t border-neutral-200">
                          <h2 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold">{t.editorialEducation}</h2>
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
                    return null;
                  })}
                </div>
              </div>
  );
}

export default EditorialTemplate;
