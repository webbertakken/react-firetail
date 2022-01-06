import { DropEvent, FileRejection } from 'react-dropzone';
import { useFirestore, useStorage, useUser } from 'reactfire';
import { useCallback } from 'react';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { useNotification } from './useNotification';
import { slugify } from '../utils/slugify';
import { AudioQuestion } from '../../organiser/model/Types';
import { doc, DocumentReference, getDoc, setDoc } from 'firebase/firestore';

/**
 * Handles the firebase side of uploads and saving the meta information.
 *
 * Example usage:
 *   import { useDropzone } from 'react-dropzone';
 *
 *   const onDrop = useFirebaseDrop(
 *     'questions/question1',
 *     'users/user1/questions/question1',
 *     (x) => dispatch(filesAccepted(x)),
 *     (x) => dispatch(uploadRegistered(x)),
 *     (x) => dispatch(uploadFailed(x)),
 *   );
 *
 *  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
 *    accept: ['image/*', 'video/*', 'audio/*'],
 *    onDrop,
 *  });
 */
export function useFirebaseDrop(
  fileUploadPath,
  metaCollectionPath,
  acceptFilesCallback,
  uploadCompleteCallback,
  uploadFailedCallback,
) {
  const storage = useStorage();
  const { data: user } = useUser();
  const firestore = useFirestore();
  const notify = useNotification();

  const saveFileMeta = useCallback(
    async (file, uploadResult) => {
      const slug = slugify(uploadResult.metadata.name);

      const createIfNotExists = async () => {
        const documentReference = doc(
          firestore,
          metaCollectionPath,
          slug,
        ) as DocumentReference<AudioQuestion>;
        const document = await getDoc(documentReference);

        if (document.exists()) {
          throw new Error('File already exists.');
        }

        const { path, lastModified, name, size, type } = file;
        const { metadata, state, totalBytes } = uploadResult;

        const {
          bucket,
          // cacheControl,?
          contentDisposition,
          contentEncoding,
          // contentLanguage,?
          contentType,
          // customMetadata,?
          fullPath,
          generation,
          md5Hash,
          metageneration,
          name: metaName,
          size: metaSize,
          timeCreated,
          type: metaType,
          updated,
        } = metadata;

        await setDoc(documentReference, {
          id: slug,
          slug,
          path,
          lastModified,
          name,
          size,
          type,
          metadata: {
            bucket,
            contentDisposition,
            contentEncoding,
            contentType,
            fullPath,
            generation,
            md5Hash,
            metageneration,
            name: metaName,
            size: metaSize,
            timeCreated,
            type: metaType,
            updated,
          },
          state,
          totalBytes,
        });
      };

      await notify.promise(createIfNotExists(), {
        loading: 'Uploading...',
        error: (error) => `An error occurred. ${error.message}`,
        success: `Upload complete.`,
      });
    },
    [metaCollectionPath, firestore, notify],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent): void => {
      fileRejections.map((rejection) =>
        console.error(
          `failed to upload: ${rejection.file.name}. ${rejection.errors
            .map((error) => error.message)
            .join(', ')}`,
        ),
      );

      acceptFilesCallback(
        acceptedFiles.map((file) => {
          const preview = URL.createObjectURL(file);

          const storageRef = ref(storage, `${fileUploadPath}/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);
          const enhancedFile = Object.assign(file, { preview, uploadTask, storageRef });

          uploadTask.then(
            async (uploadResult) => {
              try {
                await saveFileMeta(file, uploadResult);
                await uploadCompleteCallback(file);
              } catch {
                await uploadFailedCallback(file);
              }
            },
            (error) => console.error(error),
          );

          return enhancedFile;
        }),
      );
    },
    [
      storage,
      saveFileMeta,
      fileUploadPath,
      acceptFilesCallback,
      uploadCompleteCallback,
      uploadFailedCallback,
    ],
  );

  if (!user) {
    console.error('User must be logged in to upload files');
    return null;
  }

  return onDrop;
}
