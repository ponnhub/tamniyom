const functions = require("firebase-functions");
const axios = require('axios');
const admin = require('firebase-admin');
const PROJECT_ID = 'tamniyombot65-eafd4'
const saCredentials = require('./tamniyombot65-eafd4-3001b99b196d.json')
const Payload = require("./models/payload");

const express = require('express');
const cors = require('cors');
const os = require('os');
const md5 = require('md5');
const luxon = require("luxon")
luxon.Settings.defaultLocale = 'th';
luxon.Settings.defaultOutputCalendar = 'buddhist';

const Flex = require("./models/flex");
const { FB_PATH, ENTITIES, PRODUCT_UNIQUE_KEYS, ITEMS_COUNTS_IN_CAROUSEL, KEYS, assets } = require("./data/config/config");
const { compareObjByKeys } = require("./data/utils/utils");
const { line_payload } = require("./models/flex");
const GoogleServices = require("./GoogleServices/GoogleServices");
const flex = new Flex()
const payload = new Payload()
const {
    Translate
} = require('@google-cloud/translate').v2;

const app = express();

const DateTime = luxon.DateTime

//firebase
//SWITCH to false prior deployment
const firebaseLocal = os.hostname() != 'localhost'; // it's localhost on Firebase
console.log(`probably recheck if os.hostname() != 'localhost' (${os.hostname()}) and webhook URL https://ngrok/tamniyombot65-eafd4/us-central1/firebasehook`);


if (firebaseLocal) {
    const adminServiceAccountPrivatekey = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDInpv5EYiZFp+D\ntvmGdTrOCYZVuW8za+t+wdXJ99wWvPNwYaDX5Brw2fdRBrP0IluY3ufImiepjChC\ncQpNsXd4ETZuC8GOA8SWMovkJtCWe/ZzvBZ5ixL8Kw1sNr0Xu1ABTy18SffQs9n8\nyaWdZJDyNE5aJSXFOYOkEph9fOcd6WeNptHbXXzHnQnLQrN92Lt/vZ177R99z3YJ\nqUcrl5yETaMgfv28vx4ztBqP08IckixAngFR0GwkvzpAyWAKgV7inMNHIs22/8vq\nx3MACb1WMytdDALbEFoY/+UOohxV6muMrZIXPM/aVcuiYXETI3aPxLuNooSB1qf+\n379KkrJVAgMBAAECggEAAdeQ+4+5Zxxx0QIKVv13EYK9YMaf2oNEaYjKl3zm4K+R\n9adz1F+kDq+VqYEMAHMbT7NGQg2GTTR7/yYuD8oQHIJd81M4zv7CXJWwuqLPmf4f\n5G6m7y1DepzDlgmHoXLnGGf7dS9xrtEj8IICewg8G3k2+fVq3B1707MXAtn1fk0M\n6Pu9nSkuPb/ufIsPeIykQF9lzNHwRwtuV/V9yxJrMJSgiA6DadKiuHhRYtB2LTe8\ntb5knqD/6Wk6SnhbAOhtviQUTI+fR91vscrW9F13TLHKDH+8gor9GAUdaT0exfsb\nGwPg3y3fZ37GQ5ZYn43vsL4xzGp6f9gqRCGpO2FMsQKBgQD2Y8hHVezEb+yW7134\nIJDfRHjBD8CkYJWi88h3yrwVZeHkGbj0Vuyqgg22+57eLiPVsNWeKQVp5A0xwZA0\no+3eWo83YTOuXjRAq40x/sf1ViO+1KBNAS//13rzsB3cpPBubChSFBBHwIj52gxx\nxoSNc+SAyRjLXJYzyJPUjTKC0QKBgQDQcc74v5ktXUCsg890YL4bZrSRdHlxBHZj\nkHiUbg/ZptkIcMq6qEYmOLTO8VVVOyaUCzgDbd+7I2NZkBJcUacdKjdDhB6f7/EP\n/Spoe36MDaLWPCXvzYolSWhBhJQydcmPUNAsT9v7+qr+gtWZWIHgoWb3LzO3hOcR\nR+BXoZpwRQKBgH/lbdnxtVSGkLYMjKe3J9xta40zwxjQdfw/NUlReG5XE3nXDFXx\nJSqhFcNtO5szMjDDeS9/Nasw0NSKGHPqwBfSxFLH5w7VIaSMKF/SVDN6wlVVg9xV\nCHhyfwUt32JgT9nR1OA+P/Eu9StUz27j0Hyosu1S9cbiSamZrXsAzD5xAoGBAKl6\nv5QVBNCTr9AU5Ap11lylJ0/U6iDwReoyPzhAPPb06CYqv0sBIvhUxv4zzvQbwgRB\nEuwG3BBmd5MMx0D0yvG1r3Vf6R6VkuUzLNYDAyOQusOB6D6QWjBy/Se4Sl600ouK\nY5iD3hOE/p8tdcrW4dLoqLV2VZBzqQSt8kSOCuoZAoGAaNoHQ2ewpe+WmS7gTI+l\nFqPM6RumS218ArDId39rNVakISLWdLl9Zj5cSjTBIBxXe005gTxpqo2Cwy+1KcJR\nUcyfhSdgpsWEIl5P+qbYb8FXlUm6qy4Daa78k9rDXAxtQaDxTjM59JjzyUW/E5RW\npxPNKCwMBHlg2v9ykp+/z5Q=\n-----END PRIVATE KEY-----\n';
    const adminServiceAccountClientEmail = 'firebase-adminsdk-8eann@tamniyombot65-eafd4.iam.gserviceaccount.com';

    //local
    admin.initializeApp({
        databaseURL: `http://localhost:9000/?ns=${PROJECT_ID}-default-rtdb`, //http://localhost:9000/?ns=tamniyombot65-eafd4-default-rtdb
        credential: admin.credential.cert({
            projectId: PROJECT_ID,
            clientEmail: adminServiceAccountClientEmail,
            privateKey: adminServiceAccountPrivatekey
        })
    });
    // // END
} else {
    //server
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: `https://tamniyombot65-eafd4-default-rtdb.asia-southeast1.firebasedatabase.app`
    });
    //END
}

