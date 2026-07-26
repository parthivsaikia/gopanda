import { useState, useRef } from "react";
import { Field } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import type { TourCreateStepProps } from "@repo/types";
import { apiBaseUrl } from "services/config";

// --- Types ---

interface NominatimPlace {
  osm_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

// Interface for local file preview before upload
interface LocalImageFile {
  id: string;
  file: File;
  preview: string;
  selected: boolean;
}

// The shape of our form's 'place' field
type PlaceFieldValue =
  | {
      create: {
        name: string;
        latitude: number;
        longitude: number;
        photos: string[];
      };
    }
  | { connect: { id: number } }
  | undefined;

// --- API Helper for Photo Uploads ---

/**
 * Uploads files to a dedicated endpoint and returns their public URLs.
 * @param files - The files to upload.
 * @returns A promise that resolves to an array of photo URLs.
 */
const uploadPhotos = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("photos", file);
  });

  try {
    const response = await axios.post<{ photoUrls: string[] }>(
      `${apiBaseUrl}/placeImage`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.photoUrls;
  } catch (error) {
    console.error("Photo upload failed:", error);
    throw new Error("Could not upload photos.");
  }
};

// --- The Improved Component ---

interface PlaceSearchProps extends TourCreateStepProps {
  dayIndex: number;
  blockIndex: number;
}

