import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import './FileUpload.css';

const FileUpload = ({ onFileUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            toast.error(`File ${file.name} is too large. Maximum size is 50MB.`);
          } else if (error.code === 'file-invalid-type') {
            toast.error(`File ${file.name} is not a PDF file.`);
          } else {
            toast.error(`Error with file ${file.name}: ${error.message}`);
          }
        });
      });
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('PDF uploaded and processed successfully!');
        onFileUpload(result);
      } else {
        throw new Error(result.error || 'Processing failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    disabled: isUploading
  });

  const getDropzoneClassName = () => {
    let className = 'dropzone';
    if (isDragActive) className += ' drag-active';
    if (isDragReject) className += ' drag-reject';
    if (isUploading) className += ' uploading';
    return className;
  };

  return (
    <div className="file-upload-container">
      <div {...getRootProps()} className={getDropzoneClassName()}>
        <input {...getInputProps()} />
        
        <div className="dropzone-content">
          {isUploading ? (
            <>
              <div className="upload-spinner"></div>
              <h3>Processing PDF...</h3>
              <p>Extracting text and generating knowledge graphs</p>
            </>
          ) : isDragActive ? (
            isDragReject ? (
              <>
                <AlertCircle size={48} className="icon error" />
                <h3>Invalid File Type</h3>
                <p>Please upload a PDF file</p>
              </>
            ) : (
              <>
                <Upload size={48} className="icon success" />
                <h3>Drop your PDF here</h3>
                <p>Release to upload and analyze</p>
              </>
            )
          ) : (
            <>
              <FileText size={48} className="icon" />
              <h3>Upload PDF Document</h3>
              <p>Drag and drop a PDF file here, or click to select</p>
              <div className="upload-specs">
                <span>Maximum file size: 50MB</span>
                <span>Supported format: PDF</span>
              </div>
            </>
          )}
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="file-rejections">
          <h4>Upload Errors:</h4>
          {fileRejections.map(({ file, errors }) => (
            <div key={file.path} className="rejection-item">
              <strong>{file.name}</strong>
              <ul>
                {errors.map(error => (
                  <li key={error.code}>{error.message}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="features-list">
        <h4>What you'll get:</h4>
        <ul>
          <li>📖 Automatic chapter detection</li>
          <li>🔍 Entity extraction (people, organizations, concepts)</li>
          <li>🕸️ Interactive knowledge graphs</li>
          <li>📊 Relationship mapping</li>
          <li>📈 Chapter-by-chapter analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
