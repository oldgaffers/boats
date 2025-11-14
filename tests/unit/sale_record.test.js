import { describe, it, expect } from 'vitest';
import { SaleRecord, currentSaleRecord } from '../../src/util/sale_record.js';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('SaleRecord', () => {
  it('constructs and exposes asking_price with getter/setter', async () => {
    const seller = { id: 'g1', member: 'm1' };
    const sr = new SaleRecord(1000, 'nice boat', seller);
    expect(sr.asking_price).toBe(1000);
    const created = sr.created_at;
    await sleep(100);
    sr.asking_price = 1500;
    expect(sr.asking_price).toBe(1500);
    expect(sr.updated_at).not.toBe(created);
    expect(sr.seller_gold_id).toBe('g1');
    expect(sr.seller_member).toBe('m1');
  });

  it('fromObject recreates fields', () => {
    const obj = {
      asking_price: 2000,
      sales_text: 'seller text',
      created_at: '2020-01-01T00:00:00Z',
      updated_at: '2020-01-02T00:00:00Z',
      flexibility: 'loose',
      object: '2020-01-01',
      sold: false,
      summary: 'sum',
      seller_gold_id: 'gid',
      seller_member: 'mem'
    };
    const r = SaleRecord.fromObject(obj);
    expect(r.asking_price).toBe(2000);
    expect(r.sales_text).toBe('seller text');
    expect(r.created_at).toBe('2020-01-01T00:00:00Z');
    expect(r.updated_at).toBe('2020-01-02T00:00:00Z');
    expect(r.seller_gold_id).toBe('gid');
    expect(r.seller_member).toBe('mem');
  });

  it('currentSaleRecord returns correct SaleRecord or undefined', () => {
    const boatNotForSale = { selling_status: 'not_for_sale' };
    expect(currentSaleRecord(boatNotForSale)).toBeUndefined();

    const now = new Date().toISOString();
    const old = new Date(0).toISOString();
    const boatWithSales = {
      selling_status: 'for_sale',
      for_sales: [
        { asking_price: 100, updated_at: old, sold: false },
        { asking_price: 500, updated_at: now, sold: false }
      ]
    };
    const record = currentSaleRecord(boatWithSales);
    expect(record).toBeInstanceOf(SaleRecord);
    expect(record.asking_price).toBe(500);

    const boatWithSoldLatest = {
      selling_status: 'for_sale',
      for_sales: [
        { asking_price: 100, updated_at: old, sold: false },
        { asking_price: 500, updated_at: now, sold: true }
      ]
    };
    expect(currentSaleRecord(boatWithSoldLatest)).toBeUndefined();

    const boatWithNoPrice = {
      selling_status: 'for_sale',
      for_sales: [{ updated_at: now, sold: false }]
    };
    expect(currentSaleRecord(boatWithNoPrice)).toBeUndefined();
  });
});
