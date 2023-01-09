import type { NextApiRequest, NextApiResponse } from "next";
import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from "../../utils/airtable";

const createCoffeeStore = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { id, name, neighborhood, address, imgUrl, voting } = req.body;

    try {
      if (id) {
        const findCoffeeStoreRecord = await findRecordByFilter(id);
        if (findCoffeeStoreRecord.length !== 0) {
          return res
            .status(200)
            .json({ success: true, data: findCoffeeStoreRecord });
        } else {
          // Create a Record
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighborhood,
                  voting,
                  imgUrl,
                },
              },
            ]);

            const records = getMinifiedRecords(createRecords);
            return res.status(201).json({ success: true, data: records });
          } else {
            return res
              .status(400)
              .json({ success: false, message: "Id or name is missing" });
          }
        }
      } else {
        return res.status(400).json({ message: "Id is missing" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: `Server error ${error}` });
    }
  }
  return res
    .status(405)
    .json({ success: false, message: "Request Method POST is required" });
};

export default createCoffeeStore;
