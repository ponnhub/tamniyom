const GoogleServices = require("../GoogleServices/GoogleServices")


class Payload {

    constructor(customer_id = '', user={}, translation = true, sourcelang = '', gs={}) {
        this.translation = translation
        this.sourcelang = sourcelang
        this.customer_id = customer_id
        this.user = user                
        this.gs = gs
        
    }

    textResponse = async (texts) => {
        let array =  Array.isArray(texts) ? texts: [texts]
        let textsPayload = array.map (t => ({
            type: 'text',
            text: t
        }))

        console.log(this.user);
        if (this.translation) {
            let additionTexts = await Promise.all(array.map( async t  => (await this.gs.translate(t, {textPayload: true, to: this.sourcelang }))))
            textsPayload = [...textsPayload, ...additionTexts].slice(0, 5)
        }
        return {
            line_payload: textsPayload,
            response_type : 'object'
        }
    }

    QRPTemplate = async ({title, labels, to}) => {
        let lang = to || this.sourcelang
        let text  = this.translation ? await this.gs.translate(title || 'มีส่งที่ต้องการไหมครับ', {onlytext : true, to: lang}) : title || 'มีส่งที่ต้องการไหมครับ'
        let payload = {
            type: 'text',
            text: text,
            altText: text,
            quickReply: {
                items: await Promise.all(labels.map(async label => {
                    let l = this.translation ? await this.gs.translate(label.label || label, {
                        onlytext: true, to: lang
                    }) : label.label || label
                    return {
                        type: 'action',
                        action: {
                            type: 'message',
                            label: l.slice(0, 20),
                            text: label.text || label
                        }
                    }
                }))
            }
        }
       return payload
    }

    messagesQRP = (items, title) => {

        console.log(this.customer_id);
        return {
            type: 'text',
            text: title || 'กรุณาเลือก',
            altText: title || 'กรุณาเลือก',
            quickReply: {
                items: items.map(item => ({
                    type: 'action',
                    action: {
                        type: 'message',
                        label: item.label ? item.label.slice(0, 20) : item,
                        text: item.text || item
                    }
                }))
            }
        }
    }
}
module.exports = Payload