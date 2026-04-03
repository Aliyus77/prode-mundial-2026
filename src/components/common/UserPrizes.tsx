import React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import { usePrize } from "../../hooks/usePrize";

interface UserPrizesProps {
  userId: string;
  userName: string;
}

export const UserPrizes: React.FC<UserPrizesProps> = ({ userId, userName }) => {
  const { assignments, prizes } = usePrize();
  
  const userAssignments = assignments.filter(a => a.userId === userId);
  const userPrizes = userAssignments.map(assignment => {
    const prize = prizes.find(p => p.id === assignment.prizeId);
    return prize;
  }).filter(Boolean);

  if (userPrizes.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
        🏆 Premios Ganados:
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
        {userPrizes.map((prize) => (
          <Chip
            key={prize?.id}
            icon={<span>🏆</span>}
            label={prize?.name}
            color="primary"
            variant="outlined"
          />
        ))}
      </Stack>
    </Box>
  );
};
