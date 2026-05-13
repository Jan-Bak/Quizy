import { useEffect, useState, useCallback } from 'react';

interface UseIndexDBReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  add: (value: T) => Promise<void>;
  update: (value: T) => Promise<void>;
  delete: (key: IDBValidKey) => Promise<void>;
  getById: (key: IDBValidKey) => T | undefined;
  getAll: () => T[];
  clear: () => Promise<void>;
}

/**
 * Custom hook for IndexedDB CRUD operations
 * @param dbName - The name of the IndexedDB database
 * @param storeName - The name of the object store
 * @param version - The version of the database (default: 1)
 * @returns Object with CRUD methods and current data state
 */
export function useIndexDB<T>(
  dbName: string,
  storeName: string,
  version: number = 1
): UseIndexDBReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  // Initialize the database
  useEffect(() => {
    const initDB = async () => {
      try {
        setLoading(true);
        setError(null);

        const request = indexedDB.open(dbName, version);

        request.onerror = () => {
          setError('Failed to open IndexedDB');
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
          }
        };

        request.onsuccess = async () => {
          const database = request.result;
          setDb(database);

          // Load initial data
          const tx = database.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const getAllRequest = store.getAll();

          getAllRequest.onsuccess = () => {
            setData(getAllRequest.result);
            setLoading(false);
          };

          getAllRequest.onerror = () => {
            setError('Failed to load data');
            setLoading(false);
          };
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    initDB();

    return () => {
      db?.close();
    };
  }, [dbName, storeName, version]);

  // Add a new item
  const add = useCallback(
    async (value: T) => {
      if (!db) {
        setError('Database not initialized');
        return;
      }

      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.add(value);

        return new Promise<void>((resolve, reject) => {
          request.onsuccess = () => {
            // Refresh data after add
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const getAllRequest = store.getAll();
            getAllRequest.onsuccess = () => {
              setData(getAllRequest.result);
              resolve();
            };
          };

          request.onerror = () => {
            reject(new Error('Failed to add item'));
          };
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add item';
        setError(message);
        throw err;
      }
    },
    [db, storeName]
  );

  // Update an existing item
  const update = useCallback(
    async (value: T) => {
      if (!db) {
        setError('Database not initialized');
        return;
      }

      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.put(value);

        return new Promise<void>((resolve, reject) => {
          request.onsuccess = () => {
            // Refresh data after update
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const getAllRequest = store.getAll();
            getAllRequest.onsuccess = () => {
              setData(getAllRequest.result);
              resolve();
            };
          };

          request.onerror = () => {
            reject(new Error('Failed to update item'));
          };
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update item';
        setError(message);
        throw err;
      }
    },
    [db, storeName]
  );

  // Delete an item
  const delete_ = useCallback(
    async (key: IDBValidKey) => {
      if (!db) {
        setError('Database not initialized');
        return;
      }

      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.delete(key);

        return new Promise<void>((resolve, reject) => {
          request.onsuccess = () => {
            // Refresh data after delete
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const getAllRequest = store.getAll();
            getAllRequest.onsuccess = () => {
              setData(getAllRequest.result);
              resolve();
            };
          };

          request.onerror = () => {
            reject(new Error('Failed to delete item'));
          };
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete item';
        setError(message);
        throw err;
      }
    },
    [db, storeName]
  );

  // Get item by ID
  const getById = useCallback(
    (key: IDBValidKey): T | undefined => {
      return data.find((item: any) => item.id === key);
    },
    [data]
  );

  // Get all items
  const getAll = useCallback((): T[] => {
    return data;
  }, [data]);

  // Clear all items
  const clear = useCallback(async () => {
    if (!db) {
      setError('Database not initialized');
      return;
    }

    try {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.clear();

      return new Promise<void>((resolve, reject) => {
        request.onsuccess = () => {
          setData([]);
          resolve();
        };

        request.onerror = () => {
          reject(new Error('Failed to clear store'));
        };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear store';
      setError(message);
      throw err;
    }
  }, [db, storeName]);

  return {
    data,
    loading,
    error,
    add,
    update,
    delete: delete_,
    getById,
    getAll,
    clear,
  };
}
