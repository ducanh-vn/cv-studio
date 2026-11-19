'use client';

import React from 'react';
import type { CVTemplateProps } from './types';
import type { TemplateId } from '@/types/cvBuilder';

import { RabbitTemplate } from './RabbitTemplate';
import { CascadeTemplate } from './CascadeTemplate';
import { ChickenTemplate } from './ChickenTemplate';
import { IconicTemplate } from './IconicTemplate';
import { DeckerTemplate } from './DeckerTemplate';
import { BubblesTemplate } from './BubblesTemplate';
import { BasicTemplate } from './BasicTemplate';
import { CrispTemplate } from './CrispTemplate';
import { EnfoldTemplate } from './EnfoldTemplate';
import { EditorialTemplate } from './EditorialTemplate';

export interface CVTemplateSwitchProps extends CVTemplateProps {
  templateId?: TemplateId | string;
}

const TEMPLATE_REGISTRY: Record<string, React.ComponentType<CVTemplateProps>> = {
  rabbit: RabbitTemplate,
  cascade: CascadeTemplate,
  chicken: ChickenTemplate,
  iconic: IconicTemplate,
  decker: DeckerTemplate,
  bubbles: BubblesTemplate,
  basic: BasicTemplate,
  crisp: CrispTemplate,
  enfold: EnfoldTemplate,
  editorial: EditorialTemplate,
};

export function CVTemplateSwitch({
  templateId,
  ...props
}: CVTemplateSwitchProps) {
  const activeTemplateId = (templateId || props.template || 'rabbit') as string;
  const SelectedTemplate = TEMPLATE_REGISTRY[activeTemplateId] || RabbitTemplate;

  return <SelectedTemplate {...props} template={activeTemplateId as TemplateId} />;
}

export default CVTemplateSwitch;
