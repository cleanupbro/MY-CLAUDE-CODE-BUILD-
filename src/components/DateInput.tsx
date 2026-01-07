
import React, { useMemo } from 'react';

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export const DateInput: React.FC<DateInputProps> = ({ label, value, onChange, required = false, className = '' }) => {
  // Calculate date constraints
  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    const min = today.toISOString().split('T')[0];

    const future = new Date(today);
    future.setMonth(today.getMonth() + 3);
    const max = future.toISOString().split('T')[0];

    return { minDate: min, maxDate: max };
  }, []);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[#1D1D1F]">{label}</label>
      <div className="relative">
        <input 
            type="date" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            className="input w-full" 
            required={required} 
            min={minDate}
            max={maxDate}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
           {/* Calendar Icon overlay for better aesthetics */}
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">Bookings open for the next 3 months.</p>
    </div>
  );
};
