import React, { useState, useEffect } from 'react';

function SchedulePicker({ value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  return (
    <div style={{ width: '100%' }}>
      <button
        style={{ margin: '8px 0', alignSelf: 'flex-start' }}
        onClick={() => setShowPicker(v => !v)}
      >
        Schedule
      </button>
      {showPicker && (
        <div style={{ margin: '8px 0' }}>
          <label>
            Pick date and time:
            <input
              type="datetime-local"
              value={localValue}
              onChange={e => setLocalValue(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </label>
          <button
            style={{ marginLeft: 8 }}
            onClick={() => {
              setShowPicker(false);
              if (onChange) onChange(localValue);
            }}
          >
            Set
          </button>
        </div>
      )}
    </div>
  );
}

export default SchedulePicker;
