import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

export interface IDrive {
  _id: string;
  start: any;
  end: any;
  averageSpeed?: number;
  maxSpeed?: number;
  createdAt: string;
}

interface DriveProps {
  drive: IDrive;
}

const Drive: React.FC<DriveProps> = ({ drive }) => {
  const date = new Date(drive.createdAt);

  return (
    <Card>
      <CardContent>
        <Typography variant="body1" color="text.primary">
          {drive._id}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {drive.averageSpeed}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {drive.maxSpeed}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {date.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Drive;
