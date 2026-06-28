/**
 * uploadToStorage.js
 * Utility to upload a File object to Firebase Storage and return its
 * public download URL. Uses firebase/storage v9+ modular API.
 *
 * Usage:
 *   import { uploadFile } from '../utils/uploadToStorage';
 *   const url = await uploadFile(file, 'gallery/my-photo.jpg');
 */

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Upload a File to Firebase Storage.
 * @param {File}     file         - The File object from an <input type="file">.
 * @param {string}   storagePath  - Destination path inside the bucket,
 *                                  e.g. "gallery/photo_1234.jpg"
 * @param {Function} [onProgress] - Optional callback(percent) for upload progress.
 * @returns {Promise<string>}       Resolves with the public download URL.
 */
export const uploadFile = (file, storagePath, onProgress) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          const pct = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          onProgress(pct);
        }
      },
      (error) => {
        console.error('Firebase Storage upload failed:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

/**
 * Generate a unique storage path for a given folder and file.
 * Example: storagePath('gallery', file) → "gallery/1719245612000_photo.jpg"
 */
export const storagePath = (folder, file) => {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${folder}/${timestamp}_${safeName}`;
};
