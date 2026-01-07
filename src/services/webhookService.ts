
export const sendToWebhook = async <T,>(url: string, data: T): Promise<{ success: boolean; error?: string }> => {
  try {
    // Attempt 1: Standard JSON Request (Preferred)
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('Webhook response was not ok.', { status: response.status, statusText: response.statusText });
      return { success: false, error: `Server Error (${response.status}). Your submission has been saved locally.` };
    }

    return { success: true };
  } catch (error) {
    console.warn('Standard webhook attempt failed, trying no-cors fallback...', error);
    
    // Attempt 2: No-CORS Fallback (Fire and Forget)
    // This bypasses strict CORS checks by sending as text/plain opaque request
    if (error instanceof TypeError && (error.message === 'Failed to fetch' || error.message.includes('NetworkError'))) {
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors', 
          headers: {
            'Content-Type': 'text/plain', // application/json is not allowed in no-cors
          },
          body: JSON.stringify(data),
        });
        
        // In no-cors mode, we can't check response.ok, so we assume success if it didn't throw.
        return { success: true };
      } catch (fallbackError) {
        console.error('Fallback webhook attempt also failed.', fallbackError);
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown network error';
    return { success: false, error: `Connection failed (${errorMessage}). Your submission has been saved locally.` };
  }
};
