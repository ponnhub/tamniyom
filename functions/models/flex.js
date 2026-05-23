const luxon = require("luxon")
luxon.Settings.defaultLocale = 'th';
luxon.Settings.defaultOutputCalendar = 'buddhist';

const DateTime = luxon.DateTime
const { assets } = require("../data/config/config");
const GoogleServices = require("../GoogleServices/GoogleServices");
const { productCategoriesQRP } = require("./payload")
const thaiNumer = new Intl.NumberFormat('th-TH', { maximumSignificantDigits: 2 })
const thaiBaht = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  currencySign: 'accounting'
})


class Flex {

  constructor(customer_id = '', user={}, translation = false, sourcelang = '', gs={}) {
    this.translation = translation
    this.sourcelang = sourcelang
    this.customer_id = customer_id
    this.user = user
    this.gs =  gs
  }

    /**    
     * @param {*} contents 
     * @param {String} altText 
     * @returns 
     */
    static flex = (contents, altText) => {
        return {
          type: 'flex',
          altText: altText || 'ตามนิยม',
          contents: contents
      }
    }

    static line_payload = (contents, params) => {
      let res = {
        line_payload: Array.isArray(contents) ? contents : [contents],
        response_type : 'object'
    }
    if (params) res = { ...res, ...params}
      return res
    }

