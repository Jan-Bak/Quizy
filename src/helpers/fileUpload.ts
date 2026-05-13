export interface FileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void; // Progress callback (0-100)
}

export interface FileUploadResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  file?: File;
}

/**
 * Validates a file against specified criteria
 * @param file - The file to validate
 * @param options - Upload options with size and type constraints
 * @returns Validation result with error message if invalid
 */
const validateFile = (
  file: File,
  options: FileUploadOptions = {}
): { valid: boolean; error?: string } => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [],
  } = options;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds limit of ${maxSize / 1024 / 1024}MB`,
    };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Accepted types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
};

/**
 * Reads a JSON file
 * @param file - The file to read
 * @param options - Upload options
 * @returns Promise with parsed JSON data
 */
export const readFileAsJSON = async <T = unknown>(
  file: File,
  options: FileUploadOptions = {}
): Promise<FileUploadResult & { data?: T }> => {
  const validation = validateFile(file, options);
  if (!validation.valid) {
    return {
      success: false,
      message: validation.error || 'File validation failed',
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        options.onProgress?.(progress);
      }
    };

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const jsonData = JSON.parse(text);
        resolve({
          success: true,
          message: 'File read successfully',
          data: jsonData,
          file,
        });
      } catch (error) {
        resolve({
          success: false,
          message: 'Failed to parse JSON file',
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        message: 'Failed to read file',
      });
    };

    reader.readAsText(file);
  });
};
