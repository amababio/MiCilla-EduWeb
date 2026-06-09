import { IMAGE_ACCEPT, IMAGE_ACCEPT_LABEL } from "@/lib/image-upload-shared";

type ImageUploadFieldProps = {
  id: string;
  label?: string;
  hint?: string;
  currentImageUrl?: string | null;
  currentImageAlt?: string;
  optional?: boolean;
};

export function ImageUploadField({
  id,
  label = "Upload Photo",
  hint,
  currentImageUrl,
  currentImageAlt = "Current photo",
  optional = true,
}: ImageUploadFieldProps) {
  const defaultHint = optional
    ? currentImageUrl
      ? `Optional. ${IMAGE_ACCEPT_LABEL} up to 10 MB. Leave blank to keep the current photo.`
      : `Optional. ${IMAGE_ACCEPT_LABEL} up to 10 MB.`
    : `${IMAGE_ACCEPT_LABEL} up to 10 MB.`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {currentImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentImageUrl}
          alt={currentImageAlt}
          className="mt-3 h-32 w-full max-w-sm rounded-xl border border-mauve-200 object-cover"
        />
      ) : null}
      <input
        id={id}
        name="photo"
        type="file"
        accept={IMAGE_ACCEPT}
        className="mt-2 block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-mauve-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-mauve-700 hover:file:bg-mauve-200"
      />
      <p className="mt-1 text-xs text-slate-500">{hint ?? defaultHint}</p>
    </div>
  );
}
