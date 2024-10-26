"use client"

import React, { useState, useCallback } from 'react';
import { useToast } from '@/_components/ui/use-toast';

const EmailMarketing: React.FC = () => {
    const [recipients, setRecipients] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [previewContent, setPreviewContent] = useState<string>('');
    const { toast } = useToast();
    const [debugInfo, setDebugInfo] = useState<string>('');

    // Enhanced email validation
    const validateEmails = (emails: string): string[] => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return [...new Set(
            emails.split(/[,\n\s]/)
                .map(email => email.trim().toLowerCase())
                .filter(email => email && emailRegex.test(email))
        )];
    };

    const sendEmailCampaign = useCallback(async () => {
        try {
            setIsLoading(true);
            setDebugInfo('🚀 Starting email campaign process...');

            // Input validation
            if (!subject.trim()) {
                throw new Error('Please enter a subject line');
            }

            if (!prompt.trim()) {
                throw new Error('Please enter instructions for the AI');
            }

            const validEmails = validateEmails(recipients);
            if (validEmails.length === 0) {
                throw new Error('Please enter at least one valid email address');
            }

            setDebugInfo(`📧 Processing ${validEmails.length} valid recipients...`);

            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipients: validEmails,
                    subject: subject.trim(),
                    prompt: prompt.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process email campaign');
            }

            setDebugInfo(`✅ Success! Job ID: ${data.jobId}`);
            setPreviewContent(data.previewContent || '');

            toast({
                title: "Campaign Queued Successfully",
                description: `Sending to ${data.recipientCount} recipients. Job ID: ${data.jobId}`,
                duration: 5000,
            });

        } catch (error) {
            console.error('Campaign Error:', error);
            setDebugInfo(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to process campaign",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    }, [recipients, subject, prompt, toast]);

    return (
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 shadow-2xl mx-auto p-8 rounded-lg max-w-6xl">
            <h1 className="bg-clip-text bg-gradient-to-r from-purple-600 hover:from-blue-600 to-blue-600 hover:to-purple-600 mb-8 font-extrabold text-5xl text-transparent transition-all duration-300">
                AI-Powered Email Campaign
            </h1>

            <div className="space-y-6">
                {/* Recipients Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Recipients
                    </label>
                    <textarea
                        placeholder="Enter email addresses (one per line or comma-separated)
Example:
john@example.com
sarah@example.com"
                        value={recipients}
                        onChange={(e) => setRecipients(e.target.value)}
                        className="border-2 border-purple-300 bg-white bg-opacity-70 backdrop-blur-sm p-3 rounded-lg focus:ring-4 focus:ring-blue-300 w-full h-32 text-slate-950 transition-all duration-300 font-mono"
                    />
                    <div className="text-sm text-gray-600">
                        {recipients ? `${validateEmails(recipients).length} valid email(s) found` : 'No emails entered'}
                    </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Subject Line
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your email subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="border-2 border-purple-300 bg-white bg-opacity-70 backdrop-blur-sm p-3 rounded-lg focus:ring-4 focus:ring-blue-300 w-full text-slate-950 transition-all duration-300"
                    />
                </div>

                {/* AI Prompt Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        AI Instructions
                    </label>
                    <textarea
                        placeholder="Instructions for AI to generate your email content. Be specific about:
- Purpose of the email
- Tone (formal/casual)
- Key points to cover
- Call to action"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="border-2 border-purple-300 bg-white bg-opacity-70 backdrop-blur-sm p-3 rounded-lg focus:ring-4 focus:ring-blue-300 w-full h-40 text-slate-950 transition-all duration-300"
                    />
                </div>

                {/* Preview Content */}
                {previewContent && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Generated Preview
                        </label>
                        <div className="bg-white bg-opacity-70 backdrop-blur-sm p-4 rounded-lg border-2 border-green-300">
                            <pre className="whitespace-pre-wrap text-sm">{previewContent}</pre>
                        </div>
                    </div>
                )}

                {/* Send Button */}
                <button 
                    onClick={sendEmailCampaign}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-500 hover:from-blue-500 to-blue-500 hover:to-purple-500 disabled:opacity-50 shadow-lg hover:shadow-xl p-4 rounded-lg w-full font-bold text-lg text-white transform transition-all duration-300 disabled:cursor-not-allowed hover:scale-105"
                >
                    {isLoading ? (
                        <span className="flex justify-center items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Campaign...
                        </span>
                    ) : 'Send Campaign'}
                </button>
            </div>

            {/* Debug Information */}
            {debugInfo && (
                <div className="mt-6 p-4 bg-white bg-opacity-50 backdrop-blur-sm rounded-lg border-2 border-blue-200">
                    <h3 className="font-bold text-gray-700">Status Updates:</h3>
                    <pre className="whitespace-pre-wrap text-sm text-gray-600 mt-2">{debugInfo}</pre>
                </div>
            )}
        </div>
    );
};

export default EmailMarketing;
