import React from 'react';
import styles from './fileUpload.module.css';
import { IconUpload, IconFile, IconX } from '@tabler/icons-react';

interface FileUploadProps {
  attachments: (File | string)[];
  onFileChange: (files: (File | string)[]) => void;
}

const FileUpload = ({ attachments, onFileChange }: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFileChange([...attachments, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...attachments];
    newFiles.splice(index, 1);
    onFileChange(newFiles);
  };

  const getFileName = (file: File | string) => {
    if (file instanceof File) {
      return file.name;
    }
    // For URLs, extract the filename from the last part of the path
    return file.split('/').pop() || 'file';
  };

  return (
    <div className={styles.fileUploadContainer}>
      <div className={styles.fileList}>
        {attachments.map((file, index) => (
          <div key={index} className={styles.fileItem}>
            <IconFile size={20} />
            <span>{getFileName(file)}</span>
            <button
              type="button"
              onClick={() => handleRemoveFile(index)}
              className={styles.removeButton}
            >
              <IconX size={16} />
            </button>
          </div>
        ))}
      </div>
      <label className={styles.uploadButton}>
        <input type="file" multiple onChange={handleFileChange} className={styles.fileInput} />
        <IconUpload size={20} />
        <span>Upload Files</span>
      </label>
    </div>
  );
};

export default FileUpload;
