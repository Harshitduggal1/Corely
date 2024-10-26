"use client"

import React, { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/_components/ui/use-toast';

const EmailMarketing: React.FC = () => {
    const [recipients, setRecipients] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [websiteUrl, setWebsiteUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [previewContent, setPreviewContent] = useState<string>('');
    const { toast } = useToast();
    const [debugInfo, setDebugInfo] = useState<string>('');
    const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

    // Enhanced email validation
    const validateEmails = (emails: string): string[] => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return [...new Set(
            emails.split(/[,\n\s]/)
                .map(email => email.trim().toLowerCase())
                .filter(email => email && emailRegex.test(email))
        )];
    };

    // Check if all forms are filled
    const isFormValid = useMemo(() => {
        return validateEmails(recipients).length > 0 && 
               subject.trim() !== '' && 
               prompt.trim() !== '' && 
               websiteUrl.trim() !== '';
    }, [recipients, subject, prompt, websiteUrl]);

    const sendEmailCampaign = useCallback(async () => {
        try {
            setIsLoading(true);
            setDebugInfo('🚀 Starting email campaign process...');

            // Input validation
            if (!subject.trim()) throw new Error('Please enter a subject line');
            if (!prompt.trim()) throw new Error('Please enter instructions for the AI');
            if (!websiteUrl.trim()) throw new Error('Please enter your website URL');

            const validEmails = validateEmails(recipients);
            if (validEmails.length === 0) {
                throw new Error('Please enter at least one valid email address');
            }

            setDebugInfo(`📧 Processing ${validEmails.length} valid recipients...`);

            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipients: validEmails,
                    subject: subject.trim(),
                    prompt: prompt.trim(),
                    websiteUrl: websiteUrl.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process email campaign');
            }

            setDebugInfo(`✅ Success! Job ID: ${data.jobId}`);
            setPreviewContent(data.previewContent || '');
            setIsEmailSent(true);

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
            setTimeout(() => {
                setIsLoading(false);
                setIsEmailSent(false);
            }, 2000);
        }
    }, [recipients, subject, prompt, websiteUrl, toast]);

    return (
        <div className="bg-gradient-to-r from-blue-300 to-pink-200 shadow-2xl mx-auto p-8 rounded-lg max-w-6xl">
            <h1 className="bg-clip-text bg-gradient-to-r from-rose-600 hover:from-pink-600 to-blue-600 hover:to-purple-600 mb-8 font-extrabold text-7xl text-transparent transition-all duration-300">
                AI-Powered Email Campaign⚡️

            </h1>

            <div className="space-y-6">
                {/* Recipients Input */}
                <div className="space-y-2">
                <label className="block bg-clip-text bg-gradient-to-r from-fuchsia-600 via-blue-600 to-rose-600 font-bold text-transparent text-xl">
                            Recipients{' '}🚀
                        </label>
                    <textarea
                        placeholder="Enter email addresses✅ (one per line or comma-separated)
Example:
john@example.com
sarah@example.com"
                        value={recipients}
                        onChange={(e) => setRecipients(e.target.value)}
                        className="border-2 border-purple-600 bg-white bg-opacity-70 backdrop-blur-sm p-3 rounded-lg focus:ring-4 focus:ring-blue-300 w-full h-32 font-mono text-slate-950 transition-all duration-300"
                    />
                    <div className="text-gray-600 text-sm">
                        {recipients ? `${validateEmails(recipients).length} valid email(s) found` : 'No emails entered'}
                    </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                <label className="block bg-clip-text bg-gradient-to-r from-fuchsia-600 via-blue-600 to-rose-600 font-bold text-transparent text-xl">
                            Subject Title
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
                <label className="block bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 font-bold text-lg text-transparent">
                        AI Instructions
                    </label>
                    <textarea
                        placeholder="Instructions for AI to generate your email content. Be specific about:
- Purpose of the email
- Tone (formal/casual)
- Key points to cover
- Call to action
Note: The AI will automatically include {{firstName}} and your website URL in appropriate places."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="border-2 border-purple-300 bg-white bg-opacity-70 backdrop-blur-sm p-3 rounded-lg focus:ring-4 focus:ring-blue-300 w-full h-40 text-slate-950 transition-all duration-300"
                    />
                </div>

                {/* Website URL Input */}
                <div className="space-y-2">
                <label className="block bg-clip-text bg-gradient-to-r from-blue-600 via-pink-600 to-purple-600 font-bold text-lg text-transparent">
                        Website URL
                    </label>
                    <input
                        type="url"
                        placeholder="Enter your website URL"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="border-2 border-purple-300 bg-white bg-opacity-70 backdrop-blur-sm p-3 rounded-lg focus:ring-4 focus:ring-blue-300 w-full text-slate-950 transition-all duration-300"
                    />
                </div>

                {/* Preview Content */}
                {previewContent && (
                    <div className="space-y-2">
                        <label className="block bg-clip-text bg-gradient-to-r from-pink-600 via-blue-600 to-purple-600 font-bold text-lg text-transparent">
                            Generated Preview (Styled)
                        </label>
                        <div className="border-2 border-green-300 bg-white bg-opacity-70 backdrop-blur-sm p-4 rounded-lg text-gray-800">
                            <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                        </div>
                    </div>
                )}

                {/* Send Button */}
                <button 
                    onClick={sendEmailCampaign}
                    disabled={isLoading || !isFormValid}
                    className={`relative border-2 hover:border-white bg-gradient-to-r from-purple-600 hover:from-blue-600 via-pink-500 hover:via-pink-500 to-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl p-4 border-transparent rounded-lg w-full font-bold text-lg text-white transform transition-all duration-300 overflow-hidden hover:scale-105 ${!isFormValid && !isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{
                        boxShadow: isLoading ? '0 0 15px #8b5cf6, 0 0 30px #ec4899, 0 0 45px #3b82f6' : 'none',
                        transition: 'all 0.3s ease-in-out'
                    }}
                >
                    {isLoading ? (
                        <span className="flex justify-center items-center">
                            <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="animate-pulse">
                                {isEmailSent 
                                    ? '✅AI HAS SENT THE EMAIL🎉' 
                                    : ['🧠✨ OUR AI IS DOING ITS MAGIC ', '⏳🔮 PLEASE WAIT, OUR AI IS PROCESSING THE REQUEST 🚀💫', '🤖🔧 AI IS ALMOST DONE PROCESSING EMAIL 📨🎉'][Math.floor((Date.now() / 2000) % 3)]}
                            </span>
                        </span>
                    ) : (
                        <span className="relative">
                            <span className="top-0 left-0 absolute flex justify-center items-center w-full h-full">
                                {isFormValid ? 'Send Campaign⚡️' : 'Fill all fields to continue'}
                            </span>
                            <span className="invisible">🔥Send Campaign</span>
                        </span>
                    )}
                    <div className="top-0 left-0 absolute bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 opacity-30 w-full h-full animate-gradient-x"></div>
                </button>
            </div>

            {/* Debug Information */}
            {debugInfo && (
                <div className="border-2 bg-white bg-opacity-50 backdrop-blur-sm mt-6 p-4 border-blue-200 rounded-lg">
                    <h3 className="font-bold text-gray-700">✅Status Updates:</h3>
                    <pre className="mt-2 text-gray-600 text-sm whitespace-pre-wrap">{debugInfo}</pre>
                </div>
            )}
        </div>
    );
};

export default EmailMarketing;