//server
// admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//     databaseURL: 'http://localhost:9000/?ns=tamniyombot65-eafd4' //'https://rtafsandbox.firebaseio.com/'
//   });
  //END
  // }
const ROOT_REF = admin.database().ref('line-bot');

//Allow all requests from all domains & localhost
// app.all('/*', function (req, res, next) {
//     // console.log(res);
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", "POST, GET");
//     next();
// });


//ui setup
var thaiBaht = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    currencySign: 'accounting'
})

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

app.all('/admin', (req, res, next) => {
    console.log('checking auth');
    next()
})

// app.get('/test/:size/:firstmax/:offset', (req, res) => {
//     res.send(ITEMS_COUNTS_IN_CAROUSEL(req.params.size, req.params.firstmax, req.params.offset))
// })

app.post('/*', async (req, res, next) => {

    //dev
    // return next()

    console.log(req.path);
    console.log(req.originalUrl);
    console.log('updating user');

    let customer_id = req.body.customer_id//.split('-').pop()
    let bn_userId = md5(customer_id)
    res.locals.customer_id = bn_userId

    flex.customer_id = bn_userId
    payload.customer_id = bn_userId


    console.log(bn_userId);


    if ([req.path, req.originalUrl].some(i => i === '/phoneuser')) return next()

    if (!bn_userId) return res.send(payload.textResponse('no botnoi user id found'))

    let user = {
        customer_id: customer_id,
        displayName: req.body.p_display_name,
        pictureUrl: req.body.p_profile_img_url
    }

    flex.user = user
    payload.user = user
    let gs = new GoogleServices(user)
    flex.gs = gs
    payload.gs = gs

    await ROOT_REF.child('users').child(bn_userId).once('value', snapshot => {
        if (snapshot.exists()) {
            let lineProfile = snapshot.val()

            let val = lineProfile.translate
            let lang = lineProfile.language

            res.locals.translate = val
            flex.translation = val
            payload.translation = val

            res.locals.language = lang
            flex.sourcelang = lang
            payload.sourcelang = lang

        }
    })
    return ROOT_REF.child('users').child(bn_userId).update(user).then(r => {
        console.log(r);
        res.locals.privileged = true
        console.log(req.body)
        next()
    })
})

app.get('/admin/initdata', (req, res) => {

    ROOT_REF.child(FB_PATH.products).once('value').then(async snapshot => {
        if (!snapshot.exists()) {
            let products = require('./data/products.json')
            ROOT_REF.child(FB_PATH.products).set(products.map(product => ({
                ...product,
                freetext: [product.name.trim(), product.variant.trim(), product.description.trim()].join(" ")
            })))

            let entities = []
            Object.keys(ENTITIES).map(key => entities[key] = [])

            console.log(entities);

            await Promise.all(products.map(async product => {

                //save products in category
                let ref = ROOT_REF.child(FB_PATH.categories).child(product.catid)
                ref.child('name').set(product.catname)
                ref.child('products').push().set(product)

                //collect entities
                Object.entries(ENTITIES).map(([key, value]) => {

                    // บางค่า เป็นค่าผสม เช่น entities สำหรับช่วยในการค้นหาผลิตภัณฑ์
                    let values
                    switch (key) {
                        case ENTITIES.productvariants:
                            var name = [product.name.trim(), product.variant.trim(), product.description.trim()].join(" ").trim()
                            values = {
                                name: name,
                                id: product.productid,
                                catid: product.catid
                            }
                            break;
                        default:
                            values = product[value].trim()
                            break;
                    }

                    //ถ่้าค่าไม่ว่างเปล่า
                    if (values) entities[key] = [ ...entities[key], values]

                })
            }))

            await Promise.all(Object.keys(ENTITIES).map(key => {
                let unique = [...new Set(entities[key])];
                console.log(unique);
                ROOT_REF.child('entities').child(key).set(unique)
            }))

            let productWithVariants = products.reduce((p, c) => {
                let index = -1
                if (Array.isArray(p)) index = p.findIndex(i => compareObjByKeys(i, c, PRODUCT_UNIQUE_KEYS))
                console.log(index);
                if (index > -1) {
                    p[index]['variants'] = [...p[index]['variants'], c.variant]
                    p[index]['memberprices'] = [...p[index]['memberprices'], c.memberprice]
                    p[index]['aprices'] = [...p[index]['aprices'], c.aprice]
                    return p
                } else {
                    let {
                        catid,
                        name,
                        catname,
                        description
                    } = c
                    let value = {
                        catid,
                        name,
                        catname,
                        description,
                        variants: c.variant.trim() ? [c.variant]  : [],
                        memberprices: [c.memberprice],
                        aprices : [c.aprice]
                    }
                    if (Array.isArray(p)) {
                        return [...p, value]
                    } else {
                        return [value]
                    }
                }
            },[])

            ROOT_REF.child('productWithVariants').set(productWithVariants)

            console.log(productWithVariants);

            // console.log(entities);
            res.send('ok')

        } else {
            res.send('existed')
        }
    })

})

