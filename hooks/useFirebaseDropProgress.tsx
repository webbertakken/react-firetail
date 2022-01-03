import { useStorageTask } from 'reactfire';
import firebase from 'firebase/compat/app';

export function useFirebaseDropProgress(uploadTask, storageRef): number {
  const { data: uploadProgress } = useStorageTask(uploadTask, storageRef);

  const { bytesTransferred, totalBytes } = uploadProgress as firebase.storage.UploadTaskSnapshot;

  const percentComplete = Math.round(100 * (bytesTransferred / totalBytes));

  return percentComplete;
}
