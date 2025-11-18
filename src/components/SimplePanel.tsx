import React, { useState, useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { RadioButtonGroup } from '@grafana/ui';

const FILTERS: Record<string, string | null> = {
  desativado: null,
  protanopia: `1.0, 0.0, 0.0, 0, 0
               0.0, 1.0, 0.0, 0, 0
               0.7, 0.0, 1.0, 0, 0  
               0,   0,   0,   1, 0`,
  deuteranopia: `1.0, 0.0, 0.0, 0, 0
                 0.0, 0.0, 1.0, 0, 0 
                 0.0, 1.0, 0.0, 0, 0 
                 0,   0,   0,   1, 0`,
  tritanopia: `1.0, 0.0, 0.5, 0, 0  
               0.0, 1.0, 0.0, 0, 0
               0.0, 0.0, 0.0, 0, 0  
               0,   0,   0,   1, 0`,
  contrast: `2.0, -0.5, -0.5, 0, 0
             -0.5, 2.0, -0.5, 0, 0
             -0.5, -0.5, 2.0, 0, 0
             0,    0,    0,   1, 0`
};

const OPTIONS = [
  { label: 'Desativado', value: 'desativado' },
  { label: 'Protanopia', value: 'protanopia' },
  { label: 'Deuteranopia', value: 'deuteranopia' },
  { label: 'Alto Contraste', value: 'contrast' },
];

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, width, height }) => {
  const [mode, setMode] = useState<string>('desativado');

  useEffect(() => {
    const dashboardContainer = document.querySelector<HTMLElement>('.react-grid-layout')
      || document.querySelector<HTMLElement>('.main-view')
      || document.querySelector<HTMLElement>('.dashboard-container');

    if (dashboardContainer) {
      const matrix = FILTERS[mode];
      dashboardContainer.style.filter = matrix ? `url(#correction-filter-${mode})` : 'none';
      dashboardContainer.style.transition = 'filter 0.3s ease';
    }

    return () => {
      if (dashboardContainer) {
        dashboardContainer.style.filter = 'none';
        dashboardContainer.style.transition = '';
      }
    };
  }, [mode]);

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        overflow: 'hidden'
      }}
    >

      <RadioButtonGroup
        options={OPTIONS}
        value={mode}
        onChange={(v) => setMode(v!)}
        size="sm"
      />

      <svg style={{ position: 'absolute', height: 0, width: 0, overflow: 'hidden' }}>
        <defs>
          {Object.entries(FILTERS).map(([key, matrix]) => (
            matrix && (
              <filter id={`correction-filter-${key}`} key={key} colorInterpolationFilters="sRGB">
                <feColorMatrix in="SourceGraphic" type="matrix" values={matrix} />
              </filter>
            )
          ))}
        </defs>
      </svg>
    </div>
  );
};