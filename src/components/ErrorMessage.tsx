import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
    message?: string;
    onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message = '데이터를 불러올 수 없습니다',
    onRetry
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-red-400 text-lg font-semibold mb-2">오류 발생</p>
            <p className="text-gray-400 mb-6">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                    다시 시도
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
