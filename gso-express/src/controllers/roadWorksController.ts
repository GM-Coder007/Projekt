import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import RoadWorks from "../models/roadWorksModel";
import { Point } from "geojson";
import axios from "axios";
import { parseStringPromise } from "xml2js";

const {
  OK,
  CREATED,
  NO_CONTENT,
  NOT_FOUND,
  UNAUTHORIZED,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = StatusCodes;

/*function roadworksGet(req: Request, res: Response) {
  RoadWorks.find(function (err, roadWorks) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }

    return res.json(roadWorks);
  });
}*/
async function roadworksGet(req: Request, res: Response) {
  let roadworks;
  try {
    roadworks = await RoadWorks.find().exec();
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      msg: "Server error.",
    });
  }
  if (roadworks.length > 0) return res.json(roadworks);

  axios
    .get(
      "https://www.promet.si/dc/b2b.dogodki.rss?language=sl_SI&eventtype=incidents"
    )
    .then(async (response) => {
      const info = await parseStringPromise(response.data);
      let parsed: any = [];
      info.feed.entry.forEach((element: any) => {
        parsed.push({
          id: element.id[0],
          title: element.title[0],
          summary: element.summary[0],
          //type: element.category[0].$.term,
        });
      });
      return res.json({ roadworks: parsed });
    })
    .catch((error) => {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    });
}

function roadworksPost(req: Request, res: Response) {
  var roadWorks = new RoadWorks({
    title: req.body.title,
    summary: req.body.summary,
  });

  roadWorks.save(function (err, roadworks) {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        msg: "Server error.",
      });
    }
    return res.status(CREATED).json(roadworks);
  });
}

export default {
  roadworksGet,
  roadworksPost,
} as const;
