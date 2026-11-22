'use client';

import React from 'react';
import {
  Terminal,
  User,
  Briefcase,
  Plus,
  FolderGit2,
  Code2,
  GraduationCap,
  Award,
  X,
  Check,
} from 'lucide-react';
import { InlineEditable, ItemControls, AvatarBlock, CustomSectionRenderer } from '@/components/canvas';
import TechLinkIcon from '@/components/TechLinkIcon';
import CVQRCodeBlock from '@/components/CVQRCodeBlock';
import { getActiveTechLinks } from '@/lib/customTechLinks';
import { formatPeriod } from '@/lib/cvFormatters';
import type { CVTemplateProps } from './types';

export function RabbitTemplate({
  cv,
  setCv,
  lang,
  t,
  activeColor,
  pad,
  sectionOrder,
  sectionVisibility,
  isCompact = false,
  template = 'rabbit',
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
  addSkill = () => {},
  newSkillText = '',
  setNewSkillText = () => {},
  isAddingSkill = false,
  setIsAddingSkill = () => {},
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
    <div className="flex flex-col">
      {/* Rabbit Dark Tech Header */}
      <div
        className={`${pad.header} text-white flex items-center justify-between border-b-4`}
        style={{ backgroundColor: activeColor.sidebarBg, borderColor: activeColor.primary }}
      >
        <div className="space-y-2 max-w-[72%]">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
              Technical Profile
            </span>
          </div>
          <InlineEditable
            tag="h1"
            value={cv.name}
            onChange={(val) => setCv({ ...cv, name: val })}
            singleLine
            className="text-3xl font-bold uppercase tracking-tight text-white block"
          />
          <InlineEditable
            tag="p"
            value={cv.role}
            onChange={(val) => setCv({ ...cv, role: val })}
            singleLine
            className="text-xs font-semibold tracking-wider uppercase text-cyan-400 block"
          />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-300 pt-1 font-mono">
            <span>✉ <InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></span>
            <span>☎ <InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></span>
            <span>📍 <InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></span>
            {getActiveTechLinks(cv).map((link) => (
              <span key={link.id} className="inline-flex items-center space-x-1">
                <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
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
              isDarkHeader={true}
              accentColorHex={activeColor.primary}
            />
          )}
          <AvatarBlock
            avatar={cv.avatar}
            name={cv.name}
            showAvatar={cv.showAvatar}
            shape="rounded-2xl"
            size="w-24 h-24"
            className="border-cyan-400/50 shadow-xl"
            onTriggerUpload={triggerAvatarUpload || (() => {})}
          />
        </div>
      </div>

      {/* Rabbit Body (2 Columns with Connected Timeline) */}
      <div className={`${pad.body} flex-1 grid grid-cols-12 ${pad.gridGap}`}>
        {/* Left Column (65% width): Summary, Work Experience Timeline & Projects */}
        <div className={`col-span-7 ${pad.sectionGap}`}>
          {sectionOrder
            .filter((id) => ['summary', 'experience', 'projects'].includes(id) || id.startsWith('custom_'))
            .map((secKey) => {
              if (!sectionVisibility[secKey]) return null;
              if (secKey === 'summary') {
                return (
                  <div key="summary" className={`${pad.cardPad} rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5 shadow-sm`}>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{t.summaryGoal}</span>
                    </h2>
                    <InlineEditable
                      tag="p"
                      value={cv.summary}
                      onChange={(val) => setCv({ ...cv, summary: val })}
                      className={`${pad.textSummary} text-neutral-700 block text-justify`}
                    />
                  </div>
                );
              }
              if (secKey === 'experience') {
                return (
                  <div key="experience" className={pad.itemGap}>
                    <div className="flex justify-between items-center pb-1.5 border-b-2" style={{ borderColor: activeColor.border }}>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{t.experienceTimeline}</span>
                      </h2>
                      <button
                        onClick={() => addTimelineItem()}
                        className="no-print text-[10px] text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{t.addItem}</span>
                      </button>
                    </div>

                    {/* Connected Vertical Timeline Line */}
                    <div className={`relative pl-6 ml-2 border-l-2 ${pad.timelineLine}`} style={{ borderColor: activeColor.border }}>
                      {cv.timeline.map((item, idx) => (
                        <div key={item.id} className={`relative group ${pad.itemSubGap}`}>
                          {/* Circular Connecting Timeline Dot */}
                          <div
                            className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125"
                            style={{ backgroundColor: activeColor.primary }}
                          />
                          <ItemControls
                            index={idx}
                            total={cv.timeline.length}
                            onMoveUp={() => moveTimelineItem(idx, 'up')}
                            onMoveDown={() => moveTimelineItem(idx, 'down')}
                            onAddBelow={() => addTimelineItem(idx)}
                            onDelete={() => deleteTimelineItem(item.id)}
                          />
                          <div className="flex justify-between items-baseline text-xs">
                            <InlineEditable
                              tag="span"
                              value={item.role}
                              onChange={(val) => updateTimelineItem(item.id, 'role', val)}
                              singleLine
                              className="font-bold text-neutral-900"
                            />
                            <InlineEditable
                              tag="span"
                              value={formatPeriod(item.period, lang)}
                              onChange={(val) => updateTimelineItem(item.id, 'period', val)}
                              singleLine
                              className="font-mono text-[10px] text-cyan-800 font-semibold px-2 py-0.5 rounded bg-neutral-100"
                            />
                          </div>
                          <InlineEditable
                            tag="p"
                            value={item.desc}
                            onChange={(val) => updateTimelineItem(item.id, 'desc', val)}
                            className={`${pad.textDesc} text-neutral-600 block text-justify`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (secKey === 'projects') {
                return (
                  <div key="projects" className={`${pad.itemGap} pt-1`}>
                    <div className="flex justify-between items-center pb-1.5 border-b-2" style={{ borderColor: activeColor.border }}>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{t.projectsFeatured}</span>
                      </h2>
                      <button
                        onClick={() => addProjectItem()}
                        className="no-print text-[10px] text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{t.addProject}</span>
                      </button>
                    </div>

                    <div className={pad.itemSubGap}>
                      {cv.projects.map((proj, idx) => (
                        <div key={proj.id} className={`relative group ${pad.cardPad} rounded-xl bg-neutral-50/80 border border-neutral-200/80 ${pad.itemSubGap} shadow-sm`}>
                          <ItemControls
                            index={idx}
                            total={cv.projects.length}
                            onMoveUp={() => moveProjectItem(idx, 'up')}
                            onMoveDown={() => moveProjectItem(idx, 'down')}
                            onAddBelow={() => addProjectItem(idx)}
                            onDelete={() => deleteProjectItem(proj.id)}
                          />
                          <div className="flex justify-between items-baseline text-xs">
                            <div className="flex items-center space-x-1 font-bold text-neutral-900">
                              <InlineEditable
                                tag="span"
                                value={proj.title}
                                onChange={(val) => updateProjectItem(proj.id, 'title', val)}
                                singleLine
                              />
                              <span>—</span>
                              <InlineEditable
                                tag="span"
                                value={proj.category}
                                onChange={(val) => updateProjectItem(proj.id, 'category', val)}
                                singleLine
                                className="text-neutral-600 font-normal"
                              />
                            </div>
                            <InlineEditable
                              tag="span"
                              value={proj.year}
                              onChange={(val) => updateProjectItem(proj.id, 'year', val)}
                              singleLine
                              className="font-mono text-[10px] text-neutral-500"
                            />
                          </div>
                          <InlineEditable
                            tag="p"
                            value={proj.desc}
                            onChange={(val) => updateProjectItem(proj.id, 'desc', val)}
                            className={`${pad.textDesc} text-neutral-600 block`}
                          />
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {proj.badges.map((b) => (
                              <span key={b} className="text-[9px] px-1.5 py-0.5 bg-white border border-neutral-200 rounded font-mono font-medium text-neutral-700">
                                {b}
                              </span>
                            ))}
                          </div>
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

        {/* Right Column (35% width): Skills Stack, Education & Credentials */}
        <div className={`col-span-5 ${pad.sectionGap}`}>
          {sectionOrder
            .filter((id) => ['skills', 'education'].includes(id))
            .map((secKey) => {
              if (!sectionVisibility[secKey]) return null;
              if (secKey === 'skills') {
                return (
                  <div key="skills" className="space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1.5 border-b-2 flex items-center space-x-1.5" style={{ borderColor: activeColor.border }}>
                      <Code2 className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{t.skillsTech}</span>
                    </h2>

                    <div className="flex flex-wrap gap-1.5 items-center">
                      {cv.skills.map((s, idx) => (
                        <span
                          key={`${s}-${idx}`}
                          className="group/skill relative text-[11px] px-2.5 py-1 rounded-lg font-mono font-medium border shadow-xs inline-flex items-center space-x-1"
                          style={{
                            backgroundColor: activeColor.lightBg,
                            color: activeColor.primary,
                            borderColor: activeColor.border,
                          }}
                        >
                          <InlineEditable
                            tag="span"
                            value={s}
                            onChange={(v) => updateSkill(idx, v)}
                            singleLine
                          />
                          <button
                            onClick={() => removeSkill(idx)}
                            className="no-print opacity-0 group-hover/skill:opacity-100 text-neutral-400 hover:text-rose-500 transition-opacity ml-1 cursor-pointer"
                            title="Xoá kỹ năng"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}

                      {/* Inline Add Skill */}
                      {isAddingSkill ? (
                        <div className="inline-flex items-center space-x-1 no-print">
                          <input
                            type="text"
                            value={newSkillText}
                            onChange={(e) => setNewSkillText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addSkill(newSkillText);
                                setNewSkillText('');
                                setIsAddingSkill(false);
                              } else if (e.key === 'Escape') {
                                setIsAddingSkill(false);
                              }
                            }}
                            placeholder={lang === 'en' ? 'Skill...' : 'Kỹ năng...'}
                            className="text-[10px] px-2 py-0.5 rounded border border-cyan-400 bg-white text-neutral-900 outline-none w-24"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              addSkill(newSkillText);
                              setNewSkillText('');
                              setIsAddingSkill(false);
                            }}
                            className="p-1 rounded bg-cyan-600 text-white cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setIsAddingSkill(false)}
                            className="p-1 rounded bg-neutral-200 text-neutral-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsAddingSkill(true)}
                          className="no-print text-[10px] px-2 py-0.5 rounded-lg border border-dashed border-cyan-500/50 text-cyan-700 hover:bg-cyan-50 transition-colors inline-flex items-center space-x-1 font-mono cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t.addSkill}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              }
              if (secKey === 'education') {
                return (
                  <div key="education" className="space-y-3">
                    <div className="flex justify-between items-center pb-1.5 border-b-2" style={{ borderColor: activeColor.border }}>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{t.education}</span>
                      </h2>
                      <button
                        onClick={() => addEducationItem()}
                        className="no-print text-[10px] text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{t.addEducation}</span>
                      </button>
                    </div>

                    {cv.education.map((edu, idx) => (
                      <div key={edu.id} className="relative group p-3 rounded-xl bg-neutral-50/80 border border-neutral-200/80 space-y-1">
                        <ItemControls
                          index={idx}
                          total={cv.education.length}
                          onMoveUp={() => moveEducationItem(idx, 'up')}
                          onMoveDown={() => moveEducationItem(idx, 'down')}
                          onAddBelow={() => addEducationItem(idx)}
                          onDelete={() => deleteEducationItem(edu.id)}
                        />
                        <InlineEditable
                          tag="span"
                          value={edu.school}
                          onChange={(val) => updateEducationItem(edu.id, 'school', val)}
                          singleLine
                          className="font-bold text-xs block text-neutral-900"
                        />
                        <InlineEditable
                          tag="span"
                          value={edu.degree}
                          onChange={(val) => updateEducationItem(edu.id, 'degree', val)}
                          singleLine
                          className="text-[11px] text-cyan-800 font-semibold block"
                        />
                        <InlineEditable
                          tag="span"
                          value={edu.year}
                          onChange={(val) => updateEducationItem(edu.id, 'year', val)}
                          singleLine
                          className="font-mono text-[10px] text-neutral-500 block"
                        />
                        <InlineEditable
                          tag="p"
                          value={edu.desc || ''}
                          onChange={(val) => updateEducationItem(edu.id, 'desc', val)}
                          className="text-[11px] text-neutral-600 pt-1 leading-relaxed block"
                        />
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

          {/* Engineering Practices */}
          <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/80 space-y-2 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-1.5 text-[11px]">
              <Award className="w-3.5 h-3.5 text-cyan-600" />
              <span>{t.codeStandards}</span>
            </h3>
            <ul className="text-[11px] text-neutral-600 space-y-1">
              <li>{t.standardsCleanCode}</li>
              <li>{t.standardsMicroservices}</li>
              <li>{t.standardsCicd}</li>
              <li>{t.standardsEnglish}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RabbitTemplate;
