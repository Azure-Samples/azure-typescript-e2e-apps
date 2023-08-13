/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect } from 'react';

const ErrorBoundary = ({ children }: any) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const errorHandler = (error: any, errorInfo: any) => {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
      setHasError(true);
      setError(error);
    };

    window.addEventListener('error', errorHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <>
        <h1>Something went wrong.</h1>
        <div>{JSON.stringify(error)}</div>
      </>
    );
  }

  return children;
};

export default ErrorBoundary;
