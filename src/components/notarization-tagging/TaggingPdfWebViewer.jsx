import React, { useEffect, useRef, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import Icon from "@/components/ui/Icon";
import Button from "../ui/Button";
import { Axios } from "../../configs/AxiosConfig";
import { useNavigate } from "react-router";
import Tooltip from "@/components/ui/Tooltip";
import useSkin from "@/hooks/useSkin";

const TaggingPdfWebViewer = ({
  topIcons,
  setCount,
  documentInfo,
  calculatePayment,
}) => {
  const [skin] = useSkin();
  const navigate = useNavigate();
  const [instance, setInstance] = useState(null);
  const [dropPoint, setDropPoint] = useState(null);

  const viewer = useRef(null);

  useEffect(() => {
    WebViewer(
      {
        path: "webviewer/lib",
        // initialDoc: `/files/sample.pdf`,
        initialDoc: "/files/samplepdf2.pdf",
        licenseKey: import.meta.env.VITE_APRYSE_LICENCE_KEY,
      },
      viewer.current
    ).then((instance) => {
      setInstance(instance);

      const { UI } = instance;
      UI.setFitMode(UI.FitMode.FitWidth);

      UI.disableElements(["toolbarGroup-Shapes"]);
      UI.disableElements(["toolbarGroup-Edit"]);
      UI.disableElements(["toolbarGroup-Insert"]);
      UI.disableElements(["toolbarGroup-Annotate"]);

      const { iframeWindow } = instance.UI;
      const { annotationManager, Annotations } = instance.Core;
      setInstance(instance);

      const iframeDoc = iframeWindow.document.body;
      iframeDoc.addEventListener("dragover", dragOver);
      iframeDoc.addEventListener("drop", (e) => {
        drop(e, instance);
      });

      annotationManager.addEventListener("annotationChanged", () => {
        const list = annotationManager.getAnnotationsList();
        setCount({
          signeeSignature: 0,
          notarySignature: 0,
          text: 0,
        });
        list.map((annot) => {
          if (
            annot?.custom?.type === "SIGNATURE" &&
            annot?.custom?.user === "notary"
          ) {
            setCount((prev) => ({
              ...prev,
              notarySignature: prev.notarySignature + 1,
            }));
            calculatePayment();
          } else if (
            annot?.custom?.type === "SIGNATURE" &&
            annot?.custom.user === "signee"
          ) {
            setCount((prev) => ({
              ...prev,
              signeeSignature: prev.signeeSignature + 1,
            }));
            calculatePayment();
          } else {
            setCount((prev) => ({
              ...prev,
              text: prev.text + 1,
            }));
          }
        });
      });
    });
  }, []);

  const applyFields = async () => {
    const { Annotations, documentViewer } = instance.Core;
    const annotationManager = documentViewer.getAnnotationManager();
    const fieldManager = annotationManager.getFieldManager();
    const annotationsList = annotationManager.getAnnotationsList();
    const annotsToDelete = [];
    const annotsToDraw = [];

    await Promise.all(
      annotationsList.map(async (annot, index) => {
        let inputAnnot;
        let field;

        if (typeof annot.custom !== "undefined") {
          // create a form field based on the type of annotation
          if (annot.custom.type === "TEXT") {
            console.log("annot.custom.type", annot.custom.user);
            const flags = new Annotations.WidgetFlags();
            if (annot.custom.user === "notary") {
              flags.set("ReadOnly", true);
            }

            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: "Tx",
                value: annot?.custom?.value,
                flags,
              }
            );
            inputAnnot = new Annotations.TextWidgetAnnotation(field);
            inputAnnot.TextColor = new Annotations.Color(0, 0, 0);
          } else if (annot.custom.type === "SIGNATURE") {
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: "Sig",
              }
            );
            inputAnnot = new Annotations.SignatureWidgetAnnotation(field, {
              appearance: "_DEFAULT",
              appearances: {
                _DEFAULT: {
                  Normal: {
                    data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC",
                    offset: {
                      x: 100,
                      y: 100,
                    },
                  },
                },
              },
            });
          } else if (annot.custom.type === "DATE") {
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: "Tx",
                value: "mm-dd-yyyy",
                // Actions need to be added for DatePickerWidgetAnnotation to recognize this field.
                actions: {
                  F: [
                    {
                      name: "JavaScript",
                      // You can customize the date format here between the two double-quotation marks
                      // or leave this blank to use the default format
                      javascript: 'AFDate_FormatEx("mmm d, yyyy");',
                    },
                  ],
                  K: [
                    {
                      name: "JavaScript",
                      // You can customize the date format here between the two double-quotation marks
                      // or leave this blank to use the default format
                      javascript: 'AFDate_FormatEx("mmm d, yyyy");',
                    },
                  ],
                },
              }
            );

            inputAnnot = new Annotations.DatePickerWidgetAnnotation(field);
          } else if (annot.custom.type === "CHECKMARK") {
            // const flags = new Annotations.WidgetFlags();
            // // flags.set("ReadOnly", true);
            // field = new Annotations.Forms.Field(
            //   annot.getContents() + Date.now() + index,
            //   {
            //     type: "Tx",
            //     value: "Yes",
            //     flags,
            //   }
            // );

            const flags = new Annotations.WidgetFlags();
            // flags.set("Required", true);
            flags.set("Edit", true);

            const font = new Annotations.Font({ name: "Helvetica" });

            // create a form field
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: "Btn",
                value: "Off",
                flags,
                font: font,
              }
            );

            inputAnnot = new Annotations.CheckButtonWidgetAnnotation(field, {
              appearance: "_DEFAULT",
              appearances: {
                Off: {},
                Yes: {},
              },
              captions: {
                Normal: "", // Check
              },
            });
          } else if (annot.custom.type === "RECTANGLE") {
            const flags = new Annotations.WidgetFlags();
            // flags.set("Edit", false);

            flags.set("ReadOnly", true);
            flags.set("NoMove", true); // Set NoMove flag to make it non-movable
            // flags.set("NoToggleToOff");
            // flags.set("DoNotSpellCheck");
            // flags.set("NoView")
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                flags,
                type: "Tx",
              }
            );
            // Set the flags for the field
            // field.setFlag(Annotations.Forms.FieldFlag.ReadOnly, true);
            // field.setFlag(Annotations.Forms.FieldFlag.NoMove, true);

            inputAnnot = new Annotations.RectangleAnnotation();
            inputAnnot.StrokeColor = new Annotations.Color(255, 255, 255); // Set stroke color to white

            inputAnnot.PageNumber = annot.getPageNumber();
            inputAnnot.X = annot.getX();
            inputAnnot.Y = annot.getY();
            inputAnnot.Width = annot.getWidth();
            inputAnnot.Height = annot.getHeight();
            inputAnnot.Rotation = annot.Rotation;
            inputAnnot.FillColor = new Annotations.Color(255, 255, 255); // Set fill color to white
            inputAnnot.StrokeColor = new Annotations.Color(255, 255, 255); // Set stroke color to white
          } else {
            // exit early for other annotations
            annotationManager.deleteAnnotation(annot, false, true); // prevent duplicates when importing xfdf
            return;
          }
        } else {
          // exit early for other annotations
          return;
        }

        // set position
        inputAnnot.PageNumber = annot.getPageNumber();
        inputAnnot.X = annot.getX();
        inputAnnot.Y = annot.getY();
        inputAnnot.rotation = annot.Rotation;
        if (annot.Rotation === 0 || annot.Rotation === 180) {
          inputAnnot.Width = annot.getWidth();
          inputAnnot.Height = annot.getHeight();
        } else {
          inputAnnot.Width = annot.getHeight();
          inputAnnot.Height = annot.getWidth();
        }

        // delete original annotation
        annotsToDelete.push(annot);

        // customize styles of the form field
        Annotations.WidgetAnnotation.getCustomStyles = function (widget) {
          // if (widget instanceof Annotations.SignatureWidgetAnnotation) {
          //   return {
          //     border: "1px solid #a5c7ff",
          //   };
          // }
          if (widget instanceof Annotations.CheckButtonWidgetAnnotation) {
            return {
              border: "2px solid #091C3F",
              backgroundColor: "#FFFFFF",
              height: "20px",
              width: "20px",
              cursor: "pointer",
              textAlign: "center",
            };
          }

          if (widget instanceof Annotations.TextWidgetAnnotation) {
            return {
              backgroundColor: "rgba((252, 232, 232)",
              height: "30px",
              width: "200px",
              textAlign: "center",
            };
          }
        };

        Annotations.WidgetAnnotation.getCustomStyles(inputAnnot);

        // draw the annotation the viewer
        annotationManager.addAnnotation(inputAnnot);
        fieldManager.addField(field);
        annotsToDraw.push(inputAnnot);
      })
    );

    // delete old annotations
    annotationManager.deleteAnnotations(annotsToDelete, null, true);

    // refresh viewer
    await annotationManager.drawAnnotationsFromList(annotsToDraw);
    await uploadForSigning();
  };

  const uploadForSigning = async () => {
    const { documentViewer, annotationManager } = instance.Core;
    const doc = documentViewer.getDocument();
    const xfdfString = await annotationManager.exportAnnotations({
      widgets: true,
      fields: true,
    });
    const data = await doc.getFileData({ xfdfString });
    const arr = new Uint8Array(data);
    const blob = new Blob([arr], { type: "application/pdf" });

    const formData = new FormData();
    formData.append("pdfFile", blob, "filename.pdf");

    Axios.post("/api/upload-pdf", formData)
      .then((response) => {
        if (response.status == 200) {
        } else {
          console.error(
            "Failed to upload PDF server error: " + response.status
          );
        }
      })
      .catch((error) => {
        // console.log("error", error);
      });
  };

  const addField = (
    type,
    point = {},
    name = "",
    value = "",
    flag = {},
    user
  ) => {
    // console.log(value);
    const { documentViewer, Annotations } = instance.Core;
    const annotationManager = documentViewer.getAnnotationManager();
    const doc = documentViewer.getDocument();
    const displayMode = documentViewer.getDisplayModeManager().getDisplayMode();
    const page = displayMode.getSelectedPages(point, point);
    if (!!point.x && page.first == null) {
      return; //don't add field to an invalid page location
    }
    const page_idx =
      page.first !== null ? page.first : documentViewer.getCurrentPage();
    const page_info = doc.getPageInfo(page_idx);
    const page_point = displayMode.windowToPage(point, page_idx);
    const zoom = documentViewer.getZoomLevel();

    var textAnnot = new Annotations.FreeTextAnnotation();
    textAnnot.PageNumber = page_idx;
    const rotation = documentViewer.getCompleteRotation(page_idx) * 90;
    textAnnot.Rotation = rotation;
    if (rotation === 270 || rotation === 90) {
      textAnnot.Width = 30.0 / zoom;
      textAnnot.Height = 200.0 / zoom;
    } else {
      textAnnot.Width = 200.0 / zoom;
      textAnnot.Height = 30.0 / zoom;
    }
    textAnnot.X = (page_point.x || page_info.width / 2) - textAnnot.Width / 2;
    textAnnot.Y = (page_point.y || page_info.height / 2) - textAnnot.Height / 2;

    if (type === "CHECKMARK") {
      textAnnot.Width = 20.0 / zoom;
      textAnnot.Height = 20.0 / zoom;

      textAnnot.X = (page_point.x || page_info.width / 1) - textAnnot.Width / 1;
      textAnnot.Y =
        (page_point.y || page_info.height / 1) - textAnnot.Height / 1;
    }

    textAnnot.setPadding(new Annotations.Rect(0, 0, 0, 0));
    textAnnot.custom = {
      type,
      value,
      flag,
      name: `${value ? value : name}`,
      user,
      width: textAnnot.Width,
      height: textAnnot.Height,
    };

    // set the type of annot
    textAnnot.setContents(textAnnot.custom.name);
    textAnnot.FontSize = "" + 20.0 / zoom + "px";
    textAnnot.FillColor = new Annotations.Color(252, 232, 232);
    textAnnot.TextColor = new Annotations.Color(0, 165, 228);
    textAnnot.StrokeThickness = 1;
    textAnnot.StrokeColor = new Annotations.Color(252, 232, 232);
    textAnnot.TextAlign = "center";

    if (user === "notary") {
      // console.log("notary");
      textAnnot.StrokeColor = new Annotations.Color(234, 242, 255);
      textAnnot.FillColor = new Annotations.Color(234, 242, 255);
    }

    if (type === "RECTANGLE") {
      textAnnot.FillColor = new Annotations.Color(255, 255, 255);
      textAnnot.StrokeColor = new Annotations.Color(255, 255, 255);
      textAnnot.TextColor = new Annotations.Color(255, 255, 255);
      textAnnot.custom.color = new Annotations.Color(255, 255, 255);
    }

    textAnnot.Author = annotationManager.getCurrentUser();

    annotationManager.deselectAllAnnotations();
    annotationManager.addAnnotation(textAnnot, true);
    annotationManager.redrawAnnotation(textAnnot);
    annotationManager.selectAnnotation(textAnnot);
  };

  const dragOver = (e) => {
    e.preventDefault();
    return false;
  };

  const drop = (e, instance) => {
    const docViewer = instance.Core.documentViewer;
    const scrollElement = docViewer.getScrollViewElement();
    const scrollLeft = scrollElement.scrollLeft || 0;
    const scrollTop = scrollElement.scrollTop || 0;
    setDropPoint({ x: e.pageX + scrollLeft, y: e.pageY + scrollTop });
    e.preventDefault();
    return false;
  };

  const dragStart = (e) => {
    e.target.style.opacity = 0.5;
    const copy = e.target.cloneNode(true);
    copy.id = "form-build-drag-image-copy";
    copy.style.width = "250px";
    document.body.appendChild(copy);
    e.dataTransfer.setDragImage(copy, 125, 25);
    e.dataTransfer.setData("text", "");
  };

  const dragEnd = (e, type, user, value) => {
    // console.log(user);
    addField(type, dropPoint, "", value, {}, user);
    e.target.style.opacity = 1;
    document.body.removeChild(
      document.getElementById("form-build-drag-image-copy")
    );
    e.preventDefault();
  };

  return (
    <div className="relative h-full">
      <div className="bg-gray-200 mt-1 w-full flex 	flex-col">
        <div className="bg-white flex flex-row">
          <span className="m-2 font-bold w-2/6">New Request</span>
          <span className="m-2">
            <span className="font-semibold">Signee Name:</span>
            {" " +
              documentInfo.signee_firstName +
              " " +
              documentInfo.signee_lastName}
          </span>

          <span className="m-2">
            <span className="font-semibold">Signee Email:</span>
            {" " + documentInfo.signee_email}
          </span>
          <span className="m-2">
            <span className="font-semibold">Appointment Date & Time:</span>
            {" " + documentInfo.appointment_date} |{" "}
            {documentInfo.appointment_time}
          </span>
        </div>
        <div className="flex flex-row">
          <ul className="flex icon-lists w-3/5 px-2">
            {topIcons.map((item, i) => (
              <li
                key={i}
                draggable
                onDragStart={(e) => dragStart(e)}
                onDragEnd={(e) => dragEnd(e, item.type, item.user, item.value)}
              >
                <Tooltip placement="top" arrow content={item.name}>
                  <div
                    className={`rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xl  py-3 px-4 mt-3 ${
                      skin === "bordered"
                        ? " border border-gray-5002 dark:border-slate-700"
                        : "shadow-base"
                    }`}
                  >
                    <Icon icon={item.icon} />
                  </div>
                </Tooltip>
              </li>
            ))}
          </ul>

          <div className="w-1/5 flex flex-row">
            <Button
              onClick={applyFields}
              text="primary"
              className="btn-primary block-btn m-2"
            >
              Save as Draft
            </Button>
            <Button
              onClick={() => {
                navigate("/meeting?uid=notary&channelName=main");
              }}
              className="btn-primary block-btn m-2"
            >
              Join Meet
            </Button>
          </div>
        </div>
      </div>

      <div
        className="relative br-10 h-full "
        ref={viewer}
        style={{ height: "500px" }}
      ></div>
    </div>
  );
};

export default TaggingPdfWebViewer;
