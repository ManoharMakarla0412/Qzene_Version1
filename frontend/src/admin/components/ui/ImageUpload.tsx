import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
interface ImageUploadProps {
  bucket: string; // Kept for compatibility, but not used with Cloudinary
  folder?: string; // Optional folder in Cloudinary
  onUpload: (url: string) => void;
  existingUrl?: string;
}

export function ImageUpload({ bucket, folder, onUpload, existingUrl }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_unsigned_upload_preset"); // Replace with your Cloudinary upload preset
      if (folder) {
        formData.append("folder", folder);
      }

      console.log("Uploading image to Cloudinary", { file: file.name, folder });

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Cloudinary response:", data);

      if (data.error) {
        throw new Error(data.error.message || "Failed to upload image");
      }

      const secureUrl = data.secure_url;
      console.log("Secure URL:", secureUrl);

      setPreview(secureUrl);
      onUpload(secureUrl);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {preview ? (
        <div className="relative w-full h-64 rounded-md overflow-hidden">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => document.getElementById("single-image-upload")?.click()}
            >
              Change Image
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="single-image-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
          </div>
        </label>
      )}

      <input
        id="single-image-upload"
        type="file"
        accept="image/*"
        onChange={uploadImage}
        disabled={uploading}
        className="hidden"
      />

      {uploading && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}