import React, { useState, useEffect, useCallback, useMemo } from "react"
import type { ChangeEvent } from "react"

// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase" // Changed path
import type { SiteImageData, SectionTextData } from "@/lib/supabasedb" // Adjust path if needed, ADD SectionTextData
import { getAllSiteImages, updateImageAltText, getAllSectionTexts, updateSectionText } from "@/lib/supabasedb" // Adjust path if needed, ADD text functions
import { encode } from "blurhash" // <-- Import blurhash
import Compressor from "compressorjs" // <-- Import Compressor.js
import { toast } from "sonner"

// Define the sections you want to manage
// TODO KEEP SYNC WITH index.ts (need to redeploy edge function Supabase)
const VALID_SECTIONS = [
  "hero",
  "grossesse-1",
  "grossesse-2",
  "grossesse-3",
  "famille-1",
  "famille-2",
  "famille-3",
  "bebe-1",
  "bebe-2",
  "bebe-3",
  "complices-1",
  "complices-2",
  "complices-3",
  "grossesse-0",
  "famille-0",
  "bebe-0",
  "complices-0",
  "aproposdemoi",
]

// --- Helper Functions for Client-Side BlurHash ---

// Loads an image file into an HTMLImageElement
const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (...args) => reject(args)
    img.src = URL.createObjectURL(file)
  })

// Draws an image to a canvas and returns its ImageData
const getImageData = (image: HTMLImageElement): ImageData => {
  const canvas = document.createElement("canvas")
  canvas.width = image.width
  canvas.height = image.height
  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Failed to get canvas context")
  }
  context.drawImage(image, 0, 0)
  return context.getImageData(0, 0, image.width, image.height)
}

// Encodes an image file to a BlurHash string
const encodeImageToBlurhash = async (file: File): Promise<{ hash: string; width: number; height: number }> => {
  try {
    const image = await loadImage(file)
    const imageData = getImageData(image)
    // Adjust componentX/Y for quality vs performance (e.g., 4x3 is common)
    const componentX = 4
    const componentY = 3
    const hash = encode(imageData.data, imageData.width, imageData.height, componentX, componentY)
    return { hash, width: image.width, height: image.height }
  } catch (error) {
    console.error("Failed to encode blurhash:", error)
    throw new Error("Could not generate BlurHash for the image.")
  }
}

// --- Helper Function for Client-Side Image Optimization ---
/**
 * Optimizes an image file using Compressor.js.
 * Converts the image to WebP format with a specified quality.
 * @param file The image file to optimize.
 * @returns A Promise that resolves with the optimized image file (as a Blob or File).
 * @throws An error if optimization fails.
 */
const optimizeImage = (file: File): Promise<File | Blob> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8, // Adjust quality as needed (0-1)
      mimeType: "image/webp", // Convert to WebP
      success(result) {
        resolve(result)
      },
      error(err) {
        console.error("Image optimization failed:", err)
        reject(new Error(`Image optimization failed: ${err.message}`))
      },
    })
  })
}

// --- Component Start ---

