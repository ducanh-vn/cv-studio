'use client';

import React from 'react';
import { X } from 'lucide-react';
import { InlineEditable, ItemControls, AvatarBlock } from '@/components/canvas';
import TechLinkIcon from '@/components/TechLinkIcon';
import CVQRCodeBlock from '@/components/CVQRCodeBlock';
import { getActiveTechLinks } from '@/lib/customTechLinks';
import { formatPeriod } from '@/lib/cvFormatters';
import type { CVTemplateProps } from './types';

export function EnfoldTemplate({
  cv,
  setCv,
  lang,
  t,
  activeColor,
  sectionOrder,
  sectionVisibility,
  isCompact = false,
  template = 'enfold',
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
              <div className="min-h-[297mm] flex">
                {/* Main Content Area */}
                <div className="flex-1 p-8 space-y-6">
                  <div className="pb-4 border-b border-neutral-200">
                    <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="text-3xl font-bold uppercase tracking-tight text-neutral-900 block" />
                    <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-semibold tracking-wider uppercase text-cyan-800 mt-1 block" />
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
                          <div key="experience" className="space-y-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">
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
                                <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-600 block" />
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
                      return null;
                    })}
                </div>

                {/* Right Colored Sidebar */}
                <div className="w-[32%] text-white p-7 space-y-6 flex-shrink-0" style={{ backgroundColor: activeColor.sidebarBg }}>
                  <AvatarBlock
                    avatar={cv.avatar}
                    name={cv.name}
                    showAvatar={cv.showAvatar}
                    shape="rounded-full"
                    size="w-28 h-28"
                    className="mx-auto border-white/20 shadow-md"
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

                  <div className="space-y-2 text-xs">
                    <h3 className="text-xs font-bold uppercase text-cyan-400 border-b border-white/20 pb-1">{t.contactShort}</h3>
                    <p className="text-neutral-300 break-all"><InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></p>
                    <p className="text-neutral-300"><InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></p>
                    <p className="text-neutral-300"><InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></p>
                    {getActiveTechLinks(cv).map((link) => (
                      <p key={link.id} className="text-neutral-300 break-all flex items-center space-x-1.5">
                        <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <InlineEditable
                          tag="span"
                          value={link.label || ''}
                          onChange={(val) => handleUpdateCustomLink(link.id, { label: val })}
                          singleLine
                        />
                      </p>
                    ))}
                  </div>

                  {sectionOrder
                    .filter((id) => ['skills', 'education'].includes(id))
                    .map((secKey) => {
                      if (!sectionVisibility[secKey]) return null;
                      if (secKey === 'skills') {
                        return (
                          <div key="skills" className="space-y-2 text-xs">
                            <h3 className="text-xs font-bold uppercase text-cyan-400 border-b border-white/20 pb-1">{t.skillsShort}</h3>
                            <div className="flex flex-wrap gap-1">
                              {cv.skills.map((s, idx) => (
                                <span key={idx} className="group/skill text-[10px] px-2 py-0.5 rounded bg-white/10 text-white font-mono inline-flex items-center space-x-1">
                                  <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                                  <button onClick={() => removeSkill(idx)} className="no-print opacity-0 group-hover/skill:opacity-100 text-rose-300 ml-1">
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
                          <div key="education" className="space-y-2 text-xs">
                            <h3 className="text-xs font-bold uppercase text-cyan-400 border-b border-white/20 pb-1">{t.educationShort}</h3>
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

export default EnfoldTemplate;
