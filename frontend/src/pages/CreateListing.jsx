import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../lib/firebase";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imagesUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    regularPrice: 50,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    offer: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false); // uploading button  image
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false); // loading button

  const { authUser } = useAuthStore(); // Auth context hook
  const navigate = useNavigate();
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imagesUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imagesUrls: formData.imagesUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("image upload failed (2mb max per images)");
          setUploading(false);
        });
    } else {
      setImageUploadError(" you can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done.`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imagesUrls: formData.imagesUrls.filter((_, i) => i !== index),
    });
  };
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imagesUrls.length < 1)
        return setError("you must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("you must upload at least one image");
      setLoading(true);
      setError(false);

      const res = await axiosInstance.post("/listing/create", {
        ...formData,
        userRef: authUser._id,
      });
      const data = res.data;

      setLoading(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <main className="bg-white text-black">
      <h1 className="text-3xl font-semibold text-center my-7 text-black">
        Create a Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row p-3 max-w-4xl gap-4"
      >
        <div className=" flex flex-col gap-4 flex-1 ">
          <input
            type="text"
            placeholder="Name"
            className="border rounded-lg p-3  bg-white text-black border-slate-400"
            id="name"
            maxLength="62"
            minLength="6"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border rounded-lg p-3  bg-white text-black border-slate-400"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="address"
            className="border rounded-lg p-3 bg-white text-black border-slate-400"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2  bg-white text-black">
              <input
                type="checkbox"
                id="sale"
                className="checkbox border-slate-400 [--chkbg:theme(colors.white)] [--chkfg:black] checked:border-white"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="checkbox border-slate-400 [--chkbg:theme(colors.white)] [--chkfg:black] checked:border-white"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="checkbox border-slate-400 [--chkbg:theme(colors.white)] [--chkfg:black] checked:border-white"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                color="white"
                type="checkbox"
                id="furnished"
                className="checkbox border-slate-400 [--chkbg:theme(colors.white)] [--chkfg:black] checked:border-white"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="checkbox border-slate-400 [--chkbg:theme(colors.white)] [--chkfg:black] checked:border-white"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-2 rounded-lg  bg-white   border border-slate-600"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-2 rounded-lg bg-white  border border-slate-600  "
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="p-2 rounded-lg bg-white border border-slate-600"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs ">($ / months)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="1000000"
                  required
                  className="p-2 rounded-lg bg-white border border-slate-600"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discount price</p>
                  <span className="text-xs ">($ / months)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              the first images will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border-gray-700 rounded w-full"
            />
            <button
              disabled={uploading}
              onClick={handleImageSubmit}
              className=" text-green-700 border border-green-700 p-3 rounded uppercase hover:shadow-lg disabled:opacity-60"
            >
              {uploading ? "uploading..." : " upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>

          {formData.imagesUrls.length > 0 &&
            formData.imagesUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing images"
                  className=" w-20 h-20 object-cover round-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-70"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className="text-white bg-slate-700 rounded-lg p-3 uppercase hover:opacity-85 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="text-red-700 text-sm"> {error}</p>}
        </div>
      </form>
    </main>
  );
}
