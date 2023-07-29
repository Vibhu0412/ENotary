import React, { Fragment, useEffect, useState } from "react";
// import Stepper from "../components/ui/Stepper";
// import Button from "../components/ui/Button";
import Button from "@/components/ui/Button";
import SimpleBar from "simplebar-react";
import { Transition } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import InputGroup from "@/components/ui/InputGroup";

const TaggingOptions = ({
  checkFields,
  handleCheckBox,
  register,
  errors,
  PaymentTotal,
  calculatePayment,
  count,
}) => {
  const [showCount, setShowCount] = useState(false);
  const [showOptionList, setShowOptionList] = useState(false);

  return (
    <div>
      {!showOptionList && (
        <span
          className="fixed ltr:md:right-[-1px] ltr:right-[0px] rtl:left-0 rtl:md:left-[-25px] top-24 right-0 translate-y-full z-[888] bg-slate-800 text-slate-50 dark:bg-slate-700 dark:text-slate-300 transform flex items-center text-sm font-medium px-2 py-2 shadow-deep ltr:rounded-b rtl:rounded-t"
          onClick={() => setShowOptionList(true)}
        >
          <span className="md:inline-block ltr:ml-3 rtl:mr-1 text-sm">
            Options
          </span>
        </span>
      )}
      <div
        className={`
            setting-wrapper fixed ltr:right-0 rtl:left-0 top-0 md:w-[350px]  xs:w-[300px] lg:w-[400px]  w-[340px]
            bg-white dark:bg-slate-800 h-screen z-[9999]  md:pb-6 pb-[100px] shadow-base2
              dark:shadow-base3 border border-slate-200 dark:border-slate-700 transition-all duration-150
              ${
                showOptionList
                  ? "translate-x-0 opacity-100 visible"
                  : "ltr:translate-x-full rtl:-translate-x-full opacity-0 invisible"
              }
            `}
      >
        <SimpleBar className="px-6 h-full">
          <div
            className="cursor-pointer text-2xl text-slate-800 dark:text-slate-200 flex justify-end p-2"
            onClick={() => {
              setShowOptionList(false);
              setShowCount(false);
            }}
          >
            <Icon icon="heroicons-outline:x" />
          </div>
          <div className="col-span-3 flex flex-col items-center">
            <h5 className="flex items-start w-full p-2 font-bold">
              Other Options
            </h5>
            <div className="flex items-center w-full p-2">
              <input
                checked={checkFields["KBA"]}
                id="checked-checkbox"
                type="checkbox"
                value="checked"
                onClick={() => handleCheckBox("KBA", !checkFields["KBA"])}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                for="kba-checkbox"
                className="ml-2 text-md font-medium text-gray-500 dark:text-gray-300"
              >
                {" "}
                KBA Required
              </label>
            </div>

            <div className="flex items-center w-full p-2">
              <input
                checked={checkFields["witness"]}
                id="witness-checkbox"
                type="checkbox"
                value=""
                onClick={() =>
                  handleCheckBox("witness", !checkFields["witness"])
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                for="link-checkbox"
                className="ml-2 text-md font-medium text-gray-500 dark:text-gray-300"
              >
                {" "}
                Additional Witness Required
              </label>
            </div>
            {checkFields["witness"] && (
              <div className="w-full pl-2">
                <InputGroup
                  name="WitnessCount"
                  id="witnessCount"
                  type="number"
                  register={register}
                  error={errors.witnessCount}
                  placeholder="Witness Count"
                  className="h-[52px] w-full"
                  merged
                />
              </div>
            )}
            <div className="flex items-center w-full p-2">
              <input
                checked={checkFields["signee"]}
                id="signee-checkbox"
                type="checkbox"
                value=""
                onClick={() => handleCheckBox("signee", !checkFields["signee"])}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                for="link-checkbox"
                className="ml-2 text-md font-medium text-gray-500 dark:text-gray-300"
              >
                {" "}
                Additional Signee Required
              </label>
            </div>
            {checkFields["signee"] && (
              <div className="w-full pl-2">
                <InputGroup
                  name="SigneeCount"
                  id="SigneeCount"
                  // defaultValue={users[0].email}
                  type="number"
                  register={register}
                  error={errors.SigneeCount}
                  placeholder="Signee Count"
                  className="h-[52px] w-full"
                  merged
                />
              </div>
            )}

            <div className="flex flex-col items-start w-full mt-6 mb-2">
              <h6 className="font-bold ml-2 mb-2">Overall Tags</h6>
              <div className="flex flex-row items-start w-full p-2 ">
                <span style={{ width: "710px" }}>Signee Signature Count</span>
                <span className="w-full text-center">
                  {count.signeeSignature}
                </span>
              </div>
              <div className="flex flex-row items-start w-full p-2 ">
                <span style={{ width: "710px" }}>Notary Signature Count</span>
                <span className="w-full text-center">
                  {count.notarySignature}
                </span>
              </div>
              <div className="flex flex-row items-start w-full p-2 ">
                <span style={{ width: "710px" }}>Other Field</span>
                <span className="w-full text-center">{count.text}</span>
              </div>
            </div>

            {showCount && (
              <>
                <div className="w-full">
                  <hr style={{ width: "100%" }} />
                </div>
                <div className="flex flex-row items-start w-full p-2 ">
                  <span style={{ width: "710px" }}>Total</span>
                  <span className="w-full text-center">{PaymentTotal} $</span>
                </div>
                <div className="w-full mb-5">
                  <hr style={{ width: "100%" }} />
                </div>
              </>
            )}

            <Button
              text="Payment Calculation"
              onClick={() => {
                calculatePayment();
                setShowCount(true);
              }}
              className="btn-primary block-btn flex-end"
              type="submit"
            />

            <Button
              text="Preview & Submit to Signee"
              className="btn-primary block-btn mt-2"
              type="submit"
            />
          </div>
        </SimpleBar>
      </div>
      <Transition as={Fragment} show={showOptionList}>
        <div
          className="overlay bg-white bg-opacity-0 fixed inset-0 z-[999]"
          onClick={() => {
            setShowOptionList(false);
            setShowCount(false);
          }}
        ></div>
      </Transition>
    </div>
  );
};

export default TaggingOptions;
