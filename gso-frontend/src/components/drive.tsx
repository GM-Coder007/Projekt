import { Card, CardContent, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DriveProps {
  id: string;
  averageSpeed?: number;
  maxSpeed?: number;
  createdAt: string;
}

const Drive: React.FC<DriveProps> = ({
  id,
  averageSpeed,
  maxSpeed,
  createdAt,
}) => {
  const navigation = useNavigate();

  const [vote, setVote] = useState(0);
  const [error, setError] = useState(null);

  const date = new Date(createdAt);

  return (
    <Card>
      <CardContent>
        <Typography variant="body1" color="text.primary">
          {id}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {averageSpeed}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {maxSpeed}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {date.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Drive;
