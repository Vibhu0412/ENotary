import { value } from 'dom7';
import React from 'react';
import Icon from '@/components/ui/Icon';

const Fileinput = ({
  name,
  label = 'Browse',
  onChange,
  placeholder = 'Choose a file or drop it here...',
  multiple,
  preview,
  className = 'custom-class',
  msgTooltip,
  id,
  selectedFile,
  horizontal,
  validate,
  badge,
  value,
  disabled,
  readonly,
  error,
  selectedFiles,
  register,
  showStatus = false,
  status = 'APPROVED',
}) => {
  const openImageInNewTab = () => {
    if (selectedFile) {
      window.open(URL.createObjectURL(selectedFile), '_blank');
    }
  };

  return (
    <div>
      {' '}
      <div
        className={` filegroup ${error ? 'has-error' : ''} ${
          horizontal ? 'flex' : ''
        } 
   ${validate ? 'is-valid' : ''}`}
      >
        {' '}
        <label>
          {/* Input element */}{' '}
          <input
            type="file" // {...register(name)}
            register={register}
            onChange={onChange}
            className={`bg-red-400 w-full hidden ${error ? ' has-error border-danger-500' : ' '}`}
            name={name}
            id={id} // onClick={openImageInNewTab}
            readOnly={readonly}
            value={value}
            multiple={multiple}
            placeholder={placeholder}
            disabled={disabled}
          />
          {/* File control section */}{' '}
          <div
            className={`w-full h-[40px] file-control flex items-center ${className}`}
          >
            {' '}
            {!multiple && (
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {/* Display selected file name */}{' '}
                {selectedFile && (
                  <span
                    className={
                      badge ? ' badge-title' : 'text-slate-900 dark:text-white'
                    }
                  >
                    {selectedFile.name}{' '}
                  </span>
                )}{' '}
                {!selectedFile && (
                  <span className="text-slate-400">{placeholder}</span>
                )}{' '}
              </span>
            )}{' '}
            {multiple && (
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {/* Display number of selected files */}{' '}
                {selectedFiles.length > 0 && (
                  <span
                    className={
                      badge ? ' badge-title' : 'text-slate-900 dark:text-white'
                    }
                  >
                    {' '}
                    {selectedFiles.length > 0
                      ? selectedFiles.length + ' files selected'
                      : ''}{' '}
                  </span>
                )}{' '}
                {selectedFiles.length === 0 && (
                  <span className="text-slate-400">{placeholder}</span>
                )}{' '}
              </span>
            )}
            {/* Browse button */}{' '}
            <span
              className={`file-name flex-none cursor-pointer border-l px-4 border-slate-200 dark:border-slate-700 h-full inline-flex items-center bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-base rounded-tr rounded-br font-normal ${
                disabled ? ' cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              {label}{' '}
            </span>{' '}
          </div>
          {/* Error message */}{' '}
          {error && (
            <div
              className={`mt-2 ${
                msgTooltip
                  ? 'inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded'
                  : 'text-danger-500 block text-sm'
              }`}
            >
              {error.message}{' '}
            </div>
          )}{' '}
           {validate && (
        <div
          className={` mt-2 ${
            msgTooltip
              ? " inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded"
              : " text-success-500 block text-sm"
          }`}
        >
          {validate}
        </div>
      )}
        </label>{' '}
      </div>{' '}
    </div>
  );
};

export default Fileinput;
