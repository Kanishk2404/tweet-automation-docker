import React, { useState } from 'react';
import BulkPromptInput from '../BulkPromptInput';

const BulkPromptManager = ({ onBulkPromptsSubmitted }) => {
    const [showBulkInput, setShowBulkInput] = useState(false);
    const [bulkPrompts, setBulkPrompts] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleBulkSubmit = async (promptsArray) => {
        if (promptsArray.length === 0) return;

        setIsProcessing(true);
        try {
            // This would be replaced with actual bulk processing API
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            setBulkPrompts(promptsArray);
            onBulkPromptsSubmitted && onBulkPromptsSubmitted(promptsArray);
            alert(`Successfully processed ${promptsArray.length} prompts!`);
        } catch (error) {
            console.error('Error processing bulk prompts:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = () => {
        setShowBulkInput(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bulk Prompt Manager</h2>

            <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                    Submit multiple prompts at once to generate tweets in batch.
                </p>

                {!showBulkInput ? (
                    <button
                        onClick={() => setShowBulkInput(true)}
                        className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        Add Bulk Prompts
                    </button>
                ) : (
                    <div className="space-y-4">
                        <BulkPromptInput
                            onSubmit={handleBulkSubmit}
                            onCancel={handleCancel}
                        />
                        {isProcessing && (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                                <p className="mt-2 text-sm text-gray-600">Processing bulk prompts...</p>
                            </div>
                        )}
                    </div>
                )}

                {bulkPrompts.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Processed Prompts</h3>
                        <div className="space-y-2">
                            {bulkPrompts.map((prompt, idx) => (
                                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-md p-3">
                                    <div className="text-sm text-gray-500 mb-1">Prompt {idx + 1}</div>
                                    <div className="text-gray-900">{prompt}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkPromptManager; 