export function getErrorMessage(error: unknown): string {
  // Error object
  if (error instanceof Error) {
    return error.message;
  }
  
  // String
  if (typeof error === 'string') {
    return error;
  }
  
  // Object with message property (type-safe check)
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  
  // Axios response data message
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data &&
    typeof (error.response.data as { message: unknown }).message === 'string'
  ) {
    return (error.response.data as { message: string }).message;
  }
  
  // Default fallback
  return 'An unknown error occurred';
}

export function handleError(context: string, error: unknown): void {
  const message = getErrorMessage(error);
  console.error(`Error in ${context}: ${message}`);
}