const AdminImages: React.FC = () => {
  const [images, setImages] = useState<SiteImageData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Text Sections State
  const [textSections, setTextSections] = useState<SectionTextData[]>([])
  const [loadingText, setLoadingText] = useState(true)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [editingTextId, setEditingTextId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [isSavingText, setIsSavingText] = useState(false)

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isHashing, setIsHashing] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false) // New state for optimization
  const [generatedBlurhash, setGeneratedBlurhash] = useState<string | null>(null)
  const [imageWidth, setImageWidth] = useState<number | null>(null)
  const [imageHeight, setImageHeight] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isInvokingFunction, setIsInvokingFunction] = useState(false)
  const [uploadSection, setUploadSection] = useState<string>("")
  const [uploadAltText, setUploadAltText] = useState("")

  // Editing state
  const [editingImageId, setEditingImageId] = useState<number | null>(null)
  const [editingAltText, setEditingAltText] = useState("")
  const [isSavingAlt, setIsSavingAlt] = useState(false)
  const [isDeletingImageId, setIsDeletingImageId] = useState<number | null>(null) // New state for delete operation

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // State for the selected text section in the dropdown
  const [selectedTextSectionId, setSelectedTextSectionId] = useState<string>("") // Store ID as string for Select component

  const fetchImages = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllSiteImages()
      setImages(data)
    } catch (err) {
      console.error("Failed to fetch images:", err)
      setError("Erreur lors du chargement des images.")
      toast.error("Erreur lors du chargement des images.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch Text Sections
  const fetchTextSections = useCallback(async () => {
    setLoadingText(true)
    setErrorText(null)
    try {
      const data = await getAllSectionTexts()
      setTextSections(data)
    } catch (err) {
      console.error("Failed to fetch text sections:", err)
      setErrorText("Erreur lors du chargement des sections de texte.")
      toast.error("Erreur lors du chargement des sections de texte.")
    } finally {
      setLoadingText(false)
    }
  }, [])

  // Find the currently selected text section object based on ID
  const selectedTextSection = useMemo(() => {
    return textSections.find((sec) => sec.id.toString() === selectedTextSectionId)
  }, [textSections, selectedTextSectionId])

  // Group text sections by page for the dropdown
  const groupedTextSections = useMemo(() => {
    const groups: Record<string, SectionTextData[]> = {}
    textSections.forEach((section) => {
      const pageName = section.page || "Autres" // Group sections without a page under "Autres"
      if (!groups[pageName]) {
        groups[pageName] = []
      }
      groups[pageName].push(section)
    })
    // Optional: Sort groups if needed (e.g., alphabetically, or by a predefined order)
    // For now, it uses insertion order.
    return groups
  }, [textSections])

  useEffect(() => {
    fetchImages()
    fetchTextSections() // Fetch texts as well
  }, [fetchImages, fetchTextSections]) // Add fetchTextSections dependency

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(null) // Reset previous file
    setGeneratedBlurhash(null)
    setImageWidth(null)
    setImageHeight(null)
    setIsOptimizing(false) // Reset optimizing state

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setIsHashing(true)
      setError(null) // Clear previous errors
      // console.log("Starting BlurHash encoding...") // Removed log
      try {
        const { hash, width, height } = await encodeImageToBlurhash(file)
        setGeneratedBlurhash(hash)
        setImageWidth(width)
        setImageHeight(height)
        // console.log("BlurHash encoding successful:", { hash, width, height }) // Removed log
      } catch (hashError) {
        const msg = hashError instanceof Error ? hashError.message : "Erreur inconnue lors du hashage."
        console.error("BlurHash encoding failed:", hashError) // Keep console.error
        toast.error(`Erreur BlurHash: ${msg}`)
        setError(`Erreur BlurHash: ${msg}`) // Show error to user
        setSelectedFile(null) // Prevent upload if hashing fails
        // Optionally reset file input
        e.target.value = ""
      } finally {
        setIsHashing(false)
      }
    } else {
      // No file selected or selection cancelled
      setSelectedFile(null)
      setGeneratedBlurhash(null)
      setImageWidth(null)
      setImageHeight(null)
      setIsHashing(false)
    }
  }

  const handleUpload = async () => {
    // Also check if hashing is done and hash exists
    if (!selectedFile || !uploadSection || isHashing || !generatedBlurhash || isOptimizing) {
      // Add isOptimizing
      toast.warning(
        `Veuillez sélectionner un fichier et une section${
          isHashing
            ? " (Hashage en cours...)"
            : isOptimizing
              ? " (Optimisation en cours...)"
              : !generatedBlurhash && selectedFile
                ? " (Erreur BlurHash)"
                : ""
        }.`
      )
      return
    }

    setUploading(true)
    setIsInvokingFunction(false)
    setUploadProgress(0)
    setError(null)

    // --- Image Optimization using Compressor.js ---
    let optimizedFileToUpload: File | Blob = selectedFile
    let fileExtension = selectedFile.name.split(".").pop()?.toLowerCase() || "jpg"

    // Only optimize if it's not already webp, or if we want to force re-compression
    if (selectedFile.type !== "image/webp") {
      setIsOptimizing(true)
      try {
        toast.info("Optimisation de l'image en cours...")
        optimizedFileToUpload = await optimizeImage(selectedFile)
        // Compressor.js result might be a Blob, ensure it's a File for upload if needed
        // For Supabase upload, Blob is fine. The name might be lost, so we construct it.
        fileExtension = "webp" // Set extension to webp after conversion
        toast.success("Image optimisée avec succès !")
      } catch (optError) {
        console.error("Image optimization failed:", optError)
        const optErrorMessage = optError instanceof Error ? optError.message : "Unknown optimization error"
        toast.error(`L'optimisation de l'image a échoué: ${optErrorMessage}`)
        setError(`L'optimisation de l'image a échoué: ${optErrorMessage}`)
        setUploading(false)
        setIsOptimizing(false)
        return // Stop the upload process if optimization fails
      } finally {
        setIsOptimizing(false)
      }
    }
    // --- End Image Optimization ---

    const uniqueFileName = `${uploadSection}-${Date.now()}.${fileExtension}`
    const filePath = `${uploadSection}/${uniqueFileName}`

    try {
      // --- Add Logging --- START
      // console.log(`Attempting direct upload to Storage. Bucket: assets, Path: ${filePath}`) // Removed log
      // console.log(`File selected: ${selectedFile?.name}, Size: ${selectedFile?.size}, Type: ${selectedFile?.type}`) // Removed log
      // console.log(`Current Auth Session:`, await supabase.auth.getSession()) // Removed log - Potential info leak
      // --- Add Logging --- END

      const { data: storageData, error: storageError } = await supabase.storage
        .from("assets") // <<< Your BUCKET NAME
        .upload(filePath, optimizedFileToUpload, {
          // Use the optimized file
          cacheControl: "3600",
          upsert: false,
        })

      // --- Add Logging --- START
      if (storageError) {
        console.error("STORAGE UPLOAD FAILED:", storageError) // Keep console.error
        // Throw error to be caught below
        throw new Error(`Erreur Storage: ${storageError.message}`)
      } else {
        // console.log("STORAGE UPLOAD SUCCEEDED:", storageData) // Removed log
      }
      // --- Add Logging --- END

      // Only proceed if storage upload was successful
      if (!storageData?.path) {
        console.error("Storage upload succeeded but no path was returned:", storageData) // Keep console.error
        throw new Error("Le chemin du fichier uploadé n'a pas été retourné par Storage.")
      }

      setUploadProgress(50) // Indicate storage part done

      const uploadedPath = storageData.path
      // console.log(`Direct upload successful. Path: ${uploadedPath}`) // Removed log
      setUploadProgress(100)

      setIsInvokingFunction(true)
      // console.log(`Invoking Edge Function with path: ${uploadedPath}`) // Removed log

      // Prepare the payload as an object
      const payloadObject = {
        filePath: uploadedPath,
        section: uploadSection,
        altText: uploadAltText || "", // Use empty string if undefined/null
        // contentType: selectedFile.type, // Edge func doesn't use this anymore
        // Pass the generated data
        blurHash: generatedBlurhash, // Send the generated hash
        width: imageWidth, // Send the width
        height: imageHeight, // Send the height
      }
      // console.log("Invoking Edge Function with payload object:", payloadObject) // Removed log

      // Invoke the function, passing the object directly
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        "upload-site-image", // Your function name
        {
          body: payloadObject, // Pass the object directly
          // No need to set Content-Type header manually here,
          // supabase-js handles it when body is an object.
        }
      )

      if (functionError) {
        // --- Add More Detailed Logging --- START
        console.error("Supabase function invocation failed:", functionError)
        if (functionError.context) {
          // Log context if available (might contain status code or response details)
          console.error("Function error context:", functionError.context) // Keep console.error
        }
        // --- Add More Detailed Logging --- END
        throw new Error(`Erreur Fonction (Invoke): ${functionError.message}`)
      }

      // --- Add Logging for Function Response --- START
      // console.log("Supabase function invocation successful. Raw data:", functionData) // Removed log
      // --- Add Logging for Function Response --- END

      type FunctionResponse = { success: boolean } | { error: string }
      const response = functionData as FunctionResponse

      // Check if the function itself returned a logical error in its JSON response
      if (response && typeof response === "object" && "error" in response && response.error) {
        throw new Error(`Erreur Fonction (Logic): ${response.error}`)
      }

      // Also check if the response indicates success explicitly if applicable
      if (!(response && typeof response === "object" && "success" in response && response.success)) {
        // Handle cases where the function completed (2xx) but didn't return the expected success structure
        console.warn("Function completed but response structure might not indicate success:", response) // Keep console.warn
        // Depending on function logic, you might still consider this a success or throw an error
        // For now, let's assume a 2xx without a specific {success: true} is okay, but log it.
        // If your function *must* return {success: true}, uncomment the throw below:
        // throw new Error("La fonction a retourné une réponse inattendue.");
      }

      toast.success(`Image pour la section "${uploadSection}" traitée avec succès!`)
      fetchImages() // Refresh the image list
    } catch (err) {
      let errorMessage = "Une erreur inconnue est survenue."
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === "string") {
        errorMessage = err
      }
      console.error("Upload or Function process failed:", err) // Keep console.error
      setError(`Échec: ${errorMessage}`)
      toast.error(`Échec: ${errorMessage}`)
    } finally {
      setUploading(false)
      setIsInvokingFunction(false)
      setUploadProgress(0)
      setSelectedFile(null)
      setUploadSection("")
      setUploadAltText("")
      const fileInput = document.getElementById("file-input") as HTMLInputElement | null
      if (fileInput) fileInput.value = ""
    }
  }

  const handleEditClick = (image: SiteImageData) => {
    setEditingImageId(image.id)
    setEditingAltText(image.alt_text || "")
  }

  const handleCancelEdit = () => {
    setEditingImageId(null)
    setEditingAltText("")
  }

  // Handle Text Edit Click
  const handleTextEditClick = (textSection: SectionTextData) => {
    setEditingTextId(textSection.id)
    setEditingContent(textSection.content || "")
  }

  // Handle Text Cancel Edit
  const handleTextCancelEdit = () => {
    setEditingTextId(null)
    setEditingContent("")
  }

  // Handle Text Save
  const handleSaveText = async (id: number) => {
    setIsSavingText(true)
    const success = await updateSectionText(id, editingContent)
    setIsSavingText(false)
    if (success) {
      toast.success("Texte de la section mis à jour.")
      setEditingTextId(null)
      setTextSections((prevSections) =>
        prevSections.map((sec) => (sec.id === id ? { ...sec, content: editingContent } : sec))
      )
    } else {
      toast.error("Erreur lors de la mise à jour du texte de la section.")
    }
  }

  const handleSaveAltText = async (id: number) => {
    setIsSavingAlt(true)
    try {
      await updateImageAltText(id, editingAltText)
      setImages((prevImages) => prevImages.map((img) => (img.id === id ? { ...img, alt_text: editingAltText } : img)))
      setEditingImageId(null)
      toast.success("Texte alternatif mis à jour avec succès !")
    } catch (err) {
      console.error("Failed to update alt text:", err)
      toast.error("Erreur lors de la mise à jour du texte alternatif.")
    } finally {
      setIsSavingAlt(false)
    }
  }

  const handleDeleteImage = async (imageId: number, imageUrl: string) => {
    // 1. Confirm with user
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.")) {
      return
    }

    setIsDeletingImageId(imageId) // Set loading state for this specific image
    setError(null) // Clear previous errors

    try {
      // 2. Extract section from URL (e.g., 'bebe-2' from '.../assets/bebe-2/...')
      const urlParts = imageUrl.split("/").filter(Boolean)
      const assetsIndex = urlParts.indexOf("assets")
      if (assetsIndex === -1 || assetsIndex + 1 >= urlParts.length) {
        throw new Error("Section introuvable dans l'URL de l'image.")
      }
      const section = urlParts[assetsIndex + 1] // e.g., 'bebe-2'

      // 3. Recursively list all files in the section folder
      const listAllFiles = async (bucket = "assets", section: string): Promise<string[]> => {
        const { data, error } = await supabase.storage.from(bucket).list(section, { limit: 1000 })

        if (error) {
          throw new Error(`Erreur lors du listage des fichiers : ${error.message}`)
        }

        return data.map((file) => `${section}/${file.name}`)
      }

      // 4. Chunk array for deletion to avoid API limits
      const chunkArray = (array, size) => {
        const result = []
        for (let i = 0; i < array.length; i += size) {
          result.push(array.slice(i, i + size))
        }
        return result
      }

      // 5. Delete all files in the section folder
      const filesToDelete = await listAllFiles("assets", section)

      if (filesToDelete.length > 0) {
        const chunkSize = 100 // Ajusté selon limites API
        const fileChunks = chunkArray(filesToDelete, chunkSize)

        for (const chunk of fileChunks) {
          const { error: storageError } = await supabase.storage.from("assets").remove(chunk)

          if (storageError) {
            throw new Error(`Erreur lors de la suppression des fichiers: ${storageError.message}`)
          }
        }
      }

      // 6. Delete database records for this section
      const { error: dbError } = await supabase.from("site_images").delete().eq("section", section)
      if (dbError) {
        throw new Error(`Erreur lors de la suppression des images de la base de données: ${dbError.message}`)
      }

      // 7. Refresh images by removing the deleted image from the local state
      setImages((prevImages) => prevImages.filter((img) => img.id !== imageId))

      // 8. Show toast
      toast.success("Image supprimée avec succès !")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue."
      console.error("Échec de la suppression de l'image:", err)
      setError(`Échec de la suppression de l'image: ${errorMessage}`)
      toast.error(`Échec de la suppression de l'image: ${errorMessage}`)
    } finally {
      setIsDeletingImageId(null) // Reset loading state
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      toast.success("Déconnexion réussie.")
      // The ProtectedRoute component will automatically detect the session change
      // and redirect to the Login component.
    } catch (err) {
      console.error("Logout failed:", err) // Keep console.error
      let errorMessage = "Échec de la déconnexion."
      if (err instanceof Error) {
        errorMessage = err.message
      }
      toast.error(errorMessage)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[url('https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/camera404.webp')] bg-cover bg-center">
      {/* New inner container for content */}
      <div className="sakura-container mx-auto px-4 py-12 pt-32">
        <div className="mb-6 flex items-center justify-end">
          <h1 className="mr-auto font-bad-script text-3xl font-bold -tracking-tighter text-white">
            Gestion des Images du Site
          </h1>
          <Button
            className="bg-white text-black shadow-md hover:bg-destructive/90 hover:!text-white hover:text-shadow-md"
            onClick={handleLogout}
            disabled={isLoggingOut}>
            {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
          </Button>
        </div>

        {/* Grid Layout for Cards */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Upload Card */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Uploader/Remplacer une Image</CardTitle>
              <CardDescription>Sélectionnez une image et la section où elle doit apparaître.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid w-full max-w-md items-center gap-2">
                <Label htmlFor="file-input" className="font-medium">
                  Image
                </Label>
                {/* Choisir un fichier / Aucun fichier choisi */}
                <Input
                  id="file-input"
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleFileChange}
                  disabled={uploading || isInvokingFunction}
                  className="h-13 cursor-pointer file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-sakura-pink file:px-4 file:py-2 file:text-sm file:font-semibold file:!text-white file:text-shadow-md hover:file:bg-opacity-90"
                />
              </div>
              <div className="grid w-full max-w-md items-center gap-2">
                <Label htmlFor="section-select" className="font-medium">
                  Section
                </Label>
                <Select
                  value={uploadSection}
                  onValueChange={setUploadSection}
                  disabled={uploading || isInvokingFunction}>
                  <SelectTrigger id="section-select" className="w-full">
                    <SelectValue placeholder="Choisir une section..." />
                  </SelectTrigger>
                  <SelectContent>
                    {VALID_SECTIONS.map((sec) => (
                      <SelectItem key={sec} value={sec}>
                        {sec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full max-w-md items-center gap-2">
                <Label htmlFor="alt-text-input" className="font-medium">
                  Texte Alternatif (pour SEO)
                </Label>
                <Textarea
                  id="alt-text-input"
                  placeholder="Description brève et utile de l'image..."
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  disabled={uploading || isInvokingFunction}
                  rows={3}
                />
              </div>
              {(uploading || isInvokingFunction) && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">
                    {isInvokingFunction ? "Traitement des données..." : "Progression de l'upload..."}
                  </Label>
                  <Progress value={uploading ? uploadProgress : 100} className="w-full" />
                </div>
              )}
              {error && <p className="pt-2 text-sm text-red-600">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button
                className={`bg-sakura-pink font-semibold !text-white text-shadow-md ${uploading || isInvokingFunction || !selectedFile || !uploadSection || isHashing || !generatedBlurhash || isOptimizing ? "bg-gray-400" : ""}`}
                onClick={handleUpload}
                disabled={
                  uploading ||
                  isInvokingFunction ||
                  !selectedFile ||
                  !uploadSection ||
                  isHashing ||
                  !generatedBlurhash ||
                  isOptimizing // Add isOptimizing
                }>
                {isHashing
                  ? "Chargement..."
                  : isOptimizing // New condition for optimizing
                    ? "Optimisation..."
                    : uploading || isInvokingFunction
                      ? "Traitement..."
                      : "Uploader l'Image"}
              </Button>
            </CardFooter>
          </Card>

          {/* Text Editing Card */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Modifier les Textes des Sections</CardTitle>
              <CardDescription>Mettez à jour le contenu des différentes sections du site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingText && <p className="text-center text-gray-500">Chargement des textes...</p>}
              {errorText && <p className="text-center text-sm text-red-600">{errorText}</p>}
              {!loadingText && textSections.length === 0 && (
                <p className="py-4 text-center text-gray-500">Aucune section de texte trouvée.</p>
              )}

              {/* Select Dropdown for Text Sections */}
              {!loadingText && textSections.length > 0 && (
                <div className="space-y-4">
                  <Label htmlFor="text-section-select" className="font-medium">
                    Sélectionner une section
                  </Label>
                  <Select value={selectedTextSectionId} onValueChange={setSelectedTextSectionId}>
                    <SelectTrigger id="text-section-select" className="w-full">
                      <SelectValue placeholder="Choisir une section..." />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Map over grouped sections */}
                      {Object.entries(groupedTextSections).map(([pageName, sectionsInGroup]) => (
                        <SelectGroup key={pageName}>
                          <SelectLabel className="font-semibold text-sakura-dark-text">{pageName}</SelectLabel>
                          {sectionsInGroup.map((section) => (
                            <SelectItem key={section.id} value={section.id.toString()} className="pl-8 capitalize">
                              {" "}
                              {/* Indent items slightly */}
                              {section.section} (ID: {section.id})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Display Area for Selected Section */}
                  {selectedTextSection && (
                    <div className="mt-4 rounded-md border p-4">
                      {editingTextId === selectedTextSection.id ? (
                        <div className="space-y-3">
                          <Label htmlFor={`textarea-${selectedTextSection.id}`} className="font-semibold capitalize">
                            Contenu pour &quot;{selectedTextSection.section}&quot;
                          </Label>
                          <Textarea
                            id={`textarea-${selectedTextSection.id}`}
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            placeholder="Contenu de la section..."
                            className="min-h-[200px] text-sm" // Increased min height for better editing
                            disabled={isSavingText}
                          />
                          <div className="flex justify-start gap-2 pt-2">
                            <Button
                              size="sm"
                              className="bg-white text-black shadow hover:bg-sakura-pink/90 hover:!text-white hover:text-shadow-md"
                              onClick={handleTextCancelEdit}
                              disabled={isSavingText}>
                              Annuler
                            </Button>
                            <Button
                              size="sm"
                              className="bg-sakura-pink text-black shadow hover:bg-sakura-pink/90 hover:!text-white hover:text-shadow-md"
                              onClick={() => handleSaveText(selectedTextSection.id)}
                              disabled={isSavingText}>
                              {isSavingText ? "Appl..." : "Appliquer"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Label className="font-semibold capitalize">
                            Contenu actuel pour &quot;{selectedTextSection.section}&quot;
                          </Label>
                          <p className="min-h-[60px] whitespace-pre-line rounded-md bg-gray-50 p-3 text-sm text-gray-600">
                            {selectedTextSection.content || <span className="italic text-gray-400">Vide</span>}
                          </p>
                          <div className="flex justify-end pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTextEditClick(selectedTextSection)}>
                              Modifier
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            {/* Optional CardFooter if needed */}
          </Card>
        </div>

        {/* Image Table - Now below the grid */}
        <h2 className="mb-6 mr-auto mt-12 font-bad-script text-3xl font-bold -tracking-tighter text-white">
          Images Actuelles
        </h2>
        {loading && <p className="text-center text-gray-500">Chargement des images...</p>}
        {!loading && images.length === 0 && <p className="py-4 text-center text-gray-500">Aucune image trouvée.</p>}
        {!loading && images.length > 0 && (
          <Card className="overflow-hidden shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] sm:w-[100px]">Aperçu</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Texte Alt</TableHead>
                      <TableHead className="hidden md:table-cell">Dimensions</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {images.map((image) => (
                      <TableRow key={image.id} className="hover:bg-gray-50">
                        <TableCell>
                          <img
                            src={image.image_url}
                            alt={image.alt_text || `Image ${image.section}`}
                            className="h-12 w-12 rounded border object-cover sm:h-16 sm:w-16"
                            loading="lazy"
                          />
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-medium text-gray-700">{image.section}</TableCell>
                        <TableCell className="min-w-[200px]">
                          {editingImageId === image.id ? (
                            <Textarea
                              value={editingAltText}
                              onChange={(e) => setEditingAltText(e.target.value)}
                              placeholder="Description..."
                              className="min-h-[60px] text-sm"
                              disabled={isSavingAlt}
                            />
                          ) : (
                            <span className="text-sm text-gray-600">
                              {image.alt_text || <span className="italic text-gray-400">Non défini</span>}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="hidden text-sm text-gray-500 md:table-cell">
                          {image.width && image.height ? `${image.width}x${image.height}` : "-"}
                        </TableCell>
                        <TableCell>
                          <a
                            href={image.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap text-sm text-blue-600 underline hover:text-blue-800">
                            Voir Fichier
                          </a>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right">
                          {editingImageId === image.id ? (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={handleCancelEdit} disabled={isSavingAlt}>
                                Annuler
                              </Button>
                              <Button size="sm" onClick={() => handleSaveAltText(image.id)} disabled={isSavingAlt}>
                                {isSavingAlt ? "Sauv..." : "Sauver"}
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                className="bg-white text-black shadow hover:bg-sakura-pink/90 hover:!text-white hover:text-shadow-md"
                                onClick={() => handleEditClick(image)}
                                disabled={isDeletingImageId === image.id}>
                                Modifier Alt
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive" // Destructive variant for delete button
                                onClick={() => handleDeleteImage(image.id, image.image_url)}
                                disabled={editingImageId === image.id || isDeletingImageId === image.id}
                                className="ml-2">
                                {isDeletingImageId === image.id ? "Suppr..." : "Supprimer"}
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Close inner container */}
    </div>
  )
}

export default AdminImages
