import React, { useState, useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { RadioButtonGroup } from '@grafana/ui';


const FILTERS: Record<string, string | null> = {
    normal: null,
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
    { label: 'Normal', value: 'normal' },
    { label: 'Protanopia', value: 'protanopia' },
    { label: 'Deuteranopia', value: 'deuteranopia' },
    { label: 'Tritanopia', value: 'tritanopia' },
    { label: 'Alto Contraste', value: 'contrast' },
];

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, width, height }) => {
    const [mode, setMode] = useState<string>(() => {
        try { return localStorage.getItem('grafana-access-mode') || 'normal'; } catch { return 'normal'; }
    });

    useEffect(() => {
        localStorage.setItem('grafana-access-mode', mode);

        const matrix = FILTERS[mode];
        document.body.style.filter = matrix ? `url(#correction-filter-${mode})` : 'none';
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
            <div style={{ marginBottom: '8px', fontWeight: '500' }}>Acessibilidade Visual</div>

            <RadioButtonGroup
                options={OPTIONS}
                value={mode}
                onChange={(v) => setMode(v)}
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