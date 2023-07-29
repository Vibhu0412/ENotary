import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import OrganizationForm from "../auth/common/OrganizationSignupForm";

const organizationmodel = () => {
  const navigate = useNavigate();
    const [showTermsAndRegister, setShowTermsAndRegister] = useState(true);
    return (
        <div className=" space-xy-5">
            <Modal
                title="Add Organization"
                labelClass="btn-outline-dark"
                className="max-w-3xl"
                uncontrol
                scrollContent
                footerContent={
                    <Button
                        text="Save"
                        className="btn-dark shadow-base2 px-[3.5rem]"
                        onClick={() => {
                            alert("Organization Save Successfully");
                        }}
                    />
                }
            ><OrganizationForm />
            </Modal>
            {/* <Modal
            title="Notary SignUp"
            label="Notary SignUp"
            labelClass="btn-outline-dark"
            className="max-w-md"
            uncontrol
            footerContent={
                <>
                <Button
                text="No"
                style={{marginRight: '20px'}}
                className="btn-light shadow-base2 px-[2.5rem]"
                onClick={() => {
                  
                }}
              />
              <Button
                text="Yes"
                className="btn-dark px-[2.5rem]"
                onClick={()=>navigate("/notary-register")}
              />
              </>
            }
          >
            <h4 class="font-medium text-lg mb-3 text-slate-900">
            Are you commissioned as a notary in at least one state?
            </h4>
            
          </Modal> */}
        </div>
    );
}
export default organizationmodel;