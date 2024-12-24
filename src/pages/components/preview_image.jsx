import React, { useState, useCallback } from "react";
import ImageViewer from "react-simple-image-viewer";

export default function PreviewImage({ props, onRemoveImage }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <div className="image-container" style={{ zIndex: 1000 }}>
      {props.map((src, index) => (
        <div
          key={index}
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          <img
            src={src}
            onClick={() => openImageViewer(index)}
            width={240}
            height={200}
            style={{ margin: "2px", cursor: "pointer" }}
            alt="image"
          />
          <button
            onClick={async () => await onRemoveImage(index)}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              backgroundColor: "transparent",
              color: "white",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            X
          </button>
        </div>
      ))}

      {isViewerOpen && (
        <ImageViewer
          src={props}
          currentIndex={currentImage}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
          closeOnClickOutside={true}
        />
      )}
    </div>
  );
}
