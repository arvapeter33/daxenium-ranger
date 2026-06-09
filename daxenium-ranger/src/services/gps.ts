export const getCurrentLocation = () =>
  new Promise<GeolocationPosition>(
    (resolve, reject) => {

      if (!navigator.geolocation) {

        reject("GPS nem elérhető");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 15000,
        }
      );
    }
  );