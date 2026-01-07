import React from 'react';

export interface CheckboxProps {
    id: string;
    value: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, value, checked, onChange, label, description }) => (
    <label htmlFor={id} className="checkbox-label">
        <input id={id} type="checkbox" className="checkbox-input" value={value} checked={checked} onChange={onChange} />
        <div className="checkbox-custom">
            <svg className="w-3 h-3 text-white hidden" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
        </div>
        <div className="ml-3">
            <span className="text-sm font-medium text-gray-800">{label}</span>
            {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
    </label>
);