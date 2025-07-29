import React, { useState } from 'react';


const ScheduleOptions = ({ onChange }) => {
  const [option, setOption] = useState('once');
  const [times, setTimes] = useState(['']);

  const handleOptionChange = (e) => {
    const val = e.target.value;
    setOption(val);
    let newTimes = [''];
    if (val === 'twice') newTimes = ['', ''];
    if (val === 'thrice') newTimes = ['', '', ''];
    setTimes(newTimes);
    onChange && onChange({ type: val, times: newTimes });
  };

  const updateTime = (idx, value) => {
    const newTimes = [...times];
    newTimes[idx] = value;
    setTimes(newTimes);
    onChange && onChange({ type: option, times: newTimes });
  };

  return (
    <div style={{ minWidth: 220, marginLeft: 24 }}>
      <h4>Schedule</h4>
      <div>
        <label>
          <input type="radio" value="once" checked={option === 'once'} onChange={handleOptionChange} />
          Once a day
        </label>
        {option === 'once' && (
          <input
            type="time"
            value={times[0]}
            onChange={e => updateTime(0, e.target.value)}
            style={{ marginLeft: 8, width: 120 }}
          />
        )}
      </div>
      <div>
        <label>
          <input type="radio" value="twice" checked={option === 'twice'} onChange={handleOptionChange} />
          Twice a day
        </label>
        {option === 'twice' && (
          <>
            <input
              type="time"
              value={times[0]}
              onChange={e => updateTime(0, e.target.value)}
              style={{ marginLeft: 8, width: 120 }}
            />
            <input
              type="time"
              value={times[1]}
              onChange={e => updateTime(1, e.target.value)}
              style={{ marginLeft: 8, width: 120 }}
            />
          </>
        )}
      </div>
      <div>
        <label>
          <input type="radio" value="thrice" checked={option === 'thrice'} onChange={handleOptionChange} />
          Thrice a week
        </label>
        {option === 'thrice' && (
          <>
            <input
              type="time"
              value={times[0]}
              onChange={e => updateTime(0, e.target.value)}
              style={{ marginLeft: 8, width: 120 }}
            />
            <input
              type="time"
              value={times[1]}
              onChange={e => updateTime(1, e.target.value)}
              style={{ marginLeft: 8, width: 120 }}
            />
            <input
              type="time"
              value={times[2]}
              onChange={e => updateTime(2, e.target.value)}
              style={{ marginLeft: 8, width: 120 }}
            />
          </>
        )}
      </div>
      <div>
        
      </div>
    </div>
  );
};

export default ScheduleOptions;