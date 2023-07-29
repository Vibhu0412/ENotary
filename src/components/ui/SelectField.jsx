import React from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';

const SelectField = ({
  name,
  label,
  id,
  options,
  register,
  className,
  error,
  value,
  msgTooltip,
  validate,
  horizontal,
  defaultValue,
  control,
  onChange,
  setValue,
}) => {
  return (
    <div className={`fromGroup  ${error ? 'has-error' : ''}  ${
      horizontal ? 'flex' : ''
    }  ${validate ? 'is-valid' : ''} `}>
      <label htmlFor=" hh" className="form-label ">
        {label}
      </label>
      <Controller
        name={name}
        id={id}
        control={control}
        // error={errors[name]}
        register={register}
        setValue={setValue}
        render={({ field }) => (
          <Select
            {...field}
            isClearable={false}
            isSearchable={false}
            value={value}
            defaultValue={defaultValue}
            classNamePrefix="dropdown"
            styles={{
              control: provided => ({
                ...provided,
                height: '52px',
                borderColor: error?.[name] ? '#F1595C' : '#e2e8f0',
              }),
            }}
            options={options}
            onChange={onChange}
          />
        )}
      />
      {/* {errors[name] && (
        <span className={`mt-2 text-danger-500 block text-sm`}>
          {errors[name]?.label?.message}
        </span>
      )} */}
      {error && (
          <div
            className={` mt-2 ${
              msgTooltip
                ? ' inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded'
                : ' text-danger-500 block text-sm'
            }`}
          >
            {error.message}
          </div>
        )}
        {validate && (
          <div
            className={` mt-2 ${
              msgTooltip
                ? ' inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded'
                : ' text-success-500 block text-sm'
            }`}
          >
            {validate}
          </div>
        )}
    </div>
  );
};

export default SelectField;
