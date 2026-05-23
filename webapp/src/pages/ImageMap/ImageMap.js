import { useParams } from 'react-router-dom';

import React from 'react'

const ImageMap = () => {
  const { size }  = useParams();
    
  return (<img src={`/assets/images/imagemap/promotion999.png`} alt="" />)
}
export default ImageMap

