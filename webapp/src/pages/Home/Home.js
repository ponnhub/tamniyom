import { Button, Typography } from '@mui/material'
import Page from 'material-ui-shell/lib/containers/Page'
import React from 'react'
import { useIntl } from 'react-intl'


import liff from '@line/liff';

const HomePage = () => {
  const intl = useIntl()

  function gettingStarted() {
    liff.sendMessages([{
        type: 'text',
        text: 'แคตตาล็อคสินค้า'
      }]).then(_ =>  liff.closeWindow())
  }
  

  return (
    <Page pageTitle={intl.formatMessage({ id: 'home' })}>
      <Button onClick={gettingStarted}เริ่มต้นใช้งาน></Button>
    </Page>
  )
}
export default HomePage
