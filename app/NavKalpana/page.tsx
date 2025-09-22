"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ApiResponse {
    url?: string;
    error?: string;
}

export default function NavKalpana() {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file || !description) {
            setError('Please upload an image and provide a description.');
            return;
        }

        setLoading(true);
        setError('');
        setImageUrl('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);

        try {
            const response = await fetch('/api/artisans/navkalpana', {
                method: 'POST',
                body: formData,
            });

            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate image.');
            }

            if (data.url) {
                setImageUrl(data.url);
            } else {
                throw new Error('No image URL returned.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-10">
            <div className="prose max-w-none prose-p:leading-relaxed text-center mb-8">
                <h1 className="font-serif text-3xl md:text-4xl text-gray-800">NavKalpana</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    NavKalpana is an AI-powered tool designed to help artisans create stunning product mockups and promotional videos with ease.
                </p>
            </div>

            <div className="w-full max-w-7xl md:flex md:flex-row gap-8 mt-4">
                {/* Left Panel: Input & Controls */}
                <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-6 mb-8 md:mb-0">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Your Mockup</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Your Product Image
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-4h2a4 4 0 014 4v20a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4h-2a4 4 0 01-4-4v-20a4 4 0 014-4h2a4 4 0 014 4v20a4 4 0 01-4 4z"
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        >
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    {file && <p className="text-xs text-green-600 mt-2">File selected: {file.name}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Describe Your Product
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                placeholder="e.g., A handcrafted terracotta vase with intricate floral patterns, reimagined with a futuristic cyberpunk aesthetic."
                                value={description}
                                onChange={handleDescriptionChange}
                            ></textarea>
                            <p className="mt-2 text-sm text-gray-500">
                                Tip: Be as descriptive as possible to get the best results!
                            </p>
                        </div>

                        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                        <button
                            type="submit"
                            disabled={loading || !file || !description}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Generating...' : 'Generate Mockup'}
                        </button>
                    </form>
                </div>

                {/* Right Panel: Output & Gallery */}
                <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Generated Mockup</h2>
                    <div className="h-96 w-full flex items-center justify-center bg-gray-200 rounded-md overflow-hidden relative">
                        {loading && (
                            <div className="flex flex-col items-center text-gray-500">
                                <svg className="animate-spin h-10 w-10 text-indigo-500 mb-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p>Generating your creative mockup...</p>
                            </div>
                        )}
                        {!loading && imageUrl && (
                            <div className="relative w-full h-full">
                                <Image
                                    src={imageUrl}
                                    alt="Generated AI mockup"
                                    layout="fill"
                                    objectFit="contain"
                                    className="rounded-md"
                                />
                                <a
                                    href={imageUrl}
                                    download
                                    className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Download
                                </a>
                            </div>
                        )}
                        {!loading && !imageUrl && !error && (
                            <p className="text-gray-400 text-center">Your generated image will appear here.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}