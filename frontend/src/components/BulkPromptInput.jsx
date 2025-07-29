import React , {useState} from 'react';
 
const BulkPromptInput  = ({onSubmit, onCancel}) => {
    const[bulkPrompts, setBulkPrompts] = useState('');
    const handleSubmit = () => {
        const promptsArray = bulkPrompts.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        onSubmit(promptsArray);
        setBulkPrompts('');
    };

return (
        <div style ={{ margin: '1rem 0'}}>
            <textarea
                placeholder="submit prompts, one per line"
                value={bulkPrompts}
                onChange={e => setBulkPrompts(e.target.value)}
                rows={8}
                style={{ width: '100%'}}
                />
                <div style ={{marginTop:8}}>
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={onCancel} style ={{ marginLeft:8}}>Cancel</button>
                </div>
        </div>

   
);

};

export default BulkPromptInput;
