import { useEffect, useState } from "react";
import { db } from "../database/db";

interface Props {
  stockpileId: string;
}

export default function StockpilePhotos({
  stockpileId,
}: Props) {

  const [photos, setPhotos] =
    useState<any[]>([]);

  const [
    selectedPhoto,
    setSelectedPhoto,
  ] = useState("");

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {

    const data =
      await db.photos
        .where("stockpileId")
        .equals(stockpileId)
        .reverse()
        .toArray();

    setPhotos(data);
  };

  const addPhoto = async (
    file: File
  ) => {

    const reader =
      new FileReader();

    reader.onload =
      async () => {

        await db.photos.add({

          stockpileId,

          image:
            reader.result as string,

          createdAt:
            new Date().toISOString(),

          createdBy:
            localStorage.getItem(
              "currentUser"
            ) || "ismeretlen",

        });

        await loadPhotos();
      };

    reader.readAsDataURL(
      file
    );
  };

  const deletePhoto =
    async (
      id: number
    ) => {

      const confirmed =
        confirm(
          "Fotó törlése?"
        );

      if (!confirmed) {
        return;
      }

      await db.photos.delete(id);

      await loadPhotos();
    };

  return (

    <div>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {

          if (
            e.target.files &&
            e.target.files[0]
          ) {

            addPhoto(
              e.target.files[0]
            );
          }
        }}
      />

      <p
        style={{
          marginTop: "10px",
          color: "#9aa8b8",
        }}
      >
        Fotók száma:
        {" "}
        {photos.length}
      </p>

      <div
        style={{
          marginTop: "15px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(180px,1fr))",
          gap: "12px",
        }}
      >

        {photos.map(
          (photo) => (

          <div
            key={photo.id}
            className="card"
          >

            <img
              src={photo.image}
              alt="Rakat"
              style={{
                width: "100%",
                borderRadius:
                  "10px",
                cursor: "pointer",
              }}
              onClick={() =>
                setSelectedPhoto(
                  photo.image
                )
              }
            />

            <p>
              👤 {
                photo.createdBy ||
                "ismeretlen"
              }
            </p>

            <p
              style={{
                fontSize: "12px",
              }}
            >
              📅 {
                new Date(
                  photo.createdAt
                ).toLocaleString(
                  "hu-HU"
                )
              }
            </p>

            <button
              style={{
                marginTop: "10px",
                background:
                  "#b42318",
                height: "40px",
              }}
              onClick={() =>
                deletePhoto(
                  photo.id
                )
              }
            >
              🗑️ Törlés
            </button>

          </div>

        ))}

      </div>

      {selectedPhoto && (

        <div
          onClick={() =>
            setSelectedPhoto("")
          }
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "rgba(0,0,0,.9)",
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            zIndex: 9999,
          }}
        >

          <img
            src={selectedPhoto}
            alt="Nagyított"
            style={{
              maxWidth: "95%",
              maxHeight: "95%",
              borderRadius:
                "12px",
            }}
          />

        </div>

      )}

    </div>
  );
}