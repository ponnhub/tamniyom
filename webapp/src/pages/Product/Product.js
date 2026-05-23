import { Button, Stack } from "@mui/material"
import { useParams } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { Typography } from '@mui/material'
import Page from 'material-ui-shell/lib/containers/Page'
import React from 'react'
import { useIntl } from 'react-intl'
import { Box, maxWidth } from "@mui/system";

const Product = () => {
  const intl = useIntl()
  const { catid, id }  = useParams();

  
    
  return (
    <Page pageTitle={intl.formatMessage({ id: 'product' })}>
      <Stack alignItems="center"  
            direction={'column'} sx={{p: 1, gap: 1}}>
       <img src={`/assets/images/products/${catid}-${id}.png`} alt="" />
       <Typography></Typography>
            <Button sx={{ maxWidth: 160 }} variant="contained" startIcon={<AddShoppingCartIcon />}>ใส่ในตะกร้า</Button>
       
      </Stack>
    </Page>
  )
}
export default Product

