import React from 'react';

// Simple date/time picker component
function SchedulePicker({ value, onChange }) {
  return (
    <input
      type="datetime-local"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ padding: 4, fontSize: 16 }}
    />
  );
}

export default SchedulePicker;
