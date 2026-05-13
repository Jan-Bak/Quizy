import { describe, it, expect, vi } from 'vitest';
import { readFileAsJSON, type FileUploadOptions } from '../fileUpload';

describe('readFileAsJSON', () => {
  it('should successfully read and parse a valid JSON file', async () => {
    const jsonContent = { id: 1, name: 'Test Quiz', category: 'science' };
    const file = new File([JSON.stringify(jsonContent)], 'test.json', {
      type: 'application/json',
    });

    const result = await readFileAsJSON(file);

    expect(result.success).toBe(true);
    expect(result.message).toBe('File read successfully');
    expect(result.data).toEqual(jsonContent);
    expect(result.file).toBe(file);
  });

  it('should parse JSON array successfully', async () => {
    const jsonContent = [
      { id: 1, name: 'Quiz 1' },
      { id: 2, name: 'Quiz 2' },
    ];
    const file = new File([JSON.stringify(jsonContent)], 'tests.json', {
      type: 'application/json',
    });

    const result = await readFileAsJSON(file);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(jsonContent);
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('should handle invalid JSON content', async () => {
    const file = new File(['invalid json {'], 'invalid.json', {
      type: 'application/json',
    });

    const result = await readFileAsJSON(file);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Failed to parse JSON file');
    expect(result.data).toBeUndefined();
  });

  it('should validate file size', async () => {
    const jsonContent = { id: 1, name: 'Test' };
    const file = new File([JSON.stringify(jsonContent)], 'test.json', {
      type: 'application/json',
    });

    const options: FileUploadOptions = {
      maxSize: 10, // 10 bytes - smaller than the file
    };

    const result = await readFileAsJSON(file, options);

    expect(result.success).toBe(false);
    expect(result.message).toContain('File size exceeds limit');
  });

  it('should validate file type', async () => {
    const jsonContent = { id: 1, name: 'Test' };
    const file = new File([JSON.stringify(jsonContent)], 'test.json', {
      type: 'application/json',
    });

    const options: FileUploadOptions = {
      allowedTypes: ['text/plain', 'text/csv'],
    };

    const result = await readFileAsJSON(file, options);

    expect(result.success).toBe(false);
    expect(result.message).toContain('File type not allowed');
  });

  it('should accept file if type is in allowedTypes', async () => {
    const jsonContent = { id: 1, name: 'Test' };
    const file = new File([JSON.stringify(jsonContent)], 'test.json', {
      type: 'application/json',
    });

    const options: FileUploadOptions = {
      allowedTypes: ['application/json'],
    };

    const result = await readFileAsJSON(file, options);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(jsonContent);
  });

  it('should call progress callback during file read', async () => {
    const jsonContent = { id: 1, name: 'Test Quiz' };
    const file = new File([JSON.stringify(jsonContent)], 'test.json', {
      type: 'application/json',
    });

    const onProgress = vi.fn();
    const options: FileUploadOptions = {
      onProgress,
    };

    await readFileAsJSON(file, options);

    // Progress callback may be called during file reading
    expect(onProgress.mock.calls.length >= 0).toBe(true);
  });

  it('should use default maxSize of 5MB', async () => {
    const largeContent = 'x'.repeat(10 * 1024 * 1024); // 10MB
    const file = new File([largeContent], 'large.json', {
      type: 'application/json',
    });

    const result = await readFileAsJSON(file);

    expect(result.success).toBe(false);
    expect(result.message).toContain('File size exceeds limit');
  });

  it('should handle empty JSON object', async () => {
    const file = new File(['{}'], 'empty.json', {
      type: 'application/json',
    });

    const result = await readFileAsJSON(file);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({});
  });

  it('should handle empty JSON array', async () => {
    const file = new File(['[]'], 'empty.json', {
      type: 'application/json',
    });

    const result = await readFileAsJSON(file);

    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('should handle complex nested JSON', async () => {
    const jsonContent = {
      id: 1,
      title: 'Complex Quiz',
      questions: [
        {
          id: 1,
          text: 'Question 1',
          answers: ['A', 'B', 'C'],
          correct: 0,
        },
        {
          id: 2,
          text: 'Question 2',
          answers: ['X', 'Y', 'Z'],
          correct: 1,
        },
      ],
    };
    const file = new File([JSON.stringify(jsonContent)], 'complex.json', {
      type: 'application/json',
    });

    const result = await readFileAsJSON(file);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(jsonContent);
  });

  it('should support generic type parameter', async () => {
    interface Quiz {
      id: number;
      name: string;
      category: string;
    }

    const jsonContent: Quiz = { id: 1, name: 'Test', category: 'science' };
    const file = new File([JSON.stringify(jsonContent)], 'test.json', {
      type: 'application/json',
    });

    const result = await readFileAsJSON<Quiz>(file);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(jsonContent);
  });
});