    registration() {
      return Flex.flex({
        type: 'bubble',
        direction: 'ltr',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'ลงทะเบียนสมาชิก',
              align: 'center',
              contents: []
            }
          ]
        },
        hero: {
          type: 'image',
          url: assets.logo,
          size: 'full',
          aspectRatio: '1.51:1',
          aspectMode: 'fit'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'ใช้เพียงหมายเลขโทรศัพท์',
              align: 'center',
              wrap: true,
              contents: []
            },
            {
              type: 'button',
              action: {
                type: 'uri',
                label: 'ลงทะเบียน',
                uri: 'https://liff.line.me/1657071212-D1LxVWKg/phonesignup'
              },
              color: '#0096FFFF',
              style: 'primary'
            }
          ]
        }
      }, 'ลงทะเบียนด้วยเบอร์โทรศัพท์')
      
    }

    async usermenu() {

      let [hello, menu, productcatalog, translation] = await Promise.all(['สวัสดี', 'เมนู', 'หมวดหมู่สินค้า', 'แปล'].map(async word => {
        return this.translation 
        ? this.user.language 
          ? await this.gs.translate(word, {
          to: this.user.language,
          onlytext: true
        }) 
          : word
        : word
      }))
      
      return Flex.flex({
        type: 'bubble',
        direction: 'ltr',
        header: {
          type: 'box',
          layout: 'horizontal',
          spacing: 'lg',
          contents: [
            {
              type: 'box',
              layout: 'vertical',
              flex: 1,
              contents: [
                {
                  type: 'image',
                  url: assets.logo,
                  aspectMode: 'cover'
                }
              ]
            },
            {
              type: 'box',
              layout: 'vertical',
              flex: 3,
              borderWidth: '1px',
              backgroundColor: '#A5E5FF56',
              borderColor: '#B0D5FFFF',
              cornerRadius: '10px',
              contents: [
                {
                  type: 'filler'
                },
                {
                  type: 'text',
                  text: hello,
                  align: 'center',
                  gravity: 'center',
                  wrap: true,
                  contents: []
                },
                {
                  type: 'filler'
                }
              ]
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          offsetTop: '0px',
          paddingAll: '10px',
          contents: [
            {
              type: 'button',
              action: {
                type: 'message',
                label: productcatalog,
                text: 'menu'
              },
              color: '#0096FFFF',
              style: 'primary'
            },
            {
              type: 'button',
              action: {
                type: 'message',
                label: `translate/ ${translation !== 'translate' && translation}`,
                text: 'แปล'
              },
              color: '#0096FFFF',
              style: 'primary'
            }
          ]
        }
      }, menu)
    }

    /**
     * 
     * @param {[*]} products 
     */
    productCarousel(products) {
        let contents = {
            type: 'carousel',
            contents: products.map(product => this.productBubble(product, true)).slice(0, 10)
        }
        return [{
          type: 'flex',
          altText: 'แสดงสินค้าทั้งหมด',
          contents: contents
      }, productCategoriesQRP()]
      
      //Flex.flex(contents, 'แสดงสินค้าทั้งหมด')
        
    }

    productBubble(product, carousel) {

        let bubble = {
            type: 'bubble',
            direction: 'ltr',
            header: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: product.name || 'ชื่อสินค้า',
                  align: 'center',
                  contents: []
                }
              ]
            },
            hero: {
              type: 'image',
              url: product.pictureUrl || `https://tamniyombot65-eafd4.web.app/assets/images/products/xs/${product.catid}/${product.productid}.jpg`,
              size: 'full',
              aspectRatio: '1:1.2',
              aspectMode: 'cover',
              action: {
                type: 'uri',
                uri: `https://liff.line.me/1657071212-D1LxVWKg/imageviewer/${product.catid}/${product.productid}/desc`//${encodeURIComponent(`/${product.catid}/${product.productid}/${[product.name, product.variant, product.description].join(" ")}`)}`,                
              }
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: product.description || '-',
                  wrap: true,
                  align: 'center',
                  contents: []
                }
              ]
            },
            // footer: {
            //   type: 'box',
            //   layout: 'horizontal',
            //   contents: [
            //     {
            //       type: 'button',
            //       action: {
            //         type: 'uri',
            //         label: 'เพิ่มในตะกร้า',
            //         uri: 'https://liff.line.me/1657071212-D1LxVWKg'
            //       }
            //     }
            //   ]
            // }
          }
        return carousel ? bubble : {
          type: 'flex',
          altText: product.name || 'ตามนิยม',
          contents: bubble
      }
    }

    catalogsCarousel(categories) {
      let contents = {
        type: 'carousel',
        contents: categories.map(category => this.catalogBubble(category, true))
      }
      return Flex.flex(contents, 'แสดงหมวดหมู่ทั้งหมด')
    }

    catalogBubble(category, carousel) {
      let bubble = {
        type: 'bubble',
        direction: 'ltr',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: category.name || 'ชื่อหมวดหมู่',
              align: 'center',
              contents: []
            }
          ]
        },
        hero: {
          type: 'image',
          url: category.pictureUrl || assets.logo,
          size: 'full',
          aspectRatio: '1.51:1',
          aspectMode: 'fit'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: category.products ? `มี ${Object.entries(category.products).length} รายการ` : 'ไม่มีสินค้า',
              wrap: true,
              align: 'center',
              contents: []
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'button',
              action: {
                type: 'message',
                label: 'ดูหมวดนี้',
                text: category.name
              }
            }
          ]
        }
      }
    return carousel ? bubble : Flex.flex(bubble, category.name)
    }

    async cartmenu(products, updated, customer_id) {
      
      console.log(products);
      let payload = {
        type: 'bubble',
        direction: 'ltr',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'ตะกร้าสินค้า',
              align: 'center',
              contents: []
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          paddingAll: '10px',
          contents: [
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: products.map(({item: product, count}) => ({
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                paddingAll: '10px',
                backgroundColor: '#5BD0FF96',
                cornerRadius: '10px',
                contents: [
                  {
                    type: 'box',
                    layout: 'horizontal',
                    spacing: 'md',
                    contents: [
                      {
                        type: 'box',
                        layout: 'vertical',
                        paddingAll: '0px',
                        width: '40px',
                        contents: [
                          {
                            type: 'filler'
                          },
                          {
                            type: 'image',
                            url: product.pictureUrl || `https://tamniyombot65-eafd4.web.app/assets/images/products/xs/${product.catid}/${product.productid}.jpg`,
                            align: 'center',
                            gravity: 'center',
                            aspectMode: 'cover'
                          },
                          {
                            type: 'filler'
                          }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'vertical',
                        spacing: 'sm',
                        contents: [
                          {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                              {
                                type: 'text',
                                text: [product.name, product.variant, product.description].join(" "),
                                size: 'sm',
                                flex: 9,
                                wrap: true,
                                contents: []
                              }
                            ]
                          },
                          {
                            type: 'separator',
                            color: '#7D7D7DFF'
                          },
                          {
                            type: 'box',
                            layout: 'horizontal',
                            spacing: 'xs',
                            contents: [
                              {
                                type: 'text',
                                text: `${count}x`,
                                weight: 'bold',
                                size: 'xs',
                                flex: 1,
                                align: 'end',
                                contents: []
                              },
                              {
                                type: 'text',
                                text: `${thaiNumer.format(product.aprice)}`,
                                size: 'xs',
                                flex: 2,
                                contents: []
                              },
                              {
                                type: 'text',
                                text: '=',
                                size: 'xs',
                                flex: 1,
                                contents: []
                              },
                              {
                                type: 'text',
                                text: (count && product.aprice) ? `${thaiBaht.format(count * product.aprice)}` : '-',
                                weight: 'bold',
                                size: 'xs',
                                flex: 5,
                                align: 'end',
                                contents: []
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }))
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#2689daff',
              action: {
                type: 'uri',
                label: this.translation ? await this.gs.translate('ดูรายละเอียด & ส่งคำสั่งซื้อ', { to: this.sourcelang, onlytext : true}) : 'ดูรายละเอียด & ส่งคำสั่งซื้อ',
                uri: `https://liff.line.me/1657071212-D1LxVWKg/cart/${customer_id}`
              }
            },
            {
              type: 'text',
              text: `ข้อมูลตะกร้าเมื่อ ${DateTime.fromMillis(updated).setZone('Asia/Bangkok').toLocaleString(DateTime.DATETIME_SHORT)}`,
              size: 'xxs',            
              align: 'center',
              flex: 2,
              contents: []
            }            
          ]
        }
      }

      console.log(JSON.stringify(payload));
      return payload
      
    }

    

    imageMap() {
      return         {
        type: 'imagemap',
        baseUrl: 'https://tamniyombot65-eafd4.web.app/assets/images/products/promotion999.png',
        altText: 'This is an imagemap',
        baseSize: {
          width: 300,
          height: 280
        },
        actions: [
          {
            type: 'uri',
            area: {
              x: 13,
              y: 65,
              width: 74,
              height: 80
            },
            linkUri: 'https://tamniyombot65-eafd4.web.app/product/40/405'
          },
          {
            type: 'uri',
            area: {
              x: 91,
              y: 94,
              width: 77,
              height: 54
            },
            linkUri: 'https://tamniyombot65-eafd4.web.app/product/70/703'
          },
          {
            type: 'uri',
            area: {
              x: 185,
              y: 65,
              width: 103,
              height: 95
            },
            linkUri: 'https://tamniyombot65-eafd4.web.app/product/10/101'
          },
          {
            type: 'uri',
            area: {
              x: 36,
              y: 158,
              width: 110,
              height: 107
            },
            linkUri: 'https://tamniyombot65-eafd4.web.app/product/10/103'
          },
          {
            type: 'uri',
            area: {
              x: 166,
              y: 174,
              width: 119,
              height: 89
            },
            linkUri: 'https://tamniyombot65-eafd4.web.app/product/20/206'
          }
        ]
      }
    }

}

module.exports = Flex