app.get('/hello', async (request, response) => {
//     console.log('====================================');
//     console.log(request.headers.test);
//     console.log('====================================');
//     console.log('====================================');
//     console.log(request.query);
//     console.log('====================================');
//   functions.logger.info("Hello logs!", {structuredData: true});
  response.send(await payload.textResponse(`สวัสดีจาก 'ตามนิยม'`));
});

app.get('/cancel', (req, res) => {
    console.log('cancelling');
    res.end()

})

async function getVariants(freetext, ) {
    return new Promise(async (resolve, _) => {

        await ROOT_REF.child(FB_PATH.productWithVariants).orderByChild('catname').equalTo(freetext).once('value', snapshot => {
            let results = snapshot.val()
            console.log(snapshot.numChildren());

            results = Array.isArray(results) ? results : results ? Object.values(results) : []
            resolve(results)

        })
    })
}

async function getProductsInCategory(freetext) {
    return new Promise(async (resolve, _) => {
        await ROOT_REF.child('categories').orderByChild('name').equalTo(freetext).once('value' , snapshot => {

            console.log(snapshot.val());

            if (!snapshot.exists()) resolve([])

            let result =  snapshot.val()
            result = Array.isArray(result) ? result : result ? Object.values(result) : []
            resolve(result)
        })
    })
}

async function getProductsOfVariantInCategory(variant, category, product, description) {

    if (!category) {
        return []
    }
    return new Promise(async (resolve, _) => {

        let ref = ROOT_REF.child(FB_PATH.products).orderByChild('catname').equalTo(category)

        if (description) {
            ref = ROOT_REF.child(FB_PATH.products).orderByChild('description').startAt(`%${description}%`)
            .endAt(description+"\uf8ff")//.equalTo(description)
        } else if (variant) {
            ref = ROOT_REF.child(FB_PATH.products).orderByChild('variant').equalTo(variant)
        }

        await ref.once('value' , snapshot => {

            // console.log(snapshot.val());

            if (!snapshot.exists()) resolve([])

            let result =  snapshot.val()
            console.log(variant);
            console.log(category);
            console.log(product);
            console.log(description);

            result = Array.isArray(result) ? result : result ? Object.values(result) : []

            console.log(`found ${result.length}`);

            if (variant) result = result.filter(r => r.variant.trim().toLowerCase() === variant.trim().toLowerCase())
            if (product) result = result.filter(r => r.name.trim().toLowerCase() === product.trim().toLowerCase())
            if (description) result = result.filter(r => r.description.trim().toLowerCase() === description.trim().toLowerCase())
            resolve(result)

        })
    })
}

//POST
app.post('/phoneuser', async (req, res) => {

    let user = req.body;

    ROOT_REF.child('users').orderByValue('displayName').equalTo(user.displayName).limitToFirst(1).once('value' ,snapshot => {
        if (!snapshot.exists()) {
            return res.send(null)

        }
        let user = snapshot.val()
        ROOT_REF.child('users').child(user.bn_userId).update(user).then(r => {
            console.log(r);
            res.send(user.bn_userId)
        })


    })

    // try {
    //     const result = await pool.query(`INSERT INTO users (phoneNumber, uid, providerData) VALUES (?, ?, ?)
    //     ON DUPLICATE KEY UPDATE uid='${user.uid}', providerData='${JSON.stringify(user.providerData)}'`, [user.phoneNumber, user.uid, JSON.stringify(user.providerData)]);
    //     // console.log(JSON.stringify(result));
    //     res.send(result);
    // } catch (err) {
    //     res.send(err)
    //     throw err;
    // }
});

app.post('/usermenu', async (req, res) => {
    return res.send(line_payload(await flex.usermenu()))
})

