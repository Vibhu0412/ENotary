import { Grid } from "@mui/material";
import WebViewer from "@pdftron/webviewer";
import React, { useEffect, useRef, useState } from "react";

function MeetingPdfWebViewer({ quid }) {
  const containerStyles = { height: "100vh", border: "1px solid black" };
  const webviewerStyles = { height: "100%", width: "100%" };
  const instance = useRef(null);
  const viewer = useRef(null);
  const socket = useRef(null);
  const editTag = useRef(null);
  const [uid, _setUid] = useState(quid ?? "");

  useEffect(() => {
    WebViewer(
      {
        path: "webviewer/lib",
        licenseKey: import.meta.env.VITE_APRYSE_LICENCE_KEY,
        initialDoc: `https://eidos.bosctechlab.com/api/annotedDoc.pdf`,
        fullAPI: true,
      },
      viewer.current
    ).then(async (webInstance) => {
      const { UI } = webInstance;

      // Add Fit Width button to the header
      UI.setHeaderItems((header) => {
        header.push({
          type: "actionButton",
          img: "/files/image.png",
          onClick: async () => {
            const { Annotations, documentViewer } = webInstance.Core;

            if (!documentViewer.getDocument()) {
              return;
            }
            const annotManager = documentViewer.getAnnotationManager();

            // Read the image file from a local path
            const imagePath = "/files/image.png";
            const response = await fetch(imagePath);
            const blob = await response.blob();

            // Create a temporary URL for the image
            const imageURL = URL.createObjectURL(blob);

            // Insert the image as an annotation at the current page
            const page = documentViewer.getCurrentPage();
            const imageAnnot = new Annotations.FreeTextAnnotation();
            let currentPage = page;
            imageAnnot.PageNumber = currentPage;
            imageAnnot.X = 100; // Set the X position of the image
            imageAnnot.Y = 100; // Set the Y position of the image
            imageAnnot.Width = 200; // Set the width of the image
            imageAnnot.Height = 100; // Set the height of the image
            imageAnnot.setCustomData("imageURL", imageURL); // Save the image URL as custom data

            annotManager.addAnnotation(imageAnnot);
            annotManager.redrawAnnotation(imageAnnot);

            // Clean up the temporary URL after the image is inserted
            URL.revokeObjectURL(imageURL);
          },
          title: "notary seal",
        });
        return header;
      });
      webInstance.UI.setHeaderItems((header) => {
        header.push({
          type: "actionButton",
          img: "/files/edit.png",
          onClick: () => {
            editTag.current = true;
            const formFieldCreationManager =
              webInstance.Core.annotationManager.getFormFieldCreationManager();
            formFieldCreationManager.startFormFieldCreationMode();
            formFieldCreationManager.isInFormFieldCreationMode(); // returns true
          },
          title: "edit",
        });

        header.push({
          type: "actionButton",
          img: "/files/apply.jpg",
          onClick: () => {
            const formFieldCreationManager =
              webInstance.Core.annotationManager.getFormFieldCreationManager();
            formFieldCreationManager.startFormFieldCreationMode();
            formFieldCreationManager.endFormFieldCreationMode();
            editTag.current = null;
          },
          title: "apply",
        });

        return header;
      });

      // UI.setHeaderItems((header) => {

      //   return header;
      // });

      // UI.setHeaderItems((header) => {

      //   return header;
      // });

      if (uid === "notary") {
        webInstance.Core.annotationManager.setCurrentUser("notary");
        webInstance.UI.setFitMode(webInstance.UI.FitMode.FitWidth);
        webInstance.UI.disableElements(["toolbarGroup-Shapes"]);
        webInstance.UI.disableElements(["toolbarGroup-Edit"]);
        webInstance.UI.disableElements(["toolbarGroup-Insert"]);
        webInstance.UI.disableElements(["toolbarGroup-Annotate"]);
        webInstance.UI.disableElements(["toolbarGroup-View"]);
      } else {
        webInstance.UI.disableElements([
          "header",
          "notesPanel",
          "leftPanel",
          "searchPanel",
          "searchOverlay",
          "thumbnailControl",
          "toolbar",
          "signaturePanel",
          "textPopup",
          "contextMenuPopup",
          "outlinesPanel",
          "viewControlsButton",
          "pageNavOverlay",
          "redactionToolButton",
          "printButton",
          "downloadButton",
          "toolbarGroup-Shapes",
          "toolbarGroup-Edit",
          "toolbarGroup-Insert",
          "toolbarGroup-Annotate",
          "toolbarGroup-View",
          "toolbarGroup-Image",
          "toolbarGroup-Signature",
          "RubberStamp",
        ]);
      }
      webInstance.UI.setFitMode(webInstance.UI.FitMode.FitWidth);

      const PDFNet = webInstance.Core.PDFNet;
      await PDFNet.initialize();

      const doc = await PDFNet.PDFDoc.createFromURL(
        "https://eidos.bosctechlab.com/api/annotedDoc.pdf"
      );

      doc.initSecurityHandler();
      doc.lock();

      instance.current = webInstance;

      webInstance.Core.annotationManager.addEventListener(
        "fieldChanged",
        async (annotations, action) => {
          const xfdfString =
            await webInstance.Core.annotationManager.exportAnnotations({
              action: action,
              fields: true,
            });

          const data = {
            xfdfString: xfdfString,
            annotationId: annotations.Id,
          };

          if (xfdfString) {
            sendWebSocketMessage("addAnnotation", data);
          }
        }
      );

      webInstance.Core.annotationManager.addEventListener(
        "annotationChanged",
        async (annotations, action, { imported }) => {
          if (editTag.current === true) {
            return;
          }

          annotations.forEach(async (annotation) => {
            if (action === "add") {
              if (imported) {
                return;
              }
              const xfdfString =
                await webInstance.Core.annotationManager.exportAnnotations({
                  annotList: [annotation],
                  fields: true,
                });
              const data = {
                xfdfString: xfdfString,
                annotationId: annotation.Id,
                type: annotation?.custom?.type,
              };

              if (xfdfString) {
                sendWebSocketMessage("addAnnotation", data);
              }
            } else if (action === "modify") {
              if (imported) {
                return;
              }
              const xfdfString =
                await webInstance.Core.annotationManager.exportAnnotations({
                  annotList: [annotation],
                  fields: true,
                });
              const data = {
                annotationId: annotation.Id,
                xfdfString: xfdfString,
              };
              sendWebSocketMessage("updateAnnotation", data);
            } else if (action === "delete") {
              if (imported) {
                return;
              }
              const data = {
                annotationId: annotation.Id,
              };
              sendWebSocketMessage("deleteAnnotation", data);
            }
          });
        }
      );

      establishWebSocketConnection();
    });
  }, []);

  const establishWebSocketConnection = () => {
    socket.current = new WebSocket(import.meta.env.VITE_WEBSOKET_URL);

    socket.current.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.current.onmessage = async (event) => {
      const annotManager = instance.current.Core.annotationManager;
      const blob = event.data;
      const string = await blob.text();
      const message = JSON.parse(string);
      const xfdfData = message.data.xfdfString;
      try {
        if (message.action === "deleteAnnotation") {
          const annotationId = message.data.annotationId;
          const annotations = await annotManager.getAnnotationById(
            annotationId
          );

          if (annotations) {
            await annotManager.deleteAnnotation(annotations);
          }
        } else {
          await annotManager.importAnnotations(xfdfData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.current.onclose = () => {
      console.log("WebSocket connection closed.");
      setTimeout(establishWebSocketConnection, 2000);
    };
  };

  const sendWebSocketMessage = (action, data) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      const message = {
        action: action,
        data: data,
      };
      socket.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket connection is not open.");
    }
  };

  return (
    <Grid container style={containerStyles}>
      <Grid
        item
        xs={12}
        style={webviewerStyles}
        ref={viewer}
        className="relative"
      ></Grid>
    </Grid>
  );
}

export default MeetingPdfWebViewer;
