import { DropEvent, FileRejection } from 'react-dropzone';
import { useFirestore, useStorage, useUser } from 'reactfire';
import { useCallback, useMemo } from 'react';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { useNotification } from './useNotification';
import Inventory from '../../organiser/model/Inventory';
import { slugify } from '../utils/slugify';
import { AudioQuestion } from '../../organiser/model/Types';
import { doc, DocumentReference, getDoc, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

// Todo - make this more generic so it's reusable
export function useFirebaseDrop(acceptFilesCallback, uploadCompleteCallback, uploadFailedCallback) {
  const storage = useStorage();
  const { data: user } = useUser();
  const firestore = useFirestore();
  const notify = useNotification();
  const { category } = useParams(); // Todo - remove this nuclear option.
  const collectionPath = useMemo(
    () => Inventory.getQuestionsPath(user.uid, category),
    [user, category],
  );

  const saveFileMeta = useCallback(
    async (file, uploadResult) => {
      const slug = slugify(uploadResult.metadata.name);

      const createIfNotExists = async () => {
        const documentReference = doc(
          firestore,
          collectionPath,
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
        loading: 'Adding question.',
        error: (error) => `An error occurred. ${error.message}`,
        success: `Question added.`,
      });
    },
    [collectionPath, firestore, notify],
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

      if (!user) return;

      acceptFilesCallback(
        acceptedFiles.map((file) => {
          const preview = URL.createObjectURL(file);

          const storageRef = ref(storage, `user/${user.uid}/${file.name}`);
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
      user,
      storage,
      saveFileMeta,
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
