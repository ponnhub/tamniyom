import { Button, Stack } from "@mui/material"
import { useParams } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { Typography } from '@mui/material'
import Page from 'material-ui-shell/lib/containers/Page'
import React from 'react'
import { useIntl } from 'react-intl'
import { Box, maxWidth } from "@mui/system";

const ImageViewer = () => {
  const intl = useIntl()
  const { catid, productid, desc }  = useParams();
  

  console.log(catid);
  console.log(productid);
  console.log(desc);
    
  return (
    <img style={{ width: '100%' }}  src={`/assets/images/products/lg/${catid}/${productid}.jpg`} alt={desc} />
  )
}
export default ImageViewer

