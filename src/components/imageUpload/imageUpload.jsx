import React, { useRef, useState, useEffect } from "react";
import { KeenIcon } from "../keenicons";

const getImageUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  if (photo.startsWith("/")) return `http://158.160.172.170:4018${photo}`;
  return `http://${photo}`;
};

export const ImageUpload = ({ value, onChange }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    console.log("ImageUpload value:", value);

    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === "string") {
      const url = getImageUrl(value);
      console.log("ImageUpload computed URL:", url);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = null;
  };

  const handleReplace = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-[153px] h-[153px] rounded-md overflow-hidden border border-[#DBDFE9] cursor-pointer hover:opacity-80 transition"
        onClick={handleReplace}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Загрузить фото
          </div>
        )}

        {preview && (
          <>
            <button
              type="button"
              onClick={handleRemove}
              className="ki-outline absolute top-1 right-1 text-[#99A1B7] text-3xl z-10"
              title="Удалить фото"
            >
              <KeenIcon icon="trash-square" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleReplace();
              }}
              className="ki-outline absolute top-1 right-10 text-[#99A1B7] text-3xl z-10"
              title="Заменить фото"
            >
              <KeenIcon icon="notepad-edit" />
            </button>
          </>
        )}
      </div>

      <input
        type="file"
        accept=".png,.jpg,.jpeg"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
