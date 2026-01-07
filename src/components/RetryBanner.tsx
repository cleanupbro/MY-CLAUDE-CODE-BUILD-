import React, { useState, useEffect } from 'react';
import { getFailedSubmissions, removeFailedSubmission, clearFailedSubmissions } from '../services/failedSubmissionsService';
import { sendToWebhook } from '../services/webhookService';
import { WEBHOOK_URLS } from '../constants';
import { Submission } from '../types';

export const RetryBanner: React.FC = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isRetrying, setIsRetrying] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        setSubmissions(getFailedSubmissions());
    }, []);

    const handleRetry = async () => {
        setIsRetrying(true);
        setMessage('Retrying submissions...');

        let successes = 0;
        const total = submissions.length;
        let remainingSubmissions = [...submissions];

        for (const submission of submissions) {
            const webhookUrl = submission.type === 'Landing Lead' ? WEBHOOK_URLS.LANDING_LEAD : WEBHOOK_URLS[submission.type];
            const result = await sendToWebhook(webhookUrl, submission.data);
            
            if (result.success) {
                successes++;
                remainingSubmissions = remainingSubmissions.filter(s => s.id !== submission.id);
                removeFailedSubmission(submission.id); 
            }
        }
        
        setSubmissions(remainingSubmissions);
        setIsRetrying(false);

        if (successes === total) {
            setMessage('All saved submissions have been sent successfully!');
        } else {
            setMessage(`Sent ${successes} of ${total} saved submissions. ${total - successes} failed again and remain saved.`);
        }

        setTimeout(() => setMessage(null), 5000); // Clear message after 5 seconds
    };
    
    const handleDismiss = () => {
        if(confirm('Are you sure you want to dismiss all saved submissions? This cannot be undone.')) {
            clearFailedSubmissions();
            setSubmissions([]);
        }
    }

    if (submissions.length === 0) {
        return null;
    }

    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 -mt-20 sticky top-20 z-40 animate-fade-in-up" role="alert">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <p className="font-bold">Unsent Submissions</p>
                    <p className="text-sm">
                        {message || `You have ${submissions.length} submission(s) that failed to send. You can retry sending them now.`}
                    </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <button 
                        onClick={handleRetry} 
                        disabled={isRetrying}
                        className="btn-primary !px-4 !py-2 !text-sm"
                    >
                        {isRetrying ? 'Retrying...' : `Retry All (${submissions.length})`}
                    </button>
                    <button 
                        onClick={handleDismiss} 
                        disabled={isRetrying}
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full"
                        aria-label="Dismiss all saved submissions"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};