app.post('/slotfilling/:entity', (req, res) => {


    let { customer_id, p_channel, p_display_name, p_intent } = req.body

    customer_id = md5(customer_id)
    let cartdata = {}

    ROOT_REF.child('users').child(customer_id).child('cartdata').once('value', async snapshot => {

        console.log(req.body);


        let entity = req.params.entity
        let freetext = req.body.freetext

        if (snapshot.exists()) cartdata = snapshot.val() || {}
        let { catname , product, description, variant, count } = cartdata

        console.log(entity);
        console.log(freetext);
        console.log(cartdata);

        let text = 'ไม่พบสินค้าหมวดนี้ครับ'
        let prop = 'name'
        switch (entity) {

            case 'add':

            if (isNaN(freetext)) return res.send(payload.textResponse('ช่วยระบุจำนวนเป็นตัวเลขด้วยครับ'))
                return ROOT_REF.child('users').child(customer_id).child('cartdata').once('value', async snapshot => {
                    console.log(snapshot.val());
                    //save to db

                    let orderDetails = snapshot.val()
                    if (!orderDetails) return res.send(payload.textResponse('ช่วยระบุข้อมูลข้างต้นให้ครบก่อนครับ'))
                    let product = {
                        item: orderDetails.selected,
                        count: freetext,
                        date: Date.now()
                    }
                    await ROOT_REF.child('users').child(customer_id).child('cart').push().set(product)
                    ROOT_REF.child('users').child(customer_id).child('cartdata').set(null)
                    return ROOT_REF.child('users').child(customer_id).child('cart').once('value', async snapshot => {
                        if (!snapshot.exists()) {
                            return res.send(await payload.textResponse('ไม่พบสินค้าในตะกร้า'))
                        }
                        let cartedProducts = snapshot.val()
                        cartedProducts = Array.isArray(cartedProducts) ? cartedProducts  : cartedProducts ? Object.values(cartedProducts) : []


                        let [a, p] = cartedProducts.reduce((p, c) => {
                            p[0] += Number(c.count)
                            p[1] += c.count * ((c.item.memberprice && res.locals.privileged) ? c.item.memberprice : c.item.aprice)
                            return p
                        }, [0, 0])
                        let cartInfo = a ? ' มีสินค้าในตะกร้า ' + `${a} ชิ้น ราคารวม ${thaiBaht.format(p)}` + (res.locals.privileged ? ' เป็นราคาลดพิเศษแล้วครับ' : '') : ''

                        res.send(line_payload([await payload.QRPTemplate({
                            title: 'เรียบร้อย' + cartInfo,
                            labels: [{
                                label: 'ดูสินค้าอื่นๆ',
                                text: res.locals.translate ? 'Menu' : 'แคตตาล็อคสินค้า'
                            }, 'ดูตะกร้า', 'ส่งคำสั่งซื้อ']
                        })]))
                    })


                })

            case 'category':

                //either variants or description + others if no variants found

                cartdata = {
                    catname : freetext
                }
                catname = freetext
                break


            case 'variant':
                cartdata.variant = freetext
                variant = freetext
                text = 'ช่วยบอกรายละเอียดเพิ่มเติมหน่อยครับว่าเป็นแบบใด'
                prop = 'description'
                break

            case 'product':
                cartdata.product = freetext
                product = freetext
                prop = 'description'
                text = 'สนใจสินค้าชิ้นไหนครับ'
                break

            case 'description':
                cartdata.description = freetext
                description = freetext
                text = 'สนใจสินค้าชิ้นไหนครับ'
                break

            default:
                break
        }

        if (entity === 'category') {


            return getVariants(freetext).then( async results => {

                console.log(snapshot.numChildren());

                console.log(results);

                let variants = results ? results.reduce((p, c) => {
                    return c.variants ? [...p, ...c.variants] : p

                }, []) : []

                let text = variants.length
                ? `เรามีสินค้าในหมวดหมู่ "${freetext}" มีหลายขนาด เช่น ${results
                    .filter(r => r.variants)
                    .map(r => [[r.name, r.description,'ขนาด'].join(" "), r.variants.join(", ")].join(" ")).join(" หรือ ")}`
                : ''

                if (text) {
                    ROOT_REF.child('users').child(customer_id).child('cartdata').set(cartdata)
                    res.send(line_payload(await payload.QRPTemplate({
                        title: text,
                        labels: ['ยกเลิก', ...new Set(variants)]
                    })))
                } else {

                    getProductsInCategory(freetext).then(async results => {

                        if (!results.length) return res.send(payload.textResponse(text))
                        // let result =  snapshot.val()

                        console.log(results);

                        let category = Object.values(results).shift()
                        console.log(category);

                        let products = Object.values(category.products)
                        // console.log(products);
                        if (products.length) {
                            ROOT_REF.child('users').child(customer_id).child('cartdata').set(cartdata)
                            return res.send(line_payload(await payload.QRPTemplate({
                                title: 'ดูสินค้าชิ้นไหนดีครับ',
                                labels: ['ยกเลิก',...products.map(p => p.name)]
                            })))
                        } else {
                            return res.send(await payload.textResponse('ไม่พบสินค้าในหมวดหมู่นี้'))
                        }

                    })
                }
            })
        } else {


            return getProductsOfVariantInCategory(variant, catname, product, description).then(async results => {

                if (results.length) {

                    ROOT_REF.child('users').child(customer_id).child('cartdata').set(cartdata)

                    // found it!
                    if (results.length === 1) {
                        //ROOT_REF.child('users').child(customer_id).child('cartdata').set(null)

                        let product = results.shift()
                        cartdata.selected = product
                        ROOT_REF.child('users').child(customer_id).child('cartdata').set(cartdata)

                        let priceinfo = 'ราคาชิ้นละ ' + thaiBaht.format(product.aprice)
                        if (product.memberprice && res.locals.privileged) priceinfo = `สำหรับท่านราคาพิเศษ ${thaiBaht.format(product.memberprice)} จากปกติชิ้นละ ` + thaiBaht.format(product.aprice)
                        res.send(line_payload([flex.productBubble(product, false), await payload.QRPTemplate({
                            labels: ['ยกเลิก', ...Array.from(Array(10).keys()).map(i => `${i+1}`)],
                            title: `${priceinfo} ซื้อกี่ชิ้นดีครับ`
                        })]))

                    } else {

                        res.send(line_payload(await payload.QRPTemplate({
                            title: text,
                            labels: ['ยกเลิก', ...results.map(r => r[prop])]
                        })))
                        //res.send(line_payload(payload.messagesQRP(['ยกเลิก', ...results.map(r => r[prop])], text)))
                    }
                } else {
                    res.send(payload.textResponse('ไม่มีสินค้าแสดง'))
                }
            })

        }
    })




})

