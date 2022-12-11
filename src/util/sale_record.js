
export class SaleRecord {
    #price;
    created_at;
    updated_at;
    flexibility = 'normal';
    offered;
    sold;
    sales_text;
    summary;
    seller_gold_id;
    seller_member;

    constructor(price, sales_text, seller) {
        this.#price = price;
        this.created_at = new Date().toISOString();
        this.updated_at = this.created_at;
        this.offered = this.created_at.split('T')[0];
        this.sales_text = sales_text;
        this.seller_gold_id = seller?.id;
        this.seller_member = seller?.member;
        Object.defineProperty( this, 'asking_price', {
            enumerable: true,
            get: ( ) => this.#price,
            set: ( price ) => {
                this.updated_at = new Date().toISOString();
                this.#price = price;        
            },
          } );
    }

    static fromObject(object) {
        const r = new SaleRecord(object.asking_price, object.sales_text);
        r.created_at = object.created_at;
        r.updated_at = object.updated_at;
        r.flexibility = object.flexibility;
        r.offered = object.object;
        r.sold = object.sold;
        r.summary = object.summary;
        r.seller_gold_id = object.seller_gold_id;
        r.seller_member = object.seller_member;
        return r;
    }
}

export function currentSaleRecord(boat) {
    if ((boat?.selling_status || '') !== 'for_sale') {
        return undefined;
    }
    const r = (boat.for_sales || []).reduce(
        (prev, curr) => (prev.updated_at > curr.updated_at) ? prev : curr,
        { updated_at: new Date(0).toISOString() },
    );
    if (r.sold) {
        return undefined;
    }
    if (!r.asking_price) {
        return undefined;
    }
    return SaleRecord.fromObject(r);
}
