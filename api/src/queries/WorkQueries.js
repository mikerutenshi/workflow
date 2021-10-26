import { db } from '../db';
import Position from '../helpers/position';

const Work = {
  create(req, res, next) {
    if (typeof req.body.notes === 'undefined') {
      req.body.notes = null;
    }
    db.none(
      'INSERT INTO work(spk_no, product_id, product_quantity, notes) VALUES(${spk_no}, ${product_id}, ${product_quantity}, ${notes})',
      req.body,
    )
      .then(() => {
        res.status(201).json({
          status: 'Created',
          message: 'Kerjaan berhasil dibuat',
        });
      })
      .catch((err) => {
        return next(err);
      });
  },
  getAll(req, res, next) {
    const spkNo =
      typeof req.query.spk_no === 'undefined' ? '' : req.query.spk_no;
    const filter = `%${spkNo}%`;
    const page = typeof req.query.page === 'undefined' ? 1 : req.query.page;
    const limit =
      typeof req.query.limit === 'undefined' ? null : req.query.limit;
    const offset = (page - 1) * limit;

    db.task(async (t) => {
      const list = await t.any(
        'SELECT *, work.created_at, work.updated_at FROM work JOIN product ON product.product_id = work.product_id WHERE spk_no::text LIKE $1 OR article_no::text LIKE $1 ORDER BY spk_no LIMIT $2 OFFSET $3',
        [filter, limit, offset],
      );
      const meta = await t.one(
        'SELECT COUNT(*) FROM work JOIN product ON product.product_id = work.product_id WHERE spk_no::text LIKE $1 OR article_no::text LIKE $1',
        filter,
      );
      return { list, meta };
    })
      .then((result) => {
        const totalRow = result.meta.count;
        let totalPage = 1;
        if (limit !== null) {
          totalPage = Math.ceil(totalRow / limit);
        }
        res.status(200).json({
          status: 'OK',
          data: result.list,
          meta: { total_page: totalPage },
          message: 'Semua kerjaan berhasil diload',
        });
      })
      .catch((err) => {
        return next(err);
      });
  },
  getUnassigned(req, res, next) {
    const spkNo =
      typeof req.query.spk_no === 'undefined' ? '' : req.query.spk_no;
    const filter = `%${spkNo}%`;
    const page = typeof req.query.page === 'undefined' ? 1 : req.query.page;
    const limit =
      typeof req.query.limit === 'undefined' ? null : req.query.limit;
    const offset = (page - 1) * limit;
    const position =
      typeof req.query.position === 'undefined' ? null : req.query.position;

    let isDoneColumn;
    switch (position) {
      case 'drawer':
        isDoneColumn = 'is_drawn';
        break;
      case 'sewer':
        isDoneColumn = 'is_sewn';
        break;
      case 'assembler':
        isDoneColumn = 'is_assembled';
        break;
      case 'sole_stitcher':
        isDoneColumn = 'is_sole_stitched';
        break;
      case 'lining_drawer':
        isDoneColumn = 'is_lining_drawn';
        break;
      case 'insole_stitcher':
        isDoneColumn = 'is_insole_stitched';
        break;
      default:
        break;
    }
    let listQuery =
      'SELECT *, work.created_at FROM work JOIN product ON product.product_id = work.product_id WHERE $1:raw = false AND (spk_no::text LIKE $2 OR article_no::text LIKE $2)';
    let sumQuery =
      'SELECT COUNT(*) FROM work JOIN product ON product.product_id = work.product_id WHERE $1:raw = false AND (spk_no::text LIKE $2 OR article_no::text LIKE $2)';

    const addSortBy = (sortBy) => {
      if (sortBy === 'spk_no') {
        listQuery += ' ORDER BY spk_no';
      } else if (sortBy === 'article_no') {
        listQuery += ' ORDER BY article_no';
      } else if (sortBy === 'created_at') {
        listQuery += ' ORDER BY work.created_at';
      } else {
        listQuery += ' ORDER BY spk_no';
      }
    };

    const addSortDirection = (sortDirection) => {
      if (sortDirection === 'asc') {
        listQuery += ' ASC';
      } else if (sortDirection === 'desc') {
        listQuery += ' DESC';
      } else {
        listQuery += ' ASC';
      }
    };

    const addPagination = () => {
      listQuery += ' LIMIT $3 OFFSET $4';
    };

    if (position === Position.SOLE_STITCHER) {
      listQuery += ' AND product.sole_stitching_cost != 0';
    } else if (position === Position.INSOLE_STITCHER) {
      listQuery += ' AND product.insole_stitching_cost != 0';
    }

    db.task('get-unassigned_work', async (t) => {
      let list;
      let sum;

      if (
        typeof req.query.start_date !== 'undefined' &&
        typeof req.query.end_date !== 'undefined'
      ) {
        listQuery += ' AND work.created_at BETWEEN $5 AND $6';
        sumQuery += ' AND work.created_at BETWEEN $3 AND $4';

        addSortBy(req.query.sort_by);

        addSortDirection(req.query.sort_direction);

        addPagination();

        let endDate = req.query.end_date;
        endDate = `${endDate}T23:59:59.000`;

        list = await t.any(listQuery, [
          isDoneColumn,
          filter,
          limit,
          offset,
          req.query.start_date,
          endDate,
        ]);
        sum = await t.one(sumQuery, [
          isDoneColumn,
          filter,
          req.query.start_date,
          endDate,
        ]);
      } else {
        addSortBy(req.query.sort_by);

        addSortDirection(req.query.sort_direction);

        addPagination();
        list = await t.any(listQuery, [isDoneColumn, filter, limit, offset]);
        sum = await t.one(sumQuery, [isDoneColumn, filter]);
      }

      return { list, sum };
    })
      .then((result) => {
        const totalRow = result.sum.count;
        let totalPage = 1;
        if (limit !== null) {
          totalPage = Math.ceil(totalRow / limit);
        }
        res.status(200).json({
          status: 'OK',
          data: result.list,
          meta: { total_page: totalPage },
          message:
            'Semua kerjaan difilter belum dikerjakan per tukang dan posisi berhasil diload',
        });
      })
      .catch((err) => {
        return next(err);
      });
  },
  getPerWorker(req, res, next) {
    const workerId =
      typeof req.params.worker_id === 'undefined' ? null : req.params.worker_id;
    const spkNo =
      typeof req.query.spk_no === 'undefined' ? '' : req.query.spk_no;
    const filter = `%${spkNo}%`;
    const page = typeof req.query.page === 'undefined' ? 1 : req.query.page;
    const limit =
      typeof req.query.limit === 'undefined' ? null : req.query.limit;
    const offset = (page - 1) * limit;

    db.task('get_work-per_worker', async (t) => {
      const list = await t.any(
        'SELECT * FROM work JOIN worker_work ON work.work_id = worker_work.work_id JOIN product ON product.product_id = work.product_id WHERE worker_id = $1 AND spk_no::text LIKE $2 ORDER BY spk_no LIMIT $3 OFFSET $4',
        [workerId, filter, limit, offset],
      );
      const sum = await t.one(
        'SELECT COUNT(*) FROM work JOIN worker_work ON work.work_id = worker_work.work_id JOIN product ON product.product_id = work.product_id WHERE worker_id = $1 AND spk_no::text LIKE $2',
        [workerId, filter],
      );
      return { list, sum };
    })
      .then((result) => {
        const totalRow = result.sum.count;
        let totalPage = 1;
        if (limit !== null) {
          totalPage = Math.ceil(totalRow / limit);
        }
        res.status(200).json({
          status: 'OK',
          data: result.list,
          meta: { total_page: totalPage },
          message:
            'Semua kerjaan difilter berdasarkan worker_id berhasil diload',
        });
      })
      .catch((err) => {
        return next(err);
      });
  },
  delete(req, res, next) {
    const workId = req.query.work_id;
    db.none('DELETE FROM work WHERE work_id in ($1:csv)', [workId])
      .then(() => {
        res.status(200).json({
          status: 'OK',
          message: 'Kerjaan berhasil dihapus',
        });
      })
      .catch((err) => {
        return next(err);
      });
  },
  update(req, res, next) {
    const notes = typeof req.body.notes === 'undefined' ? null : req.body.notes;
    db.none(
      'UPDATE work SET spk_no = $1, product_id = $2, product_quantity = $3, notes = $4, updated_at = now() WHERE work_id = $5',
      [
        req.body.spk_no,
        req.body.product_id,
        req.body.product_quantity,
        notes,
        req.params.work_id,
      ],
    )
      .then(() => {
        res.status(200).json({
          status: 'OK',
          message: 'Kerjaan berhasil diubah',
        });
      })
      .catch((err) => {
        return next(err);
      });
  },
};

export default Work;
