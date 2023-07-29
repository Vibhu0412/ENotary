import React, { useState } from "react";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
// const { touched } = formState;
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { handleRegister } from "./store";
import {Link} from "react-router-dom/dist";


const handleFormSubmit = (data) => {
    // Handle form submission
};
const schema = yup
    .object({
        email: yup.string().email("Invalid email").required("Email is Required"),
        password: yup
            .string()
            .required("Please enter password")
            .matches(
                /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                "Password must be at least 8 characters, including numbers and one uppercase letter"
            ),
        // confirm password
        confirmpass: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match"),
        // acceptTerms: yup.boolean().oneOf([true], 'Accept Ts & Cs is required'),
        acceptTerms: yup.boolean().oneOf([true], 'Accept Ts & Cs is required').required(),
    })
    .required();

const NotaryForm = () => {
    const dispatch = useDispatch();

    const [checked, setChecked] = useState(false);
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
            <InputGroup
                label="E-mail Address"
                name="email"
                id="hi_email1"
                type="email"
                register={register}
                error={errors.email}
                placeholder="E-mail Address"
                className="h-[52px]"
                prepend={<Icon icon="heroicons-outline:mail" />}
                merged
            />
            <InputGroup
                label="Password"
                id="password"
                name='password'
                type="password"
                placeholder="Password"
                hasicon
                register={register}
                error={errors.password}
                className={` ${errors.password ? 'error' : ''} h-[52px]`}
                prepend={<Icon icon="heroicons-outline:lock-closed" />}
                merged
            />
            <InputGroup
                label="Confirm Password"
                id="password"
                name='confirmpass'
                type="password"
                placeholder="Password"
                hasicon
                register={register}
                error={errors.confirmpass}
                className={` ${errors.confirmpass ? 'error' : ''} h-[52px]`}
                prepend={<Icon icon="heroicons-outline:lock-closed" />}
                merged
            />

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
            <Button
                text="Sign Up"
                onClick={handleSubmit(handleFormSubmit)}
                className="btn-primary block-btn"
                type="submit"
            />
        </form>
    );
};

export default NotaryForm;
