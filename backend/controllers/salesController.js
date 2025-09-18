// backend/controllers/salesController.js
const dbMod = require('../Models');
const db = dbMod.default || dbMod; // cobre CJS/ESM
const { Op, fn, col, literal } = require('sequelize');
const { Sale, SaleItem, Product } = db;

const createSale = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { userId, items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Itens da venda são obrigatórios.' });
    }

    const completed = [];
    for (const raw of items) {
      const qty = Number(raw.quantity || 1);
      let unitPrice = raw.unitPrice;

      if (unitPrice == null) {
        const p = await Product.findByPk(raw.productId, { transaction: t });
        if (!p) throw new Error(`Produto ${raw.productId} não encontrado`);
        unitPrice = p.price;
      }
      const lineTotal = (Number(unitPrice) * qty).toFixed(2);
      completed.push({ productId: raw.productId, quantity: qty, unitPrice, lineTotal });
    }

    const total = completed.reduce((s, it) => s + Number(it.lineTotal), 0).toFixed(2);

    const sale = await Sale.create({ userId, total }, { transaction: t });
    for (const it of completed) {
      await SaleItem.create({ saleId: sale.id, ...it }, { transaction: t });
    }

    await t.commit();
    return res.status(201).json({ id: sale.id, total: Number(total), items: completed });
  } catch (err) {
    await t.rollback();
    console.error('Erro ao criar venda:', err);
    return res.status(500).json({ error: err.message || 'Erro ao criar venda.' });
  }
};

const summary = async (_req, res) => {
  try {
    const startToday = new Date(); startToday.setHours(0,0,0,0);
    const startMonth = new Date(); startMonth.setDate(1); startMonth.setHours(0,0,0,0);

    const [sumToday, sumMonth, countMonth] = await Promise.all([
      Sale.sum('total', { where: { createdAt: { [Op.gte]: startToday } } }),
      Sale.sum('total', { where: { createdAt: { [Op.gte]: startMonth } } }),
      Sale.count({ where: { createdAt: { [Op.gte]: startMonth } } }),
    ]);

    const hoje   = Number(sumToday || 0);
    const mes    = Number(sumMonth || 0);
    const ticket = countMonth ? mes / countMonth : 0;

    return res.json({ hoje, mes, ticket });
  } catch (err) {
    console.error('summary:', err);
    return res.status(500).json({ error: 'Erro ao calcular resumo.' });
  }
};

const byDay = async (req, res) => {
  try {
    const days = Math.max(1, Math.min(90, Number(req.query.days || 7)));
    const start = new Date(); start.setDate(start.getDate() - (days - 1)); start.setHours(0,0,0,0);

    const rows = await Sale.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'd'],
        [fn('SUM', col('total')), 'total'],
      ],
      where: { createdAt: { [Op.gte]: start } },
      group: [literal('d')],
      order: [[literal('d'), 'ASC']],
      raw: true,
    });

    const out = rows.map(r => {
      const d = new Date(r.d);
      const label = d.toLocaleDateString('pt-BR').slice(0,5); // dd/MM
      return { date: label, total: Number(r.total || 0) };
    });

    return res.json(out);
  } catch (err) {
    console.error('byDay:', err);
    return res.status(500).json({ error: 'Erro ao agrupar vendas por dia.' });
  }
};

const topCategories = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(20, Number(req.query.limit || 5)));

    const rows = await SaleItem.findAll({
      attributes: [
        [col('product.category'), 'category'],
        [fn('SUM', col('lineTotal')), 'total'],
      ],
      include: [{ model: Product, as: 'product', attributes: [] }],
      group: [col('product.category')],
      order: [[literal('total'), 'DESC']],
      limit,
      raw: true,
    });

    const out = rows.map(r => ({ category: r.category || 'Sem categoria', total: Number(r.total || 0) }));
    return res.json(out);
  } catch (err) {
    console.error('topCategories:', err);
    return res.status(500).json({ error: 'Erro ao agrupar por categorias.' });
  }
};

module.exports = { createSale, summary, byDay, topCategories };
