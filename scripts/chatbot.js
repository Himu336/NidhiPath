const API_URL = 'https://niddhipath.onrender.com/';  // Replace with your actual Render API URL

/**
 * Sends a query to the chatbot API
 * @param {string} question - The user's question
 * @returns {Promise<string>} - The chatbot's response
 */
export async function sendQuery(question) {
  try {
    const response = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error querying chatbot:', error);
    throw error;
  }
}

/**
 * Uploads a PDF file to the chatbot API
 * @param {Object} file - The PDF file object from DocumentPicker
 * @param {Function} onProgress - Callback for upload progress
 * @returns {Promise<Object>} - The upload response
 */
export async function uploadPDF(file, onProgress) {
  try {
    console.log('Creating form data for upload...');
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: 'application/pdf',
      name: file.name,
    });
    console.log('Form data created:', formData);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          console.log(`Upload progress: ${percentCompleted}%`);
          onProgress(percentCompleted);
        }
      });

      xhr.addEventListener('load', () => {
        console.log('Upload response received:', {
          status: xhr.status,
          response: xhr.responseText,
        });
        
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            console.log('Upload successful:', response);
            resolve(response);
          } catch (error) {
            console.error('Error parsing response:', error);
            reject(new Error('Invalid response format'));
          }
        } else {
          console.error('Upload failed with status:', xhr.status);
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        console.error('Network error during upload');
        reject(new Error('Network error occurred'));
      });

      xhr.addEventListener('abort', () => {
        console.log('Upload aborted');
        reject(new Error('Upload aborted'));
      });

      console.log('Starting XHR upload to:', `${API_URL}/upload`);
      xhr.open('POST', `${API_URL}/upload`);
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Error in uploadPDF:', error);
    throw error;
  }
}
