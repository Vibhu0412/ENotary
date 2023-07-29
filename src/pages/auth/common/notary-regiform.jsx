import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useNavigate } from "react-router-dom";
import Textinput from "@/components/ui/Textinput";
import Checkbox from "@/components/ui/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { handleRegister } from "./store";
import Textarea from "@/components/ui/Textarea";
import FlatpickerPage from "../../forms/date-time-picker";
import {Link} from "react-router-dom/dist";


const Country = [
  { value: "USA", label: "USA" },
  { value: "UK", label: "UK" },
  { value: "CANADA", label: "CANADA" },
];
const State = [
  { value: "CALIFORNIYA", label: "CALIFORNIYA" },
  { value: "UK", label: "UK" },
  { value: "CANADA", label: "CANADA" },
];
const City = [
  { value: "San Jose", label: "San Jose" },
  { value: "UK", label: "UK" },
  { value: "CANADA", label: "CANADA" },
];
const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};
const schema = yup
  .object({
    name: yup.string().required("First Name is Required"),
    lname: yup.string().required("Last Name is Required"),
    email: yup.string().email("Invalid email").required("Email is Required"),
    acceptTerms: yup.boolean().oneOf([true], "Accept Ts & Cs is Required"),
    // phonenumber: yup.number().required("Phone Number is Required"),
    country: yup.string().required("Country is Required"),
    zipcode: yup
      .string()
      .required("Zip is Required")
      .matches(/^\d+$/, "Zip Code must be a numeric value"),
    address: yup.string().required("Address is required"),
    IdDocnumber: yup
      .string()
      .required("Identification Document Number is Required")
      .matches(
        /^\d+$/,
        "Identification Document Number must be a numeric value"
      ),
    idDoctype: yup
      .string()
      .required("Identification Document Type is Required")
      .matches(/^\d+$/, "Identification Document Type must be a numeric value"),
    address: yup.string().required("Address is required"),
    // acceptTerms: yup.boolean().oneOf([true], 'Accept Ts & Cs is required').required(),
  })
  .required();

const NotaryRegForm = () => {
  const dispatch = useDispatch();

  const [checked, setChecked] = useState(false);
  const [picker, setPicker] = useState(new Date());
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    dispatch(handleRegister(data));
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
      <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
        <Textinput
          name="name"
          register={register}
          label="First name"
          type="text"
          placeholder=" Enter your First name"
          className="h-[52px]"
          error={errors.name}
        />
        <Textinput
          name="lname"
          label="Last name"
          type="text"
          placeholder=" Enter your Last name"
          register={register}
          error={errors.lname}
          className="h-[52px]"
        />
        <Textinput
          label="E-mail Address"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="E-mail Address"
          className="h-[52px]"
        />

        <div>
          <label className="form-label" for="inline-picker">
            Date of Birth
          </label>
          <Flatpickr
            className="form-control  h-[52px]"
            value={picker}
            onChange={(date) => setPicker(date)}
            id="default-picker"
          />
        </div>
        <InputGroup
          label="Phone Number"
          name="phonenumber"
          prepend="+1"
          placeholder="Phone Number"
          id="phoneNumber"
          register={register}
          error={errors.phonenumber}
          options={{ phone: true, phoneRegionCode: "US" }}
          isMask
          className="h-[52px]"
        />
        <Textarea
          label="Textarea"
          name="address"
          id="pn4"
          error={errors.address}
          register={register}
          placeholder="Address"
          row="1"
          className="h-[52px]"
        />
        <div className=" grid grid-cols-2 gap-5">
          <div>
            <label htmlFor=" hh" className="form-label ">
              Country
            </label>
            <div className="h-[52px] react-select">
              <Select
                className="react-select"
                name="country"
                classNamePrefix="select"
                defaultValue={Country[0]}
                options={Country}
                register={register}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    height: "52px",
                  }),
                }}
                id="hh"
              />
            </div>
          </div>
          <div>
            <label htmlFor=" hh" className="form-label ">
              State
            </label>
            <Select
              className="h-[52px]"
              classNamePrefix="select"
              defaultValue={State[0]}
              options={State}
              styles={{
                control: (provided) => ({
                  ...provided,
                  height: "52px",
                }),
              }}
              id="hh"
            />
          </div>
        </div>
        <div className=" grid grid-cols-2 gap-5">
          <div>
            <label htmlFor=" hh" className="form-label ">
              City
            </label>
            <div className="h-[52px] react-select">
              <Select
                className="react-select"
                classNamePrefix="select"
                defaultValue={City[0]}
                options={City}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    height: "52px",
                  }),
                }}
                id="hh"
              />
            </div>
          </div>
          <Textinput
            name="zipcode"
            register={register}
            label="Zip Code"
            type="text"
            placeholder="Zip Code"
            className="h-[52px]"
            error={errors.zipcode}
          />
        </div>
        <Textinput
          name="IdDocnumber"
          register={register}
          label="Identification Document Number"
          type="text"
          placeholder=" Identification Document Number"
          className="h-[52px]"
          error={errors.IdDocnumber}
        />
        <Textinput
          name="idDoctype"
          register={register}
          label="Identification Document Type"
          type="text"
          placeholder=" Identification Document Type"
          className="h-[52px]"
          error={errors.idDoctype}
        />
      </div>
      <Checkbox
        value={checked}
        error={errors.acceptTerms}
        onChange={() => setChecked(!checked)}
        label={
          <span>
            I agree with{" "}
            <Link to="/termsandcondition" className="text-primary-800" >
              Terms of Service
            </Link>
          </span>
        }
      />
      <Button text="Continue" className="btn-primary shadow-base2" />
    </form>
  );
};

export default NotaryRegForm;
