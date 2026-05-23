import { Box, Button, Card, CardContent, CardMedia, IconButton, Stack, Typography } from '@mui/material'
import Page from 'material-ui-shell/lib/containers/Page'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom';
import { getApp } from "firebase/app"
import liff from '@line/liff';
import DBService from 'services/DBService';
var thaiBaht = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  currencySign: 'accounting'
})
const Order = () => {
  const intl = useIntl()
  const app = getApp()

  const db = new DBService()
  const [products, setProducts] = useState([]);

  const { customer_id } = useParams()

  function gettingStarted() {
    liff.sendMessages([{
        type: 'text',
        text: 'แคตตาล็อคสินค้า'
      }]).then(_ =>  liff.closeWindow())
  }

  useEffect(() => {
    if (!products.length) db.getCart(customer_id).then(products => {
      let items = Array.isArray(products) ? products : Object.values(products)
      // items = items.reduceRight((p, c) => {
      //   if (p.find(i => i.item.productid === c.productid)) p
      // }, items)
      setProducts(e => [...e, ...items])
    })
  });

  const productsCard = (obj) => {
    let {
      count,
      item: product
    } = obj
    return <Card sx={{ display: 'flex' }}>
    <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={`/assets/images/products/xs/${product.catid}/${product.productid}.jpg`}
        alt={[product.name, product.variant, product.description].join(" ") }
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography component="div" variant="h4">
          {product.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          {count + 'x ' + thaiBaht.format(product.aprice)}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" component="div">
          {thaiBaht.format(count * product.aprice)}
        </Typography>
      </CardContent>      
    </Box>
  </Card>
  }
  

  return (
    <Page pageTitle={intl.formatMessage({ id: 'Cart' })}>
      <Box sx={{ width: '100%', p: 2, g: 2 }}>
      <Stack spacing={2}>
        {products.length ? products.map(product => productsCard(product)) : 'ยังไม่มีสินค้าในตะกร้า'}
        <Button sx={{ width: '50%' }} variant="contained">ยืนยันส่งคำสั่งซื้อ</Button>
      </Stack>      
    </Box>
    </Page>
  )
}
export default Order
