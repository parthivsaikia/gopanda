export const ImageGalleryWithOneImage = ({ image }: { image: string }) => {
  return (
    <div className="w-full">
      <img
        className="h-full w-full object-cover "
        src={image}
        alt="tour-image"
      />
    </div>
  );
};

const ImageGalleryWithTwoImage = ({ images }: { images: string[] }) => {
  return (
    <div className="grid grid-cols-2 h-full gap-4">
      {images.map((image) => (
        <div className="h-full w-full" key={image}>
          <img
            className="h-full w-full object-cover rounded-2xl"
            src={image}
            alt="tour-image"
          />
        </div>
      ))}
    </div>
  );
};

// Renders one image on top, and two side-by-side below
const ImageGalleryWithThreeImage = ({ images }: { images: string[] }) => {
  return (
    // Main container: 2 rows, with a gap
    <div className="grid grid-rows-2 gap-2 h-full">
      {/* Top row: a single image */}
      <div className="h-full w-full">
        <img
          className="h-full w-full object-cover rounded-2xl"
          src={images[0]}
          alt="gallery"
        />
      </div>
      {/* Bottom row: a nested grid with 2 columns */}
      <div className="grid grid-cols-2 gap-2 h-full">
        <div className="h-full w-full">
          <img
            className="h-full w-full object-cover rounded-2xl"
            src={images[1]}
            alt="gallery"
          />
        </div>
        <div className="h-full w-full">
          <img
            className="h-full w-full object-cover rounded-2xl"
            src={images[2]}
            alt="gallery"
          />
        </div>
      </div>
    </div>
  );
};

// Renders a 2x2 grid of images
const ImageGalleryWithFourImages = ({ images }: { images: string[] }) => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
      {" "}
      {/* Use both cols and rows */}
      {images.map((image, index) => (
        <div key={index} className="h-full w-full">
          {" "}
          {/* Added React key */}
          <img
            className="h-full w-full object-cover rounded-2xl"
            src={image}
            alt="gallery"
          />{" "}
          {/* Moved object-cover */}
        </div>
      ))}
    </div>
  );
};

export default function TourDetails({ images }: { images: string[] }) {
  if (!images || images.length === 0) {
    return <div>No images to display.</div>; // Handle case with no images
  }

  // Slice to a max of 5 images total.
  const displayImages = images.length > 5 ? images.slice(0, 5) : images;

  const heroImg = displayImages[0];
  const remainingImages = displayImages.slice(1);
  const remainingImagesLength = remainingImages.length;
  const hasGallery = remainingImagesLength > 0;

  return (
    // Make the whole container a responsive grid with a max-width
    <div className="mx-auto max-w-7xl p-4  grid grid-cols-1 md:grid-cols-2 gap-2">
      {/* Hero Image takes the first column */}
      <div className="h-full w-full">
        <img
          src={heroImg}
          alt="Hero"
          className="h-full w-full object-cover rounded-2xl"
        />
      </div>

      {/* The gallery of remaining images takes the second column */}
      <div className="h-full w-full hidden md:block">
        {" "}
        {/* Hide on small screens, show on medium+ */}
        {remainingImagesLength === 1 && (
          <ImageGalleryWithOneImage image={remainingImages[0]} />
        )}
        {remainingImagesLength === 2 && (
          <ImageGalleryWithTwoImage images={remainingImages} />
        )}
        {remainingImagesLength === 3 && (
          <ImageGalleryWithThreeImage images={remainingImages} />
        )}
        {remainingImagesLength === 4 && (
          <ImageGalleryWithFourImages images={remainingImages} />
        )}
        {/* Note: ImageGalleryWithOneImage also needs the object-cover fix */}
      </div>
    </div>
  );
}