app.post('/freetextsearch', (req, res) => {



    let freetext = req.body.freetext
    let customer_id = req.body.customer_id
    customer_id = md5(customer_id)

    ROOT_REF.child(FB_PATH.products).orderByChild('freetext').once('value', async snapshot => { // this works only starting word: .startAt(freetext).endAt(freetext+"\uf8ff")

        await ROOT_REF.child('users').child(customer_id).child('cartdata').set(null)
        let notfoundText = 'ไม่พบสินค้าที่ใกล้เคียงครับ ลองใช้ตัวเลือกจากเมนูนะครับ'
        if (!snapshot.exists()) return res.send(payload.textResponse(notfoundText))

        let products = snapshot.val()
        products = Array.isArray(products) ? products : products ? Object.values(products) : []

            // string similarity
        var stringSimilarity = require("string-similarity");

        // var similarity = stringSimilarity.compareTwoStrings("healed", "sealed");

        var matches = stringSimilarity.findBestMatch(freetext, products.map(p => p.freetext));

        // console.log(matches);

        let bestMatches = [matches.bestMatch]
        let betterMatches = matches.ratings.filter(m => m.rating > 0)
        let containedMatch = matches.ratings.filter(m => m.target.includes(freetext) && m.rating > 0)


        // console.log(bestMatches);
        // console.log(betterMatches);
        // console.log(containedMatch);

        let usableMatches = containedMatch.length ? containedMatch : betterMatches.length ? betterMatches : bestMatches

        let selectedProducts = products.filter(p => usableMatches.map(m => m.target.trim()).includes(p.freetext.trim()))

        let cartdata =  await (await ROOT_REF.child('users').child(customer_id).child('cartdata').once('value')).val()

        if (cartdata) {
            Object.entries(cartdata).forEach(([k, v]) => {
                console.log(k);
                console.log(v);
                selectedProducts = selectedProducts.filter(p => p[k] === v)
            });
        }

        console.log(selectedProducts.length);
        if (!selectedProducts.length) usableMatches = betterMatches
        res.send(line_payload(await payload.QRPTemplate({
            labels: selectedProducts.slice(0, 13).map(p => ({
                label: p.freetext,
                text: 'ดูสินค้า ' + p.freetext.trim()
            })),
            title: 'พบสินค้าต่อไปนี้ครับ'
        })))
    })
})

app.post('/bestmatch', (req, res) => {

    let bestmatch = req.body.freetext.split('ดูสินค้า ').pop()

    console.log(bestmatch);



    ROOT_REF.child(FB_PATH.products).orderByChild('freetext').equalTo(bestmatch).once('value', async snapshot => {
        let notfoundText = 'ไม่พบสินค้าที่ใกล้เคียงครับ ลองใช้ตัวเลือกจากเมนูนะครับ'
        if (!snapshot.exists()) return res.send(payload.textResponse(notfoundText))

        let products = snapshot.val()
        products = Array.isArray(products) ? products : products ? Object.values(products) : []
        let product = products.shift() || {}
        if (product) {

            let customer_id = req.body.customer_id
            customer_id = md5(customer_id)

            ROOT_REF.child('users').child(customer_id).child('cartdata').child('selected').set(product)

            let priceinfo = 'ราคาชิ้นละ ' + thaiBaht.format(product.aprice)
            if (product.memberprice && res.locals.privileged) priceinfo = `สำหรับท่านราคาพิเศษ ${thaiBaht.format(product.memberprice)} จากปกติชิ้นละ ` + thaiBaht.format(product.aprice)

            res.send(line_payload([flex.productBubble(product, false), await payload.QRPTemplate({
                labels: ['ยกเลิก', ...Array.from(Array(10).keys()).map(i => `${i+1}`)],
                title: `${priceinfo} ซื้อกี่ชิ้นดีครับ`
            })]))
        } else {
            res.send(payload.textResponse(notfoundText))
        }
    })

})

