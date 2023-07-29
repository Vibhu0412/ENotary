import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import TaggingPdfWebViewer from "../components/notarization-tagging/TaggingPdfWebViewer";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useLocation } from "react-router-dom";
import TaggingOptions from "../components/notarization-tagging/TaggingOptions";

const schema = yup
  .object({
    witnessCount: yup
      .number()
      .required("Witness Count is required")
      .integer()
      .positive(),
  })
  .required();

const NotaryTagging = () => {
  let location = useLocation();
  const [PaymentTotal, setPaymentTotal] = useState(0);
  const [documentInfo, setDocumentInfo] = useState({});

  const {
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [checkFields, setCheckFields] = useState({
    KBA: true,
    witness: false,
    signee: false,
  });

  useEffect(() => {
    const { state } = location;
    setDocumentInfo({ ...state.original, index: state.index });
  }, [location]);

  const calculatePayment = () => {
    setPaymentTotal(
      2 * count.signeeSignature + 3 * count.notarySignature + 1 * count.text
    );
  };

  const handleCheckBox = (name, value) => {
    setCheckFields({ ...checkFields, [name]: value });
  };

  const [count, setCount] = useState({
    signeeSignature: 0,
    notarySignature: 0,
    text: 0,
  });

  const topIcons = [
    {
      icon: "fluent-mdl2:date-time",
      name: "Commision Expiry Date",
      type: "TEXT",
      value: "2025-09-01",
      user: "notary",
    },
    {
      icon: "mdi:estate",
      name: "Notary State",
      type: "TEXT",
      value: "Alabama",
      user: "notary",
    },
    {
      icon: "fa-solid:city",
      name: "Notary City",
      type: "TEXT",
      value: "Birmingham",
      user: "notary",
    },
  ];

  return (
    <>
      <div style={{ marginTop: "-25px" }}>
        <div style={{ minHeight: "600px" }}>
          <TaggingPdfWebViewer
            topIcons={topIcons}
            setCount={setCount}
            documentInfo={documentInfo}
            calculatePayment={calculatePayment}
          />
        </div>
        <div>
          <TaggingOptions
            checkFields={checkFields}
            handleCheckBox={handleCheckBox}
            register={register}
            errors={errors}
            PaymentTotal={PaymentTotal}
            calculatePayment={calculatePayment}
            count={count}
          />
        </div>
      </div>
    </>
  );
};

export default NotaryTagging;
