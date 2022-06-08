import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

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
  refreshRoadQuality: (id: string) => void;
  handleDelete: (id: string) => void;
}

const Drive: React.FC<DriveProps> = ({
  drive,
  refreshRoadQuality,
  handleDelete,
}) => {
  const date = new Date(drive.createdAt);

  function deleteDrive(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    handleDelete(drive._id);
  }

  return (
    <Card
      sx={{ mb: 2, cursor: "pointer" }}
      onClick={() => refreshRoadQuality(drive._id)}
    >
      <CardHeader
        title={drive._id}
        action={
          <IconButton
            aria-label="settings"
            sx={{ color: "red" }}
            onClick={deleteDrive}
          >
            <DeleteForeverIcon />
          </IconButton>
        }
      />
      <CardContent>
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
