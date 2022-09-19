import { Box } from '@chakra-ui/react';
import React from 'react';
import MarkDocsList from '../components/mark/MarkDocsList';

const MarkSpec = () => {
  return (
    <Box p={6}>
      <MarkDocsList
        pasteMarkDoc={() => {}}
        onClose={() => {}}
        switching={false}
      />
    </Box>
  );
};

export default MarkSpec;
