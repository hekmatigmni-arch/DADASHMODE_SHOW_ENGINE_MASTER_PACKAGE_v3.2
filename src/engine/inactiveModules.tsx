/**
 * INACTIVE MODULES ARCHIVE
 * 
 * In accordance with prompt instructions:
 * "Disable unused old components: old text explanation panels, unused rule cards, duplicate HUD elements.
 * Do not delete them. Move them to inactive modules."
 */

import React from 'react';

export const InactiveRuleCard: React.FC<{ title: string; text: string }> = ({ title, text }) => {
  return (
    <div className="hidden opacity-0 pointer-events-none" aria-hidden="true" data-status="archived_inactive">
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  );
};

export const InactiveLegacyCounter: React.FC<{ label: string; count: number }> = ({ label, count }) => {
  return (
    <div className="hidden opacity-0 pointer-events-none" aria-hidden="true" data-status="archived_inactive">
      <span>{label}</span>
      <span>{count}</span>
    </div>
  );
};