export default function PlaceSearch({
  form,
  dayIndex,
  blockIndex,
}: PlaceSearchProps) {
  const [value, setValue] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [isValidPlaceSelected, setIsValidPlaceSelected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // New state for local image management
  const [localImages, setLocalImages] = useState<LocalImageFile[]>([]);

  const fetchPlaces = async (value: string): Promise<NominatimPlace[]> => {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        value,
      )}&limit=5&addressdetails=1`,
    );
    return response.data;
  };

  const placesQuery = useQuery({
    queryKey: ["places", value],
    queryFn: () => fetchPlaces(value),
    enabled: !!value && value.length > 0,
  });

  const handlePlaceSelect = (place: NominatimPlace) => {
    form.setFieldValue(
      `dayPlan[${dayIndex}].itineraries[${blockIndex}].place`,
      {
        create: {
          name: place.display_name,
          latitude: parseFloat(place.lat),
          longitude: parseFloat(place.lon),
          photos: [],
        },
      },
    );
    setIsDropDownVisible(false);
    setIsValidPlaceSelected(true);
    setValue(place.display_name);
  };

  // Handle file selection - now just for preview
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024,
    );

    const newLocalImages: LocalImageFile[] = newFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      selected: true, // Select by default
    }));

    setLocalImages((prev) => [...prev, ...newLocalImages]);
  };

  // Upload only selected images
  const handleUploadSelected = async (placeValue: PlaceFieldValue) => {
    if (!placeValue || !("create" in placeValue)) return;

    const selectedImages = localImages.filter((img) => img.selected);
    if (selectedImages.length === 0) {
      setUploadError("Please select at least one image to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const filesToUpload = selectedImages.map((img) => img.file);
      const uploadedUrls = await uploadPhotos(filesToUpload);

      // Get existing URLs to avoid duplicates
      const existingUrls = placeValue.create.photos || [];
      const uniqueNewUrls = uploadedUrls.filter(
        (url) => !existingUrls.includes(url),
      );

      // Update the form state with the new array of URLs
      form.setFieldValue(
        `dayPlan[${dayIndex}].itineraries[${blockIndex}].place.create.photos`,
        [...existingUrls, ...uniqueNewUrls],
      );

      // Clear local images after successful upload
      setLocalImages([]);
    } catch (error) {
      setUploadError("Failed to upload photos. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const toggleImageSelection = (id: string) => {
    setLocalImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, selected: !img.selected } : img,
      ),
    );
  };

  const removeLocalImage = (id: string) => {
    setLocalImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const selectAllImages = () => {
    setLocalImages((prev) => prev.map((img) => ({ ...img, selected: true })));
  };

  const deselectAllImages = () => {
    setLocalImages((prev) => prev.map((img) => ({ ...img, selected: false })));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-96 mx-auto p-4">
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium mb-2">
            Search a place
          </label>
          <Field
            form={form}
            name={`dayPlan[${dayIndex}].itineraries[${blockIndex}].place`}
            validators={{
              onChange: ({ value }) => {
                if (!isValidPlaceSelected && value) {
                  setIsValidPlaceSelected(false);
                }
                return undefined;
              },
              onSubmit: ({ value }) => {
                if (!value || !("create" in value)) {
                  return "Please select a valid place from the search results.";
                }
                const { name, latitude, longitude } = value.create;
                if (!name || !latitude || !longitude) {
                  return "Please select a valid place from the search results.";
                }
                return undefined;
              },
            }}
            listeners={{
              onChangeDebounceMs: 500,
              onChange: ({ value }) => {
                const displayName =
                  value && "create" in value ? value.create.name : "";
                setValue(displayName);
                setIsValidPlaceSelected(!!value && "create" in value);
                if (displayName) {
                  setIsDropDownVisible(true);
                } else {
                  form.setFieldValue(
                    `dayPlan[${dayIndex}].itineraries[${blockIndex}].place`,
                    undefined,
                  );
                }
              },
            }}
            children={(field) => {
              const placeValue = field.state.value as PlaceFieldValue;

              return (
                <>
                  <Input
                    required
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setIsValidPlaceSelected(false);
                      if (e.target.value) {
                        setIsDropDownVisible(true);
                      } else {
                        field.handleChange(undefined);
                      }
                    }}
                    onFocus={() => {
                      if (value) {
                        setIsDropDownVisible(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setIsDropDownVisible(false), 200);
                    }}
                    placeholder="Enter place name"
                    autoComplete="off"
                    className={
                      !field.state.meta.isValid ? "border-red-500" : ""
                    }
                  />
                  {!field.state.meta.isValid &&
                    field.state.meta.errors.length > 0 && (
                      <span className="text-red-500 text-sm">
                        {field.state.meta.errors.join(", ")}
                      </span>
                    )}

                  {isDropDownVisible &&
                    placesQuery.data &&
                    placesQuery.data.length > 0 && (
                      <div className="absolute top-full mt-1 w-full z-10">
                        <ul className="bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {placesQuery.isPending && (
                            <li className="p-3 text-sm text-gray-500">
                              Loading...
                            </li>
                          )}
                          {placesQuery.isError && (
                            <li className="p-3 text-sm text-red-500">
                              Error loading places.
                            </li>
                          )}
                          {placesQuery.data?.map((place: NominatimPlace) => (
                            <li
                              key={place.osm_id}
                              onMouseDown={() => handlePlaceSelect(place)}
                              className="cursor-pointer p-3 hover:bg-gray-100 text-sm"
                            >
                              {place.display_name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {value && !isValidPlaceSelected && !placesQuery.isPending && (
                    <div className="mt-1 text-sm text-amber-600">
                      Please select a place from the dropdown results.
                    </div>
                  )}

                  {/* Display selected place and photo uploader */}
                  {placeValue && "create" in placeValue && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          value={placeValue.create.latitude.toString()}
                          placeholder="Latitude"
                          readOnly
                          className="bg-gray-50"
                        />
                        <Input
                          value={placeValue.create.longitude.toString()}
                          placeholder="Longitude"
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Select Photos to Upload
                        </label>
                        <div className="space-y-4">
                          {/* Hidden file input */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              handleFileSelect(e.target.files);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                          />

                          {/* Drop zone */}
                          <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                              isDragOver
                                ? "border-blue-400 bg-blue-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            <div className="space-y-4">
                              <div>
                                <p className="text-lg font-medium text-gray-700">
                                  Drop images here or click to browse
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Support for multiple images (max 10MB each)
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-4"
                              >
                                Choose Files
                              </Button>
                            </div>
                          </div>

                          {/* Local image preview and selection */}
                          {localImages.length > 0 && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-700">
                                  Selected Images (
                                  {
                                    localImages.filter((img) => img.selected)
                                      .length
                                  }
                                  /{localImages.length})
                                </h4>
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={selectAllImages}
                                    className="text-xs"
                                  >
                                    Select All
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={deselectAllImages}
                                    className="text-xs"
                                  >
                                    Deselect All
                                  </Button>
                                </div>
                              </div>

                              {/* Image grid */}
                              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                {localImages.map((image) => (
                                  <div
                                    key={image.id}
                                    className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                                      image.selected
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    onClick={() =>
                                      toggleImageSelection(image.id)
                                    }
                                  >
                                    {/* Image preview */}
                                    <img
                                      src={image.preview}
                                      alt="Preview"
                                      className="w-full h-32 object-cover"
                                    />

                                    {/* Selection indicator */}
                                    <div className="absolute top-2 left-2">
                                      <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                          image.selected
                                            ? "bg-blue-500 border-blue-500"
                                            : "bg-white border-gray-300"
                                        }`}
                                      >
                                        {image.selected && (
                                          <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Remove button */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeLocalImage(image.id);
                                      }}
                                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                      ×
                                    </button>

                                    {/* File info */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                                      <p className="text-xs truncate">
                                        {image.file.name}
                                      </p>
                                      <p className="text-xs text-gray-300">
                                        {formatFileSize(image.file.size)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Upload button */}
                              <div className="flex justify-center">
                                <Button
                                  type="button"
                                  onClick={() =>
                                    handleUploadSelected(placeValue)
                                  }
                                  disabled={
                                    isUploading ||
                                    localImages.filter((img) => img.selected)
                                      .length === 0
                                  }
                                  className="px-6"
                                >
                                  {isUploading
                                    ? "Uploading..."
                                    : `Upload ${localImages.filter((img) => img.selected).length} Selected Images`}
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Upload status messages */}
                          {uploadError && (
                            <p className="text-sm text-red-600">
                              {uploadError}
                            </p>
                          )}

                          {/* Already uploaded images */}
                          {placeValue.create.photos.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-700">
                                  Uploaded Images (
                                  {placeValue.create.photos.length})
                                </h4>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    form.setFieldValue(
                                      `dayPlan[${dayIndex}].itineraries[${blockIndex}].place.create.photos`,
                                      [],
                                    );
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  Clear All
                                </Button>
                              </div>

                              <div className="space-y-2 max-h-64 overflow-y-auto">
                                {placeValue.create.photos.map((url, index) => (
                                  <div
                                    key={`${url}-${index}`}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                  >
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                          {url.split("/").pop() || url}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Uploaded successfully
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updatedPhotos =
                                          placeValue.create.photos.filter(
                                            (_, i) => i !== index,
                                          );
                                        form.setFieldValue(
                                          `dayPlan[${dayIndex}].itineraries[${blockIndex}].place.create.photos`,
                                          updatedPhotos,
                                        );
                                      }}
                                      className="text-red-500 hover:text-red-700 ml-2 h-8 w-8 p-0 flex-shrink-0"
                                    >
                                      ×
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
