const FB_PATH = {
    products: 'products',
    categories: 'categories',
    productWithVariants: 'productWithVariants'
}
const ENTITIES = {
    products: 'name',
    categories: 'catname',
    variants: 'variant',
    productvariants: 'productvariants'
}

const KEYS = {
    start_translating: 'เริ่มแปล',
    stop_translating : 'เลิกแปล',
    detect_language: 'Detect Language'
}

const ITEMS_COUNTS_IN_CAROUSEL = (s, f, o) => {

    let size = Number(s)
    let desiredItemMax = Number(f)
    let offset = Number(o)

    let columns = Math.min(10, Math.ceil((size - (offset % desiredItemMax)) / desiredItemMax).toFixed(0));
    //Number(Math.ceil((size + offset - desiredItemMax) / desiredItemMax).toFixed(0))
    return {
        columns: columns,
        items_counts: Array(columns).fill('').map((_, page) => ((page === 0 & offset !== 0)
            ? Math.min(offset, size)
            : page === columns - 1
                ? (size - offset) % desiredItemMax === 0
                    ? desiredItemMax
                    :  (size - offset) % desiredItemMax
                : desiredItemMax)


        //     page < (columns - 1)
        // ? (page === 0
        //     ? desiredItemMax - offset
        //     : desiredItemMax )
        // : page === 0
        //     ? Math.min(offset, size)
        //     : (size % desiredItemMax === 0
        //         ? desiredItemMax
        //         : ((size % desiredItemMax) + offset)))
                ),

        start: Array(columns).fill('').map((_, page) => (Math.max(0, page * desiredItemMax - offset))),
        end: Array(columns).fill('').map((_, page) => (size <= offset
        ? size 
        : page === columns - 1
            ? Math.min((page + 1) * desiredItemMax - offset + 1, size)
            : (page + 1) * desiredItemMax))
    }
}

const PARAMS_PATHS = {
    category: 'categories',
    variant: 'variants'
}

const assets = {
    logo: 'https://firebasestorage.googleapis.com/v0/b/tamniyombot65-eafd4.appspot.com/o/assets%2Fimages%2Ftamniyom_logo%400%2C1x.jpg?alt=media&token=560c636a-e663-4f77-ad59-1928be38f921',
    flags_url : {
        'en': 'http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg',
        'fr': 'https://firebasestorage.googleapis.com/v0/b/task-cloud-function-iea.appspot.com/o/flags%2Ffr.png?alt=media&token=09cdc0ed-e1dd-4701-8fd7-43cd303c343d',
        'it': 'https://firebasestorage.googleapis.com/v0/b/task-cloud-function-iea.appspot.com/o/flags%2Fit.png?alt=media&token=ce1835d1-e849-4284-aa38-66996437d3d9',    
        'th': 'https://firebasestorage.googleapis.com/v0/b/task-cloud-function-iea.appspot.com/o/flags%2Fth.png?alt=media&token=5326b179-9071-421c-8201-66706b44dd69'
    }
}

const PRODUCT_UNIQUE_KEYS = [
    'name', 'catid', 'description'
]
module.exports = {
    KEYS,
    FB_PATH,
    ENTITIES,
    PRODUCT_UNIQUE_KEYS,
    ITEMS_COUNTS_IN_CAROUSEL,
    assets
}

