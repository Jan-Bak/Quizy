import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useIndexDB } from '../useIndexDB';

// Mock IndexedDB
const mockStore = new Map();
const mockObjectStoreNames = {
  contains: vi.fn((name: string) => mockStore.has(name)),
};

const createMockRequest = (result?: any) => ({
  result,
  onsuccess: null as any,
  onerror: null as any,
  onupgradeneeded: null as any,
});

const createMockTransaction = () => ({
  objectStore: vi.fn(() => ({
    add: vi.fn((value) => {
      mockStore.set(value.id, value);
      const request = createMockRequest(value.id);
      setTimeout(() => request.onsuccess?.({}), 0);
      return request;
    }),
    put: vi.fn((value) => {
      mockStore.set(value.id, value);
      const request = createMockRequest(value.id);
      setTimeout(() => request.onsuccess?.({}), 0);
      return request;
    }),
    delete: vi.fn((key) => {
      mockStore.delete(key);
      const request = createMockRequest(undefined);
      setTimeout(() => request.onsuccess?.({}), 0);
      return request;
    }),
    get: vi.fn((key) => {
      const request = createMockRequest(mockStore.get(key));
      setTimeout(() => request.onsuccess?.({}), 0);
      return request;
    }),
    getAll: vi.fn(() => {
      const request = createMockRequest(Array.from(mockStore.values()));
      setTimeout(() => request.onsuccess?.({}), 0);
      return request;
    }),
    clear: vi.fn(() => {
      mockStore.clear();
      const request = createMockRequest(undefined);
      setTimeout(() => request.onsuccess?.({}), 0);
      return request;
    }),
  })),
});

const createMockDatabase = () => ({
  transaction: vi.fn(() => createMockTransaction()),
  objectStoreNames: mockObjectStoreNames,
  close: vi.fn(),
  createObjectStore: vi.fn(),
});

beforeEach(() => {
  mockStore.clear();

  const mockDatabase = createMockDatabase();

  vi.stubGlobal('indexedDB', {
    open: vi.fn((_dbName: string, _version: number) => {
      const request: any = createMockRequest();
      request.result = mockDatabase;

      setTimeout(() => {
        if (request.onupgradeneeded) {
          request.onupgradeneeded({ target: { result: mockDatabase } });
        }
        request.onsuccess?.();
      }, 0);

      return request;
    }),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  mockStore.clear();
});

interface TestItem {
  id: number;
  name: string;
  value: string;
}

describe('useIndexDB', () => {
  it('should initialize database on mount', async () => {
    const { result } = renderHook(() => useIndexDB<TestItem>('testDB', 'items'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
  });

  it('should add a new item', async () => {
    const { result } = renderHook(() => useIndexDB<TestItem>('testDB', 'items'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newItem: TestItem = { id: 1, name: 'Quiz 1', value: 'science' };
    await result.current.add(newItem);

    await waitFor(() => {
      expect(result.current.data).toContainEqual(newItem);
    });
  });

  it('should update an existing item', async () => {
    const { result } = renderHook(() => useIndexDB<TestItem>('testDB', 'items'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const item: TestItem = { id: 1, name: 'Quiz 1', value: 'science' };
    await result.current.add(item);

    await waitFor(() => {
      expect(result.current.data).toContainEqual(item);
    });

    const updatedItem: TestItem = { id: 1, name: 'Updated Quiz', value: 'math' };
    await result.current.update(updatedItem);

    await waitFor(() => {
      expect(result.current.data).toContainEqual(updatedItem);
      expect(result.current.data).not.toContainEqual(item);
    });
  });

  it('should delete an item', async () => {
    const { result } = renderHook(() => useIndexDB<TestItem>('testDB', 'items'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const item: TestItem = { id: 1, name: 'Quiz 1', value: 'science' };
    await result.current.add(item);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });

    await result.current.delete(1);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(0);
    });
  });

  it('should get an item by id', async () => {
    const { result } = renderHook(() => useIndexDB<TestItem>('testDB', 'items'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const item: TestItem = { id: 1, name: 'Quiz 1', value: 'science' };
    await result.current.add(item);

    await waitFor(() => {
      expect(result.current.data).toContainEqual(item);
    });

    const retrievedItem = result.current.getById(1);

    expect(retrievedItem).toEqual(item);
  });

  it('should get all items', async () => {
    const { result } = renderHook(() => useIndexDB<TestItem>('testDB', 'items'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const item1: TestItem = { id: 1, name: 'Quiz 1', value: 'science' };
    const item2: TestItem = { id: 2, name: 'Quiz 2', value: 'math' };

    await result.current.add(item1);
    await result.current.add(item2);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });

    const allItems = result.current.getAll();

    expect(allItems).toHaveLength(2);
    expect(allItems).toContainEqual(item1);
    expect(allItems).toContainEqual(item2);
  });

  it('should clear all items', async () => {
    const { result } = renderHook(() => useIndexDB<TestItem>('testDB', 'items'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const item1: TestItem = { id: 1, name: 'Quiz 1', value: 'science' };
    const item2: TestItem = { id: 2, name: 'Quiz 2', value: 'math' };

    await result.current.add(item1);
    await result.current.add(item2);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });

    await result.current.clear();

    await waitFor(() => {
      expect(result.current.data).toHaveLength(0);
    });
  });

  it('should handle multiple operations sequentially', async () => {
    const { result } = renderHook(() => useIndexDB<TestItem>('testDB', 'items'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Add
    const item1: TestItem = { id: 1, name: 'Quiz 1', value: 'science' };
    await result.current.add(item1);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });

    // Add another
    const item2: TestItem = { id: 2, name: 'Quiz 2', value: 'math' };
    await result.current.add(item2);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });

    const updated: TestItem = { id: 1, name: 'Updated Quiz 1', value: 'history' };
    await result.current.update(updated);

    await waitFor(() => {
      expect(result.current.data).toContainEqual(updated);
    });

    await result.current.delete(2);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
      expect(result.current.data[0]).toEqual(updated);
    });
  });

  it('should handle get operations without modifying state', async () => {
    const { result } = renderHook(() => useIndexDB<TestItem>('testDB', 'items'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const item: TestItem = { id: 1, name: 'Quiz 1', value: 'science' };
    await result.current.add(item);

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });

    const initialDataLength = result.current.data.length;

    result.current.getById(1);
    result.current.getAll();

    expect(result.current.data).toHaveLength(initialDataLength);
  });
});
