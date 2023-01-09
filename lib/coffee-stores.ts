import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "",
  //...other fetch options
});

const getUrlForCoffeeStores = (searchParams: {}, limit: number) => {
  return `https://api.foursquare.com/v3/places/search?${searchParams}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 30,
  });
  const unsplashResults = photos.response?.results || [];
  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
  latlong = "41.8781,-87.6298",
  limit = "9"
) => {
  const photos = await getListOfCoffeeStorePhotos();
  const searchParams = new URLSearchParams({
    query: "coffee",
    ll: latlong,
    open_now: "true",
    sort: "DISTANCE",
  });

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY || "",
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(searchParams, +limit),
    options
  );
  const data = await response.json();
  return data.results.map(
    (
      result: {
        fsq_id: number;
        location: { address: string; neighborhood: string };
        name: string;
      },
      idx: number
    ) => {
      const {
        fsq_id,
        name,
        location: { neighborhood, address },
      } = result;
      return {
        id: fsq_id,
        address: address,
        name: name,
        neighborhood: neighborhood?.length > 0 ? neighborhood[0] : "",
        imgUrl: photos.length > 0 ? photos[idx] : null,
      };
    }
  );
};
