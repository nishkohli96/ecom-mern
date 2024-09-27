import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import AlgoliaConfig from 'constants/algolia-config';

interface QuantitySelectorProps {
  inStock: number;
  quantity: number;
  onQuantityChanged: (e: SelectChangeEvent) => void;
  isOnCartCard?: boolean;
}

const QuantitySelector = ({
  inStock,
  quantity,
  onQuantityChanged,
  isOnCartCard,
}: QuantitySelectorProps) => {
  const maxAllowedQuantity = Math.min(
    inStock,
    AlgoliaConfig.CONFIG.productPage.maxAllowedPurchase
  );
  const quantityArray = Array.from(
    { length: maxAllowedQuantity },
    (_, i) => i + 1
  );

  return (
    <Box sx={{ minWidth: 120, maxWidth: 300 }}>
      <FormControl fullWidth>
        <InputLabel id="quantity-label">Quantity</InputLabel>
        <Select
          labelId="quantity-label"
          id="quantity-selection"
          value={`${quantity}`}
          defaultValue="1"
          label="Quantity"
          sx={{
            ...(isOnCartCard && {
              '& .MuiInputBase-input': {
                padding: '5px 10px',
              },
            }),
          }}
          onChange={(event: SelectChangeEvent) => onQuantityChanged(event)}
        >
          {quantityArray.map(item => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default QuantitySelector;
