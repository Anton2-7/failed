import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import { getCroppedImg } from "../../utils/getCroppedImg";
import { useEffect, useRef, useState } from "react";
import { Input, KeenIcon } from "../../../../components";
import { getPhotoSrc } from "../../utils/getPhotoSrc";
import { toast, Bounce } from "react-toastify";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 100;

export default function ModalPrize({
  closeModal,
  onSavePrize,
  prizes,
  editingPrize,
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState();
  const [prizeName, setPrizeName] = useState("");
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  useEffect(() => {
    if (editingPrize) {
      setSelectedImage(editingPrize.photo);
      setPrizeName(editingPrize.name);
    }
  }, [editingPrize]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;
      setSelectedImage(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const showAlert = (type, message) => {
    toast[type](message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const validateForm = () => {
    if (!prizeName) {
      showAlert("error", "Введите название приза");
      return false;
    }
    return true;
  };

  const handlePrizeSave = async () => {
    if (!validateForm()) {
      return;
    }
    if (!selectedImage || !prizeName) return;

    if (crop && crop.width && crop.height) {
      getCroppedImg(
        imgRef.current,
        previewCanvasRef.current,
        convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
      );
    }

    const newPrize = {
      id: null,
      name: prizeName,
      photo: previewCanvasRef.current.toDataURL("image/webp"),
      position: prizes.length + 1,
    };
    onSavePrize(newPrize);
    closeModal();
  };

  const imageSrc = getPhotoSrc(selectedImage);

  return (
    <div className="bg-white rounded-2xl w-full max-w-[350px] shadow-xl flex flex-col m-auto my-[10%] ">
      <div className="card-header py-0 px-5 flex justify-between items-center">
        <h2 className="font-bold text-gray-900">Редактирование подарка</h2>
        <button onClick={closeModal}>
          <KeenIcon icon={"cross-square"} className="text-2xl opacity-50" />
        </button>
      </div>
      <div className="card-body p-4 flex flex-col gap-1">
        <div className="text-gray-600 text-[13px]">
          Загрузка изображений производится в формате webp, не более 320×320
          пикселей и не менее 100×100, строго с прозрачным фоном
        </div>
        <div
          className="relative flex justify-center items-center bg-[#101C2B] rounded-lg w-full max-w-[315px] h-[315px] cursor-pointer overflow-hidden"
          onClick={handleImageClick}
        >
          {selectedImage ? (
            <ReactCrop
              crop={crop}
              onChange={(percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCrop(c)}
              keepSelection
            >
              <img
                ref={imgRef}
                src={imageSrc}
                crossOrigin="anonymous"
                alt="Выбранное изображение"
                onLoad={onImageLoad}
              />
            </ReactCrop>
          ) : (
            <KeenIcon icon={"picture"} className="text-5xl" />
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/webp"
          className="hidden"
          disabled={selectedImage ? true : false}
        />
        <div className="mt-2">
          <Input
            text={"Название подарка"}
            placeholder={"iPhone 16 PRO"}
            value={prizeName}
            onChange={(value) => setPrizeName(value)}
          />
        </div>
        <div className="flex gap-5 mt-3">
          <button
            onClick={closeModal}
            className="flex-1 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-500"
          >
            Отменить
          </button>
          <button
            onClick={handlePrizeSave}
            className="flex-1 py-2 rounded-lg bg-blue-500 text-white"
          >
            Сохранить
          </button>
        </div>
        {crop && <canvas ref={previewCanvasRef} style={{ display: "none" }} />}
      </div>
    </div>
  );
}