app.post('/toggletranslate', (req, res) => {

    let customer_id = req.body.customer_id
    let translation = req.body.translation.toLowerCase()
    customer_id = md5(customer_id)

    ROOT_REF.child('users').child(customer_id).once('value', async snapshot => {

        let user = snapshot.val()
        let beingTranslated = user.translate
        let language = user.language

        switch (translation) {
            case 'แปล':
            case 'translate':
            case 'start translation':
            case 'translation':
            case KEYS.start_translating:
                if (beingTranslated) {
                    return res.send(line_payload(payload.messagesQRP([{
                        label: 'Stop/เลิกแปล',
                        text: KEYS.stop_translating
                    }, {
                        label: KEYS.detect_language,
                        text: KEYS.detect_language
                    }], 'Still in translation mode. Please continue typing. อยู่ในโหมดการแปลอยู่แล้ว พิมพ์คุยต่อได้เลยครับ หรือจากต้องการออกจากโหมดแปลให้พิมพ์ เลิกแปล')))
                }
                break
            case KEYS.stop_translating:
                if (!beingTranslated) {
                    return res.send(line_payload(payload.messagesQRP([{
                        label: 'Start/เริ่มแปล',
                        text: KEYS.start_translating
                    }, {
                        label: 'Detect Language',
                        text: KEYS.detect_language
                    }], 'Not in translatin mode, yet. Should I translate all conversations? Please tell me so. ต้องการให้ผมแปลบทสนทนาให้พิมพ์ เริ่มแปล')))
                }
                break
            default:
                break;
        }

        ROOT_REF.child('users').child(customer_id).child('translate').transaction(value => !value).then(async result => {
            let snapshot = result.snapshot
            if (snapshot.exists()) {
                beingTranslated = snapshot.val()
                if (beingTranslated) {
                    return res.send(line_payload(payload.messagesQRP([{
                        label: 'Start/เริ่มแปล',
                        text: KEYS.stop_translating
                    }, {
                        label: 'Detect Language',
                        text: KEYS.detect_language
                    }], 'In translation mode now. Please start typing.\nอยู่ในโหมดการแปลแล้ว เริ่มคุยได้เลยครับ')))

                }
                return res.send(await payload.textResponse('ปิดโหมดการแปลแล้ว'))
            }
        })



    })


})

app.post('/detectlanguage', async (req, res) => {

    let hello = req.body.hello
    let customer_id = req.body.customer_id
    let user = {
        customer_id: customer_id,
        displayName: req.body.p_display_name,
        pictureUrl: req.body.p_profile_img_url
    }

    customer_id = md5(customer_id)

    var target;

    let detections;


    const googleTranslate = new Translate({
        projectId: saCredentials.project_id, //eg my-project-0o0o0o0o'
        keyFilename: 'tamniyombot65-eafd4-3001b99b196d.json' //eg my-project-0fwewexyz.json
    });

    await googleTranslate.detect(hello).then(async (array) => {
        detections = Array.isArray(array) ? array : [array];
        // console.log('Detections:');

        await Promise.all(detections.map(async (detection) => {
            // console.log(`${detection.input} => ${detection.language}`);
            if(!target) target = detection.language;
            console.log(`target: ${target}`);
            // switch (detection.language) {
            //     case 'th':
            //         target = to || 'en';
            //         break
            //     default:
            //         break;
            // }
        }));
        await ROOT_REF.child('users').child(customer_id).update({
            language: target,
            translation: target != 'th'
        })
        let text = 'Hello, this is the language you speak. You can now communicate in your mother language.'
        let translations;
        googleTranslate.translate(text, target).then(async (array) => {
            translations = Array.isArray(array) ? array : [array];
            // console.log('Translations:');
            // var translatedText = '';

            Promise.all(translations.map(async (translation, i) => {
                // console.log(`${text[i]} => (${target}) ${translation}`);
                // t += `${text[i]} => (${target}) ${translation}`;
                // translatedText += `${translation}`;
            }));

            const translationPayload = {
                type: 'text',
                text: translations[0],
                sender: {}
            };

            if (target) {
                let lineProfile = user;
                translationPayload.sender = lineProfile ? {
                    name: lineProfile.displayName,
                    iconUrl: assets.flags_url[target]
                } : {
                    name: agent.name,
                    iconUrl: assets.flags_url[target]
                }

                return res.send({
                    ...line_payload([translationPayload, await flex.usermenu()]),
                    intent: 'แปล'
                })

                // .QRPTemplate({
                //     title: 'เริ่มต้นจากเมนู',
                //     labels: [{
                //         label: 'เมนูสินค้า',
                //         text: 'Menu'
                //     }],
                //     to: target
                // })

            } else {
                return res.send(await payload.textResponse('ไม่พบรหัสภาษา'))
            }
        }).catch(e => {
            console.error(e)
        });
    });



})


app.post('/translate', (req, res) => {

    if (res.locals.translate) {
        res.send(payload.textResponse('translating'))
    } else {
        res.send(payload.textResponse('not translating'))
    }
})

