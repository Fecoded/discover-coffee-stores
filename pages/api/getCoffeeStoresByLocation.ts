// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchCoffeeStores } from "../../lib/coffee-stores";

// type Data = {
//   message: string;
// };

const getCoffeeStoresByLocation = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { latlong, limit } = req.query;
    if (typeof latlong === "string" && typeof limit === "string") {
      const response = await fetchCoffeeStores(latlong, limit);
      return res
        .status(200)
        .json({ success: true, count: response.length, data: response });
    }
    return res.status(200).json({ data: [] });
  } catch (err) {
    console.error("There is an error", err);
    return res
      .status(500)
      .json({ message: "Oh no! Something went wrong", err });
  }
};

export default getCoffeeStoresByLocation;
