import { DropEvent, FileRejection } from 'react-dropzone';
import { useStorage, useUser } from 'reactfire';
import { useCallback } from 'react';
import { ref, uploadBytesResumable } from 'firebase/storage';

export function useFirebaseDrop(acceptFiles, uploadComplete) {
  const storage = useStorage();
  const { data: user } = useUser();

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

      acceptFiles(
        acceptedFiles.map((file) => {
          const preview = URL.createObjectURL(file);

          const storageRef = ref(storage, `user/${user.uid}/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);
          const enhancedFile = Object.assign(file, { preview, uploadTask, storageRef });

          uploadTask.then(
            () => uploadComplete(file.name),
            (error) => console.error(error),
          );

          return enhancedFile;
        }),
      );
    },
    [user, storage, acceptFiles, uploadComplete],
  );

  if (!user) {
    console.error('User must be logged in to upload files');
    return null;
  }

  return onDrop;
}