app.post('/addcartslotfilling', (req, res) => {

    let { category: catname, product, description, variant, count } = req.body
    let { customer_id, p_channel, p_display_name, p_intent } = req.body
    customer_id = md5(customer_id)

    if (p_intent === 'cancel')return ROOT_REF.child('users').child(customer_id).child('cartdata').set(null).then(_ => res.end())

    async function getCategories() {

        return new Promise((resolve, reject) => {
            ROOT_REF.child(FB_PATH.categories).once('value', snapshot => {
                if (!snapshot.exists()) {
                    resolve([])
                }
                let categories = snapshot.val()
                categories = Array.isArray(categories) ? categories : categories ? Object.values(categories) : []

                console.log(categories);
                resolve(categories)
            })
        })

    }

    ROOT_REF.child('users').child(customer_id).child('cartdata').once('value', snapshot => {


        console.log(req.body);
        console.log((snapshot.val()));

        if (!snapshot.exists()) {
            return ROOT_REF.child('users').child(customer_id).child('cartdata').set({
                date: Date.now()
            }).then(async _ => {
                getCategories().then(categories => {
                    res.send(line_payload(flex.catalogsCarousel(categories)))
                })

            })
        } else {
            console.log('returnng QRP');
            return res.send(line_payload(payload.QRPTemplate({
                labels: ['ยกเลิก'],
                title: 'ยกเลิกหรือซื้อต่อ'
            })))
        }



        if (catname) {
            if (product) {
                if (description) {
                    if (variant) {
                        if (count) {
                            //confirm

                            //reset mode

                        } else {
                            //reply with count

                        }

                    } else {
                        //search if variants available if not : count

                    }
                } else {
                    //search for description if found multiple let to choose

                }
            } else {
                // search for all products and let to choose

            }
        } else {
            // search for all categories and let to choose

        }

    })
    // ROOT_REF.child(FB_PATH.products).orderByChild('catname').equalTo(category).once('value', snapshot => {

    //     if (!snapshot.exists()) {
    //         return res.send(payload.textResponse('ไม่พบสินค้าในหมวดหมู่นี้'))
    //     }
    //     let products = snapshot.val()
    //     products = Array.isArray(products) ? products : Object.values(products)

    //     console.log(products);
    //     return res.send(flex.productCarousel(products))
    // })

})

app.post('/productcategories', async (req, res) => {


    let customer_id = req.body.customer_id
    customer_id = md5(customer_id)
    await ROOT_REF.child('users').child(customer_id).child('translate').set(true)
    payload.translation = true

    ROOT_REF.child(FB_PATH.categories).once('value', async snapshot => {
        if (!snapshot.exists()) {
            return res.send(payload.textResponse('ไม่พบหมวดหมู่สินค้า'))
        }
        let categories = snapshot.val()
        categories = Array.isArray(categories) ? categories : categories ? Object.values(categories) : []

        console.log(categories);
        return res.send(line_payload(await payload.QRPTemplate({
            title: 'สนใจสินค้าหมวดหมู่ใดครับ',
            labels: categories.map(cat => ({
                label: cat.name,
                text: cat.name
            })),
        to: res.locals.language || 'en'
        })))
    })
})

app.post('/categoryproducts', (req, res) => {

    let { category } = req.body
    console.log(category);
    ROOT_REF.child(FB_PATH.products).orderByChild('catname').equalTo(category).once('value', snapshot => {

        if (!snapshot.exists()) {
            return res.send(payload.textResponse('ไม่พบสินค้าในหมวดหมู่นี้'))
        }
        let products = snapshot.val()
        products = Array.isArray(products) ? products : products ? Object.values(products) : []

        console.log(products);
        return res.send(line_payload(flex.productCarousel(products)))
    })

})

app.post('/productbydesc', (req, res) => {

    let { category, product } = req.body
    ROOT_REF.child(FB_PATH.productWithVariants).orderByChild('name').equalTo(product).once('value', async snapshot => {
        if (!snapshot.exists()) {
            return res.end()
        }
        let products = snapshot.val()
        products = Array.isArray(products) ? products : products ? Object.values(products) : []
        if (category) products = products.filter(p => p.catname === category)
        let filteredProduct = products.shift()
        if (filteredProduct && filteredProduct.variants) {
            return res.send(line_payload(await payload.QRPTemplate({
                labels: ['ยกเลิก', ...Object.values(filteredProduct.variants)],
                title: 'เลือกขนาด'
            })))
        }
        res.end()

    })

})
app.post('/productvariants', (req, res) => {

    let { category, product, description } = req.body
    ROOT_REF.child(FB_PATH.productWithVariants).orderByChild('name').equalTo(product).once('value', snapshot => {
        if (!snapshot.exists()) {
            return res.end()
        }
        let products = snapshot.val()
        products = Array.isArray(products) ? products : products ? Object.values(products) : []
        if (category) products = products.filter(p => p.catname === category)
        if (description) product = product.filter(p => p.description === description)

    })

})

app.get('/product/:cat/:id', (req, res) => {
    let products = require('./data/products.json')
    let product = products.find(p => p.id == req.params.id)
    functions.logger.info(product, {structuredData: true});
    res.send(line_payload(flex.productBubble(product)))
})

//productQuery <<product>>
//viewProduct <<product>>
app.post('/product/patternsearch', async (req, res) => {

    let { category, product, variant } = req.body

    // console.log(req);
    console.log(req.headers);
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);



    /**
     * ถ้าระบุชื่อผลิตภัณฑ์มา
     * ให่้เช็คความยาว results หากน้อยกว่า 10 ให้ส่งเป็น carousel
     *
     * หากมากกว่า ให้เช็ค db ว่ามี descriptions/ variants ที่ตรง db ไหม
     * ถ้ามี ให้ QRP ถามกลับ ด้วย description/ variants จนได้ข้อมูลครบ
     *
     *
     */
    if (product) {

        let productGroups
        ROOT_REF.child(FB_PATH.productWithVariants).orderByChild('name').equalTo(product).once('value', snapshot => {
            if (!snapshot.exists() || snapshot.val().length === 0) {
                return res.send(payload.textResponse('ไม่พบสินค้าใดๆ'))
            }

            productGroups = snapshot.val()

            let text = Array.isArray(productGroups) ? 'เรามีหลายแบบ': 'พบสินค้านี้ครับ'
            let payloads = [text]
            productGroups = Array.isArray(productGroups) ? productGroups : productGroups ? Object.values(productGroups) : []
            console.log(productGroups);

            productGroups.map(group => payloads.push(group.description))


            if (productGroups.length <= 10) {
                return res.send(line_payload(flex.productCarousel(productGroups)))
            }

            return res.send(payload.textResponse(payloads))
        })

        // if (!variant) {



        // } else {

        //     return res.send(payload.textResponse('เดี๋ยวบอกรายละเอียดนะครับ'))
        // }
    } else {
        res.send(payload.textResponse('ช่วยบอกสินค้าก่อน'))
    }
})

app.post('/product/search', (req, res) => {
    let { freetext } = req.body

    //search through products


    //search through categories if needed

})

//D:repeatLastPurchase: QRP
app.post('/repeatLastPurchase', (req, res) => {

})

//viewCart
app.post('/viewCart', (req, res) => {

    let customer_id = req.body.customer_id
    customer_id = md5(customer_id)
    ROOT_REF.child('users').child(customer_id).child('cart').once('value', async snapshot => {
        if (!snapshot.exists()) return res.send(line_payload(await payload.QRPTemplate({
            title: 'ยังไม่มีสินค้าเลยครับ ลองเลือกดูสินค้าเรานะครับ',
            labels: [{
                label: 'ดูสินค้าอื่นๆ',
                text: res.locals.translate ? 'Menu' : 'แคตตาล็อคสินค้า'
            }]
        })))
        let products = snapshot.val()
        products = Array.isArray(products) ? products : products ? Object.values(products) : []

        products.sort((a, b) => a.item.catid - b.item.catid)
        let updated = products.reduce((p, c) => Math.max(p, c.date), 0)
        res.send(line_payload([Flex.flex(await flex.cartmenu(products, updated, customer_id)), await payload.QRPTemplate({
            labels: [{
                label: `${DateTime.fromMillis(updated).setZone('Asia/Bangkok').toRelative().slice(0, 20)}`,
                text: 'ดูตะกร้า'
            }],
            title: 'ข้อมูลสินค้าในตะกร้าที่อัพเดตล่าสุดตามเวลาเรียกดู:'
        })]))
    })

})

//submitorder
app.post('/submitorder', async (req, res) => {

    let confirm = req.body.confirm

    if (confirm) {
        let latestOrder = await ROOT_REF.child('users').child(res.locals.customer_id).child('cart').once('value')
        console.log(latestOrder.exists());
        console.log(latestOrder);
        console.log(latestOrder.val());
        return res.send(payload.textResponse('order confirmed'))
    }
    res.send(payload.textResponse('checking order'))

})

//D:remove <<product>>: QRP
app.post('/remove/:id', (req, res) => {

})

//D:emptyCart: QRP
app.get('/emptyCart', (req, res) => {

})

//D:sendOrder: QRP
app.get('/sendOrder', (req, res) => {

})

//D:cancelOrder <<order>>: QRP
app.post('/cancelorder/:id', (req, res) => {

})

//checkOrdersStatus
app.get('/checkorderstatus', (req, res) => {

})

//D:confirmPayment: QRP
app.post('/confirmpayment', (req, res) => {

})

app.post('/trackorder', async (req, res) => {
    let trackingid = req.body.trackingid

    let alltracks = require('./flashTrackingResponse.json')
    let quota = 15

    let track = alltracks.find(t => t.data.trackingNo.trim().toLowerCase() === trackingid.trim().toLowerCase())
    if (track) {
        // return res.send(await payload.textResponse(track.data.timelines.map(t => ())))
    }


})

app.get('/listall/:catid' ,(req, res) => {
    let products = require('./data/products.json') // filter etc
    let product = products.pop()

    let filteredProducts = Array(10).fill(product).filter(p => p.catid == req.params.catid)

    res.send(line_payload(flex.productCarousel(filteredProducts)))
})

app.get('/test', (req, res) => {
    res.send(line_payload(flex.imageMap()))
})

exports.firebasehook = functions.https.onRequest(app);
